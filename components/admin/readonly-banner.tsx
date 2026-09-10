import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAdminSetupMessage } from "@/lib/admin/shared";

export function ReadonlyBanner({ demoMode }: { demoMode: boolean }) {
  if (!demoMode) return null;

  return (
    <Card className="mb-6 border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold">دیمۆ / CMS تەنها خوێندنەوە</p>
          <p className="text-amber-100/85">{getAdminSetupMessage()}</p>
        </div>
        <Badge className="bg-amber-300/20 text-amber-50 hover:bg-amber-300/20">
          گۆڕاوەکانی ژینگە پێویستن
        </Badge>
      </div>
    </Card>
  );
}
