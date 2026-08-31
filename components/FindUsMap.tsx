'use client';

import { MapPin } from 'lucide-react';

const GOOGLE_MAPS_URL =
  'https://maps.google.com/?q=KRISTY+UNISEX+SALON,+Door+No+27,+14/32,+Osman+Nagar+Rd,+beside+Vision+Arsha,+Tellapur,+Hyderabad,+Telangana+502034';

export default function FindUsMap() {
  return (
    <section
      id="find-us"
      style={{
        backgroundColor: '#0a0a0a',
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
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'flex-end',
            marginBottom: '40px',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.18em',
                color: '#646464',
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}
            >
              Find Us
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
                fontSize: 'clamp(28px, 3.5vw, 36px)',
                lineHeight: 1.05,
                letterSpacing: '-0.4px',
                color: '#ffffff',
                fontWeight: 400,
              }}
            >
              The Studio, Tellapur
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                fontSize: '14px',
                lineHeight: 1.6,
                color: '#646464',
                marginTop: '10px',
              }}
            >
              Door No 27, 14/32, Osman Nagar Rd, beside Vision Arsha,<br />
              Tellapur, Hyderabad, Telangana 502034
            </p>
          </div>

          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '13px',
              color: '#c9a96e',
              textDecoration: 'none',
              letterSpacing: '0.06em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              borderBottom: '1px solid rgba(201,169,110,0.3)',
              paddingBottom: '2px',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderBottomColor = 'rgba(201,169,110,0.9)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderBottomColor = 'rgba(201,169,110,0.3)')
            }
          >
            ↗ Get Directions
          </a>
        </div>

        {/* ── Static map visual card ── */}
        <div
          style={{
            height: '420px',
            borderRadius: '5px',
            overflow: 'hidden',
            border: '1px solid rgba(180,174,172,0.1)',
            backgroundColor: '#111111',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 24px',
            textAlign: 'center',
            background:
              'radial-gradient(circle at 50% 45%, rgba(201, 169, 110, 0.06) 0%, rgba(17, 17, 17, 1) 75%)',
          }}
        >
          {/* Subtle concentric ambient ring */}
          <div
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              backgroundColor: 'rgba(201, 169, 110, 0.08)',
              border: '1px solid rgba(201, 169, 110, 0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '28px',
              boxShadow: '0 0 32px rgba(201, 169, 110, 0.12)',
            }}
          >
            <MapPin size={48} color="#c9a96e" strokeWidth={1.5} />
          </div>

          {/* Primary Get Directions button */}
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: '#000000',
              backgroundColor: '#c9a96e',
              padding: '14px 32px',
              borderRadius: '5px',
              textDecoration: 'none',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 18px rgba(201, 169, 110, 0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#dfc38d';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(201, 169, 110, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#c9a96e';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(201, 169, 110, 0.25)';
            }}
          >
            <span>Get Directions</span>
            <span aria-hidden="true" style={{ fontSize: '15px', lineHeight: 1 }}>
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
