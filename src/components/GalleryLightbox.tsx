"use client";

import { useEffect, useCallback, useRef, useState } from "react";

interface GalleryLightboxProps {
  items: Record<string, unknown>[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function GalleryLightbox({ items, initialIndex, isOpen, onClose }: GalleryLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const safeItems = items?.length ? items : [];

  const goPrev = useCallback(() => {
    setIndex((prev) => ((prev - 1) % safeItems.length + safeItems.length) % safeItems.length);
  }, [safeItems.length]);

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % safeItems.length);
  }, [safeItems.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, goPrev, goNext]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const currentItem = safeItems.length ? safeItems[index] : null;
  if (!isOpen || !currentItem) return null;

  const imageUrl = currentItem.image_url as string | undefined;
  const title = (currentItem.title as string) || (currentItem.description as string) || null;
  const category = currentItem.category as string | undefined;
  const alt = title || category || "Gallery image";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Gallery image viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <button
        onClick={onClose}
        aria-label="Close gallery image"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-offwhite/80 transition-all hover:bg-black/60 hover:text-offwhite focus:outline-none focus:ring-2 focus:ring-gold/50 md:right-6 md:top-6"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <button
        onClick={goPrev}
        aria-label="Previous image"
        className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-offwhite/80 transition-all hover:bg-black/60 hover:text-offwhite focus:outline-none focus:ring-2 focus:ring-gold/50 md:left-4 md:h-12 md:w-12"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        onClick={goNext}
        aria-label="Next image"
        className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-offwhite/80 transition-all hover:bg-black/60 hover:text-offwhite focus:outline-none focus:ring-2 focus:ring-gold/50 md:right-4 md:h-12 md:w-12"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="flex max-h-[90vh] max-w-[95vw] flex-col items-center md:max-w-[90vw]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={alt}
            className="max-h-[75vh] max-w-[95vw] rounded-sm object-contain shadow-2xl md:max-h-[82vh] md:max-w-[90vw]"
          />
        ) : (
          <div className="flex h-64 w-80 items-center justify-center rounded-sm bg-charcoal/50 text-taupe">
            No image available
          </div>
        )}
        {(title || category) && (
          <div className="mt-3 text-center">
            {title && (
              <p className="text-sm font-medium text-offwhite/90 md:text-base">
                {title}
              </p>
            )}
            {category && (
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                {category}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
