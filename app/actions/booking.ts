'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export type BookingFormState = {
  success: boolean;
  bookingId?: string;
  error?: string;
};

const VALID_TIME_SLOTS = new Set([
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30',
]);

function sanitizeText(str: string): string {
  return str.replace(/<[^>]*>?/gm, '').trim();
}

function isValidUUID(val?: string | null): boolean {
  if (!val) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

export async function submitBooking(
  _prevState: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  // 0. Rate limiting (max 5 booking submissions per 10 minutes per IP)
  const clientIp = await getClientIp();
  const rateLimitResult = checkRateLimit(`booking:${clientIp}`, 5, 10 * 60 * 1000);
  if (!rateLimitResult.success) {
    const minutesLeft = Math.ceil(rateLimitResult.resetSeconds / 60);
    return {
      success: false,
      error: `Too many booking requests from your connection. Please wait ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''} or call us directly at 095156 25554.`,
    };
  }

  const rawName   = (formData.get('customer_name')  as string) || '';
  const rawPhone  = (formData.get('customer_phone')  as string) || '';
  const rawEmail  = (formData.get('customer_email')  as string | null) || null;
  const serviceId = (formData.get('service_id')      as string | null) || null;
  const serviceName = (formData.get('service_name')  as string | null) || null;
  const preferredDate = (formData.get('preferred_date')  as string) || '';
  const preferredTime = (formData.get('preferred_time')  as string) || '';
  const rawNotes  = (formData.get('notes')           as string | null) || null;
  const rawLocation = (formData.get('location') as string | null) || 'tellapur';
  const location = rawLocation === 'gopanpally' ? 'gopanpally' : 'tellapur';

  // 1. Name validation
  const customerName = sanitizeText(rawName);
  if (!customerName || customerName.length < 2) {
    return { success: false, error: 'Please enter your full name (at least 2 characters).' };
  }
  if (customerName.length > 80) {
    return { success: false, error: 'Name cannot exceed 80 characters.' };
  }

  // 2. Strict 10-digit Indian mobile number validation & sanitization
  let cleanPhone = rawPhone.replace(/\D/g, ''); // remove spaces, hyphens, brackets
  if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
    cleanPhone = cleanPhone.slice(2);
  } else if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
    cleanPhone = cleanPhone.slice(1);
  }

  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    return {
      success: false,
      error: 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9 (e.g. 9876543210).',
    };
  }

  // 3. Email validation (if provided)
  const customerEmail = rawEmail ? sanitizeText(rawEmail) : null;
  if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  // 4. Date validation
  if (!preferredDate) {
    return { success: false, error: 'Please select a preferred date.' };
  }

  // Use Indian Standard Time (salon location: Tellapur, Hyderabad)
  const now = new Date();
  const istString = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const istDate = new Date(istString);
  const istYear = istDate.getFullYear();
  const istMonth = String(istDate.getMonth() + 1).padStart(2, '0');
  const istDay = String(istDate.getDate()).padStart(2, '0');
  const istTodayStr = `${istYear}-${istMonth}-${istDay}`;

  if (preferredDate < istTodayStr) {
    return { success: false, error: 'Appointment date cannot be in the past.' };
  }

  // 5. Time validation
  if (!preferredTime || !VALID_TIME_SLOTS.has(preferredTime)) {
    return { success: false, error: 'Please select a valid appointment time slot.' };
  }

  // If appointment is for today, reject past time slots
  if (preferredDate === istTodayStr) {
    const [slotH, slotM] = preferredTime.split(':').map(Number);
    const slotMinutes = slotH * 60 + slotM;
    const currentIstMinutes = istDate.getHours() * 60 + istDate.getMinutes();

    if (slotMinutes <= currentIstMinutes) {
      return {
        success: false,
        error: 'The selected time slot has already passed for today. Please select an upcoming time slot.',
      };
    }
  }

  // 6. Notes sanitization
  const cleanNotes = rawNotes ? sanitizeText(rawNotes).slice(0, 500) : null;
  const fullNotes = [
    serviceName ? `Selected Service: ${sanitizeText(serviceName)}` : null,
    cleanNotes,
  ]
    .filter(Boolean)
    .join('\n');

  // Pre-generate UUID so we don't need a SELECT query back from Supabase (avoiding RLS conflicts)
  const bookingId = crypto.randomUUID();

  try {
    const supabase = await createClient();

    const bookingPayload: Record<string, unknown> = {
      id:             bookingId,
      customer_name:  customerName,
      customer_phone: cleanPhone,
      customer_email: customerEmail || null,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      notes:          fullNotes || null,
      status:         'pending',
      location:       location,
    };

    if (isValidUUID(serviceId)) {
      bookingPayload.service_id = serviceId;
    }

    // Attempt pure INSERT (no .select() so no SELECT RLS policy check is triggered)
    let { error } = await supabase
      .from('bookings')
      .insert({
        ...bookingPayload,
        ...(serviceName ? { service_name: sanitizeText(serviceName) } : {}),
      });

    // Fallback if table does not have service_name or location column
    if (error && (error.message?.includes('service_name') || error.message?.includes('location'))) {
      const fallbackPayload = { ...bookingPayload };
      delete fallbackPayload.location;
      const fallbackResult = await supabase
        .from('bookings')
        .insert({ id: bookingId, ...fallbackPayload });
      error = fallbackResult.error;
    }

    if (error) {
      console.error('Supabase booking insert error:', error);
      return {
        success: false,
        error: 'Unable to process your booking request at this time. Please call us at 095156 25554 to book directly.',
      };
    }

    revalidatePath('/booking');
    return {
      success: true,
      bookingId,
    };
  } catch (err: unknown) {
    console.error('Unexpected booking error:', err);
    return {
      success: false,
      error: 'Booking service temporarily unavailable. Please call us at 095156 25554.',
    };
  }
}
