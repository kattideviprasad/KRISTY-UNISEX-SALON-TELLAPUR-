'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface GalleryItem {
  src: string;
  alt: string;
  caption?: string;
}

interface GalleryLightboxProps {
  items: GalleryItem[];
  selectedIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

/** Fullscreen lightbox modal — extracted from ExpandableGallery, hover-expand removed. */
export function GalleryLightbox({
  items,
  selectedIndex,
  onClose,
  onNext,
  onPrev,
}: GalleryLightboxProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    if (selectedIndex !== null) {
      window.addEventListener('keydown', handleKey);
    }
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIndex, onClose, onNext, onPrev]);

  return (
    <AnimatePresence>
      {selectedIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.94)',
            padding: '24px',
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#ffffff',
              padding: '8px',
              zIndex: 10,
              lineHeight: 1,
              opacity: 0.7,
              transition: 'opacity 0.2s',
            }}
          >
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Previous image"
            style={{
              position: 'absolute',
              left: '20px',
              background: 'none',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '5px',
              cursor: 'pointer',
              color: '#ffffff',
              padding: '12px',
              zIndex: 10,
              opacity: 0.7,
              transition: 'opacity 0.2s',
            }}
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '1100px',
              maxHeight: '88vh',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <motion.img
              key={selectedIndex}
              src={items[selectedIndex].src}
              alt={items[selectedIndex].alt}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25 }}
              style={{
                maxHeight: '80vh',
                maxWidth: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '5px',
                display: 'block',
              }}
            />

            {/* Caption */}
            {items[selectedIndex].caption && (
              <p
                style={{
                  fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '0.06em',
                  textAlign: 'center',
                }}
              >
                {items[selectedIndex].caption}
              </p>
            )}
          </motion.div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Next image"
            style={{
              position: 'absolute',
              right: '20px',
              background: 'none',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '5px',
              cursor: 'pointer',
              color: '#ffffff',
              padding: '12px',
              zIndex: 10,
              opacity: 0.7,
              transition: 'opacity 0.2s',
            }}
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Counter */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.1em',
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: '5px 14px',
              borderRadius: '5px',
            }}
          >
            {selectedIndex + 1} / {items.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
