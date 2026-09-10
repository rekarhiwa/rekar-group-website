import type {
  Client,
  HeroSettings,
  HomepageSection,
  NavigationItem,
  Post,
  ProcessStep,
  Project,
  ProjectCategory,
  Service,
  SiteSettings,
  SocialLink,
  StatItem,
  Testimonial,
  Technology,
  ThemeSettings,
} from "@/types/database";

export const demoSiteSettings: SiteSettings = {
  id: "00000000-0000-0000-0000-000000000001",
  company_name: "ڕێکار گروپ",
  company_name_en: "Rekar Group",
  tagline: "Digital Agency & Technology",
  logo_url: "/brand/logo.png",
  logo_mark_url: "/brand/logo-mark.png",
  favicon_url: "/brand/logo-mark.png",
  phone: "07710500202",
  email: "contact@rekar.group",
  address: "کوردوستان - رانیە",
  whatsapp: "07710500202",
  website_url: "https://www.rekar.group",
  default_seo_title: "ڕێکار گروپ — Digital Agency & Technology",
  default_seo_description:
    "لە بیرۆکە و ستراتیژییەوە تا دیزاین، وێبسایت، ئەپ، سیستەم و ڕیکلام؛ ڕێکار گروپ چارەسەری دیجیتاڵی دروست دەکات.",
  og_image_url: "/brand/logo.png",
  google_maps_url: null,
  footer_description:
    "ڕێکار گروپ — دەزگای دیجیتاڵ و تەکنەلۆجیا. چارەسەری نوێ بۆ گەشەی کاروبار و براند.",
  copyright_text: "© ڕێکار گروپ. هەموو مافەکان پارێزراون.",
  updated_at: new Date().toISOString(),
};

export const demoThemeSettings: ThemeSettings = {
  id: "00000000-0000-0000-0000-000000000002",
  primary_color: "#7B00C8",
  secondary_color: "#190026",
  accent_color: "#9A24F0",
  background_color: "#100018",
  updated_at: new Date().toISOString(),
};

export const demoHero: HeroSettings = {
  id: "00000000-0000-0000-0000-000000000003",
  badge: "Digital Agency & Technology",
  heading: "تەکنەلۆجیا بەهێزتر بۆ",
  highlighted_heading: "داهاتوویەکی باشتر",
  description:
    "لە بیرۆکە و ستراتیژییەوە تا دیزاین، وێبسایت، ئەپ، سیستەم و ڕیکلام؛ ڕێکار گروپ چارەسەری دیجیتاڵی دروست دەکات کە کاروبارەکان گەشە پێبدات و براندەکان جیاواز بکاتەوە.",
  primary_button_label: "پڕۆژەکەت دەستپێبکە",
  primary_button_url: "/contact",
  secondary_button_label: "سەیری کارەکانمان بکە",
  secondary_button_url: "/projects",
  visual_enabled: true,
  stats_enabled: true,
  updated_at: new Date().toISOString(),
};

export const demoSections: HomepageSection[] = [
  { id: "s1", type: "hero", name: "Hero", heading: null, subtitle: null, enabled: true, sort_order: 1, settings: {}, created_at: "", updated_at: "" },
  { id: "s2", type: "project_marquee", name: "Project Marquee", heading: null, subtitle: null, enabled: true, sort_order: 2, settings: {}, created_at: "", updated_at: "" },
  { id: "s3", type: "services", name: "Services", heading: "خزمەتگوزارییەکانمان", subtitle: "چارەسەری تەواو بۆ گەشەی دیجیتاڵی", enabled: true, sort_order: 3, settings: {}, created_at: "", updated_at: "" },
  { id: "s4", type: "featured_projects", name: "Featured Projects", heading: "پڕۆژە دیارەکان", subtitle: "هەندێک لە کارەکانی ئێمە", enabled: true, sort_order: 4, settings: {}, created_at: "", updated_at: "" },
  { id: "s5", type: "stats", name: "Stats", heading: "ئامارەکانمان", subtitle: null, enabled: true, sort_order: 5, settings: {}, created_at: "", updated_at: "" },
  { id: "s6", type: "process", name: "Process", heading: "شێوازی کارکردن", subtitle: "لە بیرۆکەوە تا گەیاندن", enabled: false, sort_order: 6, settings: {}, created_at: "", updated_at: "" },
  { id: "s7", type: "clients", name: "Clients", heading: "کڕیارەکانمان", subtitle: null, enabled: false, sort_order: 7, settings: {}, created_at: "", updated_at: "" },
  { id: "s8", type: "posts", name: "Posts", heading: "نوێترین زانیاری", subtitle: "بینین و شیکاری", enabled: false, sort_order: 8, settings: {}, created_at: "", updated_at: "" },
  { id: "s9", type: "testimonials", name: "Testimonials", heading: "ڕای کڕیارەکان", subtitle: null, enabled: false, sort_order: 9, settings: {}, created_at: "", updated_at: "" },
  { id: "s10", type: "cta", name: "CTA", heading: "ئامادەیت بۆ دەستپێکردن؟", subtitle: "پەیوەندیمان پێوە بکە و پڕۆژەکەت باس بکە", enabled: true, sort_order: 10, settings: { button_label: "پەیوەندی", button_url: "/contact" }, created_at: "", updated_at: "" },
];

