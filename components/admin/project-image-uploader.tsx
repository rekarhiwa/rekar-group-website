"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Button } from "@/components/ui/button";

const accepted = ["image/jpeg", "image/png", "image/webp"];

export function ProjectImageUploader({
  value,
  onChange,
  projectId,
  kind = "gallery",
}: {
  value?: string;
  onChange: (url: string) => void;
  projectId?: string;
  kind?: "gallery" | "icon" | "cover";
}) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function upload(file?: File) {
    if (!file) return;
    if (!accepted.includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error("تەنها JPG، PNG یان WebP تا 5MB ڕێگەپێدراوە");
      return;
    }
    if (!isSupabaseConfigured()) {
      toast.error("Supabase ڕێکنەخراوە؛ ناتوانرێت وێنە باربکرێت");
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const extension = file.name.split(".").pop() || "webp";
      const path = `projects/${projectId || "temp"}/${kind}/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from("project-media").upload(path, file, { upsert: true });
      if (error) throw error;
      const url = supabase.storage.from("project-media").getPublicUrl(path).data.publicUrl;
      onChange(url);
      toast.success("وێنەکە بارکرا");
    } catch (error) {
      toast.error("بارکردنی وێنە سەرکەوتوو نەبوو", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div
        className={`relative flex min-h-40 items-center justify-center overflow-hidden rounded-2xl border border-dashed ${dragging ? "border-primary bg-primary/10" : "border-white/15 bg-white/[0.02]"}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); void upload(e.dataTransfer.files[0]); }}
      >
        {value ? <Image src={value} alt="" fill className="object-cover" unoptimized /> : (
          <button type="button" className="flex flex-col items-center gap-2 p-8 text-sm text-muted" onClick={() => input.current?.click()}>
            <ImagePlus className="h-7 w-7" />
            وێنەکە ڕابکێشە یان هەڵیبژێرە
          </button>
        )}
        {uploading ? <div className="absolute inset-0 grid place-items-center bg-black/60 text-sm text-white">بارکردن...</div> : null}
      </div>
      <input ref={input} hidden type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(e) => void upload(e.target.files?.[0])} />
      <div className="flex gap-2">
        <Button type="button" size="sm" variant="outline" disabled={uploading} onClick={() => input.current?.click()}>
          {value ? "گۆڕینی وێنە" : "هەڵبژاردنی وێنە"}
        </Button>
        {value ? <Button type="button" size="sm" variant="ghost" onClick={() => onChange("")}><Trash2 className="h-4 w-4" /> سڕینەوە</Button> : null}
      </div>
    </div>
  );
}
