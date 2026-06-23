"use client";

interface Props {
  url: string | null | undefined;
  opacity?: number;
}

export default function SectionBgImage({ url, opacity = 0.2 }: Props) {
  if (!url) return null;
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity,
      }}
    />
  );
}
