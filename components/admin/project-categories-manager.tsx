"use client";
/* eslint-disable react-hooks/refs -- dnd-kit exposes ref/listener objects for render */

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  deleteProjectCategoryAction,
  reorderProjectCategoriesAction,
  saveProjectCategoryAction,
} from "@/app/admin/actions/projects";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProjectCategory } from "@/types/database";

function Row({
  item,
  onEdit,
  onDelete,
}: {
  item: ProjectCategory;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const x = useSortable({ id: item.id });
  return (
    <div
      ref={x.setNodeRef}
      style={{ transform: CSS.Transform.toString(x.transform), transition: x.transition }}
      className="flex items-center gap-3 rounded-xl border border-white/10 p-3"
    >
      <button type="button" {...x.attributes} {...x.listeners}>
        <GripVertical className="h-5 w-5 text-muted" />
      </button>
      <div className="flex-1">
        <p className="text-white">{item.name}</p>
        <p className="text-xs text-muted" dir="ltr">
          {item.slug}
        </p>
      </div>
      <Button size="sm" variant="outline" onClick={onEdit}>
        دەستکاری
      </Button>
      <ConfirmDialog title="سڕینەوەی پۆل" description="دڵنیایت؟" confirmLabel="سڕینەوە" onConfirm={onDelete}>
        <Button type="button" size="sm" variant="destructive">
          سڕینەوە
        </Button>
      </ConfirmDialog>
    </div>
  );
}

export function ProjectCategoriesManager({ categories }: { categories: ProjectCategory[] }) {
  const router = useRouter();
  const [items, setItems] = useState(categories);
  const [editing, setEditing] = useState<ProjectCategory | null>(null);
  const [pending, startTransition] = useTransition();

  function dragEnd(e: DragEndEvent) {
    if (!e.over || e.active.id === e.over.id) return;
    const next = arrayMove(
      items,
      items.findIndex((x) => x.id === e.active.id),
      items.findIndex((x) => x.id === e.over?.id)
    );
    setItems(next);
    startTransition(async () => {
      const r = await reorderProjectCategoriesAction(next.map((x) => x.id));
      if (r.status === "error") toast.error(r.message);
      else toast.success(r.message);
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const r = await deleteProjectCategoryAction(id);
      if (r.status === "error") toast.error(r.message);
      else {
        toast.success(r.message);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-5" dir="rtl">
      <h1 className="text-2xl font-bold text-white">پۆلەکانی پڕۆژە</h1>
      <form
        className="glass grid gap-3 rounded-2xl p-4 md:grid-cols-4"
        action={(fd) =>
          startTransition(async () => {
            const r = await saveProjectCategoryAction(undefined, fd);
            if (r.status === "error") toast.error(r.message);
            else {
              toast.success(r.message);
              setEditing(null);
              router.refresh();
            }
          })
        }
      >
        <input type="hidden" name="id" value={editing?.id || ""} />
        <Input name="name" key={`name-${editing?.id}`} defaultValue={editing?.name} placeholder="ناو" required />
        <Input name="slug" key={`slug-${editing?.id}`} defaultValue={editing?.slug} placeholder="slug" dir="ltr" />
        <Input
          name="description"
          key={`desc-${editing?.id}`}
          defaultValue={editing?.description || ""}
          placeholder="وەسف"
        />
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            name="is_active"
            value="true"
            defaultChecked={editing?.is_active !== false}
            className="rounded border-white/20"
          />
          چالاک
        </label>
        <Button disabled={pending}>پاشەکەوتکردن</Button>
      </form>
      <DndContext onDragEnd={dragEnd}>
        <SortableContext items={items.map((x) => x.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((x) => (
              <Row key={x.id} item={x} onEdit={() => setEditing(x)} onDelete={() => remove(x.id)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
