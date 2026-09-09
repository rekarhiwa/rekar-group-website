export type UserRole = "super_admin" | "admin" | "editor";
export type ContentStatus = "draft" | "published" | "archived" | "scheduled";
export type HomepageSectionType =
  | "hero"
  | "project_marquee"
  | "services"
  | "featured_projects"
  | "stats"
  | "process"
  | "clients"
  | "posts"
  | "testimonials"
  | "cta"
  | "custom_content";

export type PageBlockType =
  | "heading"
  | "text"
  | "rich_text"
  | "image"
  | "image_text"
  | "gallery"
  | "button"
  | "cta"
  | "faq"
  | "stats"
  | "features"
  | "video"
  | "spacer"
  | "custom_html";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  company_name: string;
  company_name_en: string;
  tagline: string | null;
  logo_url: string | null;
  logo_mark_url: string | null;
  favicon_url: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  whatsapp: string | null;
  website_url: string | null;
  default_seo_title: string | null;
  default_seo_description: string | null;
  og_image_url: string | null;
  google_maps_url: string | null;
  footer_description: string | null;
  copyright_text: string | null;
  updated_at: string;
}

export interface ThemeSettings {
  id: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  updated_at: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  type: "link" | "page" | "external";
  parent_id: string | null;
  sort_order: number;
  open_in_new_tab: boolean;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  enabled: boolean;
  sort_order: number;
}

export interface HomepageSection {
  id: string;
  type: HomepageSectionType;
  name: string;
  heading: string | null;
  subtitle: string | null;
  enabled: boolean;
  sort_order: number;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface HeroSettings {
  id: string;
  badge: string | null;
  heading: string;
  highlighted_heading: string | null;
  description: string | null;
  primary_button_label: string | null;
  primary_button_url: string | null;
  secondary_button_label: string | null;
  secondary_button_url: string | null;
  visual_enabled: boolean;
  stats_enabled: boolean;
  updated_at: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  icon: string | null;
  sort_order: number;
  visible: boolean;
  show_in_hero: boolean;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  icon: string | null;
  cover_image: string | null;
  features: string[];
  sort_order: number;
  status: ContentStatus;
  seo_title: string | null;
  seo_description: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  is_active?: boolean;
  sort_order: number;
}

export interface ProjectFeature {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  subtitle?: string | null;
  short_description: string | null;
  full_description: string | null;
  icon: string | null;
  cover_image: string | null;
  featured: boolean;
  show_in_marquee: boolean;
  status: ContentStatus;
  client_name: string | null;
  completion_date: string | null;
  website_url: string | null;
  play_store_url: string | null;
  app_store_url: string | null;
  github_url: string | null;
  challenge: string | null;
  solution: string | null;
  result: string | null;
  case_study: string | null;
  features: string[];
  platforms: string[];
  seo_title?: string | null;
  seo_description?: string | null;
  og_image?: string | null;
  sort_order: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  category?: ProjectCategory | null;
  technologies?: Technology[];
  images?: ProjectImage[];
  feature_items?: ProjectFeature[];
}

export interface Technology {
  id: string;
  name: string;
  slug: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  sort_order: number;
}

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category_id: string | null;
  author_id: string | null;
  featured: boolean;
  status: ContentStatus;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  view_count?: number;
  unique_view_count?: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  category?: PostCategory | null;
  tags?: Tag[];
  author?: Profile | null;
}

export interface HomepagePostsSettings {
  limit: number;
  category_id?: string | null;
  featured_only?: boolean;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  status: ContentStatus;
  seo_title: string | null;
  seo_description: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  blocks?: PageBlock[];
}

export interface PageBlock {
  id: string;
  page_id: string;
  type: PageBlockType;
  content: Record<string, unknown>;
  sort_order: number;
  visible: boolean;
}

export interface Client {
  id: string;
  name: string;
  logo: string | null;
  website: string | null;
  sort_order: number;
  visible: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  job_title: string | null;
  company: string | null;
  avatar: string | null;
  testimonial: string;
  rating: number;
  featured: boolean;
  visible: boolean;
  sort_order: number;
}

export interface ProcessStep {
  id: string;
  step_number: number;
  title: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  visible: boolean;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  company: string | null;
  project_type: string | null;
  budget: string | null;
  message: string;
  is_read: boolean;
  is_important: boolean;
  is_archived: boolean;
  created_at: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  size: number;
  mime_type: string;
  alt_text: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  user_name: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  entity_label: string | null;
  created_at: string;
}
