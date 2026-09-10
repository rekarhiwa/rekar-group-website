"use client";

import { useEffect, useState } from "react";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";

const toolbarButtons = [
  { label: "B", action: "bold" },
  { label: "I", action: "italic" },
  { label: "H2", action: "heading" },
  { label: "UL", action: "bulletList" },
  { label: "OL", action: "orderedList" },
  { label: "دەق", action: "blockquote" },
  { label: "کۆد", action: "codeBlock" },
] as const;

export function RichEditor({
  name,
  defaultValue = "",
  placeholder = "لێرە بنووسە...",
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  const [html, setHtml] = useState(defaultValue);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    immediatelyRender: false,
    content: defaultValue,
    onUpdate: ({ editor: currentEditor }) => {
      setHtml(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[260px] rounded-2xl border border-white/10 bg-[#160021] px-4 py-3 text-sm text-white outline-none prose prose-invert max-w-none",
      },
    },
  });

  useEffect(() => {
    if (!editor || editor.getHTML() === defaultValue) return;
    editor.commands.setContent(defaultValue || "<p></p>");
  }, [defaultValue, editor]);

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={html} readOnly />
      <div className="flex flex-wrap gap-2">
        {toolbarButtons.map((button) => (
          <button
            key={button.action}
            type="button"
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-muted transition hover:text-white"
            onClick={() => {
              if (!editor) return;
              switch (button.action) {
                case "bold":
                  editor.chain().focus().toggleBold().run();
                  break;
                case "italic":
                  editor.chain().focus().toggleItalic().run();
                  break;
                case "heading":
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                  break;
                case "bulletList":
                  editor.chain().focus().toggleBulletList().run();
                  break;
                case "orderedList":
                  editor.chain().focus().toggleOrderedList().run();
                  break;
                case "blockquote":
                  editor.chain().focus().toggleBlockquote().run();
                  break;
                case "codeBlock":
                  editor.chain().focus().toggleCodeBlock().run();
                  break;
              }
            }}
          >
            {button.label}
          </button>
        ))}
        <button
          type="button"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-muted transition hover:text-white"
          onClick={() => {
            const url = window.prompt("بەستەری وێنە");
            if (url) editor?.chain().focus().setImage({ src: url }).run();
          }}
        >
          وێنە
        </button>
        <button
          type="button"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-muted transition hover:text-white"
          onClick={() => {
            const url = window.prompt("بەستەری لینک");
            if (url) editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
        >
          بەستەر
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
