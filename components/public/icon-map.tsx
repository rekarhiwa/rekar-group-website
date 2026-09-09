import type { LucideProps } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Calendar,
  Code,
  Database,
  Globe,
  Heart,
  Lightbulb,
  Megaphone,
  MessageCircle,
  Palette,
  PenTool,
  Rocket,
  Share2,
  Smartphone,
  Star,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "arrow-right": ArrowRight,
  badge: BadgeCheck,
  briefcase: Briefcase,
  calendar: Calendar,
  code: Code,
  database: Database,
  globe: Globe,
  heart: Heart,
  lightbulb: Lightbulb,
  megaphone: Megaphone,
  "message-circle": MessageCircle,
  palette: Palette,
  "pen-tool": PenTool,
  rocket: Rocket,
  "share-2": Share2,
  smartphone: Smartphone,
  star: Star,
};

export function CmsIcon({
  name,
  fallback = Briefcase,
  ...props
}: LucideProps & {
  name?: string | null;
  fallback?: LucideIcon;
}) {
  const Icon = (name ? iconMap[name] : null) ?? fallback;
  return <Icon {...props} />;
}
