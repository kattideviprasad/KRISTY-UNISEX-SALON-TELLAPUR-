'use client';

import Image from 'next/image';
import Link from 'next/link';

const GOPANPALLY_MAPS =
  'https://maps.google.com/?q=Kristy+Unisex+Salon,+1st+Floor,+Tellapur+Rd,+opp.+Muppa+Green+Grandeur,+Gopanpally,+Hyderabad,+Telangana+500046';

const TELLAPUR_MAPS =
  'https://maps.google.com/?q=KRISTY+UNISEX+SALON,+Door+No+27,+14/32,+Osman+Nagar+Rd,+beside+Vision+Arsha,+Tellapur,+Hyderabad,+Telangana+502034';

const studios = [
  {
    id: 'gopanpally',
    badge: 'Original Location',
    title: 'Gopanpally — The Original',
    address:
      '1st Floor, Tellapur Rd, opp. Muppa Green Grandeur, Gopanpally, Hyderabad, Telangana 500046',
    phone: '091532 24444',
    phoneHref: 'tel:+919153224444',
    hours: 'Open daily, 7:00 AM – 11:00 PM',
    blurb:
      'Known for bridal makeup, mehendi, and stylists who walk you through every step',
    image: '/reception.png',
    imageAlt: 'Gopanpally studio reception',
    mapsUrl: GOPANPALLY_MAPS,
    bookingLocation: 'gopanpally',
  },
  {
    id: 'tellapur',
    badge: 'Tellapur Branch',
    title: 'Tellapur — Osman Nagar',
    address:
      'Door No 27, 14/32, Osman Nagar Rd, beside Vision Arsha, Tellapur, Hyderabad, Telangana 502034',
    phone: '095156 25554',
    phoneHref: 'tel:+919515625554',
    hours: 'Open daily, 8:00 AM – 10:00 PM',
    blurb:
      'A calmer, newer space with the same attentive, unhurried service',
    image: '/about-hero.jpg', // swap for real Tellapur interior photo
    imageAlt: 'Tellapur studio reception',
    mapsUrl: TELLAPUR_MAPS,
    bookingLocation: 'tellapur',
  },
];

export default function TwoStudios() {
  return (
    <section
      id="studios"
      style={{
        backgroundColor: '#f2f1ed',
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
        <div style={{ marginBottom: '64px' }}>
          <p
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: '#646464',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            Our Locations
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.48px',
              color: '#000000',
              fontWeight: 400,
              marginBottom: '24px',
              maxWidth: '560px',
            }}
          >
            Two Studios, One Standard
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '16px',
              lineHeight: 1.65,
              color: '#3b3429',
              maxWidth: '680px',
            }}
          >
            KRISTY UNISEX SALON began in Gopanpalle, where it built its
            reputation one client at a time — patient stylists, honest advice,
            and the kind of trust that turns first-timers into regulars. As that
            reputation grew, so did the need for a second home: Tellapur. Same
            team values, same standard of care, just closer to you. Whichever
            chair you sit in, you&rsquo;re getting the same Kristy experience.
          </p>
        </div>

        {/* ── Two cards ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
          }}
        >
          {studios.map((studio) => (
            <div
              key={studio.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '5px',
                overflow: 'hidden',
                border: '1px solid rgba(180,174,172,0.3)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Photo slot */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '16 / 9',
                  backgroundColor: '#f2f1ed',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={studio.image}
                  alt={studio.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 580px"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />

                {/* Badge */}
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#000000',
                    backgroundColor: '#c9a96e',
                    padding: '4px 10px',
                    borderRadius: '3px',
                  }}
                >
                  {studio.badge}
                </span>
              </div>

              {/* Card body */}
              <div
                style={{
                  padding: '28px 28px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  flex: 1,
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
                    fontSize: 'clamp(20px, 2vw, 24px)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.2px',
                    color: '#000000',
                    fontWeight: 400,
                  }}
                >
                  {studio.title}
                </h3>

                {/* Blurb */}
                <p
                  style={{
                    fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                    fontSize: '14px',
                    lineHeight: 1.55,
                    color: '#646464',
                    fontStyle: 'italic',
                  }}
                >
                  &ldquo;{studio.blurb}&rdquo;
                </p>

                {/* Divider */}
                <div
                  style={{
                    borderTop: '1px solid #f2f1ed',
                    paddingTop: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {/* Address */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span
                      style={{
                        color: '#c9a96e',
                        fontSize: '14px',
                        marginTop: '1px',
                        flexShrink: 0,
                      }}
                    >
                      ◎
                    </span>
                    <p
                      style={{
                        fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                        fontSize: '13px',
                        lineHeight: 1.5,
                        color: '#3b3429',
                      }}
                    >
                      {studio.address}
                    </p>
                  </div>

                  {/* Hours */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: '#c9a96e', fontSize: '14px', flexShrink: 0 }}>◷</span>
                    <p
                      style={{
                        fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                        fontSize: '13px',
                        color: '#3b3429',
                      }}
                    >
                      {studio.hours}
                    </p>
                  </div>
                </div>

                {/* CTA buttons */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginTop: '8px',
                  }}
                >
                  {/* Get Directions */}
                  <a
                    href={studio.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#000000',
                      backgroundColor: '#c9a96e',
                      padding: '9px 18px',
                      borderRadius: '5px',
                      textDecoration: 'none',
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#dfc38d';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#c9a96e';
                    }}
                  >
                    <span>Get Directions</span>
                    <span aria-hidden="true">↗</span>
                  </a>

                  {/* Call */}
                  <a
                    href={studio.phoneHref}
                    style={{
                      fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#000000',
                      backgroundColor: '#ffffff',
                      padding: '9px 18px',
                      borderRadius: '5px',
                      textDecoration: 'none',
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      border: '1px solid #b4aeac',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = '#3b3429';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = '#b4aeac';
                    }}
                  >
                    <span>📞</span>
                    <span>Call {studio.phone}</span>
                  </a>

                  {/* Book at this location */}
                  <Link
                    href={`/booking?location=${studio.bookingLocation}`}
                    prefetch={true}
                    style={{
                      fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#000000',
                      backgroundColor: 'transparent',
                      padding: '9px 0',
                      borderRadius: '0',
                      textDecoration: 'none',
                      letterSpacing: '0.05em',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      borderBottom: '1px solid rgba(0,0,0,0.25)',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = '#000000';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'rgba(0,0,0,0.25)';
                    }}
                  >
                    Book at this location →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
