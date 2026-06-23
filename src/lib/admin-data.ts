export const adminStats = [
  { label: "Total Stylists", value: "6", change: "+1 this month", icon: "users" },
  { label: "Services", value: "12", change: "+2 this month", icon: "scissors" },
  { label: "Gallery Items", value: "84", change: "+12 this month", icon: "image" },
  { label: "Messages", value: "0", change: "0 new", icon: "message" },
  { label: "Videos", value: "11", change: "+3 this month", icon: "video" },
  { label: "Booking Clicks", value: "1,248", change: "+18% vs last month", icon: "link" },
];

export const recentActivity = [
  { action: "New booking", detail: "Blonde service by Sarah M.", time: "12 min ago" },
  { action: "Gallery updated", detail: "3 new brunette photos added", time: "1 hr ago" },
  { action: "Stylist updated", detail: "Taylor's availability changed", time: "2 hr ago" },
  { action: "New message", detail: "Inquiry from Jessica R.", time: "3 hr ago" },
  { action: "Service added", detail: "Bridal Styling package live", time: "5 hr ago" },
  { action: "Video uploaded", detail: "Lived-in color tutorial", time: "1 day ago" },
];

export const adminServices = [
  { id: 1, title: "Lived-in Color", price: "$180+", duration: "2.5 hr", status: "Active", category: "Color" },
  { id: 2, title: "Extensions", price: "$400+", duration: "3 hr", status: "Active", category: "Extensions" },
  { id: 3, title: "Lashes", price: "$120+", duration: "1.5 hr", status: "Active", category: "Lashes" },
  { id: 4, title: "Bridal Styling", price: "$250+", duration: "2 hr", status: "Active", category: "Styling" },
  { id: 5, title: "Haircuts", price: "$85+", duration: "1 hr", status: "Active", category: "Cut" },
  { id: 6, title: "Consultations", price: "Free", duration: "30 min", status: "Active", category: "Consultation" },
];

export const adminStylists = [
  { id: 1, name: "Lex", role: "Owner / Master Stylist", specialties: "Blonde, Color, Extensions", instagram: "@cheveuxlex", bookingLink: "https://linktr.ee/cheveux_lex", active: true },
  { id: 2, name: "Kat", role: "Master Stylist", specialties: "Blonde, Brunette, Color", instagram: "@katcheveux", bookingLink: "https://linktr.ee/cheveux_lex", active: true },
  { id: 3, name: "Morgan", role: "Master Stylist", specialties: "Extensions, Blonde, Styling", instagram: "@morgancheveux", bookingLink: "https://linktr.ee/cheveux_lex", active: true },
  { id: 4, name: "Taylor", role: "Lash Artist", specialties: "Lashes, Brow Tinting", instagram: "@taylorcheveux", bookingLink: "https://linktr.ee/cheveux_lex", active: true },
];

export const adminGalleryItems = [
  { id: 1, category: "Blonde", alt: "Sun-kissed balayage", featured: true, stylist: "Lex" },
  { id: 2, category: "Brunette", alt: "Chocolate caramel melt", featured: true, stylist: "Kat" },
  { id: 3, category: "Extensions", alt: "Hand-tied installation", featured: false, stylist: "Morgan" },
  { id: 4, category: "Lashes", alt: "Volume lash set", featured: true, stylist: "Taylor" },
  { id: 5, category: "Color", alt: "Copper rose gold melt", featured: false, stylist: "Lex" },
  { id: 6, category: "Blonde", alt: "Platinum bob", featured: false, stylist: "Kat" },
  { id: 7, category: "Brunette", alt: "Espresso gloss", featured: false, stylist: "Morgan" },
  { id: 8, category: "Color", alt: "Bronde baby lights", featured: true, stylist: "Lex" },
  { id: 9, category: "Extensions", alt: "Tape-in length", featured: false, stylist: "Morgan" },
  { id: 10, category: "Lashes", alt: "Wispy natural set", featured: false, stylist: "Taylor" },
  { id: 11, category: "Blonde", alt: "Honey blonde highlights", featured: false, stylist: "Kat" },
  { id: 12, category: "Brunette", alt: "Rich chestnut", featured: false, stylist: "Lex" },
];