export const demoStats: StatItem[] = [
  { id: "st1", value: "150+", label: "پڕۆژەی تەواوکراو", icon: "briefcase", sort_order: 1, visible: true, show_in_hero: true },
  { id: "st2", value: "98%", label: "ڕەزامەندی کڕیارەکان", icon: "heart", sort_order: 2, visible: true, show_in_hero: true },
  { id: "st3", value: "5+", label: "ساڵ ئەزموون", icon: "calendar", sort_order: 3, visible: true, show_in_hero: true },
];

export const demoServices: Service[] = [
  { id: "sv1", title: "سپۆنسەر و ڕیکلام", slug: "ads", short_description: "ڕیکلامی دیجیتاڵی و سپۆنسەری کاریگەر", full_description: "بەڕێوەبردنی ڕیکلام لە سەکۆ جیاوازەکان.", icon: "megaphone", cover_image: null, features: ["ڕیکلامی مێتا", "گۆگڵ ئادز", "سپۆنسەر"], sort_order: 1, status: "published", seo_title: null, seo_description: null, deleted_at: null, created_at: "", updated_at: "" },
  { id: "sv2", title: "سۆشیال میدیا", slug: "social-media", short_description: "بەڕێوەبردنی سۆشیال میدیا و ناوەڕۆک", full_description: "ستراتیژی و بەرهەمهێنانی ناوەڕۆک بۆ سۆشیال میدیا.", icon: "share-2", cover_image: null, features: ["پلانی ناوەڕۆک", "دیزاین", "بڵاوکردنەوە"], sort_order: 2, status: "published", seo_title: null, seo_description: null, deleted_at: null, created_at: "", updated_at: "" },
  { id: "sv3", title: "دیزاین و براندینگ", slug: "design-branding", short_description: "ناسنامەی بینراو و براند", full_description: "دیزاینی لۆگۆ، ناسنامە و ماددەی براند.", icon: "palette", cover_image: null, features: ["لۆگۆ", "براندبووک", "UI"], sort_order: 3, status: "published", seo_title: null, seo_description: null, deleted_at: null, created_at: "", updated_at: "" },
  { id: "sv4", title: "وێبسایت", slug: "websites", short_description: "وێبسایتی خێرا و مۆدێرن", full_description: "دروستکردنی وێبسایت بە تەکنەلۆجیای نوێ.", icon: "globe", cover_image: null, features: ["Next.js", "SEO", "CMS"], sort_order: 4, status: "published", seo_title: null, seo_description: null, deleted_at: null, created_at: "", updated_at: "" },
  { id: "sv5", title: "مۆبایل ئەپ", slug: "mobile-apps", short_description: "ئەپی مۆبایل بۆ iOS و Android", full_description: "گەشەپێدانی ئەپی مۆبایل.", icon: "smartphone", cover_image: null, features: ["React Native", "Flutter", "Native"], sort_order: 5, status: "published", seo_title: null, seo_description: null, deleted_at: null, created_at: "", updated_at: "" },
  { id: "sv6", title: "داتابەیس و سیستەم", slug: "systems", short_description: "سیستەمی کارگێڕی و داتابەیس", full_description: "سیستەمی تایبەت بۆ کاروبار.", icon: "database", cover_image: null, features: ["ERP", "POS", "CRM"], sort_order: 6, status: "published", seo_title: null, seo_description: null, deleted_at: null, created_at: "", updated_at: "" },
  { id: "sv7", title: "ڕاوێژکاری دیجیتاڵ", slug: "consulting", short_description: "ڕاوێژکاری ستراتیژی دیجیتاڵ", full_description: "ڕێنمایی بۆ گۆڕانکاری دیجیتاڵی.", icon: "lightbulb", cover_image: null, features: ["ستراتیژی", "شیکاری", "ڕاهێنان"], sort_order: 7, status: "published", seo_title: null, seo_description: null, deleted_at: null, created_at: "", updated_at: "" },
];

