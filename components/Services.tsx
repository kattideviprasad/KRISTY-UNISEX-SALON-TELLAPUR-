'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type Service = {
  id: number;
  name: string;
  category: string;
  accent: boolean;
};

const CATEGORIES = [
  { key: 'All', label: 'All Services' },
  { key: 'Face & Skin Care', label: 'Face & Skin Care' },
  { key: 'Hair', label: 'Hair' },
  { key: 'Bridal & Makeup', label: 'Bridal & Makeup' },
  { key: 'Threading', label: 'Threading' },
  { key: 'Nails', label: 'Nails' },
];

const SERVICES: Service[] = [
  // Face & Skin Care (13 services)
  { id: 1,  name: 'Facial',                             category: 'Face & Skin Care', accent: false },
  { id: 2,  name: 'Anti Acne Facial',                   category: 'Face & Skin Care', accent: false },
  { id: 3,  name: 'Skin Treatment',                     category: 'Face & Skin Care', accent: false },
  { id: 4,  name: 'Skin Treatment – Anti Acne',         category: 'Face & Skin Care', accent: false },
  { id: 5,  name: 'D-Tan Pack – Face',                  category: 'Face & Skin Care', accent: false },
  { id: 6,  name: 'Tan Pack – Face',                    category: 'Face & Skin Care', accent: false },
  { id: 7,  name: 'Chemical Peel Treatment',            category: 'Face & Skin Care', accent: true  },
  { id: 8,  name: 'Facial Wrinkles',                    category: 'Face & Skin Care', accent: false },
  { id: 9,  name: 'Radiance Rejuvenating Cocoa Facial', category: 'Face & Skin Care', accent: true  },
  { id: 10, name: 'Facial Glow',                        category: 'Face & Skin Care', accent: false },
  { id: 11, name: 'Pimple Treatment',                   category: 'Face & Skin Care', accent: false },
  { id: 12, name: 'Vital Peel Facial',                  category: 'Face & Skin Care', accent: false },
  { id: 13, name: 'Thermo Herb Facial',                 category: 'Face & Skin Care', accent: false },

  // Hair (5 services)
  { id: 14, name: 'Hair Cut',         category: 'Hair', accent: false },
  { id: 15, name: 'Advance Hair Cut', category: 'Hair', accent: true  },
  { id: 16, name: 'Hair Styling',     category: 'Hair', accent: false },
  { id: 17, name: 'Hair Extension',   category: 'Hair', accent: true  },
  { id: 18, name: 'Shaving',          category: 'Hair', accent: false },

  // Bridal & Makeup (4 services)
  { id: 19, name: 'Basic Makeup',   category: 'Bridal & Makeup', accent: false },
  { id: 20, name: 'Bridal Package', category: 'Bridal & Makeup', accent: true  },
  { id: 21, name: 'Basic Mehandi',  category: 'Bridal & Makeup', accent: false },
  { id: 22, name: 'Bridal Mehandi', category: 'Bridal & Makeup', accent: false },

  // Threading (1 service)
  { id: 23, name: 'Threading – Eyebrows', category: 'Threading', accent: false },

  // Nails (1 service)
  { id: 24, name: 'Premium Manicure', category: 'Nails', accent: false },
];

function ServicesContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('category');

  const [activeCategory, setActiveCategory] = useState(() => {
    if (catParam) {
      const match = CATEGORIES.find((c) => c.key === catParam);
      if (match) return match.key;
    }
    return 'All';
  });

  const visible = useMemo(() => {
    return activeCategory === 'All'
      ? SERVICES
      : SERVICES.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  return (
    <section
      id="services"
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
        {/* ── Section header ── */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
            What We Offer
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
              fontSize: 'clamp(32px, 4vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.48px',
              color: '#000000',
              fontWeight: 400,
              marginBottom: '16px',
            }}
          >
            Our Services
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '15px',
              lineHeight: 1.6,
              color: '#646464',
              maxWidth: '520px',
              margin: '0 auto',
            }}
          >
            A full menu of beauty and grooming treatments for every guest.
            Pricing to be confirmed — contact us or book to enquire.
          </p>
        </div>

        {/* ── Category tab pills ── */}
        <div
          role="tablist"
          aria-label="Service categories"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            marginBottom: '48px',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '13px',
                  fontWeight: isActive ? 500 : 400,
                  letterSpacing: '0.04em',
                  padding: '8px 18px',
                  borderRadius: '5px',
                  border: isActive ? '1px solid #3b3429' : '1px solid #b4aeac',
                  backgroundColor: isActive ? '#3b3429' : 'transparent',
                  color: isActive ? '#ffffff' : '#646464',
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── Service count ── */}
        <p
          style={{
            fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
            fontSize: '12px',
            color: '#b4aeac',
            letterSpacing: '0.06em',
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          {visible.length} service{visible.length !== 1 ? 's' : ''}
          {activeCategory !== 'All' ? ` in ${activeCategory}` : ' across all categories'}
        </p>

        {/* ── Service grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1px',
            backgroundColor: '#b4aeac',
            border: '1px solid #b4aeac',
            borderRadius: '5px',
            overflow: 'hidden',
          }}
        >
          {visible.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* ── Disclaimer note ── */}
        <p
          style={{
            fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
            fontSize: '12px',
            color: '#646464',
            textAlign: 'center',
            marginTop: '32px',
            letterSpacing: '0.02em',
          }}
        >
          Prices and durations are placeholders — to be updated by the client before launch.
        </p>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const bg       = service.accent ? '#3b3429' : '#ffffff';
  const textMain = service.accent ? '#ffffff' : '#000000';
  const textSub  = service.accent ? '#b4aeac' : '#646464';
  const divider  = service.accent
    ? '1px solid rgba(255,255,255,0.12)'
    : '1px solid #f2f1ed';

  const bookingHref = `/booking?service_name=${encodeURIComponent(service.name)}&category=${encodeURIComponent(service.category)}`;

  return (
    <a
      href={bookingHref}
      style={{
        backgroundColor: bg,
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'filter 0.18s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.filter = 'brightness(0.95)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.filter = 'none';
      }}
    >
      {/* Category badge */}
      <span
        style={{
          fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: textSub,
        }}
      >
        {service.category}
      </span>

      {/* Service name */}
      <h3
        style={{
          fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
          fontSize: '22px',
          lineHeight: 1.08,
          letterSpacing: '-0.2px',
          color: textMain,
          fontWeight: 400,
          flexGrow: 1,
        }}
      >
        {service.name}
      </h3>

      {/* Description placeholder */}
      <p
        style={{
          fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
          fontSize: '13px',
          lineHeight: 1.5,
          color: textSub,
        }}
      >
        [Brief description — to be supplied by client]
      </p>

      {/* Price / duration row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          paddingTop: '14px',
          borderTop: divider,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
            fontSize: '18px',
            color: textMain,
            fontWeight: 400,
          }}
        >
          ₹[PRICE]
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
            fontSize: '12px',
            color: textSub,
            letterSpacing: '0.04em',
          }}
        >
          [xx] min
        </span>
      </div>
    </a>
  );
}
export default function Services() {
  return (
    <Suspense fallback={null}>
      <ServicesContent />
    </Suspense>
  );
}
