"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const blockTypes = [
  "heading",
  "text",
  "rich_text",
  "image",
  "image_text",
  "gallery",
  "button",
  "cta",
  "faq",
  "stats",
  "features",
  "video",
  "spacer",
  "custom_html",
];

type BlockItem = {
  type: string;
  sort_order: number;
  visible: boolean;
  content: Record<string, unknown>;
};

export function PageBlocksEditor({
  name,
  defaultValue = "[]",
}: {
  name: string;
  defaultValue?: string;
}) {
  const initial = useMemo(() => {
    try {
      const parsed = JSON.parse(defaultValue);
      return Array.isArray(parsed) ? (parsed as BlockItem[]) : [];
    } catch {
      return [];
    }
  }, [defaultValue]);

  const [blocks, setBlocks] = useState<BlockItem[]>(
    initial.length
      ? initial
      : [{ type: "heading", sort_order: 1, visible: true, content: { text: "بلۆکی نوێ" } }]
  );

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(blocks)} readOnly />
      {blocks.map((block, index) => (
        <div key={`${block.type}-${index}`} className="rounded-2xl border border-white/10 bg-[#160021] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <select
              value={block.type}
              onChange={(event) =>
                setBlocks((current) =>
                  current.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, type: event.target.value } : item
                  )
                )
              }
              className="h-10 rounded-xl border border-white/10 bg-[#14001f] px-3 text-sm text-white"
            >
              {blockTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted">دیار</span>
              <Switch
                checked={block.visible}
                onCheckedChange={(checked) =>
                  setBlocks((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, visible: checked } : item
                    )
                  )
                }
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setBlocks((current) => current.filter((_, itemIndex) => itemIndex !== index))
                }
              >
                لابردن
              </Button>
            </div>
          </div>
          <Input
            value={String(block.content.title ?? block.content.text ?? "")}
            onChange={(event) =>
              setBlocks((current) =>
                current.map((item, itemIndex) =>
                  itemIndex === index
                    ? {
                        ...item,
                        sort_order: itemIndex + 1,
                        content: { ...item.content, text: event.target.value, title: event.target.value },
                      }
                    : item
                )
              )
            }
            placeholder="ناونیشانی بلۆک"
            className="mb-3 border-white/10 bg-[#14001f]"
          />
          <Textarea
            value={String(block.content.body ?? block.content.html ?? "")}
            onChange={(event) =>
              setBlocks((current) =>
                current.map((item, itemIndex) =>
                  itemIndex === index
                    ? {
                        ...item,
                        sort_order: itemIndex + 1,
                        content: { ...item.content, body: event.target.value, html: event.target.value },
                      }
                    : item
                )
              )
            }
            placeholder="ناوەڕۆکی بلۆک"
            className="min-h-28 border-white/10 bg-[#14001f]"
          />
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() =>
          setBlocks((current) => [
            ...current,
            {
              type: "text",
              sort_order: current.length + 1,
              visible: true,
              content: { text: "بلۆکی نوێ" },
            },
          ])
        }
      >
        زیادکردنی بلۆک
      </Button>
    </div>
  );
}
