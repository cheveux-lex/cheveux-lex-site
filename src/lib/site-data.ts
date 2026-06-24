export const siteSettings = {
  name: "Cheveux Lex Salon",
  shortName: "Cheveux Lex",
  subtitle: "Hair and Beauty Salon",
  tagline: "Lexington's Hair, Elevated",
  description:
    "A modern salon offering lived-in color, extensions, and lashes—designed to bring out your most confident self.",
  address: "393 Waller Ave. Suite 115, Lexington, Kentucky",
  addressShort: "393 Waller Ave. Suite 115, Lexington, KY",
  phone: "(555) 123-4567",
  email: "hello@cheveuxlex.com",
  bookingUrl: "https://linktr.ee/Cheveux_lex",
  logo_url: "",
  hero_image_url: "",
  salon_image_url: "",
  footer_logo_url: "",
  map_image_url: "",
  map_embed_url: "",
  instagram: "https://instagram.com/cheveuxlex",
  instagramHandle: "@cheveuxlex",
  googleMapsQuery: "393+Waller+Ave+Suite+115+Lexington+KY",
  hours: [
    { day: "Tue - Sat", time: "9AM - 6PM" },
  ],
  facebook: "https://facebook.com/cheveuxlex",
  tiktok: "https://tiktok.com/@cheveuxlex",
  copyright: `© ${new Date().getFullYear()} Cheveux Lex Salon. All rights reserved.`,
  navLinks: [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Services", href: "/services" },
    { label: "Our Work", href: "/#our-work" },
    { label: "Stylists", href: "/stylists" },
    { label: "Gallery", href: "/gallery" },
    { label: "Videos", href: "/videos" },
    { label: "Contact", href: "/contact" },
  ],
};

export interface Service {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon: string;
  priceRange: string;
  categories: string[];
}

export const services: Service[] = [
  {
    id: 1,
    title: "Lived-in Color",
    slug: "lived-in-color",
    shortDescription:
      "Effortless, grow-out friendly color that looks natural and luminous.",
    description:
      "Our signature lived-in color service delivers dimensional, sun-kissed results that grow out beautifully. Using premium color lines and customized techniques, we create soft highlights, babylights, and tonal blends that enhance your natural beauty with minimal maintenance.",
    icon: "palette",
    priceRange: "$180+",
    categories: ["color", "blonde", "brunette"],
  },
  {
    id: 2,
    title: "Extensions",
    slug: "extensions",
    shortDescription:
      "Premium hand-tied extensions for length, volume, and confidence.",
    description:
      "Transform your hair with our hand-tied weft and tape-in extensions. We use only the finest 100% human hair, matched perfectly to your texture and color. Whether you want mermaid length or subtle volume, our certified extension specialists deliver seamless, natural results.",
    icon: "sparkles",
    priceRange: "$400+",
    categories: ["extensions"],
  },
  {
    id: 3,
    title: "Lashes",
    slug: "lashes",
    shortDescription:
      "Custom lash extensions that accentuate your natural eye shape.",
    description:
      "From classic sets to volume fans, our lash artists create bespoke lash looks that complement your eye shape and lifestyle. We use lightweight, premium lashes that feel like your own—because your eyes deserve to be the focal point.",
    icon: "eye",
    priceRange: "$120+",
    categories: ["lashes"],
  },
  {
    id: 4,
    title: "Cut & Styling",
    slug: "cut-and-styling",
    shortDescription:
      "Precision cuts and blowouts tailored to your face shape and texture.",
    description:
      "Our stylists combine precision cutting techniques with an eye for shape and movement. Every cut is customized to your face shape, hair texture, and lifestyle. Finish with a signature blowout or soft curls for instant polish.",
    icon: "scissors",
    priceRange: "$85+",
    categories: ["cut"],
  },
  {
    id: 5,
    title: "Blonde Services",
    slug: "blonde",
    shortDescription:
      "Platinums, buttery blondes, and everything in between.",
    description:
      "From icy platinum to honey blonde, our blonding experts specialize in healthy, luminous blonde transformations. We use bond-building treatments and gentle lighteners to achieve your dream blonde while maintaining the integrity of your hair.",
    icon: "sun",
    priceRange: "$200+",
    categories: ["color", "blonde"],
  },
  {
    id: 6,
    title: "Brunette Services",
    slug: "brunette",
    shortDescription:
      "Rich brunette tones with depth, dimension, and shine.",
    description:
      "Say goodbye to flat brown. Our brunette services deliver multidimensional color with rich lowlights, caramel ribbons, and glossy glazes. From espresso to chestnut, we create brunette shades that catch the light beautifully.",
    icon: "moon",
    priceRange: "$150+",
    categories: ["color", "brunette"],
  },
];

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  category: string;
  stylist: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "/placeholder-gallery-1.jpg",
    alt: "Sun-kissed blonde balayage with soft waves",
    category: "Blonde",
    stylist: "Lex",
  },
  {
    id: 2,
    src: "/placeholder-gallery-2.jpg",
    alt: "Rich chocolate brunette with caramel highlights",
    category: "Brunette",
    stylist: "Kat",
  },
  {
    id: 3,
    src: "/placeholder-gallery-3.jpg",
    alt: "Long blonde hand-tied extension installation",
    category: "Extensions",
    stylist: "Morgan",
  },
  {
    id: 4,
    src: "/placeholder-gallery-4.jpg",
    alt: "Natural volume lash extension set",
    category: "Lashes",
    stylist: "Taylor",
  },
  {
    id: 5,
    src: "/placeholder-gallery-5.jpg",
    alt: "Vivid copper and rose gold color melt",
    category: "Color",
    stylist: "Lex",
  },
  {
    id: 6,
    src: "/placeholder-gallery-6.jpg",
    alt: "Platinum blonde bob transformation",
    category: "Blonde",
    stylist: "Kat",
  },
  {
    id: 7,
    src: "/placeholder-gallery-7.jpg",
    alt: "Beachy brunette waves with subtle highlights",
    category: "Brunette",
    stylist: "Morgan",
  },
  {
    id: 8,
    src: "/placeholder-gallery-8.jpg",
    alt: "Hybrid lash set with wispy effect",
    category: "Lashes",
    stylist: "Taylor",
  },
];

