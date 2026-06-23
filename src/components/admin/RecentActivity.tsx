import { recentActivity } from "@/lib/admin-data";

const activityIcons: Record<string, React.ReactNode> = {
  booking: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  gallery: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  stylist: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    </svg>
  ),
  message: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  service: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" />
    </svg>
  ),
  video: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
};

function getIcon(action: string) {
  const key = action.toLowerCase().includes("booking")
    ? "booking"
    : action.toLowerCase().includes("gallery")
      ? "gallery"
      : action.toLowerCase().includes("stylist")
        ? "stylist"
        : action.toLowerCase().includes("message")
          ? "message"
          : action.toLowerCase().includes("service")
            ? "service"
            : "video";
  return activityIcons[key];
}

export default function RecentActivity() {
  return (
    <div className="divide-y divide-beige/10">
      {recentActivity.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold/8 text-gold/70">
            {getIcon(item.action)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-snug text-charcoal">
              {item.action}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-taupe line-clamp-1">
              {item.detail}
            </p>
          </div>
          <span className="flex-shrink-0 pt-0.5 text-[10px] leading-tight text-taupe/45">
            {item.time}
          </span>
        </div>
      ))}
    </div>
  );
}
