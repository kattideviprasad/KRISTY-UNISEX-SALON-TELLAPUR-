import Link from 'next/link';

const GOOGLE_MAPS_URL =
  'https://maps.google.com/?q=KRISTY+UNISEX+SALON,+Door+No+27,+14/32,+Osman+Nagar+Rd,+beside+Vision+Arsha,+Tellapur,+Hyderabad,+Telangana+502034';

export default function BookingCTA() {
  return (
    <section
      id="contact"
      style={{
        backgroundColor: '#3b3429',
        paddingTop: '96px',
        paddingBottom: '96px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingLeft: '24px',
          paddingRight: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '64px',
          alignItems: 'center',
        }}
      >
        {/* Left — headline */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: '#b4aeac',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            Book Your Visit
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
              fontSize: 'clamp(30px, 4vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.48px',
              color: '#ffffff',
              fontWeight: 400,
              marginBottom: '20px',
            }}
          >
            Reserve Your Visit
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '15px',
              lineHeight: 1.6,
              color: '#b4aeac',
              maxWidth: '400px',
            }}
          >
            Secure your chair at KRISTY UNISEX SALON — online booking is fast
            and takes less than two minutes. Or simply call and we&apos;ll take
            it from there.
          </p>
        </div>

        {/* Right — CTAs */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            alignItems: 'flex-start',
          }}
        >
          {/* Primary booking button */}
          <Link
            href="/booking"
            prefetch={true}
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#3b3429',
              backgroundColor: '#ffffff',
              padding: '14px 32px',
              borderRadius: '5px',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              display: 'inline-block',
              transition: 'background-color 0.2s',
            }}
          >
            Book an Appointment
          </Link>

          {/* Call button */}
          <a
            href="tel:+919515625554"
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#ffffff',
              backgroundColor: 'transparent',
              padding: '14px 32px',
              borderRadius: '5px',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              display: 'inline-block',
              border: '1px solid rgba(255,255,255,0.3)',
              transition: 'border-color 0.2s',
            }}
          >
            Call Us — 095156 25554
          </a>

          {/* Get directions */}
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '13px',
              color: '#b4aeac',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              marginTop: '8px',
              paddingLeft: '4px',
              transition: 'color 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>&#8599;</span>
            Get Directions on Google Maps
          </a>

          {/* Hours note */}
          <p
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '12px',
              color: '#646464',
              marginTop: '8px',
              paddingLeft: '4px',
            }}
          >
            Open daily · Closes 10 PM
          </p>
        </div>
      </div>
    </section>
  );
}
