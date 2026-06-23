"use client";

import { useState, useCallback } from "react";
import GalleryImage from "@/components/GalleryImage";
import GalleryLightbox from "@/components/GalleryLightbox";

const categoryGradients: Record<string, string> = {
  Blonde: "linear-gradient(135deg, #E8D5B7 0%, #D4B896 40%, #C4A882 100%)",
  Brunette: "linear-gradient(135deg, #8B7355 0%, #6B5B45 40%, #4A3F32 100%)",
  Extensions: "linear-gradient(135deg, #D8CEC2 0%, #C4B6A6 40%, #A89C8E 100%)",
  Lashes: "linear-gradient(135deg, #A89C8E 0%, #8B7E6E 40%, #6B5B45 100%)",
  Color: "linear-gradient(135deg, #C49B7A 0%, #B89B67 40%, #A0845A 100%)",
  Salon: "linear-gradient(135deg, #D8CEC2 0%, #C4A882 40%, #B89B67 100%)",
};

function getGradient(category: string) {
  return categoryGradients[category] || "linear-gradient(135deg, #D8CEC2, #A89C8E)";
}

interface GalleryGridClientProps {
  items: Record<string, unknown>[];
}

export default function GalleryGridClient({ items }: GalleryGridClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxKey, setLightboxKey] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    setLightboxKey((prev) => prev + 1);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <div
            key={(item.id as string) || String(item.id as number) || i}
            className="group relative aspect-[3/4] overflow-hidden rounded-sm cursor-pointer"
            onClick={() => openLightbox(i)}
          >
            {item.image_url ? (
              <GalleryImage
                src={item.image_url as string}
                alt={(item.title as string) || (item.description as string) || (item.alt as string) || "Gallery image"}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                fallbackGradient={getGradient(item.category as string)}
              />
            ) : (
              <div
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                style={{
                  background: getGradient(item.category as string),
                }}
              />
            )}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%),
                  radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 40%)
                `,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                {item.category as string}
              </p>
              <p className="mt-1 text-sm text-offwhite/90">
                {(item.title as string) || (item.description as string) || (item.alt as string)}
              </p>
              <p className="mt-1 text-xs text-offwhite/60">by {(item.stylist as string) || "Lex"}</p>
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