export interface Stylist {
  id: number;
  name: string;
  role: string;
  image: string;
  specialties: string[];
  bio: string;
  instagram: string;
}

export const stylists: Stylist[] = [
  {
    id: 1,
    name: "Lex",
    role: "Owner / Master Stylist",
    image: "/placeholder-stylist-1.jpg",
    specialties: ["Blonde", "Color", "Extensions", "Cut"],
    bio: "With over a decade of experience, Lex founded Cheveux Lex Salon to create a space where luxury meets authenticity. She specializes in lived-in color, seamless extensions, and transformative blonding.",
    instagram: "https://instagram.com/cheveuxlex",
  },
  {
    id: 2,
    name: "Kat",
    role: "Master Stylist",
    image: "/placeholder-stylist-2.jpg",
    specialties: ["Blonde", "Brunette", "Color", "Cut"],
    bio: "Kat brings editorial precision and a keen eye for detail to every service. Her specialty is creating dimensional brunette and blonde shades that look as natural as they are stunning.",
    instagram: "https://instagram.com/cheveuxlex",
  },
  {
    id: 3,
    name: "Morgan",
    role: "Master Stylist",
    image: "/placeholder-stylist-3.jpg",
    specialties: ["Extensions", "Blonde", "Styling", "Cut"],
    bio: "Morgan is our extension expert, certified in multiple hand-tied methods. She believes every client deserves hair that makes them feel unstoppable—and she makes that happen with patience and artistry.",
    instagram: "https://instagram.com/cheveuxlex",
  },
  {
    id: 4,
    name: "Taylor",
    role: "Lash Artist",
    image: "/placeholder-stylist-4.jpg",
    specialties: ["Lashes", "Brow Tinting"],
    bio: "Taylor is a licensed cosmetologist specializing in lash artistry. She custom-designs every lash set to enhance her clients' natural features, ensuring a look that's both stunning and sustainable.",
    instagram: "https://instagram.com/cheveuxlex",
  },
];

export const bookingSteps = [
  {
    step: 1,
    title: "Choose Service",
    description:
      "Browse our service menu and select what you're looking for—from lived-in color to lash extensions.",
  },
  {
    step: 2,
    title: "Pick Date & Time",
    description:
      "Find a time that works for you. We offer flexible scheduling with online booking available 24/7.",
  },
  {
    step: 3,
    title: "Confirm & Relax",
    description:
      "You're all set. Arrive at our salon and let our team take care of the rest.",
  },
];
