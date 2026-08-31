import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import { SALON_SERVICES, type SalonService } from './services';

export const metadata: Metadata = {
  title: 'Book an Appointment — KRISTY UNISEX SALON, Tellapur Hyderabad',
  description:
    'Reserve your appointment at KRISTY UNISEX SALON, Tellapur, Hyderabad. Choose your service, date, and preferred time online.',
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

export default async function BookingPage() {
  const services = await getServices();

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
                Book
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
              Reserve Your Visit
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
              Fill in the form below and we will confirm your appointment by
              phone. For immediate bookings, call{' '}
              <a
                href="tel:+919515625554"
                style={{ color: '#ffffff', textDecoration: 'none' }}
              >
                095156 25554
              </a>
              .
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
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '80px',
            alignItems: 'start',
          }}
        >
          {/* Sidebar info */}
          <div>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '5px',
                padding: '32px 28px',
                marginBottom: '24px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  color: '#646464',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                }}
              >
                Visit Us
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '14px',
                  lineHeight: 1.65,
                  color: '#000000',
                  marginBottom: '20px',
                }}
              >
                Door No 27, 14/32,
                <br />
                Osman Nagar Rd,
                <br />
                beside Vision Arsha,
                <br />
                Tellapur, Hyderabad,
                <br />
                Telangana 502034
              </p>
              <a
                href="tel:+919515625554"
                style={{
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '14px',
                  color: '#3b3429',
                  textDecoration: 'none',
                  fontWeight: 500,
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                095156 25554
              </a>
              <p
                style={{
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '13px',
                  color: '#646464',
                }}
              >
                Open daily · Closes 10 PM
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#3b3429',
                borderRadius: '5px',
                padding: '28px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
                  fontSize: '16px',
                  color: '#ffffff',
                  fontWeight: 400,
                  marginBottom: '10px',
                }}
              >
                4.8★ Google rating
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '13px',
                  color: '#b4aeac',
                  lineHeight: 1.5,
                }}
              >
                Trusted by 299 verified reviewers. We take every appointment
                seriously.
              </p>
            </div>
          </div>

          {/* Booking form */}
          <div>
            <BookingForm services={services} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
