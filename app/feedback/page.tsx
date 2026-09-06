import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import FeedbackForm from './FeedbackForm';
import { SALON_SERVICES, type SalonService } from '@/app/booking/services';

export const metadata: Metadata = {
  title: 'Share Your Feedback — KRISTY UNISEX SALON',
  description:
    'We value your experience. Share your feedback about your visit to KRISTY UNISEX SALON, Tellapur or Gopanpally, Hyderabad.',
};

// Revalidate page data in background every 5 minutes
export const revalidate = 300;

async function getServices(): Promise<SalonService[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes('placeholder')) {
    return SALON_SERVICES;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(
      `${url}/rest/v1/services?select=id,name,price_inr,duration_minutes,category&is_active=eq.true&order=name`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        signal: controller.signal,
        next: { revalidate: 300 },
      }
    );
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // If Supabase table is not yet created or network is slow, fallback immediately
  }

  return SALON_SERVICES;
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FeedbackPage({ searchParams }: PageProps) {
  const [params, services] = await Promise.all([searchParams, getServices()]);
  const locationParam = typeof params.location === 'string' ? params.location : 'tellapur';
  const branchSlug = locationParam === 'gopanpally' ? 'gopanpally' : 'tellapur';

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
                Feedback
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
              Share Your Feedback
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
              Your experience matters to us. Let us know how your visit was — it
              helps us serve you better.
            </p>
          </div>
        </div>

        {/* Form & Reviews section */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingTop: '72px',
            paddingBottom: '96px',
            display: 'flex',
            flexDirection: 'column',
            gap: '48px',
          }}
        >
          <div style={{ maxWidth: '560px', width: '100%', margin: '0 auto' }}>
            <FeedbackForm defaultBranch={branchSlug} services={services} />
          </div>

          {/* Reviews & Social Card */}
          <div
            style={{
              maxWidth: '560px',
              width: '100%',
              margin: '0 auto',
              backgroundColor: '#111111',
              border: '1px solid rgba(201,169,110,0.2)',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
                fontSize: '24px',
                color: '#c9a96e',
                marginBottom: '16px',
              }}
            >
              Love Your New Look?
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                fontSize: '15px',
                color: '#b4aeac',
                marginBottom: '32px',
                lineHeight: 1.6,
              }}
            >
              Leave us a Google review or tag us in your selfies! Your support helps us grow and continue providing excellent service.
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                alignItems: 'center',
              }}
            >
              <a
                href={
                  branchSlug === 'gopanpally'
                    ? 'https://maps.app.goo.gl/v7sPXjeLXPjM9j2TA' // Gopanpally Google Review link
                    : 'https://maps.app.goo.gl/dQdoLTQgLuYSvUjd9' // Tellapur Google Review link
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#000000',
                  backgroundColor: '#c9a96e',
                  padding: '14px 32px',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  display: 'inline-block',
                  width: '100%',
                  textAlign: 'center',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Leave us a Google Review
              </a>
              <a
                href="https://www.instagram.com/kristyunisex"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#ffffff',
                  backgroundColor: 'transparent',
                  border: '1px solid #c9a96e',
                  padding: '14px 32px',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  display: 'inline-block',
                  width: '100%',
                  textAlign: 'center',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Follow us on Instagram
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer branchSlug={branchSlug} />
    </>
  );
}
