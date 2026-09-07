'use server';

import { cookies } from 'next/headers';
import { verifySessionToken, COOKIE_NAME } from '@/lib/admin-session';
import { getAdminSupabaseClient } from '@/lib/supabase/admin';

export type DashboardBooking = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  service_id: string | null;
  service_name: string | null;
  preferred_date: string;
  preferred_time: string;
  notes: string | null;
  status: string;
  location: string | null;
  created_at: string;
};

export type DashboardDataResult = {
  bookings: DashboardBooking[];
  error?: string;
};

/**
 * Fetch bookings from the multi-branch `bookings_v2` table, joined with
 * `customers` and `services_v2`, filtered by branch slug.
 *
 * Falls back to the legacy `bookings` table if v2 query fails (e.g. tables
 * haven't been created yet).
 */
export async function fetchDashboardData(
  branchSlug: 'tellapur' | 'gopanpally' | 'both'
): Promise<DashboardDataResult> {
  // Auth guard
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return { bookings: [], error: 'Unauthorized' };
  }

  const supabase = await getAdminSupabaseClient();

  // ── Try bookings_v2 (multi-branch) first ──────────────────────────────
  try {
    // Resolve branch_id(s) from slug
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

    // Query bookings_v2 with customer + service joins
    let query = supabase
      .from('bookings_v2')
      .select(`
        id,
        booking_date,
        booking_time,
        status,
        notes,
        created_at,
        branch_id,
        customer:customers!inner ( name, phone, email ),
        service:services_v2 ( name ),
        branch:branches!inner ( slug )
      `)
      .order('created_at', { ascending: false })
      .limit(200);

    // Filter by branch
    if (branchIds.length === 1) {
      query = query.eq('branch_id', branchIds[0]);
    } else {
      query = query.in('branch_id', branchIds);
    }

    const { data: rows, error: qErr } = await query;

    if (qErr) throw qErr;

    if (rows && rows.length >= 0) {
      // Map v2 rows → DashboardBooking shape (compatible with existing dashboard)
      const bookings: DashboardBooking[] = rows.map((r: Record<string, unknown>) => {
        const customer = r.customer as { name: string; phone: string; email: string | null } | null;
        const service = r.service as { name: string } | null;
        const branch = r.branch as { slug: string } | null;

        return {
          id: r.id as string,
          customer_name: customer?.name ?? '—',
          customer_phone: customer?.phone ?? '—',
          customer_email: customer?.email ?? null,
          service_id: null,
          service_name: service?.name ?? null,
          preferred_date: r.booking_date as string,
          preferred_time: r.booking_time as string,
          notes: r.notes as string | null,
          status: r.status as string,
          location: branch?.slug ?? null,
          created_at: r.created_at as string,
        };
      });

      return { bookings };
    }

    return { bookings: [] };
  } catch (err) {
    console.error('[dashboard-data] bookings_v2 query failed:', err);
    return { bookings: [], error: 'Failed to load bookings from database.' };
  }
}

