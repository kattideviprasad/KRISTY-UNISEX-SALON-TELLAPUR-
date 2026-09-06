import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import MembershipForm from './MembershipForm';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Join the Kristy Club — KRISTY UNISEX SALON',
  description:
    'Become a member of the Kristy Club to unlock exclusive perks, early access to offers, and a premium salon experience.',
};

export const revalidate = 300;

async function getBranches() {
  const supabase = await createClient();
  const { data } = await supabase.from('branches').select('id, name').order('name');
  return data || [];
}

export default async function MembershipPage() {
  const branches = await getBranches();

  return (
    <>
      <Nav />
      <main
        style={{
          backgroundColor: '#f2f1ed',
          minHeight: '100vh',
          paddingTop: '64px',
        }}
      >
        {/* Page header */}
        <div
          style={{
            backgroundColor: '#000000',
            paddingTop: '80px',
            paddingBottom: '80px',
            paddingLeft: '24px',
            paddingRight: '24px',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '24px',
              }}
            >
              <Link
                href="/"
                style={{
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '13px',
                  color: '#646464',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                }}
              >
                Home
              </Link>
              <span style={{ color: '#646464', fontSize: '13px' }}>/</span>
              <span
                style={{
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '13px',
                  color: '#b4aeac',
                  letterSpacing: '0.04em',
                }}
              >
                Membership
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
                fontSize: 'clamp(32px, 4vw, 48px)',
                lineHeight: 1.05,
                letterSpacing: '-0.48px',
                color: '#ffffff',
                fontWeight: 400,
                marginBottom: '16px',
              }}
            >
              Join the Kristy Club
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                fontSize: '15px',
                lineHeight: 1.6,
                color: '#b4aeac',
                maxWidth: '480px',
              }}
            >
              Elevate your salon experience. Become a member today to unlock exclusive perks, early access to seasonal offers, and priority bookings.
            </p>
          </div>
        </div>

        {/* Form section */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingTop: '72px',
            paddingBottom: '96px',
          }}
        >
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <MembershipForm branches={branches} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
