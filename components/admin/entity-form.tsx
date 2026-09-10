"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RichEditor } from "@/components/admin/rich-editor";
import { ImageUpload } from "@/components/admin/image-upload";
import { PageBlocksEditor } from "@/components/admin/page-blocks-editor";
import { UnsavedGuard } from "@/components/admin/unsaved-guard";
import { initialActionState, type ActionState } from "@/lib/admin/action-state";
import type { AdminField } from "@/lib/admin/shared";

export function EntityForm({
  title,
  description,
  fields,
  record,
  selectOptions = {},
  saveAction,
  backHref,
  demoMode,
}: {
  title: string;
  description: string;
  fields: AdminField[];
  record: Record<string, unknown>;
  selectOptions?: Record<string, { label: string; value: string }[]>;
  saveAction: (state: ActionState, formData: FormData) => Promise<ActionState>;
  backHref: string;
  demoMode: boolean;
}) {
  const [state, formAction, pending] = useActionState(saveAction, initialActionState);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  const normalizedRecord = useMemo(() => record ?? {}, [record]);

  return (
    <Card className="border-white/10 bg-white/[0.03] p-6">
      <UnsavedGuard enabled={dirty} />
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <p className="text-sm text-muted">{description}</p>
        </div>
        <Button asChild variant="secondary">
          <Link href={backHref}>گەڕانەوە بۆ لیست</Link>
        </Button>
      </div>

      <form action={formAction} className="space-y-5" onChange={() => setDirty(true)}>
        <input type="hidden" name="id" value={String(normalizedRecord.id ?? "")} />

        <div className="grid gap-5 md:grid-cols-2">
          {fields.map((field) => {
            const rawValue = normalizedRecord[field.name];
            const stringValue =
              typeof rawValue === "string"
                ? rawValue
                : Array.isArray(rawValue)
                  ? rawValue.join(", ")
                  : rawValue == null
                    ? ""
                    : String(rawValue);

            const options = selectOptions[field.name] ?? field.options ?? [];

            return (
              <div
                key={field.name}
                className={field.type === "richtext" || field.type === "textarea" || field.type === "image" ? "md:col-span-2" : ""}
              >
                <Label className="mb-2 block">{field.label}</Label>

                {field.type === "text" || field.type === "date" || field.type === "number" ? (
                  <Input
                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                    name={field.name}
                    defaultValue={stringValue}
                    placeholder={field.placeholder}
                    className="border-white/10 bg-[#160021]"
                  />
                ) : null}

                {field.type === "textarea" ? (
                  field.name === "blocks_json" ? (
                    <PageBlocksEditor name={field.name} defaultValue={stringValue} />
                  ) : (
                  <Textarea
                    name={field.name}
                    defaultValue={stringValue}
                    placeholder={field.placeholder}
                    className="min-h-32 border-white/10 bg-[#160021]"
                  />
                  )
                ) : null}

                {field.type === "tags" ? (
                  <Textarea
                    name={field.name}
                    defaultValue={stringValue}
                    placeholder="بڕگە-١، بڕگە-٢"
                    className="min-h-28 border-white/10 bg-[#160021]"
                  />
                ) : null}

                {field.type === "select" ? (
                  <select
                    name={field.name}
                    defaultValue={stringValue}
                    className="flex h-11 w-full rounded-xl border border-white/10 bg-[#160021] px-3 text-sm text-white outline-none"
                  >
                    <option value="">هەڵبژێرە</option>
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : null}

                {field.type === "switch" ? (
                  <div className="flex h-11 items-center rounded-xl border border-white/10 bg-[#160021] px-4">
                    <Switch
                      name={field.name}
                      defaultChecked={
                        typeof rawValue === "boolean"
                          ? rawValue
                          : stringValue === "true" || stringValue === "on"
                      }
                    />
                  </div>
                ) : null}

                {field.type === "richtext" ? (
                  <RichEditor name={field.name} defaultValue={stringValue} />
                ) : null}

                {field.type === "image" ? (
                  <ImageUpload name={field.name} defaultValue={stringValue} />
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-end gap-3 pt-4">
          <Button type="submit" name="intent" value="save" disabled={pending || demoMode}>
            {pending ? "پاشەکەوت دەکرێت..." : "پاشەکەوتی ڕەشنووس"}
          </Button>
          <Button
            type="submit"
            name="intent"
            value="publish"
            variant="secondary"
            disabled={pending || demoMode}
          >
            بڵاوکردنەوە / نوێکردنەوە
          </Button>
        </div>
      </form>
    </Card>
  );
}
