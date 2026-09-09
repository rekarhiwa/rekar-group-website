"use client";

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
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <DataTable
        title={title}
        rows={items}
        columns={[
          {
            key: "name",
            header: "Item",
            render: (row) => (
              <div>
                <p className="font-medium text-white">
                  {String(row.title ?? row.name ?? row.label ?? row.value ?? "Untitled")}
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
            header: "Meta",
            render: (row) => (
              <div className="space-y-1 text-xs text-muted">
                {"status" in row ? <p>Status: {String(row.status ?? "-")}</p> : null}
                {"sort_order" in row ? <p>Order: {String(row.sort_order ?? "-")}</p> : null}
                {"visible" in row ? <p>Visible: {String(Boolean(row.visible))}</p> : null}
              </div>
            ),
          },
          {
            key: "action",
            header: "Action",
            render: (row) => (
              <ActionButton
                variant="destructive"
                action={() => deleteAction(String(row.id ?? ""))}
                className="h-9"
              >
                Delete
              </ActionButton>
            ),
          },
        ]}
      />

      <Card className="border-white/10 bg-white/[0.03] p-6">
        <div className="mb-5">
          <h3 className="text-xl font-semibold text-white">New {title}</h3>
          <p className="text-sm text-muted">{description}</p>
        </div>
        <ServerForm action={saveAction} className="space-y-4">
          <input type="hidden" name="id" value="" />
          {fields.map((field) => (
            <div key={field.name}>
              <Label className="mb-2 block">{field.label}</Label>
              {field.type === "text" || field.type === "number" ? (
                <Input
                  name={field.name}
                  type={field.type === "number" ? "number" : "text"}
                  className="border-white/10 bg-[#160021]"
                />
              ) : null}
              {field.type === "textarea" || field.type === "tags" ? (
                <Textarea
                  name={field.name}
                  className="min-h-28 border-white/10 bg-[#160021]"
                />
              ) : null}
              {field.type === "image" ? <ImageUpload name={field.name} /> : null}
              {field.type === "switch" ? (
                <div className="rounded-xl border border-white/10 bg-[#160021] px-4 py-3">
                  <Switch name={field.name} />
                </div>
              ) : null}
            </div>
          ))}
          <Button type="submit" disabled={demoMode}>
            Save
          </Button>
        </ServerForm>
      </Card>
    </div>
  );
}
