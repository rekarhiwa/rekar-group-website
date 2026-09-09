"use client";
 

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type ProjectFeatureDraft = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

function FeatureRow({
  feature,
  onChange,
  onDelete,
}: {
  feature: ProjectFeatureDraft;
  onChange: (value: ProjectFeatureDraft) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: feature.id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className="grid gap-3 rounded-xl border border-white/10 p-3 md:grid-cols-[auto_1fr_1fr_auto]">
      <button type="button" aria-label="ڕاکێشان" {...attributes} {...listeners} className="cursor-grab text-muted">
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="space-y-2">
        <Input value={feature.title} onChange={(e) => onChange({ ...feature, title: e.target.value })} placeholder="ناونیشانی تایبەتمەندی" />
        <Input value={feature.icon} onChange={(e) => onChange({ ...feature, icon: e.target.value })} placeholder="ئایکۆن" dir="ltr" />
      </div>
      <Textarea value={feature.description} onChange={(e) => onChange({ ...feature, description: e.target.value })} placeholder="وەسف" />
      <Button type="button" size="sm" variant="ghost" onClick={onDelete} aria-label="سڕینەوە">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function ProjectFeaturesEditor({
  value,
  onChange,
}: {
  value: ProjectFeatureDraft[];
  onChange: (value: ProjectFeatureDraft[]) => void;
}) {
  function dragEnd(event: DragEndEvent) {
    if (!event.over || event.active.id === event.over.id) return;
    const from = value.findIndex((item) => item.id === event.active.id);
    const to = value.findIndex((item) => item.id === event.over?.id);
    onChange(arrayMove(value, from, to));
  }

  return (
    <div className="space-y-3">
      <DndContext onDragEnd={dragEnd}>
        <SortableContext items={value.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          {value.map((feature, index) => (
            <FeatureRow
              key={feature.id}
              feature={feature}
              onChange={(next) => onChange(value.map((item, i) => (i === index ? next : item)))}
              onDelete={() => onChange(value.filter((_, i) => i !== index))}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button type="button" variant="outline" onClick={() => onChange([...value, { id: crypto.randomUUID(), title: "", description: "", icon: "" }])}>
        <Plus className="h-4 w-4" /> زیادکردنی تایبەتمەندی
      </Button>
    </div>
  );
}
