"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionButton } from "@/components/admin/action-button";
import type { ContactMessage } from "@/types/database";

export function MessageManager({
  items,
  updateAction,
  deleteAction,
}: {
  items: ContactMessage[];
  updateAction: (args: {
    id: string;
    patch: { is_read?: boolean; is_important?: boolean; is_archived?: boolean };
  }) => Promise<{ status: string; message: string }>;
  deleteAction: (id: string) => Promise<{ status: string; message: string }>;
}) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-white">{item.full_name}</h3>
                {!item.is_read ? <Badge>نەخوێندراو</Badge> : null}
                {item.is_important ? <Badge variant="warning">گرنگ</Badge> : null}
                {item.is_archived ? <Badge variant="outline">ئەرشیفکراو</Badge> : null}
              </div>
              <p className="text-sm text-muted">
                {item.company ?? "بێ کۆمپانیا"} - {item.email ?? "بێ ئیمەیڵ"} - {item.phone ?? "بێ تەلەفۆن"}
              </p>
              <p className="rounded-2xl bg-black/20 p-4 text-sm leading-7 text-foreground">
                {item.message}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <ActionButton
                action={() =>
                  updateAction({ id: item.id, patch: { is_read: !item.is_read } })
                }
                variant="secondary"
              >
                {item.is_read ? "نیشانەکردن وەک نەخوێندراو" : "نیشانەکردن وەک خوێندراو"}
              </ActionButton>
              <ActionButton
                action={() =>
                  updateAction({
                    id: item.id,
                    patch: { is_important: !item.is_important },
                  })
                }
                variant="outline"
              >
                {item.is_important ? "لابردنی ئەستێرە" : "ئەستێرە"}
              </ActionButton>
              <ActionButton
                action={() =>
                  updateAction({
                    id: item.id,
                    patch: { is_archived: !item.is_archived },
                  })
                }
                variant="outline"
              >
                {item.is_archived ? "دەرهێنان لە ئەرشیف" : "ئەرشیف"}
              </ActionButton>
              <ActionButton
                action={() => deleteAction(item.id)}
                variant="destructive"
                className="disabled:opacity-60"
              >
                سڕینەوە
              </ActionButton>
            </div>
          </div>
        </Card>
      ))}
      {!items.length ? (
        <Card className="border-white/10 bg-white/[0.03] p-10 text-center text-muted">
          هێشتا هیچ نامەیەک نییە.
        </Card>
      ) : null}
    </div>
  );
}
