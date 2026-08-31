'use server';

import { cookies } from 'next/headers';
import { verifySessionToken, COOKIE_NAME } from '@/lib/admin-session';
import { getAdminSupabaseClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

const VALID_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

export async function updateBookingStatus(id: string, status: string) {
  // Server-side auth check — verify custom session cookie
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return { error: 'Unauthorized' };
  }

  if (!VALID_STATUSES.includes(status)) {
    return { error: 'Invalid status value' };
  }

  if (!id || typeof id !== 'string') {
    return { error: 'Invalid booking ID' };
  }

  const supabase = await getAdminSupabaseClient();
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('updateBookingStatus error:', error);
    return { error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}