export const demoCategories: ProjectCategory[] = [
  { id: "pc1", name: "ئەپەکان", slug: "apps", description: "ئەپی مۆبایل بۆ iOS و Android", is_active: true, sort_order: 1 },
  { id: "pc2", name: "وێبسایتەکان", slug: "websites", description: "وێبسایت و پلاتفۆرمی خێرا و مۆدێرن", is_active: true, sort_order: 2 },
  { id: "pc3", name: "سیستەمەکان", slug: "systems", description: "سیستەمی کارگێڕی و چارەسەری کاروبار", is_active: true, sort_order: 3 },
];

export const demoTechnologies: Technology[] = [
  { id: "tech1", name: "Next.js", slug: "nextjs" },
  { id: "tech2", name: "React Native", slug: "react-native" },
  { id: "tech3", name: "TypeScript", slug: "typescript" },
  { id: "tech4", name: "Supabase", slug: "supabase" },
  { id: "tech5", name: "Flutter", slug: "flutter" },
  { id: "tech6", name: "PostgreSQL", slug: "postgresql" },
];

type DemoProjectInput = Partial<Project> &
  Pick<Project, "id" | "name" | "slug" | "category_id">;

function makeDemoProject(input: DemoProjectInput): Project {
  const category = demoCategories.find((item) => item.id === input.category_id) ?? null;

  return {
    short_description: null,
    full_description: null,
    subtitle: null,
    icon: "/brand/logo-mark.png",
    cover_image: null,
    featured: false,
    show_in_marquee: false,
    status: "published",
    client_name: null,
    completion_date: null,
    website_url: null,
    play_store_url: null,
    app_store_url: null,
    github_url: null,
    challenge: null,
    solution: null,
    result: null,
    case_study: null,
    features: [],
    platforms: [],
    seo_title: null,
    seo_description: null,
    og_image: null,
    sort_order: 0,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    category,
    technologies: [],
    images: [],
    feature_items: [],
    ...input,
  };
}

