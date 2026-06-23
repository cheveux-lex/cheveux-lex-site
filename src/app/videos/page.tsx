import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/supabase/site-settings";
import { getActiveVideos } from "@/lib/supabase/videos";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Videos",
  description: "Watch our salon transformations, tutorials, and more from Cheveux Lex Salon.",
};

const videoGradients: Record<string, string> = {
  Color: "radial-gradient(ellipse 140% 80% at 50% 130%, #A06040 0%, #C49B7A 25%, #D4A882 45%, #B89B67 65%, #8B6F47 85%, #5C3D28 100%)",
  Extensions: "radial-gradient(ellipse 140% 80% at 50% 130%, #A89C8E 0%, #C4B6A6 30%, #D8CEC2 50%, #C4B6A6 70%, #A89C8E 85%, #8B7E6E 100%)",
  Lashes: "radial-gradient(ellipse 140% 80% at 50% 130%, #2C241B 0%, #4A3F32 30%, #6B5B45 50%, #4A3F32 70%, #2C241B 85%, #1A1510 100%)",
  Blonde: "radial-gradient(ellipse 140% 80% at 50% 130%, #D4B896 0%, #E8D5B7 35%, #F2E4CE 55%, #EAD9BE 70%, #C4A882 90%, #8B7355 100%)",
  Salon: "radial-gradient(ellipse 140% 80% at 50% 130%, #8B7E6E 0%, #A89C8E 30%, #C4B6A6 50%, #A89C8E 70%, #8B7E6E 85%, #6B5B45 100%)",
  Styling: "radial-gradient(ellipse 140% 80% at 50% 130%, #C4A882 0%, #B89B67 30%, #A0845A 50%, #B89B67 70%, #C4A882 85%, #8B6F47 100%)",
  Tutorial: "radial-gradient(ellipse 140% 80% at 50% 130%, #6B5B45 0%, #8B7E6E 30%, #A89C8E 50%, #8B7E6E 70%, #6B5B45 85%, #4A3F32 100%)",
};

function getVideoGradient(cat: string) {
  return videoGradients[cat] || videoGradients.Salon;
}

function VideoCard({ video }: { video: { title: string; video_url: string; thumbnail_url: string | null; platform: string; category: string } }) {
  return (
    <a
      href={video.video_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-sm bg-offwhite shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-video overflow-hidden">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
            style={{ background: getVideoGradient(video.category) }}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-charcoal/30 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-gold/40">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading text-base font-medium text-charcoal group-hover:text-gold transition-colors">
          {video.title}
        </h3>
        <div className="mt-2 flex items-center gap-3">
          <span className="rounded-[2px] bg-beige/30 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-taupe">
            {video.category}
          </span>
          <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-taupe/50">
            {video.platform}
          </span>
        </div>
      </div>
    </a>
  );
}

export default async function VideosPage() {
  const [settings, videos] = await Promise.all([
    getSiteSettings(),
    getActiveVideos(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 text-center md:px-8 lg:px-12">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Watch
          </span>
          <h1 className="mt-3 font-heading text-4xl font-light text-charcoal md:text-5xl lg:text-6xl">
            Videos
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-taupe">
            See our work in motion—transformations, tutorials, and a look inside the salon.
          </p>
        </div>
      </section>

      <section className="bg-offwhite py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          {videos.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-taupe">No videos available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-cream py-16 text-center md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <h2 className="font-heading text-3xl font-light text-charcoal md:text-4xl">
            Inspired?
          </h2>
          <p className="mt-3 text-taupe">
            Book your appointment and let us create your next look.
          </p>
          <a
            href={settings?.bookingUrl ?? "https://linktr.ee/Cheveux_lex"}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-offwhite transition-all hover:bg-gold/90 hover:shadow-lg"
          >
            Book Appointment
          </a>
        </div>
      </section>
    </>
  );
}
