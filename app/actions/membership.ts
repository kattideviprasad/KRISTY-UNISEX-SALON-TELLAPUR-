'use server';

import { getAdminSupabaseClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function joinMembership(formData: FormData) {
  try {
    const supabase = await getAdminSupabaseClient();
    
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = (formData.get('email') as string) || null;
    const dob = (formData.get('dob') as string) || null;
    const preferred_branch_id = (formData.get('preferred_branch_id') as string) || null;

    if (!name || !phone) {
      return { error: 'Name and Phone are required.' };
    }

    if (!/^\d{10}$/.test(phone)) {
      return { error: 'Phone number must be exactly 10 digits.' };
    }

    // Upsert customer (match on phone)
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .upsert(
        {
          name,
          phone,
          ...(email && { email }),
          ...(dob && { dob }),
          ...(preferred_branch_id && { preferred_branch_id }),
        },
        { onConflict: 'phone' }
      )
      .select('id')
      .single();

    if (customerError || !customerData) {
      console.error('[membership] Customer upsert error:', customerError);
      return { error: 'Failed to save customer details. Please try again.' };
    }

    // Check if membership already exists for this customer
    const { data: existingMembership } = await supabase
      .from('memberships')
      .select('id')
      .eq('customer_id', customerData.id)
      .single();

    if (existingMembership) {
      return { success: true, message: 'You are already a member!', membershipId: existingMembership.id };
    }

    // Create membership record
    const { data: membershipData, error: membershipError } = await supabase
      .from('memberships')
      .insert({
        customer_id: customerData.id,
        tier: 'Member',
        start_date: new Date().toISOString().split('T')[0],
      })
      .select('id')
      .single();

    if (membershipError || !membershipData) {
      console.error('[membership] Insert error:', membershipError);
      return { error: 'Failed to create membership. Please try again.' };
    }

    revalidatePath('/admin');
    return { success: true, message: 'Welcome to the Kristy Club!', membershipId: membershipData.id };
  } catch (err) {
    console.error('[membership] Unexpected error:', err);
    return { error: 'Something went wrong. Please try again later.' };
  }
}
