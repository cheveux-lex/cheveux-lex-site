import Link from "next/link";
import { adminStylists } from "@/lib/admin-data";
import type { StylistRow } from "@/lib/supabase/stylists";

const portraitGradients = [
  "radial-gradient(ellipse 130% 70% at 50% 110%, #8B6F47 0%, #B89B67 40%, #C4A882 55%, #B89B67 70%, #8B6F47 85%), radial-gradient(ellipse 80% 30% at 50% 25%, rgba(255,220,180,0.2) 0%, transparent 50%)",
  "radial-gradient(ellipse 130% 70% at 50% 110%, #6B5B45 0%, #A0845A 35%, #C4A882 50%, #A0845A 65%, #6B5B45 80%), radial-gradient(ellipse 80% 30% at 50% 25%, rgba(255,210,170,0.15) 0%, transparent 50%)",
  "radial-gradient(ellipse 130% 70% at 50% 110%, #4A3F32 0%, #6B5B45 40%, #8B7E6E 55%, #6B5B45 70%, #4A3F32 85%), radial-gradient(ellipse 80% 30% at 50% 25%, rgba(200,180,160,0.12) 0%, transparent 50%)",
  "radial-gradient(ellipse 130% 70% at 50% 110%, #8B7E6E 0%, #B8A898 35%, #D8CEC2 50%, #B8A898 65%, #8B7E6E 80%), radial-gradient(ellipse 80% 30% at 50% 25%, rgba(255,240,230,0.2) 0%, transparent 50%)",
];

interface Props {
  stylists?: StylistRow[];
}

export default function StylistsManagerPreview({ stylists }: Props) {
  const items = (stylists?.length
    ? stylists
    : (adminStylists as unknown as StylistRow[])
  ) as unknown as Record<string, unknown>[];

  return (
    <div>
      <div className="mb-4 flex items-center justify-end gap-2">
        <Link
          href="/admin/stylists"
          className="rounded-[4px] border border-gold/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gold transition-all hover:bg-gold hover:text-offwhite focus:outline-none focus:ring-2 focus:ring-gold/30"
        >
          Add Stylist
        </Link>
      </div>
      <div className="divide-y divide-beige/10">
        {items.map((s, i) => {
          const booking = (s.booking_url as string) || (s.bookingLink as string) || "";
          return (
            <div
              key={(s.id as string) || String(s.id as number)}
              className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-beige/20">
                {s.image_url ? (
                  <img
                    src={s.image_url as string}
                    alt={s.name as string}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{ background: portraitGradients[i % portraitGradients.length] }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-snug text-charcoal">
                  {s.name as string}
                </p>
                <p className="text-[10px] leading-snug tracking-wide text-taupe">
                  {s.role as string}
                </p>
              </div>
              <p className="hidden max-w-[100px] truncate text-[10px] text-taupe/50 sm:block">
                {booking}
              </p>
              <div className="flex flex-shrink-0 gap-3">
                <Link
                  href="/admin/stylists"
                  className="text-[9px] font-medium uppercase tracking-[0.12em] text-taupe/60 transition-colors hover:text-gold focus:outline-none"
                >
                  Edit
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
