import { HomepageRenderer } from "@/components/home/homepage-renderer";
import { getHomepageSections } from "@/services/content";

export default async function PublicHomePage() {
  const sections = await getHomepageSections();

  return <HomepageRenderer sections={sections} />;
}
