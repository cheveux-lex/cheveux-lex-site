"use client";

import { useState } from "react";

interface GalleryImageProps {
  src: string;
  alt: string;
  className: string;
  fallbackGradient: string;
}

export default function GalleryImage({ src, alt, className, fallbackGradient }: GalleryImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={className}
        style={{ background: fallbackGradient }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
