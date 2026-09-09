import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="ambient-bg flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm text-light-violet">404</p>
      <h1 className="text-3xl font-bold text-foreground md:text-4xl">
        پەڕەکە نەدۆزرایەوە
      </h1>
      <p className="max-w-md text-muted">
        ئەم بەستەرە بوونی نییە یان سڕاوەتەوە. دەتوانیت بگەڕێیتەوە بۆ سەرەتا.
      </p>
      <Button asChild>
        <Link href="/">گەڕانەوە بۆ سەرەتا</Link>
      </Button>
    </div>
  );
}
