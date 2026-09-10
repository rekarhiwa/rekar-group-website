"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ImageUpload({
  name,
  defaultValue = "",
  onUploaded,
  onChange,
}: {
  name: string;
  defaultValue?: string | null;
  onUploaded?: (url: string) => void;
  onChange?: (url: string) => void;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setValue(defaultValue ?? "");
  }, [defaultValue]);

  const preview = useMemo(() => value || "/brand/logo-mark.png", [value]);

  function setUrl(url: string) {
    setValue(url);
    onChange?.(url);
    if (url) onUploaded?.(url);
  }

  async function handleUpload(file: File | null) {
    if (!file) return;

    if (!isSupabaseConfigured()) {
      toast.error("هەڵەیەک ڕوویدا", {
        description: "بۆ آپڵۆدکردن پێویستە Supabase ڕێکبخرێت.",
      });
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const objectPath = `${crypto.randomUUID()}/${file.name}`;
      const { error: storageError } = await supabase.storage
        .from("media")
        .upload(objectPath, file, { upsert: true });
      if (storageError) throw storageError;

      const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(objectPath);
      const publicUrl = publicUrlData.publicUrl;
      await supabase.from("media").insert({
        filename: file.name,
        url: publicUrl,
        size: file.size,
        mime_type: file.type || "application/octet-stream",
      });

      setUrl(publicUrl);
      toast.success("پاشەکەوت کرا");
    } catch (error) {
      toast.error("هەڵەیەک ڕوویدا", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={value} readOnly />
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#160021]">
        <div className="relative aspect-[16/9] w-full">
          <Image src={preview} alt="" fill className="object-cover" unoptimized />
        </div>
      </div>
      <Input
        value={value}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://..."
        dir="ltr"
      />
      <div className="flex flex-wrap gap-3">
        <label className="inline-flex cursor-pointer items-center">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(event) => void handleUpload(event.target.files?.[0] ?? null)}
          />
          <span className="inline-flex h-11 items-center rounded-xl border border-white/10 px-4 text-sm text-white">
            {uploading ? "ئاپڵۆد دەکرێت..." : "ئاپڵۆدی فایل"}
          </span>
        </label>
        <Button type="button" variant="ghost" onClick={() => setUrl("")}>
          لابردن
        </Button>
      </div>
    </div>
  );
}
