'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GalleryLightbox, type GalleryItem } from '@/components/ui/gallery-animation';

const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: '/gallery/studio.jpg',
    alt: 'KRISTY UNISEX SALON — studio interior',
    caption: 'The Studio',
  },
  {
    src: '/gallery/craft.jpg',
    alt: 'KRISTY UNISEX SALON — styling floor',
    caption: 'The Craft',
  },
  {
    src: '/gallery/wash-care.jpg',
    alt: 'KRISTY UNISEX SALON — wash and care station',
    caption: 'Wash & Care',
  },
];

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const open = (i: number) => setSelectedIndex(i);
  const close = () => setSelectedIndex(null);
  const next = () =>
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % GALLERY_ITEMS.length : 0
    );
  const prev = () =>
    setSelectedIndex((prev) =>
      prev !== null
        ? (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length
        : GALLERY_ITEMS.length - 1
    );

  return (
    <>
      <section
        id="gallery"
        style={{
          backgroundColor: '#000000',
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
          <div style={{ marginBottom: '48px' }}>
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
              Our Space &amp; Work
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
                fontSize: 'clamp(32px, 4vw, 40px)',
                lineHeight: 1.05,
                letterSpacing: '-0.48px',
                color: '#ffffff',
                fontWeight: 400,
              }}
            >
              The Studio
            </h2>
          </div>

          {/* ── 3-column equal-width grid ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2px',
            }}
          >
            {GALLERY_ITEMS.map((item, i) => (
              <GalleryTile
                key={item.src}
                item={item}
                onClick={() => open(i)}
              />
            ))}
          </div>

          {/* ── Click hint ── */}
          <p
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '12px',
              color: '#646464',
              letterSpacing: '0.06em',
              textAlign: 'center',
              marginTop: '20px',
            }}
          >
            Click any image to view fullscreen
          </p>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <GalleryLightbox
        items={GALLERY_ITEMS}
        selectedIndex={selectedIndex}
        onClose={close}
        onNext={next}
        onPrev={prev}
      />
    </>
  );
}

function GalleryTile({
  item,
  onClick,
}: {
  item: GalleryItem;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Open ${item.caption ?? item.alt} in fullscreen`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="gallery-tile"
      style={{
        position: 'relative',
        aspectRatio: '4 / 3',
        overflow: 'hidden',
        backgroundColor: '#3b3429',
        cursor: 'pointer',
      }}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
        quality={80}
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          transition: 'transform 0.5s ease',
        }}
      />

      {/* Permanent dark scrim for caption legibility */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background:
            'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Caption */}
      {item.caption && (
        <div
          style={{
            position: 'absolute',
            bottom: '18px',
            left: '20px',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
              fontSize: '15px',
              color: '#ffffff',
              fontWeight: 400,
              letterSpacing: '0.04em',
            }}
          >
            {item.caption}
          </span>
        </div>
      )}

      <style>{`
        .gallery-tile:hover img {
          transform: scale(1.04);
        }
      `}</style>
    </div>
  );
}
