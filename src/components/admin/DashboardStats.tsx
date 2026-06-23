import { adminStats } from "@/lib/admin-data";

const statIcons: Record<string, React.ReactNode> = {
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  scissors: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  ),
  image: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  video: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  message: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  link: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
};

interface Props {
  servicesCount?: number;
  stylistsCount?: number;
  messagesCount?: number;
  newMessagesCount?: number;
  videosCount?: number;
}

export default function DashboardStats({ servicesCount, stylistsCount, messagesCount, newMessagesCount, videosCount }: Props) {
  const stats = adminStats.map((stat) => {
    if (stat.label === "Services" && servicesCount !== undefined) {
      return { ...stat, value: String(servicesCount) };
    }
    if (stat.label === "Total Stylists" && stylistsCount !== undefined) {
      return { ...stat, value: String(stylistsCount) };
    }
    if (stat.label === "Messages" && messagesCount !== undefined) {
      return { ...stat, value: String(messagesCount), change: newMessagesCount ? `${newMessagesCount} new` : "" };
    }
    if (stat.label === "Videos" && videosCount !== undefined) {
      return { ...stat, value: String(videosCount), change: "" };
    }
    return stat;
  });

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group rounded-sm border border-beige/20 bg-offwhite p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] transition-all hover:-translate-y-0.5 hover:border-beige/30 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">
              {stat.label}
            </p>
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gold/8 text-gold/80 transition-colors group-hover:bg-gold/15 group-hover:text-gold">
              {statIcons[stat.icon]}
            </div>
          </div>
          <p className="mt-2 font-heading text-2xl font-semibold tracking-tight text-charcoal">
            {stat.value}
          </p>
          <p className="mt-0.5 text-[10px] font-medium text-taupe/60">{stat.change}</p>
        </div>
      ))}
    </div>
  );
}