export const demoProjects: Project[] = [
  makeDemoProject({
    id: "p1", name: "KRD TV", slug: "krd-tv", category_id: "pc1",
    subtitle: "تەلەفیزیۆنی کوردی لە هەر شوێنێک",
    short_description: "پلاتفۆرمی بینینی تەلەفیزیۆنی کوردی",
    full_description: "ئەپ و پلاتفۆرمی KRD TV بۆ بینینی ناوەڕۆکی ڕاستەوخۆ و تۆمارکراو.",
    featured: true, show_in_marquee: true, client_name: "KRD TV", completion_date: "2025-06-01",
    challenge: "پێویستی بە پلاتفۆرمێکی خێرا و جێگیر بۆ بینینی ناوەڕۆک هەبوو.",
    solution: "ئەپێکی کراس-پلاتفۆرم و پانێڵێکی بەڕێوەبردنی ناوەڕۆک دروست کرا.",
    result: "هەزاران بەکارهێنەری چالاک و ئەزموونێکی بینینی جێگیر.",
    features: ["پەخشی ڕاستەوخۆ", "ئەرشیف", "ئاگاداری"],
    platforms: ["iOS", "Android"], technologies: [demoTechnologies[1], demoTechnologies[2], demoTechnologies[3]], sort_order: 1,
    seo_title: "KRD TV — پڕۆژەی ڕێکار گروپ", seo_description: "وردەکاری دیزاین و گەشەپێدانی ئەپی KRD TV.",
  }),
  makeDemoProject({
    id: "p2", name: "Noor", slug: "noor", category_id: "pc1",
    subtitle: "خزمەتگوزارییەکانت لە ناو مۆبایل",
    short_description: "ئەپی خزمەتگوزاری دیجیتاڵی", full_description: "Noor چارەسەری مۆبایلە بۆ خزمەتگوزارییە ڕۆژانەکان.",
    featured: true, show_in_marquee: true, client_name: "Noor", completion_date: "2025-03-01",
    features: ["هەژمار", "پارەدان", "ئاگاداری"], platforms: ["Android"],
    technologies: [demoTechnologies[4], demoTechnologies[3]], sort_order: 2,
  }),
  makeDemoProject({
    id: "p3", name: "Kurdish POS", slug: "kurdish-pos", category_id: "pc3",
    subtitle: "فرۆشتن و کۆگا بە زمانی کوردی",
    short_description: "سیستەمی فرۆشتنی کوردی", full_description: "POSێکی تەواو بۆ فرۆشگا و چێشتخانەکان.",
    featured: true, show_in_marquee: true, completion_date: "2024-11-01",
    challenge: "بازاڕ پێویستی بە سیستەمێکی ئاسان و کوردی هەبوو.",
    solution: "سیستەمی POSی تەواو بە ڕاپۆرت و بەڕێوەبردنی کۆگا دروست کرا.",
    result: "هەڵەکانی فرۆشتن کەمبوونەوە و خێرایی خزمەتگوزاری زیاد بوو.",
    features: ["فرۆشتن", "کۆگا", "ڕاپۆرت"], platforms: ["Web", "Desktop"],
    technologies: [demoTechnologies[0], demoTechnologies[2], demoTechnologies[5]], sort_order: 3,
  }),
  makeDemoProject({
    id: "p4", name: "Girfan", slug: "girfan", category_id: "pc1",
    subtitle: "کۆمەڵگە و ناوەڕۆک لە یەک شوێن",
    short_description: "ئەپی کۆمەڵایەتی", full_description: "Girfan بۆ پەیوەندی، هاوبەشکردن و دۆزینەوەی ناوەڕۆک دروست کراوە.",
    show_in_marquee: true, client_name: "Girfan", platforms: ["iOS", "Android"],
    technologies: [demoTechnologies[1], demoTechnologies[3]], sort_order: 4,
  }),
  makeDemoProject({
    id: "p5", name: "Krin Store", slug: "krin-store", category_id: "pc2",
    subtitle: "ئەزموونێکی نوێی کڕینی ئۆنلاین",
    short_description: "فرۆشگای ئۆنلاین", full_description: "Krin فرۆشگایەکی مۆدێرنە بە کاتالۆگ، پارەدان و بەدواداچوونی گەیاندن.",
    featured: true, show_in_marquee: true, client_name: "Krin", completion_date: "2025-01-15",
    features: ["کاتالۆگ", "پارەدان", "گەیاندن"], platforms: ["Web"],
    technologies: [demoTechnologies[0], demoTechnologies[2], demoTechnologies[3]], sort_order: 5,
  }),
  makeDemoProject({
    id: "p6", name: "Restaurant System", slug: "restaurant-system", category_id: "pc3",
    subtitle: "بەڕێوەبردنی چێشتخانە لە یەک داشبۆرد",
    short_description: "سیستەمی تەواوی ئۆردەر، مێز، کۆگا و ڕاپۆرت",
    full_description: "چارەسەرێکی یەکگرتوو بۆ خێراکردنی ئۆردەر و بەڕێوەبردنی وردی چێشتخانە.",
    featured: true, show_in_marquee: true, completion_date: "2026-02-10",
    challenge: "ئۆردەری دەستی و ڕاپۆرتی جیاواز هەڵە و دواخستن دروست دەکرد.",
    solution: "POS، شاشەی چێشتخانە و داشبۆردی بەڕێوەبردن لە یەک سیستەمدا یەکخرا.",
    result: "کاتی ئامادەکردنی ئۆردەر کەمبووەوە و وردی ڕاپۆرتەکان زیاد بوو.",
    platforms: ["Web", "Tablet"], technologies: [demoTechnologies[0], demoTechnologies[3], demoTechnologies[5]], sort_order: 6,
    feature_items: [
      { id: "pf61", project_id: "p6", title: "بەڕێوەبردنی مێز", description: "دۆخی هەر مێز و ئۆردەرەکانی بە ڕاستەوخۆ ببینە.", icon: "database", sort_order: 1 },
      { id: "pf62", project_id: "p6", title: "شاشەی چێشتخانە", description: "ئۆردەرەکان خێرا دەگەنە تیمی چێشتخانە.", icon: "smartphone", sort_order: 2 },
      { id: "pf63", project_id: "p6", title: "ڕاپۆرتی ورد", description: "فرۆشتن، کۆگا و قازانج لە یەک شوێن.", icon: "briefcase", sort_order: 3 },
    ],
  }),
  makeDemoProject({
    id: "p7", name: "Bayakawa", slug: "bayakawa", category_id: "pc2",
    subtitle: "بازاڕێکی دیجیتاڵی بۆ کڕین و فرۆشتن",
    short_description: "پلاتفۆرمی ڕیکلام و بازاڕی ئۆنلاین",
    full_description: "Bayakawa بەکارهێنەران بە ئاسانی بەرهەم و خزمەتگوزاری بڵاودەکەنەوە و دەدۆزنەوە.",
    featured: true, show_in_marquee: true, completion_date: "2026-05-20",
    platforms: ["Web"], technologies: [demoTechnologies[0], demoTechnologies[2], demoTechnologies[3]], sort_order: 7,
    feature_items: [
      { id: "pf71", project_id: "p7", title: "گەڕانی زیرەک", description: "دۆزینەوەی خێرای بەرهەم بە فلتەری ورد.", icon: "star", sort_order: 1 },
      { id: "pf72", project_id: "p7", title: "ڕیکلامی بەکارهێنەر", description: "بڵاوکردنەوە و بەڕێوەبردنی ڕیکلام بە ئاسانی.", icon: "megaphone", sort_order: 2 },
    ],
  }),
  makeDemoProject({
    id: "p8", name: "Dagirtin", slug: "dagirtin", category_id: "pc2",
    subtitle: "دابەزاندنی ناوەڕۆک بە خێرایی",
    short_description: "ئامرازی سادە و خێرا بۆ بەڕێوەبردنی دابەزاندن",
    full_description: "Dagirtin ئەزموونێکی ڕوون و خێرا بۆ دابەزاندن و ڕێکخستنی فایلەکان پێشکەش دەکات.",
    show_in_marquee: true, completion_date: "2025-09-12", platforms: ["Web"],
    technologies: [demoTechnologies[0], demoTechnologies[2]], sort_order: 8,
  }),
  makeDemoProject({
    id: "p9", name: "Walam", slug: "walam", category_id: "pc1",
    subtitle: "وەڵامی خێرا بۆ پێداویستییە ڕۆژانەکان",
    short_description: "ئەپی پەیوەندی و وەڵامدانەوەی زیرەک",
    full_description: "Walam خزمەتگوزاری و بەکارهێنەر بە ڕێگەیەکی سادە و خێرا بەیەکەوە دەبەستێتەوە.",
    featured: true, show_in_marquee: true, completion_date: "2026-07-01",
    platforms: ["iOS", "Android"], technologies: [demoTechnologies[1], demoTechnologies[2], demoTechnologies[3]], sort_order: 9,
    feature_items: [
      { id: "pf91", project_id: "p9", title: "گفتوگۆی ڕاستەوخۆ", description: "پەیوەندی خێرا و پارێزراو.", icon: "message-circle", sort_order: 1 },
      { id: "pf92", project_id: "p9", title: "ئاگادارکردنەوە", description: "نوێکارییە گرنگەکان لە کاتی خۆیدا.", icon: "smartphone", sort_order: 2 },
    ],
  }),
];

