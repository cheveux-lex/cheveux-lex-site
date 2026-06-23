"use client";

import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
  containerClassName?: string;
}

export default function SafeImage({ src, alt, className = "", fallback, containerClassName = "" }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    if (fallback) return <>{fallback}</>;
    return null;
  }

  return (
    <div className={containerClassName}>
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
