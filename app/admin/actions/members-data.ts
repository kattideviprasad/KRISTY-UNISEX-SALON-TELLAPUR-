'use server';

import { getAdminSupabaseClient } from '@/lib/supabase/admin';

export type MemberRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  dob: string | null;
  join_date: string;
  branch_slug: string | null;
  branch_name: string | null;
  tier: string | null;
};

export async function fetchMembersData(): Promise<MemberRow[]> {
  const supabase = await getAdminSupabaseClient();

  const { data: rows, error } = await supabase
    .from('memberships')
    .select(`
      id,
      tier,
      start_date,
      created_at,
      customer:customers!inner (
        name,
        phone,
        email,
        dob,
        branch:branches (
          slug,
          name
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[members-data] Query failed:', error);
    return [];
  }

  const memberMap = new Map<string, MemberRow>();

  for (const r of (rows ?? [])) {
    const customer = r.customer as unknown as { name: string; phone: string; email: string | null; dob: string | null; branch: { slug: string; name: string } | null } | null;
    
    if (!customer) continue;

    memberMap.set(r.id, {
      id: r.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      dob: customer.dob,
      join_date: r.created_at || r.start_date || new Date().toISOString(),
      branch_slug: customer.branch?.slug || null,
      branch_name: customer.branch?.name || null,
      tier: r.tier || 'Member',
    });
  }

  return Array.from(memberMap.values());
}
