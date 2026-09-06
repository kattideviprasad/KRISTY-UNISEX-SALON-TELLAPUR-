import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifySessionToken, COOKIE_NAME } from '@/lib/admin-session';
import BookingsDashboard from './BookingsDashboard';

export const dynamic = 'force-dynamic';

export type Booking = {
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
  location?: string | null;
  created_at: string;
};

export default async function AdminPage() {
  // Server-side auth check (defence-in-depth on top of proxy)
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) redirect('/admin/login');

  // Data is now fetched client-side via fetchDashboardData, driven by
  // the BranchSwitcher selection. Only auth gating happens server-side.
  return (
    <BookingsDashboard
      adminEmail="kristy"
    />
  );
}
