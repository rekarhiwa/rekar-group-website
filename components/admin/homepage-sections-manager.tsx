"use client";

import { useMemo, useState, useTransition } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HomepageSection, PostCategory } from "@/types/database";
import { saveHomepageSectionsAction } from "@/app/admin/actions/homepage";

function SortableRow({
  section,
  onToggle,
  onEdit,
}: {
  section: HomepageSection;
  onToggle: (id: string, enabled: boolean) => void;
  onEdit: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: section.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
    >
      <button
        type="button"
        className="cursor-grab text-muted active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex-1">
        <p className="font-medium text-white">{section.name}</p>
        <p className="text-sm text-muted">
          {section.heading ?? "بێ سەردێڕی تایبەت"} - ڕیزبەندی {section.sort_order}
        </p>
      </div>
      <Button type="button" size="sm" variant="ghost" onClick={() => onEdit(section.id)}>
        <Settings2 className="h-4 w-4" />
        دەستکاری
      </Button>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted">چالاک</span>
        <Switch
          checked={section.enabled}
          onCheckedChange={(checked) => onToggle(section.id, checked)}
        />
      </div>
    </div>
  );
}

export function HomepageSectionsManager({
  initialSections,
  demoMode,
  postCategories = [],
}: {
  initialSections: HomepageSection[];
  demoMode: boolean;
  postCategories?: PostCategory[];
}) {
  const [sections, setSections] = useState(initialSections);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor));

  const ids = useMemo(() => sections.map((item) => item.id), [sections]);
  const editing = sections.find((s) => s.id === editingId) || null;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSections((current) => {
      const oldIndex = current.findIndex((item) => item.id === active.id);
      const newIndex = current.findIndex((item) => item.id === over.id);
      return arrayMove(current, oldIndex, newIndex).map((item, index) => ({
        ...item,
        sort_order: index + 1,
      }));
    });
  }

  function handleToggle(id: string, enabled: boolean) {
    setSections((current) =>
      current.map((item) => (item.id === id ? { ...item, enabled } : item))
    );
  }

  function updateEditing(patch: Partial<HomepageSection>) {
    if (!editingId) return;
    setSections((current) =>
      current.map((item) => (item.id === editingId ? { ...item, ...patch } : item))
    );
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveHomepageSectionsAction(
        sections.map((s) => ({
          id: s.id,
          enabled: s.enabled,
          sort_order: s.sort_order,
          heading: s.heading,
          subtitle: s.subtitle,
          settings: s.settings || {},
        }))
      );
      if (result.status === "success") toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <Card className="border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">بەشەکانی پەڕەی سەرەکی</h2>
          <p className="text-sm text-muted">
            ڕاکێشە بۆ ڕیزکردنەوە، دیاری بکە، ڕێکخستنەکان دەستکاری بکە، پاشان پاشەکەوتی بکە.
          </p>
        </div>
        <Button type="button" onClick={handleSave} disabled={pending || demoMode}>
          {pending ? "پاشەکەوت دەکرێت..." : "پاشەکەوت"}
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sections.map((section) => (
              <SortableRow
                key={section.id}
                section={section}
                onToggle={handleToggle}
                onEdit={setEditingId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {editing ? (
        <div className="mt-6 space-y-4 rounded-2xl border border-primary/30 bg-primary/10 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">دەستکاری: {editing.name}</h3>
            <Button type="button" size="sm" variant="ghost" onClick={() => setEditingId(null)}>
              داخستن
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="mb-2 block">ناونیشانی بەش</Label>
              <Input
                value={editing.heading ?? ""}
                onChange={(e) => updateEditing({ heading: e.target.value })}
              />
            </div>
            <div>
              <Label className="mb-2 block">ژێرناونیشانی بەش</Label>
              <Input
                value={editing.subtitle ?? ""}
                onChange={(e) => updateEditing({ subtitle: e.target.value })}
              />
            </div>
          </div>

          {editing.type === "posts" ? (
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="mb-2 block">ژمارەی پۆست</Label>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  value={Number(editing.settings?.limit ?? 3)}
                  onChange={(e) =>
                    updateEditing({
                      settings: {
                        ...editing.settings,
                        limit: Number(e.target.value || 3),
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label className="mb-2 block">پۆل</Label>
                <select
                  className="flex h-11 w-full rounded-xl border border-border bg-card px-3 text-sm"
                  value={String(editing.settings?.category_id ?? "")}
                  onChange={(e) =>
                    updateEditing({
                      settings: {
                        ...editing.settings,
                        category_id: e.target.value || null,
                      },
                    })
                  }
                >
                  <option value="">هەموو پۆلەکان</option>
                  {postCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end justify-between rounded-xl border border-white/10 px-4 py-3">
                <Label>تەنها تایبەت</Label>
                <Switch
                  checked={Boolean(editing.settings?.featured_only)}
                  onCheckedChange={(checked) =>
                    updateEditing({
                      settings: {
                        ...editing.settings,
                        featured_only: checked,
                      },
                    })
                  }
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
