import Link from "next/link";
import { adminGalleryItems } from "@/lib/admin-data";
import type { GalleryRow } from "@/lib/supabase/gallery";

const hairGradients: Record<string, string> = {
  Blonde:
    "radial-gradient(ellipse 140% 80% at 50% 130%, #D4B896 0%, #E8D5B7 35%, #F2E4CE 55%, #EAD9BE 70%, #C4A882 90%, #8B7355 100%), " +
    "radial-gradient(ellipse 100% 50% at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 60%)",
  Brunette:
    "radial-gradient(ellipse 140% 80% at 50% 130%, #4A3F32 0%, #6B5B45 30%, #8B7355 50%, #6B5B45 70%, #4A3F32 85%, #2C241B 100%), " +
    "radial-gradient(ellipse 100% 40% at 50% 15%, rgba(180,160,130,0.12) 0%, transparent 50%)",
  Extensions:
    "radial-gradient(ellipse 140% 80% at 50% 130%, #A89C8E 0%, #C4B6A6 30%, #D8CEC2 50%, #C4B6A6 70%, #A89C8E 85%, #8B7E6E 100%), " +
    "linear-gradient(180deg, rgba(200,190,180,0.15) 0%, transparent 30%)",
  Lashes:
    "radial-gradient(ellipse 140% 80% at 50% 130%, #2C241B 0%, #4A3F32 30%, #6B5B45 50%, #4A3F32 70%, #2C241B 85%, #1A1510 100%), " +
    "radial-gradient(ellipse 80% 30% at 50% 20%, rgba(255,255,255,0.06) 0%, transparent 50%)",
  Color:
    "radial-gradient(ellipse 140% 80% at 50% 130%, #A06040 0%, #C49B7A 25%, #D4A882 45%, #B89B67 65%, #8B6F47 85%, #5C3D28 100%), " +
    "radial-gradient(ellipse 100% 45% at 50% 15%, rgba(255,200,160,0.15) 0%, transparent 50%)",
  Styling:
    "radial-gradient(ellipse 140% 80% at 50% 130%, #A0845A 0%, #C4A882 30%, #D8CEC2 50%, #C4A882 70%, #A0845A 85%, #6B5B45 100%), " +
    "radial-gradient(ellipse 80% 35% at 50% 20%, rgba(255,255,240,0.1) 0%, transparent 50%)",
  Cut:
    "radial-gradient(ellipse 140% 80% at 50% 130%, #6B5B45 0%, #8B7E6E 30%, #A89C8E 50%, #8B7E6E 70%, #6B5B45 85%, #4A3F32 100%), " +
    "radial-gradient(ellipse 80% 30% at 50% 20%, rgba(200,190,180,0.08) 0%, transparent 50%)",
  Consultation:
    "radial-gradient(ellipse 140% 80% at 50% 130%, #C4B6A6 0%, #D8CEC2 30%, #EDE5DC 50%, #D8CEC2 70%, #C4B6A6 85%, #A89C8E 100%), " +
    "radial-gradient(ellipse 80% 35% at 50% 20%, rgba(255,255,255,0.12) 0%, transparent 50%)",
};

function getHairGradient(cat: string) {
  return hairGradients[cat] || hairGradients.Styling;
}

interface Props {
  galleryItems?: GalleryRow[];
}

export default function GalleryManagerPreview({ galleryItems }: Props) {
  const items = (galleryItems?.length ? galleryItems : adminGalleryItems) as unknown as Record<string, unknown>[];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs text-taupe/70">
          {items.length} images
        </p>
        <div className="flex gap-2">
          <Link
            href="/admin/gallery"
            className="rounded-[4px] border border-gold/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gold transition-all hover:bg-gold hover:text-offwhite focus:outline-none focus:ring-2 focus:ring-gold/30"
          >
            Upload Images
          </Link>
          <Link
            href="/admin/gallery"
            className="rounded-[4px] border border-beige/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-taupe transition-all hover:border-gold/40 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          >
            View Gallery
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
        {items.slice(0, 6).map((item, i) => {
          const imageUrl = item.image_url as string | undefined;
          return (
            <div key={(item.id as string) || String(item.id as number) || i} className="group relative aspect-[4/5] overflow-hidden rounded-[3px]">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={(item.description as string) || (item.alt as string) || ""}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: getHairGradient(item.category as string) }}
                />
              )}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 p-1.5 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-offwhite/90">
                  {item.category as string}
                </p>
              </div>
              {(item.featured as boolean) && (
                <div className="absolute right-1.5 top-1.5 rounded-[2px] bg-gold/90 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.1em] text-offwhite backdrop-blur-[2px]">
                  Featured
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
