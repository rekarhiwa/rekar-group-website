"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { purgeProjectAction, restoreProjectAction } from "@/app/admin/actions/projects";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/types/database";

export function ProjectsTrashTable({ items }: { items: Project[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  function run(action: "restore" | "purge", id: string) {
    startTransition(async () => {
      const result = action === "restore" ? await restoreProjectAction(id) : await purgeProjectAction(id);
      if (result.status === "error") toast.error(result.message);
      else toast.success(result.message);
      router.refresh();
    });
  }
  return (
    <div className="space-y-4" dir="rtl"><h1 className="text-2xl font-bold text-white">سەبەتەی زبڵی پڕۆژەکان</h1>
      <div className="overflow-x-auto rounded-2xl border border-white/10"><table className="min-w-full text-sm"><thead className="bg-white/5 text-muted"><tr><th className="p-3 text-start">ناو</th><th className="p-3 text-start">سڕینەوە</th><th className="p-3 text-start">کردار</th></tr></thead>
        <tbody>{items.map((item) => <tr key={item.id} className="border-t border-white/10"><td className="p-3 text-white">{item.name}</td><td className="p-3 text-muted">{item.deleted_at ? formatDate(item.deleted_at) : "—"}</td><td className="flex gap-2 p-3"><Button size="sm" variant="secondary" disabled={pending} onClick={() => run("restore", item.id)}>گەڕاندنەوە</Button><ConfirmDialog title="سڕینەوەی هەمیشەیی" description="ئەم کردارە ناگەڕێتەوە. دڵنیایت؟" confirmLabel="سڕینەوە" onConfirm={() => run("purge", item.id)}><Button type="button" size="sm" variant="destructive" disabled={pending}>سڕینەوەی هەمیشەیی</Button></ConfirmDialog></td></tr>)}
        {!items.length ? <tr><td colSpan={3} className="p-10 text-center text-muted">سەبەتەی زبڵ بەتاڵە</td></tr> : null}</tbody></table></div>
    </div>
  );
}
