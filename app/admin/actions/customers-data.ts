'use server';

import { cookies } from 'next/headers';
import { verifySessionToken, COOKIE_NAME } from '@/lib/admin-session';
import { getAdminSupabaseClient } from '@/lib/supabase/admin';

export type CustomerRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  visit_count: number;
  last_visit_date: string | null;
  most_recent_branch: string | null;
  created_at: string;
  bookings: CustomerBooking[];
};

export type CustomerBooking = {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  service_name: string | null;
  branch_slug: string | null;
};

export type CustomersDataResult = {
  customers: CustomerRow[];
  stats: {
    total: number;
    newThisMonth: number;
    repeatVisitors: number;
  };
  error?: string;
};

/**
 * Fetch customers with aggregated booking stats from bookings_v2.
 * Optionally filters by branch slug.
 */
export async function fetchCustomersData(
  branchSlug: 'tellapur' | 'gopanpally' | 'both'
): Promise<CustomersDataResult> {
  // Auth guard
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return { customers: [], stats: { total: 0, newThisMonth: 0, repeatVisitors: 0 }, error: 'Unauthorized' };
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

    // Fetch all bookings_v2 with customer + service + branch joins
    let query = supabase
      .from('bookings_v2')
      .select(`
        id,
        booking_date,
        booking_time,
        status,
        created_at,
        customer_id,
        branch_id,
        customer:customers!inner ( id, name, phone, email, created_at ),
        service:services_v2 ( name ),
        branch:branches!inner ( slug )
      `)
      .order('booking_date', { ascending: false });

    if (branchIds.length === 1) {
      query = query.eq('branch_id', branchIds[0]);
    } else {
      query = query.in('branch_id', branchIds);
    }

    const { data: rows, error: qErr } = await query;
    if (qErr) throw qErr;

    // Group by customer
    const customerMap = new Map<string, CustomerRow>();

    for (const r of (rows ?? [])) {
      const customer = r.customer as unknown as { id: string; name: string; phone: string; email: string | null; created_at: string } | null;
      const service = r.service as unknown as { name: string } | null;
      const branch = r.branch as unknown as { slug: string } | null;

      if (!customer) continue;

      const booking: CustomerBooking = {
        id: r.id as string,
        booking_date: r.booking_date as string,
        booking_time: r.booking_time as string,
        status: r.status as string,
        service_name: service?.name ?? null,
        branch_slug: branch?.slug ?? null,
      };

      if (customerMap.has(customer.id)) {
        const existing = customerMap.get(customer.id)!;
        existing.visit_count += 1;
        existing.bookings.push(booking);

        // Update last visit if this booking is more recent
        if (!existing.last_visit_date || (r.booking_date as string) > existing.last_visit_date) {
          existing.last_visit_date = r.booking_date as string;
          existing.most_recent_branch = branch?.slug ?? null;
        }
      } else {
        customerMap.set(customer.id, {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          visit_count: 1,
          last_visit_date: r.booking_date as string,
          most_recent_branch: branch?.slug ?? null,
          created_at: customer.created_at,
          bookings: [booking],
        });
      }
    }

    const customers = Array.from(customerMap.values());

    // Sort bookings within each customer by date descending
    for (const c of customers) {
      c.bookings.sort((a, b) => b.booking_date.localeCompare(a.booking_date));
    }

    // Sort customers by last visit date descending by default
    customers.sort((a, b) => {
      if (!a.last_visit_date) return 1;
      if (!b.last_visit_date) return -1;
      return b.last_visit_date.localeCompare(a.last_visit_date);
    });

    // Compute stats
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

    const stats = {
      total: customers.length,
      newThisMonth: customers.filter(c => c.created_at && c.created_at.slice(0, 10) >= monthStart).length,
      repeatVisitors: customers.filter(c => c.visit_count >= 2).length,
    };

    return { customers, stats };
  } catch (err) {
    console.error('[customers-data] Query failed:', err);
    return { customers: [], stats: { total: 0, newThisMonth: 0, repeatVisitors: 0 }, error: 'Failed to load customers.' };
  }
}
