"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { ServerForm } from "@/components/admin/server-form";
import { ActionButton } from "@/components/admin/action-button";
import { ImageUpload } from "@/components/admin/image-upload";
import type { ActionState } from "@/lib/admin/action-state";
import type { AdminField } from "@/lib/admin/shared";

function fieldValue(item: Record<string, unknown> | null, name: string) {
  if (!item) return "";
  const raw = item[name];
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) return raw.join(", ");
  if (raw == null) return "";
  return String(raw);
}

function fieldChecked(item: Record<string, unknown> | null, name: string) {
  if (!item) return false;
  return Boolean(item[name]);
}

export function InlineCollectionManager({
  title,
  description,
  fields,
  items,
  saveAction,
  deleteAction,
  demoMode,
}: {
  title: string;
  description: string;
  fields: AdminField[];
  items: Record<string, unknown>[];
  saveAction: (state: ActionState, formData: FormData) => Promise<ActionState>;
  deleteAction: (id: string) => Promise<{ status: string; message: string }>;
  demoMode: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const formKey = String(editing?.id ?? "new");

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <DataTable
        title={title}
        rows={items}
        columns={[
          {
            key: "name",
            header: "بڕگە",
            render: (row) => (
              <div>
                <p className="font-medium text-white">
                  {String(row.title ?? row.name ?? row.label ?? row.value ?? "بێ ناونیشان")}
                </p>
                <p className="text-xs text-muted">
                  {String(row.slug ?? row.company ?? row.icon ?? row.website ?? "")}
                </p>
              </div>
            ),
            searchValue: (row) =>
              `${String(row.title ?? row.name ?? row.label ?? "")} ${String(row.slug ?? "")}`,
          },
          {
            key: "status",
            header: "زانیاری",
            render: (row) => (
              <div className="space-y-1 text-xs text-muted">
                {"status" in row ? <p>دۆخ: {String(row.status ?? "-")}</p> : null}
                {"sort_order" in row ? <p>ڕیزبەندی: {String(row.sort_order ?? "-")}</p> : null}
                {"visible" in row ? <p>دیار: {Boolean(row.visible) ? "بەڵێ" : "نەخێر"}</p> : null}
              </div>
            ),
          },
          {
            key: "action",
            header: "کردار",
            render: (row) => (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-9"
                  onClick={() => setEditing(row)}
                >
                  دەستکاری
                </Button>
                <ActionButton
                  variant="destructive"
                  action={async () => {
                    const result = await deleteAction(String(row.id ?? ""));
                    if (result.status === "success") {
                      if (editing && String(editing.id) === String(row.id)) setEditing(null);
                      router.refresh();
                    }
                    return result;
                  }}
                  className="h-9"
                >
                  سڕینەوە
                </ActionButton>
              </div>
            ),
          },
        ]}
      />

      <Card className="border-white/10 bg-white/[0.03] p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-white">
              {editing ? `دەستکاریکردنی ${title}` : `${title}ی نوێ`}
            </h3>
            <p className="text-sm text-muted">{description}</p>
          </div>
          {editing ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(null)}>
              نوێ
            </Button>
          ) : null}
        </div>
        <ServerForm
          key={formKey}
          action={async (state, formData) => {
            const result = await saveAction(state, formData);
            if (result.status === "success") {
              setEditing(null);
              router.refresh();
            }
            return result;
          }}
          className="space-y-4"
        >
          <input type="hidden" name="id" value={String(editing?.id ?? "")} />
          {fields.map((field) => (
            <div key={`${formKey}-${field.name}`}>
              <Label className="mb-2 block">{field.label}</Label>
              {field.type === "text" || field.type === "number" ? (
                <Input
                  name={field.name}
                  type={field.type === "number" ? "number" : "text"}
                  defaultValue={fieldValue(editing, field.name)}
                  className="border-white/10 bg-[#160021]"
                />
              ) : null}
              {field.type === "textarea" || field.type === "tags" ? (
                <Textarea
                  name={field.name}
                  defaultValue={fieldValue(editing, field.name)}
                  className="min-h-28 border-white/10 bg-[#160021]"
                />
              ) : null}
              {field.type === "image" ? (
                <ImageUpload name={field.name} defaultValue={fieldValue(editing, field.name)} />
              ) : null}
              {field.type === "switch" ? (
                <div className="rounded-xl border border-white/10 bg-[#160021] px-4 py-3">
                  <Switch name={field.name} defaultChecked={fieldChecked(editing, field.name)} />
                </div>
              ) : null}
            </div>
          ))}
          <Button type="submit" disabled={demoMode}>
            {editing ? "نوێکردنەوە" : "پاشەکەوت"}
          </Button>
        </ServerForm>
      </Card>
    </div>
  );
}
