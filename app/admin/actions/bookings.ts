'use server';

import { cookies } from 'next/headers';
import { verifySessionToken, COOKIE_NAME } from '@/lib/admin-session';
import { getAdminSupabaseClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

const VALID_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

function isValidUUID(val?: string | null): boolean {
  if (!val) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

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

  if (!isValidUUID(id)) {
    return { error: 'Invalid booking ID' };
  }

  const supabase = await getAdminSupabaseClient();
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('updateBookingStatus error:', error);
    return { error: 'Failed to update booking status. Please try again.' };
  }

  revalidatePath('/admin');
  return { success: true };
}
