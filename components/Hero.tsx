import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        overflow: 'hidden',
      }}
    >
      {/* ── LEFT PANEL — ink, all content ─────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#000000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(80px, 10vw, 120px) clamp(32px, 5vw, 72px)',
          position: 'relative',
        }}
      >
        {/* Logo badge */}
        <div
          style={{
            marginBottom: '36px',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '1px solid rgba(180,174,172,0.3)',
            position: 'relative',
          }}
        >
          <Image
            src="/logo.png"
            alt="KRISTY UNISEX SALON"
            width={100}
            height={100}
            priority
            sizes="100px"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>

        {/* Eyebrow */}
        <p
          style={{
            fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: '#646464',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          Unisex Beauty &amp; Grooming · Tellapur, Hyderabad
        </p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            lineHeight: 1.04,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            fontWeight: 400,
            marginBottom: '28px',
          }}
        >
          KRISTY
          <br />
          UNISEX SALON
        </h1>

        {/* Divider rule */}
        <div
          style={{
            width: '40px',
            height: '1px',
            backgroundColor: '#3b3429',
            marginBottom: '28px',
          }}
        />

        {/* Supporting copy */}
        <p
          style={{
            fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
            fontSize: '15px',
            lineHeight: 1.65,
            color: '#b4aeac',
            marginBottom: '44px',
            maxWidth: '380px',
          }}
        >
          Expert hair, skin, and grooming for every guest.
          Walk in or reserve your chair in advance.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
          <Link
            href="/booking"
            prefetch={true}
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              color: '#000000',
              backgroundColor: '#ffffff',
              padding: '13px 28px',
              borderRadius: '5px',
              textDecoration: 'none',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'inline-block',
            }}
          >
            Book an Appointment
          </Link>
          <a
            href="tel:+919515625554"
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '13px',
              color: '#646464',
              textDecoration: 'none',
              letterSpacing: '0.06em',
              paddingLeft: '2px',
            }}
          >
            &#8594; Call 095156 25554
          </a>
        </div>

        {/* Trust strip */}
        <p
          style={{
            fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
            fontSize: '12px',
            color: '#646464',
            letterSpacing: '0.04em',
            marginTop: '56px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          4.8&#9733; &middot; 299 Google reviews
        </p>

        {/* Scroll indicator — desktop only */}
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            left: 'clamp(32px, 5vw, 72px)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '1px',
              backgroundColor: '#3b3429',
              animation: 'scrollPulse 2s ease-in-out infinite',
              willChange: 'opacity',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.16em',
              color: '#646464',
              textTransform: 'uppercase',
            }}
          >
            Scroll
          </span>
        </div>
      </div>

      {/* ── RIGHT PANEL — full-brightness salon photo ──────────────────── */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#1a1410',
          minHeight: '100vh',
        }}
      >
        <Image
          src="/hero2.png"
          alt="Inside KRISTY UNISEX SALON, Tellapur"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={95}
          style={{
            objectFit: 'cover',
            objectPosition: 'center center',
          }}
        />

        {/* Subtle left-edge gradient to blend into the ink panel */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '120px',
            height: '100%',
            background: 'linear-gradient(to right, #000000, transparent)',
            pointerEvents: 'none',
          }}
        />

        {/* Bottom caption */}
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            right: '28px',
            textAlign: 'right',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.06em',
              backgroundColor: 'rgba(0,0,0,0.4)',
              padding: '6px 12px',
              borderRadius: '3px',
              backdropFilter: 'blur(4px)',
            }}
          >
            The Studio · Tellapur
          </span>
        </div>
      </div>

      {/* Mobile fallback — stacks photo above content on narrow screens */}
      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @media (max-width: 768px) {
          #hero {
            grid-template-columns: 1fr !important;
            grid-template-rows: 55vw auto;
            min-height: unset !important;
          }
          #hero > div:first-child {
            order: 2;
            min-height: 100vh;
          }
          #hero > div:last-child {
            order: 1;
            min-height: 55vw !important;
          }
        }
      `}</style>
    </section>
  );
}