export const demoNav: NavigationItem[] = [
  { id: "n1", label: "سەرەتا", url: "/", type: "link", parent_id: null, sort_order: 1, open_in_new_tab: false, visible: true, created_at: "", updated_at: "" },
  { id: "n2", label: "خزمەتگوزارییەکان", url: "/services", type: "link", parent_id: null, sort_order: 2, open_in_new_tab: false, visible: true, created_at: "", updated_at: "" },
  { id: "n3", label: "پڕۆژەکان", url: "/projects", type: "link", parent_id: null, sort_order: 3, open_in_new_tab: false, visible: true, created_at: "", updated_at: "" },
  { id: "n4", label: "زانیاری و نوێکاری", url: "/insights", type: "link", parent_id: null, sort_order: 4, open_in_new_tab: false, visible: true, created_at: "", updated_at: "" },
  { id: "n5", label: "دەربارەی ئێمە", url: "/about", type: "link", parent_id: null, sort_order: 5, open_in_new_tab: false, visible: true, created_at: "", updated_at: "" },
  { id: "n6", label: "پەیوەندی", url: "/contact", type: "link", parent_id: null, sort_order: 6, open_in_new_tab: false, visible: true, created_at: "", updated_at: "" },
];

export const demoSocial: SocialLink[] = [
  { id: "so1", platform: "Facebook", url: "https://facebook.com", enabled: true, sort_order: 1 },
  { id: "so2", platform: "Instagram", url: "https://instagram.com", enabled: true, sort_order: 2 },
  { id: "so3", platform: "TikTok", url: "https://tiktok.com", enabled: false, sort_order: 3 },
  { id: "so4", platform: "Telegram", url: "https://t.me", enabled: true, sort_order: 4 },
  { id: "so5", platform: "LinkedIn", url: "https://linkedin.com", enabled: true, sort_order: 5 },
  { id: "so6", platform: "YouTube", url: "https://youtube.com", enabled: false, sort_order: 6 },
  { id: "so7", platform: "X", url: "https://x.com", enabled: false, sort_order: 7 },
];

