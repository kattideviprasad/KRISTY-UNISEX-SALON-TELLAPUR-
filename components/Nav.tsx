'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';

// Service categories that link to #services?category=...
const SERVICE_CATEGORIES = [
  { label: 'Face & Skin Care', key: 'Face & Skin Care' },
  { label: 'Hair',             key: 'Hair' },
  { label: 'Bridal & Makeup',  key: 'Bridal & Makeup' },
  { label: 'Threading',        key: 'Threading' },
  { label: 'Nails',            key: 'Nails' },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { scrollYProgress } = useScroll();

  // Delayed close — gives users 400ms to move mouse into the dropdown
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActive(null), 700);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const openMenu = (item: string) => {
    cancelClose();
    setActive(item);
  };

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    if (typeof current === 'number') {
      if (current < 0.02) {
        setHidden(false);
        return;
      }
      const prev = scrollYProgress.getPrevious() ?? 0;
      const direction = current - prev;
      if (direction > 0) {
        setHidden(true);
        cancelClose();
        setActive(null);
      } else {
        setHidden(false);
      }
    }
  });

  return (
    <motion.div
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}
    >
      {/* ── Main bar ── */}
      <div
        style={{ backgroundColor: '#000000' }}
        onMouseLeave={() => setActive(null)}
      >
        <div
          className="mx-auto flex items-center justify-between"
          style={{
            maxWidth: '1200px',
            height: '64px',
            paddingLeft: '24px',
            paddingRight: '24px',
          }}
        >
          {/* Logo + wordmark */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1px solid rgba(180,174,172,0.25)',
              }}
            >
              <Image
                src="/logo.png"
                alt="KRISTY UNISEX SALON"
                width={44}
                height={44}
                priority
                sizes="44px"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
                fontSize: '16px',
                letterSpacing: '0.07em',
                color: '#ffffff',
                whiteSpace: 'nowrap',
              }}
            >
              KRISTY UNISEX SALON
            </span>
          </Link>

          {/* ── Desktop nav (navbar-menu system) ── */}
          <div
            className="hidden md:flex items-center"
            style={{ gap: '0', position: 'relative' }}
          >
            {/*
              We use the Menu container purely for its onMouseLeave reset,
              but we style it ourselves to match the dark bar — no pill/border.
            */}
            <div
              onMouseLeave={scheduleClose}
              onMouseEnter={cancelClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '28px',
                position: 'relative',
              }}
            >
              {/* Services — hover dropdown */}
              <div
                onMouseEnter={() => openMenu('Services')}
                onMouseLeave={scheduleClose}
                style={{ position: 'relative' }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                    fontSize: '14px',
                    color: '#b4aeac',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    userSelect: 'none',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => {
                    if (active !== 'Services') e.currentTarget.style.color = '#b4aeac';
                  }}
                >
                  Services ▾
                </span>

                {/* Invisible bridge — fills the gap so mouse never leaves the hover zone */}
                {active === 'Services' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '-20px',
                      right: '-20px',
                      height: '24px',
                    }}
                    onMouseEnter={cancelClose}
                  />
                )}

                {/* Dropdown panel */}
                {active === 'Services' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', mass: 0.5, damping: 11.5, stiffness: 100 }}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 100,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#111111',
                        border: '1px solid rgba(180,174,172,0.15)',
                        borderRadius: '12px',
                        padding: '12px 8px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        minWidth: '196px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      {SERVICE_CATEGORIES.map((cat) => (
                        <a
                          key={cat.key}
                          href={`/?category=${encodeURIComponent(cat.key)}#services`}
                          onClick={() => setActive(null)}
                          style={{
                            fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                            fontSize: '14px',
                            color: '#b4aeac',
                            textDecoration: 'none',
                            letterSpacing: '0.03em',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            display: 'block',
                            transition: 'background-color 0.15s, color 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            cancelClose();
                            e.currentTarget.style.backgroundColor = '#1e1e1e';
                            e.currentTarget.style.color = '#c9a96e';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#b4aeac';
                          }}
                        >
                          {cat.label}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Plain nav links */}
              {(
                [
                  { label: 'About',     href: '#about' },
                  { label: 'Locations', href: '#studios' },
                  { label: 'Gallery',   href: '#gallery' },
                  { label: 'Contact',   href: '#contact' },
                ] as const
              ).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setActive(null)}
                  style={{
                    fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                    fontSize: '14px',
                    color: '#b4aeac',
                    textDecoration: 'none',
                    letterSpacing: '0.04em',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#b4aeac')}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Book Now button — outside Menu, styled exactly as before */}
            <Link
              href="/booking"
              prefetch={true}
              style={{
                fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                fontSize: '13px',
                fontWeight: '500',
                color: '#000000',
                backgroundColor: '#ffffff',
                padding: '7px 16px',
                borderRadius: '5px',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                transition: 'background-color 0.2s, color 0.2s',
                marginLeft: '24px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f2f1ed';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              Book Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}
          >
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                backgroundColor: '#ffffff',
                transition: 'transform 0.2s',
                transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                backgroundColor: '#ffffff',
                opacity: menuOpen ? 0 : 1,
                transition: 'opacity 0.2s',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                backgroundColor: '#ffffff',
                transition: 'transform 0.2s',
                transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none',
              }}
            />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              backgroundColor: '#000000',
              borderTop: '1px solid #3b3429',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Services with sub-items on mobile */}
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '11px',
                  color: '#646464',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                Services
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '4px' }}>
                {SERVICE_CATEGORIES.map((cat) => (
                  <a
                    key={cat.key}
                    href={`/?category=${encodeURIComponent(cat.key)}#services`}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                      fontSize: '14px',
                      color: '#b4aeac',
                      textDecoration: 'none',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {cat.label}
                  </a>
                ))}
              </div>
            </div>

            {[
              { label: 'About',     href: '#about' },
              { label: 'Locations', href: '#studios' },
              { label: 'Gallery',   href: '#gallery' },
              { label: 'Contact',   href: '#contact' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '14px',
                  color: '#b4aeac',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                }}
              >
                {link.label}
              </a>
            ))}

            <Link
              href="/booking"
              prefetch={true}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                fontSize: '13px',
                fontWeight: '500',
                color: '#000000',
                backgroundColor: '#ffffff',
                padding: '10px 20px',
                borderRadius: '5px',
                textDecoration: 'none',
                textAlign: 'center',
                letterSpacing: '0.04em',
                display: 'inline-block',
                alignSelf: 'flex-start',
              }}
            >
              Book Now
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
