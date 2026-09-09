"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { uploadEditorImageAction } from "@/app/admin/actions/posts";
import { cn } from "@/lib/utils";
import "./post-editor-styles.css";

type PostRichEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,
  parseHTML() {
    return [
      { tag: 'div[data-type="callout"]' },
      { tag: "div.callout" },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "callout",
        "data-type": "callout",
      }),
      0,
    ];
  },
});

const Gallery = Node.create({
  name: "gallery",
  group: "block",
  content: "image+",
  defining: true,
  isolating: true,
  parseHTML() {
    return [
      { tag: 'div[data-type="gallery"]' },
      { tag: "div.gallery" },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "gallery",
        "data-type": "gallery",
      }),
      0,
    ];
  },
});

const Figcaption = Node.create({
  name: "figcaption",
  content: "inline*",
  defining: true,
  parseHTML() {
    return [{ tag: "figcaption" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["figcaption", mergeAttributes(HTMLAttributes), 0];
  },
});

const Figure = Node.create({
  name: "figure",
  group: "block",
  content: "image figcaption?",
  defining: true,
  isolating: true,
  parseHTML() {
    return [{ tag: "figure" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["figure", mergeAttributes(HTMLAttributes), 0];
  },
});

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-lg border px-2.5 py-1.5 text-xs transition",
        active
          ? "border-violet-400/50 bg-violet-500/25 text-white"
          : "border-white/10 bg-transparent text-white/70 hover:border-white/20 hover:text-white",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {label}
    </button>
  );
}

async function uploadFile(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  const result = await uploadEditorImageAction(formData);
  if (!result.ok || !result.url) {
    window.alert(result.error || "Upload failed");
    return null;
  }
  return result.url;
}

function collectImageFiles(list: FileList | File[] | null | undefined): File[] {
  if (!list) return [];
  return Array.from(list).filter((file) => file.type.startsWith("image/"));
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function PostRichEditor({
  value,
  onChange,
  placeholder = "ناوەڕۆکی پۆست بنووسە...",
}: PostRichEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [, setTick] = useState(0);
  const onChangeRef = useRef(onChange);
  const uploadingRef = useRef(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const insertUploadedImagesRef = useRef<
    (
      files: File[],
      mode: "figure" | "gallery" | "inline",
      viewPos?: number | null,
    ) => Promise<void>
  >(async () => undefined);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const setUploadingSafe = useCallback((next: boolean) => {
    uploadingRef.current = next;
    setUploading(next);
  }, []);

  const insertUploadedImages = useCallback(
    async (
      files: File[],
      mode: "figure" | "gallery" | "inline",
      viewPos?: number | null,
    ) => {
      const currentEditor = editorRef.current;
      if (!currentEditor || !files.length || uploadingRef.current) return;

      setUploadingSafe(true);
      try {
        const urls: string[] = [];
        for (const file of files) {
          const url = await uploadFile(file);
          if (url) urls.push(url);
        }
        if (!urls.length) return;

        if (typeof viewPos === "number") {
          currentEditor.chain().focus().setTextSelection(viewPos).run();
        }

        if (mode === "gallery" || (mode === "inline" && urls.length > 1)) {
          const imgs = urls
            .map((src) => `<img src="${escapeAttr(src)}" alt="" />`)
            .join("");
          currentEditor
            .chain()
            .focus()
            .insertContent(
              `<div class="gallery" data-type="gallery">${imgs}</div>`,
            )
            .run();
          return;
        }

        const src = urls[0];
        if (mode === "figure") {
          currentEditor
            .chain()
            .focus()
            .insertContent(
              `<figure><img src="${escapeAttr(src)}" alt="" /><figcaption>Caption</figcaption></figure>`,
            )
            .run();
          return;
        }

        currentEditor.chain().focus().setImage({ src }).run();
      } finally {
        setUploadingSafe(false);
      }
    },
    [setUploadingSafe],
  );

  useEffect(() => {
    insertUploadedImagesRef.current = insertUploadedImages;
  }, [insertUploadedImages]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: false,
        underline: false,
        horizontalRule: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
        },
      }),
      Image.configure({ allowBase64: false }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        controls: true,
        nocookie: true,
        width: 640,
        height: 360,
      }),
      HorizontalRule,
      Callout,
      Gallery,
      Figure,
      Figcaption,
    ],
    content: value || "",
    onUpdate: ({ editor: current }) => {
      onChangeRef.current(current.getHTML());
      setTick((n) => n + 1);
    },
    onSelectionUpdate: () => setTick((n) => n + 1),
    editorProps: {
      attributes: {
        class:
          "post-editor-prose min-h-[320px] px-4 py-3 text-sm text-white leading-relaxed focus:outline-none",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;
        const files = collectImageFiles(event.dataTransfer?.files);
        if (!files.length) return false;
        event.preventDefault();
        const coords = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });
        void insertUploadedImagesRef.current(
          files,
          files.length > 1 ? "gallery" : "figure",
          coords?.pos ?? null,
        );
        return true;
      },
      handlePaste: (_view, event) => {
        const files = collectImageFiles(event.clipboardData?.files);
        if (!files.length) return false;
        event.preventDefault();
        void insertUploadedImagesRef.current(
          files,
          files.length > 1 ? "gallery" : "figure",
        );
        return true;
      },
    },
  });

  editorRef.current = editor;

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "";
    if (next === current) return;
    if (next === "" && (current === "<p></p>" || current === "")) return;
    editor.commands.setContent(next, { emitUpdate: false });
  }, [value, editor]);

  const busy = uploading || !editor;

  return (
    <div className="post-rich-editor space-y-3">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const files = collectImageFiles(event.target.files);
          event.target.value = "";
          void insertUploadedImages(files, "figure");
        }}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          const files = collectImageFiles(event.target.files);
          event.target.value = "";
          void insertUploadedImages(files, "gallery");
        }}
      />

      <div className="flex flex-wrap gap-1.5 rounded-2xl border border-white/10 bg-[#160021]/80 p-2">
        <ToolbarButton
          label="P"
          active={editor?.isActive("paragraph")}
          disabled={busy}
          onClick={() => editor?.chain().focus().setParagraph().run()}
        />
        <ToolbarButton
          label="H2"
          active={editor?.isActive("heading", { level: 2 })}
          disabled={busy}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        />
        <ToolbarButton
          label="H3"
          active={editor?.isActive("heading", { level: 3 })}
          disabled={busy}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
        />
        <ToolbarButton
          label="H4"
          active={editor?.isActive("heading", { level: 4 })}
          disabled={busy}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 4 }).run()
          }
        />
        <ToolbarButton
          label="Bold"
          active={editor?.isActive("bold")}
          disabled={busy}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="Italic"
          active={editor?.isActive("italic")}
          disabled={busy}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="Underline"
          active={editor?.isActive("underline")}
          disabled={busy}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        />
        <ToolbarButton
          label="Link"
          active={editor?.isActive("link")}
          disabled={busy}
          onClick={() => {
            if (!editor) return;
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
              return;
            }
            const previous = editor.getAttributes("link").href as
              | string
              | undefined;
            const url = window.prompt("Link URL", previous || "https://");
            if (!url) return;
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
        />
        <ToolbarButton
          label="Bullet"
          active={editor?.isActive("bulletList")}
          disabled={busy}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="Numbered"
          active={editor?.isActive("orderedList")}
          disabled={busy}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          label="Quote"
          active={editor?.isActive("blockquote")}
          disabled={busy}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          label="Code"
          active={editor?.isActive("codeBlock")}
          disabled={busy}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        />
        <ToolbarButton
          label="Image"
          disabled={busy}
          onClick={() => imageInputRef.current?.click()}
        />
        <ToolbarButton
          label="Gallery"
          active={editor?.isActive("gallery")}
          disabled={busy}
          onClick={() => galleryInputRef.current?.click()}
        />
        <ToolbarButton
          label="Video"
          active={editor?.isActive("youtube")}
          disabled={busy}
          onClick={() => {
            const url = window.prompt(
              "YouTube URL",
              "https://www.youtube.com/watch?v=",
            );
            if (!url) return;
            editor?.chain().focus().setYoutubeVideo({ src: url }).run();
          }}
        />
        <ToolbarButton
          label="Table"
          active={editor?.isActive("table")}
          disabled={busy}
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        />
        <ToolbarButton
          label="Divider"
          disabled={busy}
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        />
        <ToolbarButton
          label="Callout"
          active={editor?.isActive("callout")}
          disabled={busy}
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .insertContent(
                `<div class="callout" data-type="callout"><p>Callout text</p></div>`,
              )
              .run()
          }
        />
        <ToolbarButton
          label="Button"
          disabled={busy}
          onClick={() => {
            const href =
              window.prompt("Button URL", "https://") || "https://";
            const label =
              window.prompt("Button label", "Button") || "Button";
            editor
              ?.chain()
              .focus()
              .insertContent(
                `<p><a class="editor-button" href="${escapeAttr(href)}">${escapeAttr(label)}</a></p>`,
              )
              .run();
          }}
        />
      </div>

      {uploading ? (
        <p className="text-xs text-violet-300/90">Uploading image…</p>
      ) : null}

      <div className="rounded-2xl border border-white/10 bg-[#160021]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
