"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteTechnologyAction, saveTechnologyAction } from "@/app/admin/actions/projects";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Technology } from "@/types/database";

export function ProjectTechnologiesManager({ technologies }: { technologies: Technology[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Technology | null>(null);
  const [pending, startTransition] = useTransition();

  function remove(id: string) {
    startTransition(async () => {
      const r = await deleteTechnologyAction(id);
      if (r.status === "error") toast.error(r.message);
      else {
        toast.success(r.message);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-5" dir="rtl">
      <h1 className="text-2xl font-bold text-white">تەکنەلۆژیاکان</h1>
      <form
        action={(fd) =>
          startTransition(async () => {
            const r = await saveTechnologyAction(undefined, fd);
            if (r.status === "error") toast.error(r.message);
            else {
              toast.success(r.message);
              setEditing(null);
              router.refresh();
            }
          })
        }
        className="glass grid gap-3 rounded-2xl p-4 md:grid-cols-3"
      >
        <input type="hidden" name="id" value={editing?.id || ""} />
        <Input
          name="name"
          key={`name-${editing?.id}`}
          defaultValue={editing?.name}
          placeholder="ناوی تەکنەلۆژیا"
          dir="ltr"
          required
        />
        <Input
          name="slug"
          key={`slug-${editing?.id}`}
          defaultValue={editing?.slug}
          placeholder="slug"
          dir="ltr"
        />
        <Button disabled={pending}>پاشەکەوتکردن</Button>
      </form>
      <div className="space-y-2">
        {technologies.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-xl border border-white/10 p-3">
            <div className="flex-1" dir="ltr">
              <p className="text-white">{item.name}</p>
              <p className="text-xs text-muted">{item.slug}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setEditing(item)}>
              دەستکاری
            </Button>
            <ConfirmDialog
              title="سڕینەوەی تەکنەلۆژیا"
              description="دڵنیایت؟"
              confirmLabel="سڕینەوە"
              onConfirm={() => remove(item.id)}
            >
              <Button type="button" size="sm" variant="destructive">
                سڕینەوە
              </Button>
            </ConfirmDialog>
          </div>
        ))}
      </div>
    </div>
  );
}
