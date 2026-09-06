'use server';

import { cookies } from 'next/headers';
import { verifySessionToken, COOKIE_NAME } from '@/lib/admin-session';
import { getAdminSupabaseClient } from '@/lib/supabase/admin';

export type FeedbackRow = {
  id: string;
  customer_name: string;
  customer_phone: string;
  branch_slug: string | null;
  service_name: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type FeedbackDataResult = {
  feedback: FeedbackRow[];
  stats: {
    total: number;
    averageRating: number;
  };
  error?: string;
};

export async function fetchFeedbackData(
  branchSlug: 'tellapur' | 'gopanpally' | 'both'
): Promise<FeedbackDataResult> {
  // Auth guard
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return { feedback: [], stats: { total: 0, averageRating: 0 }, error: 'Unauthorized' };
  }

  const supabase = await getAdminSupabaseClient();

  try {
    // Resolve branch IDs
    let branchIds: string[] = [];

    if (branchSlug === 'both') {
      const { data: branches, error: brErr } = await supabase
        .from('branches')
        .select('id');
      if (brErr || !branches?.length) throw brErr ?? new Error('No branches found');
      branchIds = branches.map((b: { id: string }) => b.id);
    } else {
      const { data: branch, error: brErr } = await supabase
        .from('branches')
        .select('id')
        .eq('slug', branchSlug)
        .single();
      if (brErr || !branch) throw brErr ?? new Error(`Branch "${branchSlug}" not found`);
      branchIds = [branch.id];
    }

    // Query feedback with customer + branch joins
    let query = supabase
      .from('feedback')
      .select(`
        id,
        rating,
        comment,
        created_at,
        customer:customers ( name, phone ),
        branch:branches ( slug ),
        service:services_v2 ( name )
      `)
      .order('created_at', { ascending: false });

    if (branchIds.length === 1) {
      query = query.eq('branch_id', branchIds[0]);
    } else {
      query = query.in('branch_id', branchIds);
    }

    const { data: rows, error: qErr } = await query;
    if (qErr) throw qErr;

    const feedback: FeedbackRow[] = (rows ?? []).map((r) => {
      const customer = r.customer as unknown as { name: string; phone: string } | null;
      const branch = r.branch as unknown as { slug: string } | null;
      const service = r.service as unknown as { name: string } | null;
      return {
        id: r.id as string,
        customer_name: customer?.name ?? 'Unknown',
        customer_phone: customer?.phone ?? '—',
        branch_slug: branch?.slug ?? null,
        service_name: service?.name ?? null,
        rating: r.rating as number,
        comment: r.comment as string | null,
        created_at: r.created_at as string,
      };
    });

    // Compute stats
    const total = feedback.length;
    const averageRating = total > 0
      ? Math.round((feedback.reduce((sum, f) => sum + f.rating, 0) / total) * 10) / 10
      : 0;

    return { feedback, stats: { total, averageRating } };
  } catch (err) {
    console.error('[feedback-data] Query failed:', err);
    return { feedback: [], stats: { total: 0, averageRating: 0 }, error: 'Failed to load feedback.' };
  }
}
