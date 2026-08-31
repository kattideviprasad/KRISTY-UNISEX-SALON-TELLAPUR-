import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section id="hero" className="hero-section">
      {/* ── Background Photo — on desktop occupies right 50%, on mobile fills 100% ── */}
      <div className="hero-image-container">
        <Image
          src="/hero2.png"
          alt="Inside KRISTY UNISEX SALON, Tellapur"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={95}
          className="hero-image"
          style={{
            objectFit: 'cover',
            objectPosition: 'center center',
          }}
        />

        {/* Mobile full-bleed dark gradient overlay for text legibility */}
        <div className="hero-mobile-overlay" />

        {/* Desktop left-edge blend gradient */}
        <div className="hero-desktop-blend" />

        {/* Studio location caption */}
        <div className="hero-caption">
          <span>The Studio · Tellapur</span>
        </div>
      </div>

      {/* ── Content Panel — on desktop left panel, on mobile overlaid on top of image ── */}
      <div className="hero-content-panel">
        {/* Logo badge */}
        <div className="hero-logo-badge">
          <Image
            src="/logo.png"
            alt="KRISTY UNISEX SALON"
            width={84}
            height={84}
            priority
            sizes="84px"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>

        {/* Eyebrow */}
        <p className="hero-eyebrow">
          Unisex Beauty &amp; Grooming · Tellapur, Hyderabad
        </p>

        {/* Headline */}
        <h1 className="hero-headline">
          KRISTY
          <br />
          UNISEX SALON
        </h1>

        {/* Divider rule */}
        <div className="hero-divider" />

        {/* Supporting copy */}
        <p className="hero-description">
          Expert hair, skin, and grooming for every guest.
          Walk in or reserve your chair in advance.
        </p>

        {/* CTAs */}
        <div className="hero-ctas">
          <Link
            href="/booking"
            prefetch={true}
            className="hero-btn-primary"
          >
            Book an Appointment
          </Link>
          <a
            href="tel:+919515625554"
            className="hero-btn-call"
          >
            &#8594; Call 095156 25554
          </a>
        </div>

        {/* Trust strip */}
        <p className="hero-trust">
          4.8&#9733; &middot; 299 Google reviews
        </p>

        {/* Scroll indicator — desktop only */}
        <div className="hero-scroll-indicator">
          <div className="hero-scroll-line" />
          <span className="hero-scroll-text">Scroll</span>
        </div>
      </div>

      <style>{`
        .hero-section {
          min-height: 100vh;
          min-height: 100dvh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
          overflow: hidden;
          background-color: #000000;
        }

        .hero-content-panel {
          background-color: #000000;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(80px, 10vw, 120px) clamp(32px, 5vw, 72px);
          position: relative;
          z-index: 2;
        }

        .hero-image-container {
          position: relative;
          overflow: hidden;
          background-color: #1a1410;
          min-height: 100vh;
          min-height: 100dvh;
        }

        .hero-mobile-overlay {
          display: none;
        }

        .hero-desktop-blend {
          position: absolute;
          top: 0;
          left: 0;
          width: 120px;
          height: 100%;
          background: linear-gradient(to right, #000000, transparent);
          pointer-events: none;
        }

        .hero-caption {
          position: absolute;
          bottom: 28px;
          right: 28px;
          text-align: right;
          z-index: 3;
        }

        .hero-caption span {
          font-family: var(--font-heading), ui-serif, Georgia, serif;
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.06em;
          background-color: rgba(0,0,0,0.4);
          padding: 6px 12px;
          border-radius: 3px;
          backdrop-filter: blur(4px);
        }

        .hero-logo-badge {
          margin-bottom: 32px;
          width: 84px;
          height: 84px;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid rgba(180,174,172,0.3);
          position: relative;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }

        .hero-eyebrow {
          font-family: var(--font-body), ui-sans-serif, system-ui, sans-serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          color: #c9a96e;
          text-transform: uppercase;
          margin-bottom: 18px;
          font-weight: 500;
        }

        .hero-headline {
          font-family: var(--font-heading), ui-serif, Georgia, serif;
          font-size: clamp(36px, 4.5vw, 56px);
          line-height: 1.04;
          letter-spacing: -0.02em;
          color: #ffffff;
          font-weight: 400;
          margin-bottom: 24px;
        }

        .hero-divider {
          width: 40px;
          height: 1px;
          background-color: #c9a96e;
          margin-bottom: 24px;
        }

        .hero-description {
          font-family: var(--font-body), ui-sans-serif, system-ui, sans-serif;
          font-size: 15px;
          line-height: 1.65;
          color: #b4aeac;
          margin-bottom: 36px;
          max-width: 380px;
        }

        .hero-ctas {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }

        .hero-btn-primary {
          font-family: var(--font-body), ui-sans-serif, system-ui, sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #000000;
          background-color: #c9a96e;
          padding: 14px 30px;
          border-radius: 5px;
          text-decoration: none;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: inline-block;
          transition: all 0.2s ease;
          box-shadow: 0 4px 18px rgba(201, 169, 110, 0.25);
        }

        .hero-btn-primary:hover {
          background-color: #dfc38d;
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(201, 169, 110, 0.35);
        }

        .hero-btn-call {
          font-family: var(--font-body), ui-sans-serif, system-ui, sans-serif;
          font-size: 13px;
          color: #b4aeac;
          text-decoration: none;
          letter-spacing: 0.06em;
          padding-left: 2px;
          transition: color 0.2s ease;
        }

        .hero-btn-call:hover {
          color: #ffffff;
        }

        .hero-trust {
          font-family: var(--font-body), ui-sans-serif, system-ui, sans-serif;
          font-size: 12px;
          color: #888888;
          letter-spacing: 0.04em;
          margin-top: 48px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .hero-scroll-indicator {
          position: absolute;
          bottom: 36px;
          left: clamp(32px, 5vw, 72px);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hero-scroll-line {
          width: 32px;
          height: 1px;
          background-color: #3b3429;
          animation: scrollPulse 2s ease-in-out infinite;
          will-change: opacity;
        }

        .hero-scroll-text {
          font-family: var(--font-body), ui-sans-serif, system-ui, sans-serif;
          font-size: 10px;
          letter-spacing: 0.16em;
          color: #646464;
          text-transform: uppercase;
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }

        /* ── MOBILE RESPONSIVENESS (< 768px) ── */
        @media (max-width: 768px) {
          .hero-section {
            display: block !important;
            min-height: 100vh !important;
            min-height: 100dvh !important;
            position: relative !important;
          }

          .hero-image-container {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            min-height: 100% !important;
            z-index: 1 !important;
          }

          .hero-desktop-blend {
            display: none !important;
          }

          .hero-mobile-overlay {
            display: block !important;
            position: absolute !important;
            inset: 0 !important;
            background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.45) 0%,
              rgba(0, 0, 0, 0.72) 40%,
              rgba(0, 0, 0, 0.94) 100%
            ) !important;
            z-index: 2 !important;
          }

          .hero-content-panel {
            background-color: transparent !important;
            position: relative !important;
            z-index: 3 !important;
            min-height: 100vh !important;
            min-height: 100dvh !important;
            padding: 96px 24px 44px 24px !important;
            justify-content: center !important;
          }

          .hero-logo-badge {
            width: 72px !important;
            height: 72px !important;
            margin-bottom: 20px !important;
          }

          .hero-headline {
            font-size: clamp(32px, 8.5vw, 44px) !important;
            margin-bottom: 16px !important;
          }

          .hero-divider {
            margin-bottom: 16px !important;
          }

          .hero-description {
            font-size: 14px !important;
            line-height: 1.6 !important;
            margin-bottom: 28px !important;
            max-width: 100% !important;
          }

          .hero-trust {
            margin-top: 28px !important;
            padding-top: 14px !important;
          }

          .hero-scroll-indicator {
            display: none !important;
          }

          .hero-caption {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
