"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import GalleryLightbox from "@/components/GalleryLightbox";

interface MobileGalleryCarouselProps {
  items: Record<string, unknown>[];
  categoryGradients: Record<string, string>;
}

export default function MobileGalleryCarousel({ items, categoryGradients }: MobileGalleryCarouselProps) {
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxKey, setLightboxKey] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      console.log("Our Work scroll:", el.scrollWidth, el.clientWidth);
    }
  }, []);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    setLightboxKey((prev) => prev + 1);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const clearPointer = useCallback(() => {
    pointerStart.current = null;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback((index: number) => (e: React.PointerEvent) => {
    const start = pointerStart.current;
    if (!start) return;
    const dx = Math.abs(e.clientX - start.x);
    const dy = Math.abs(e.clientY - start.y);
    pointerStart.current = null;
    if (dx <= 8 && dy <= 8) {
      openLightbox(index);
    }
  }, [openLightbox]);

  return (
    <>
      <div
        ref={scrollRef}
        data-our-work-scroll=""
        className="flex w-full max-w-full gap-4 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory px-5 pb-4 [-webkit-overflow-scrolling:touch] our-work-mobile-scroll"
        onPointerDown={handlePointerDown}
        onPointerCancel={clearPointer}
      >
        {items.slice(0, 5).map((item, i) => (
          <div
            key={(item.id as string) || String(item.id as number) || i}
            className="flex-none w-[78vw] max-w-[320px] snap-start aspect-[3/4] overflow-hidden rounded-sm relative cursor-pointer"
            onPointerUp={handlePointerUp(i)}
          >
            <div
              className="absolute inset-0"
              style={{
                background: categoryGradients[item.category as string] || "linear-gradient(135deg, #D8CEC2, #A89C8E)",
              }}
            />
            {item.image_url ? (
              <img
                src={item.image_url as string}
                alt={(item.title as string) || (item.description as string) || (item.alt as string) || "Gallery image"}
                className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
                draggable={false}
              />
            ) : null}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)
                `,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 select-none">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gold">
                {item.category as string}
              </p>
            </div>
          </div>
        ))}
      </div>
      <GalleryLightbox
        key={lightboxKey}
        items={items}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
      />
    </>
  );
}
