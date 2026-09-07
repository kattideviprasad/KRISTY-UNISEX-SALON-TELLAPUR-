'use client';

import Image from 'next/image';
import Link from 'next/link';

const GOOGLE_MAPS_URL =
  'https://maps.google.com/?q=KRISTY+UNISEX+SALON,+Door+No+27,+14/32,+Osman+Nagar+Rd,+beside+Vision+Arsha,+Tellapur,+Hyderabad,+Telangana+502034';

export default function Footer({ branchSlug }: { branchSlug?: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: '#000000',
        paddingTop: '96px',
        paddingBottom: '48px',
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
        {/* Top row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '64px',
            marginBottom: '72px',
          }}
        >
          {/* Brand column */}
          <div>
            {/* Logo + wordmark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '1px solid rgba(180,174,172,0.2)',
                }}
              >
                <Image
                  src="/logo.png"
                  alt="KRISTY UNISEX SALON"
                  width={48}
                  height={48}
                  sizes="48px"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
                  fontSize: '16px',
                  letterSpacing: '0.06em',
                  color: '#ffffff',
                  fontWeight: 400,
                  lineHeight: 1.2,
                }}
              >
                KRISTY<br />UNISEX SALON
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                fontSize: '14px',
                lineHeight: 1.6,
                color: '#646464',
                maxWidth: '240px',
              }}
            >
              Unisex beauty &amp; grooming salon in Tellapur, Hyderabad.
              Open daily, closing at 10 PM.
            </p>
          </div>

          {/* Contact column */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: '#646464',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Contact
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={branchSlug === 'gopanpally' ? 'tel:+919153224444' : 'tel:+919515625554'}
                style={{
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '14px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  letterSpacing: '0.02em',
                }}
              >
                {branchSlug === 'gopanpally' ? '091532 24444' : '095156 25554'}
              </a>
              <p
                style={{
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: '#b4aeac',
                }}
              >
                {branchSlug === 'gopanpally' ? (
                  <>
                    1st Floor, Tellapur Rd,
                    <br />
                    opp. Muppa Green Grandeur,
                    <br />
                    Gopanpalle, Gopanpally,
                    <br />
                    Hyderabad,
                    <br />
                    Telangana 500046
                  </>
                ) : (
                  <>
                    Door No 27, 14/32,
                    <br />
                    Osman Nagar Rd,
                    <br />
                    beside Vision Arsha,
                    <br />
                    Tellapur, Hyderabad,
                    <br />
                    Telangana 502034
                  </>
                )}
              </p>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '13px',
                  color: '#646464',
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                  transition: 'color 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>&#8599;</span> View on Google Maps
              </a>

              {/* Social icons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  paddingTop: '4px',
                }}
              >
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/kristyunisex/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kristy Unisex Salon on Instagram"
                  style={{
                    color: '#646464',
                    display: 'inline-flex',
                    alignItems: 'center',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a96e')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#646464')}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href={branchSlug === 'gopanpally' ? 'https://wa.me/919153224444' : 'https://wa.me/919515625554'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with Kristy Unisex Salon on WhatsApp"
                  style={{
                    color: '#646464',
                    display: 'inline-flex',
                    alignItems: 'center',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a96e')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#646464')}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Hours column */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: '#646464',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Hours
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '32px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                    fontSize: '14px',
                    color: '#b4aeac',
                  }}
                >
                  Daily
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                    fontSize: '14px',
                    color: '#ffffff',
                  }}
                >
                  {branchSlug === 'gopanpally' ? '7:00 AM – 11:00 PM' : '8:00 AM – 10:00 PM'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick links column */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: '#646464',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Navigate
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Services', href: '#services' },
                { label: 'About', href: '#about' },
                { label: 'Gallery', href: '#gallery' },
                { label: 'Book an Appointment', href: '/booking' },
                { label: 'Share Your Feedback', href: '/feedback' },
                { label: 'Join the Kristy Club', href: '/membership' },
              ].map((link) => {
                const isInternal = link.href.startsWith('/');
                const linkStyle = {
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '14px',
                  color: '#b4aeac',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  letterSpacing: '0.02em',
                };
                if (isInternal) {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={true}
                      style={linkStyle}
                    >
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    style={linkStyle}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Reviews & Social column */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: '#646464',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Reviews & Social
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#000000',
                  backgroundColor: '#c9a96e',
                  padding: '12px 20px',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  display: 'inline-block',
                  textAlign: 'center',
                  transition: 'opacity 0.2s',
                  borderRadius: '2px',
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
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#ffffff',
                  backgroundColor: 'transparent',
                  border: '1px solid #c9a96e',
                  padding: '12px 20px',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  display: 'inline-block',
                  textAlign: 'center',
                  transition: 'background-color 0.2s',
                  borderRadius: '2px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Follow us on Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            backgroundColor: '#1a1a1a',
            marginBottom: '32px',
          }}
        />

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '12px',
              color: '#646464',
            }}
          >
            &copy; {currentYear} KRISTY UNISEX SALON. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '12px',
              color: '#646464',
            }}
          >
            4.8&#9733; &middot; 299 Google reviews &middot; Tellapur, Hyderabad
          </p>
        </div>
      </div>
    </footer>
  );
}