export const adminVideos = [
  { id: 1, title: "Lived-in Color Tutorial", category: "Color", featured: true, duration: "4:32", date: "2026-06-15" },
  { id: 2, title: "Extension Care Guide", category: "Extensions", featured: true, duration: "6:18", date: "2026-06-10" },
  { id: 3, title: "Lash Application Tips", category: "Lashes", featured: false, duration: "3:45", date: "2026-06-05" },
  { id: 4, title: "Blonde Transformation", category: "Blonde", featured: false, duration: "8:12", date: "2026-05-28" },
];

export const adminBookingLinks = {
  mainUrl: "https://linktr.ee/Cheveux_lex",
  stylistLinks: [
    { name: "Lex", url: "https://linktr.ee/cheveux_lex" },
    { name: "Kat", url: "https://linktr.ee/cheveux_kat" },
    { name: "Morgan", url: "https://linktr.ee/cheveux_morgan" },
    { name: "Taylor", url: "https://linktr.ee/cheveux_taylor" },
  ],
};

export const adminMessages = [
  { id: 1, name: "Jessica R.", email: "jessica@example.com", service: "Blonde", message: "Hi! I'm interested in getting blonde balayage for my shoulder-length hair. Do you have availability next week?", date: "2026-06-20", status: "Unread" },
  { id: 2, name: "Amanda K.", email: "amanda@example.com", service: "Extensions", message: "I'd love to learn more about hand-tied extensions. I have fine hair and want to add length.", date: "2026-06-19", status: "Read" },
  { id: 3, name: "Rachel M.", email: "rachel@example.com", service: "Lashes", message: "Do you offer hybrid lash sets? Looking for something natural but with more fullness.", date: "2026-06-18", status: "Unread" },
  { id: 4, name: "Lauren T.", email: "lauren@example.com", service: "Color", message: "I'm a bridesmaid in a wedding and need a color consultation before the big day!", date: "2026-06-17", status: "Replied" },
  { id: 5, name: "Brittany S.", email: "brittany@example.com", service: "Bridal", message: "Getting married in October and looking for a trial run for my wedding hair. Please let me know pricing!", date: "2026-06-16", status: "Unread" },
];

export const siteSettingsData = {
  heroTitle: "Lexington's Hair, Elevated",
  heroSubtitle: "A modern salon offering lived-in color, extensions, and lashes.",
  address: "393 Waller Ave. Suite 115, Lexington, Kentucky",
  phone: "(555) 123-4567",
  email: "hello@cheveuxlex.com",
  bookingUrl: "https://linktr.ee/Cheveux_lex",
  instagram: "https://instagram.com/cheveuxlex",
  tiktok: "https://tiktok.com/@cheveuxlex",
  facebook: "https://facebook.com/cheveuxlex",
};

const categoryGradients: Record<string, string> = {
  Blonde: "linear-gradient(135deg, #E8D5B7 0%, #D4B896 40%, #C4A882 100%)",
  Brunette: "linear-gradient(135deg, #8B7355 0%, #6B5B45 40%, #4A3F32 100%)",
  Extensions: "linear-gradient(135deg, #D8CEC2 0%, #C4B6A6 40%, #A89C8E 100%)",
  Lashes: "linear-gradient(135deg, #A89C8E 0%, #8B7E6E 40%, #6B5B45 100%)",
  Color: "linear-gradient(135deg, #C49B7A 0%, #B89B67 40%, #A0845A 100%)",
  Styling: "linear-gradient(135deg, #C4A882 0%, #B89B67 40%, #A0845A 100%)",
  Cut: "linear-gradient(135deg, #A89C8E 0%, #8B7E6E 40%, #6B5B45 100%)",
  Consultation: "linear-gradient(135deg, #D8CEC2 0%, #C4B6A6 40%, #A89C8E 100%)",
};

export function getCatGradient(cat: string) {
  return categoryGradients[cat] || "linear-gradient(135deg, #D8CEC2 0%, #A89C8E 100%)";
}
