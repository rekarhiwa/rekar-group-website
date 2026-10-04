import type { Metadata } from "next";
import { PrivacyPolicyContent } from "@/components/legal/nrxi-drawakan-privacy-policy";

const PATH = "/nrxidrawakanprivacypolicy";
const CANONICAL = `https://www.rekar.group${PATH}`;

export const metadata: Metadata = {
  title: "سیاسەتی پاراستنی زانیاری — نرخی دراوەکان",
  description:
    "Privacy Policy for Nirkhi Drawakan (نرخی دراوەکان) — currency, gold & crypto rates app by Rekar Group.",
  alternates: {
    canonical: CANONICAL,
  },
  // Direct link only — do not surface in search / site discovery.
  robots: {
    index: false,
    follow: false,
  },
};

export default function NrxiDrawakanPrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}
