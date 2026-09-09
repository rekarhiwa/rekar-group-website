"use client";
/* eslint-disable react-hooks/refs -- dnd-kit exposes ref/listener objects for render */

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { ProjectImageUploader } from "@/components/admin/project-image-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type GalleryDraft = { id: string; image_url: string; alt_text: string; caption: string };

function GalleryRow({ item, projectId, update, remove }: { item: GalleryDraft; projectId?: string; update: (item: GalleryDraft) => void; remove: () => void }) {
  const sortable = useSortable({ id: item.id });
  return (
    <div ref={sortable.setNodeRef} style={{ transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition }} className="grid gap-3 rounded-xl border border-white/10 p-3 md:grid-cols-[auto_220px_1fr_auto]">
      <button type="button" {...sortable.attributes} {...sortable.listeners} className="cursor-grab text-muted"><GripVertical className="h-5 w-5" /></button>
      <ProjectImageUploader value={item.image_url} onChange={(image_url) => update({ ...item, image_url })} projectId={projectId} />
      <div className="space-y-2">
        <Input value={item.alt_text} onChange={(e) => update({ ...item, alt_text: e.target.value })} placeholder="دەقی جێگرەوە (Alt)" />
        <Input value={item.caption} onChange={(e) => update({ ...item, caption: e.target.value })} placeholder="وەسفی وێنە" />
      </div>
      <Button type="button" variant="ghost" size="sm" onClick={remove}><Trash2 className="h-4 w-4" /></Button>
    </div>
  );
}

export function ProjectGalleryManager({ value, onChange, projectId }: { value: GalleryDraft[]; onChange: (items: GalleryDraft[]) => void; projectId?: string }) {
  function dragEnd(event: DragEndEvent) {
    if (!event.over || event.active.id === event.over.id) return;
    onChange(arrayMove(value, value.findIndex((x) => x.id === event.active.id), value.findIndex((x) => x.id === event.over?.id)));
  }
  return (
    <div className="space-y-3">
      <DndContext onDragEnd={dragEnd}>
        <SortableContext items={value.map((x) => x.id)} strategy={verticalListSortingStrategy}>
          {value.map((item, index) => <GalleryRow key={item.id} item={item} projectId={projectId} update={(next) => onChange(value.map((x, i) => i === index ? next : x))} remove={() => onChange(value.filter((_, i) => i !== index))} />)}
        </SortableContext>
      </DndContext>
      <Button type="button" variant="outline" onClick={() => onChange([...value, { id: crypto.randomUUID(), image_url: "", alt_text: "", caption: "" }])}>زیادکردنی وێنە</Button>
    </div>
  );
}