export const demoProcess: ProcessStep[] = [
  { id: "pr1", step_number: 1, title: "گفتوگۆ و تێگەیشتن", description: "پێداویستی و ئامانجەکانت دەناسین.", icon: "message-circle", sort_order: 1, visible: true },
  { id: "pr2", step_number: 2, title: "ستراتیژی و دیزاین", description: "پلانی کارکردن و دیزاینی سەرەتایی.", icon: "pen-tool", sort_order: 2, visible: true },
  { id: "pr3", step_number: 3, title: "گەشەپێدان", description: "جێبەجێکردنی تەکنیکی و تاقیکردنەوە.", icon: "code", sort_order: 3, visible: true },
  { id: "pr4", step_number: 4, title: "بڵاوکردنەوە و پشتگیری", description: "گەیاندن و چاودێری بەردەوام.", icon: "rocket", sort_order: 4, visible: true },
];

export const demoClients: Client[] = [
  { id: "c1", name: "KRD TV", logo: "/brand/logo-mark.png", website: null, sort_order: 1, visible: true },
  { id: "c2", name: "Noor", logo: "/brand/logo-mark.png", website: null, sort_order: 2, visible: true },
  { id: "c3", name: "Girfan", logo: "/brand/logo-mark.png", website: null, sort_order: 3, visible: true },
  { id: "c4", name: "Krin", logo: "/brand/logo-mark.png", website: null, sort_order: 4, visible: true },
];

export const demoTestimonials: Testimonial[] = [
  { id: "t1", name: "ئارام محەمەد", job_title: "بەڕێوەبەر", company: "KRD TV", avatar: null, testimonial: "ڕێکار گروپ پڕۆژەکەمان بە کوالێتی بەرز و لە کاتی خۆیدا تەواو کرد.", rating: 5, featured: true, visible: true, sort_order: 1 },
  { id: "t2", name: "هێمن سەعدی", job_title: "دامەزرێنەر", company: "Krin", avatar: null, testimonial: "تیمێکی پیشەیی و تێگەیشتنێکی قووڵ لە بازاڕی کوردی.", rating: 5, featured: true, visible: true, sort_order: 2 },
];

export const demoPosts: Post[] = [
  { id: "po1", title: "چۆن وێبسایتێکی مۆدێرن دروست دەکرێت؟", slug: "modern-web-design", excerpt: "هەنگاوە سەرەکییەکانی دیزاین و گەشەپێدانی وێبسایتی سەرکەوتوو.", content: "<p>وێبسایتی مۆدێرن پێویستی بە دیزاینی ڕوون، خێرایی، و SEO هەیە.</p><p>لە ڕێکار گروپ ئێمە لەگەڵ کڕیار کار دەکەین بۆ دروستکردنی چارەسەری تایبەت.</p>", cover_image: null, category_id: null, author_id: null, featured: true, status: "published", published_at: "2025-01-10T00:00:00Z", seo_title: null, seo_description: null, og_image: null, deleted_at: null, created_at: "", updated_at: "" },
  { id: "po2", title: "گرنگی سۆشیال میدیا بۆ کاروبار", slug: "social-media-business", excerpt: "چۆن سۆشیال میدیا دەتوانێت فرۆشتن و ناسینەوە زیاد بکات.", content: "<p>سۆشیال میدیا ئامرازێکی بەهێزە بۆ پەیوەندی لەگەڵ کڕیار.</p>", cover_image: null, category_id: null, author_id: null, featured: false, status: "published", published_at: "2025-02-01T00:00:00Z", seo_title: null, seo_description: null, og_image: null, deleted_at: null, created_at: "", updated_at: "" },
  { id: "po3", title: "ئەپی مۆبایل یان وێبسایت؟", slug: "app-vs-website", excerpt: "هەڵبژاردنی گونجاو بۆ کاروبارەکەت.", content: "<p>هەردووکیان سوودیان هەیە بەپێی ئامانج و بودجە.</p>", cover_image: null, category_id: null, author_id: null, featured: false, status: "published", published_at: "2025-03-01T00:00:00Z", seo_title: null, seo_description: null, og_image: null, deleted_at: null, created_at: "", updated_at: "" },
];
