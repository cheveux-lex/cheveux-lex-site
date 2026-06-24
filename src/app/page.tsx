import Hero from "@/components/Hero";
import FeaturedServices from "@/components/FeaturedServices";
import MidSection from "@/components/MidSection";
import InfoBand from "@/components/InfoBand";
import { getSiteSettings } from "@/lib/supabase/site-settings";
import { getActiveServices } from "@/lib/supabase/services";
import { getActiveStylists } from "@/lib/supabase/stylists";
import { getFeaturedGalleryItems } from "@/lib/supabase/gallery-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [settings, services, stylists, galleryItems] = await Promise.all([
    getSiteSettings(),
    getActiveServices(),
    getActiveStylists(),
    getFeaturedGalleryItems(),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <FeaturedServices services={services} />
      <MidSection stylists={stylists} galleryItems={galleryItems} />
      <InfoBand settings={settings} />
    </>
  );
}
