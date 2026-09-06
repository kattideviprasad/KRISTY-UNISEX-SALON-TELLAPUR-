'use server';

import crypto from 'crypto';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export type FeedbackFormState = {
  success: boolean;
  error?: string;
};

function sanitizeText(str: string): string {
  return str.replace(/<[^>]*>?/gm, '').trim();
}

export async function submitFeedback(
  _prevState: FeedbackFormState,
  formData: FormData
): Promise<FeedbackFormState> {
  // Rate limiting (max 3 feedback submissions per 10 minutes per IP)
  const clientIp = await getClientIp();
  const rateLimitResult = checkRateLimit(`feedback:${clientIp}`, 3, 10 * 60 * 1000);
  if (!rateLimitResult.success) {
    const minutesLeft = Math.ceil(rateLimitResult.resetSeconds / 60);
    return {
      success: false,
      error: `Too many submissions. Please wait ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''} before trying again.`,
    };
  }

  const rawName = (formData.get('name') as string) || '';
  const rawPhone = (formData.get('phone') as string) || '';
  const rawRating = (formData.get('rating') as string) || '';
  const rawComment = (formData.get('comment') as string | null) || null;
  const rawBranch = (formData.get('branch') as string | null) || 'tellapur';
  const branch = rawBranch === 'gopanpally' ? 'gopanpally' : 'tellapur';
  const rawServiceId = (formData.get('service_id') as string | null) || '';
  const serviceId = rawServiceId && /^[0-9a-f-]{36}$/i.test(rawServiceId) ? rawServiceId : null;

  // Validate name
  const name = sanitizeText(rawName);
  if (!name || name.length < 2) {
    return { success: false, error: 'Please enter your name (at least 2 characters).' };
  }
  if (name.length > 80) {
    return { success: false, error: 'Name cannot exceed 80 characters.' };
  }

  // Validate phone (10-digit Indian mobile)
  let cleanPhone = rawPhone.replace(/\D/g, '');
  if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
    cleanPhone = cleanPhone.slice(2);
  } else if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
    cleanPhone = cleanPhone.slice(1);
  }
  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    return {
      success: false,
      error: 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.',
    };
  }

  // Validate rating
  const rating = parseInt(rawRating, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { success: false, error: 'Please select a rating between 1 and 5 stars.' };
  }

  // Sanitize comment
  const comment = rawComment ? sanitizeText(rawComment).slice(0, 1000) : null;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceKey || !supabaseUrl) {
      return { success: false, error: 'Feedback service is not configured. Please try again later.' };
    }

    const { createClient: createSupabaseJsClient } = await import('@supabase/supabase-js');
    const adminClient = createSupabaseJsClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Resolve branch_id
    const { data: branchData, error: branchError } = await adminClient
      .from('branches')
      .select('id')
      .eq('slug', branch)
      .single();

    if (branchError || !branchData?.id) {
      console.error('[feedback] Branch lookup failed:', branchError?.message);
      return { success: false, error: 'Unable to process feedback. Please try again.' };
    }

    // Upsert customer by phone (same pattern as booking.ts)
    const customerId = crypto.randomUUID();
    const { data: customerData, error: customerError } = await adminClient
      .from('customers')
      .upsert(
        {
          id: customerId,
          name,
          phone: cleanPhone,
        },
        { onConflict: 'phone' }
      )
      .select('id')
      .single();

    if (customerError) {
      console.error('[feedback] Customer upsert error:', customerError.message);
      return { success: false, error: 'Unable to process feedback. Please try again.' };
    }

    // Insert feedback
    const feedbackRow: Record<string, unknown> = {
      id: crypto.randomUUID(),
      branch_id: branchData.id,
      customer_id: customerData.id,
      rating,
      comment: comment || null,
    };
    if (serviceId) {
      feedbackRow.service_id = serviceId;
    }

    const { error: fbError } = await adminClient
      .from('feedback')
      .insert(feedbackRow);

    if (fbError) {
      console.error('[feedback] Insert error:', fbError.message);
      return { success: false, error: 'Unable to save feedback. Please try again.' };
    }

    console.log(`[feedback] ✅ Feedback submitted — rating=${rating}, branch=${branch}`);
    return { success: true };
  } catch (err) {
    console.error('[feedback] Unexpected error:', err);
    return { success: false, error: 'Feedback service temporarily unavailable. Please try again later.' };
  }
}
