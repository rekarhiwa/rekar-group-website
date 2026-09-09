"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Token = { text: string; tone?: "muted" | "key" | "str" | "fn" | "cmt" };

const toneClass: Record<NonNullable<Token["tone"]>, string> = {
  muted: "text-white/35",
  key: "text-[#C878FF]",
  str: "text-[#E8D5FF]",
  fn: "text-white",
  cmt: "text-white/30",
};

type Snippet = {
  file: string;
  lines: Token[][];
};

const snippets: Snippet[] = [
  {
    file: "rekar · product.ts",
    lines: [
      [{ text: "// لە بیرۆکەوە تا بەرهەم", tone: "cmt" }],
      [
        { text: "const ", tone: "key" },
        { text: "product", tone: "fn" },
        { text: " = {", tone: "muted" },
      ],
      [
        { text: "  brand", tone: "fn" },
        { text: ": ", tone: "muted" },
        { text: '"ڕێکار گروپ"', tone: "str" },
        { text: ",", tone: "muted" },
      ],
      [
        { text: "  focus", tone: "fn" },
        { text: ": ", tone: "muted" },
        { text: '"وێب · ئەپ · سیستەم"', tone: "str" },
        { text: ",", tone: "muted" },
      ],
      [
        { text: "  ship", tone: "fn" },
        { text: ": ", tone: "muted" },
        { text: "(idea) => ", tone: "key" },
        { text: "build", tone: "fn" },
        { text: "(idea)", tone: "muted" },
      ],
      [{ text: "}", tone: "muted" }],
      [],
      [
        { text: "await ", tone: "key" },
        { text: "product", tone: "fn" },
        { text: ".ship(", tone: "muted" },
        { text: '"داهاتوو"', tone: "str" },
        { text: ")", tone: "muted" },
      ],
    ],
  },
  {
    file: "rekar · ads.ts",
    lines: [
      [{ text: "// سپۆنسەر و ڕیکلامی زیرەک", tone: "cmt" }],
      [
        { text: "export ", tone: "key" },
        { text: "async ", tone: "key" },
        { text: "function ", tone: "key" },
        { text: "placeAd", tone: "fn" },
        { text: "(campaign) {", tone: "muted" },
      ],
      [
        { text: "  const ", tone: "key" },
        { text: "slot", tone: "fn" },
        { text: " = ", tone: "muted" },
        { text: "inventory", tone: "fn" },
        { text: ".reserve(campaign)", tone: "muted" },
      ],
      [
        { text: "  return ", tone: "key" },
        { text: "ads", tone: "fn" },
        { text: ".sponsor.publish(slot)", tone: "muted" },
      ],
      [{ text: "}", tone: "muted" }],
      [],
      [
        { text: "placeAd", tone: "fn" },
        { text: "({ ", tone: "muted" },
        { text: "brand", tone: "fn" },
        { text: ": ", tone: "muted" },
        { text: '"ڕێکار"', tone: "str" },
        { text: ", ", tone: "muted" },
        { text: "reach", tone: "fn" },
        { text: ": ", tone: "muted" },
        { text: '"کوردستان"', tone: "str" },
        { text: " })", tone: "muted" },
      ],
    ],
  },
  {
    file: "rekar · app.tsx",
    lines: [
      [{ text: "// ڕووکارێک کە ئاسایی دەردەکەوێت", tone: "cmt" }],
      [
        { text: "export ", tone: "key" },
        { text: "function ", tone: "key" },
        { text: "Screen", tone: "fn" },
        { text: "() {", tone: "muted" },
      ],
      [
        { text: "  return ", tone: "key" },
        { text: "(", tone: "muted" },
      ],
      [
        { text: "    <", tone: "muted" },
        { text: "Hero", tone: "fn" },
        { text: " brand=", tone: "muted" },
        { text: '"ڕێکار"', tone: "str" },
        { text: " />", tone: "muted" },
      ],
      [
        { text: "    <", tone: "muted" },
        { text: "Flow", tone: "fn" },
        { text: " from=", tone: "muted" },
        { text: '"بیرۆکە"', tone: "str" },
        { text: " to=", tone: "muted" },
        { text: '"بڵاوکردنەوە"', tone: "str" },
        { text: " />", tone: "muted" },
      ],
      [
        { text: "  )", tone: "muted" },
      ],
      [{ text: "}", tone: "muted" }],
    ],
  },
  {
    file: "rekar · design.ts",
    lines: [
      [{ text: "// سیستەمی براند، نەک تەنها ڕازاندنەوە", tone: "cmt" }],
      [
        { text: "const ", tone: "key" },
        { text: "theme", tone: "fn" },
        { text: " = {", tone: "muted" },
      ],
      [
        { text: "  ink", tone: "fn" },
        { text: ": ", tone: "muted" },
        { text: '"#FBF7FF"', tone: "str" },
        { text: ",", tone: "muted" },
      ],
      [
        { text: "  void", tone: "fn" },
        { text: ": ", tone: "muted" },
        { text: '"#100018"', tone: "str" },
        { text: ",", tone: "muted" },
      ],
      [
        { text: "  signal", tone: "fn" },
        { text: ": ", tone: "muted" },
        { text: '"#7B00C8"', tone: "str" },
      ],
      [{ text: "}", tone: "muted" }],
      [],
      [
        { text: "apply", tone: "fn" },
        { text: "(theme).", tone: "muted" },
        { text: "everywhere", tone: "fn" },
        { text: "()", tone: "muted" },
      ],
    ],
  },
  {
    file: "rekar · deploy.sh",
    lines: [
      [{ text: "# لە لۆکاڵەوە بۆ لایڤ", tone: "cmt" }],
      [
        { text: "pnpm ", tone: "key" },
        { text: "build", tone: "fn" },
      ],
      [
        { text: "pnpm ", tone: "key" },
        { text: "test", tone: "fn" },
      ],
      [
        { text: "vercel ", tone: "key" },
        { text: "deploy ", tone: "fn" },
        { text: "--prod", tone: "str" },
      ],
      [],
      [
        { text: 'echo "', tone: "muted" },
        { text: "بڵاوکرایەوە ✓", tone: "str" },
        { text: '"', tone: "muted" },
      ],
    ],
  },
];

/** Tallest snippet wins — notepad height stays locked so it never jumps. */
const maxSnippetLines = Math.max(...snippets.map((s) => s.lines.length));
const LINE_H_PX = 32; // matches sm:leading-8
const notepadBodyStyle = {
  height: `${maxSnippetLines * LINE_H_PX}px`,
} as const;

export function CodeStage() {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const snippet = snippets[snippetIndex % snippets.length];

  const lines = useMemo(
    () =>
      snippet.lines.map((tokens) => ({
        tokens,
        full: tokens.map((t) => t.text).join(""),
      })),
    [snippet]
  );

  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const done = lineIndex >= lines.length;

  useEffect(() => {
    setLineIndex(0);
    setCharIndex(0);
  }, [snippetIndex]);

  useEffect(() => {
    if (done) {
      const timer = window.setTimeout(() => {
        setSnippetIndex((i) => (i + 1) % snippets.length);
      }, 1400);
      return () => window.clearTimeout(timer);
    }

    const current = lines[lineIndex];
    if (!current) return;

    if (charIndex < current.full.length) {
      const timer = window.setTimeout(() => setCharIndex((c) => c + 1), 20);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setLineIndex((i) => i + 1);
      setCharIndex(0);
    }, 160);
    return () => window.clearTimeout(timer);
  }, [lineIndex, charIndex, lines, done]);

  const slots = Array.from({ length: maxSnippetLines }, (_, i) => lines[i] ?? null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0B0014]"
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#7B00C8]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-[#9A24F0]/15 blur-3xl" />

      <div className="relative flex items-center gap-2 border-b border-white/[0.06] px-5 py-3.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ms-3 font-mono text-xs text-white/35">{snippet.file}</span>
      </div>

      <div className="relative overflow-x-auto px-5 py-6 sm:px-7 sm:py-8" dir="ltr">
        <pre
          className="min-w-[340px] overflow-hidden font-mono text-[13px] leading-7 sm:text-[14px] sm:leading-8"
          style={notepadBodyStyle}
        >
          {slots.map((row, rowIndex) => {
            if (!row) {
              return (
                <div key={`pad-${rowIndex}`} className="flex h-8">
                  <span className="w-8 shrink-0 select-none text-transparent">{rowIndex + 1}</span>
                </div>
              );
            }

            const fullyTyped = done || rowIndex < lineIndex;
            if (!fullyTyped && rowIndex > lineIndex) {
              return (
                <div key={rowIndex} className="flex h-8">
                  <span className="w-8 shrink-0 select-none text-white/20">{rowIndex + 1}</span>
                </div>
              );
            }

            const shown = fullyTyped
              ? row.full.length
              : rowIndex === lineIndex
                ? charIndex
                : 0;

            let eaten = 0;
            return (
              <div key={`${snippet.file}-${rowIndex}`} className="flex h-8">
                <span className="w-8 shrink-0 select-none text-white/20">{rowIndex + 1}</span>
                <code>
                  {row.tokens.map((token, tokenIndex) => {
                    const start = eaten;
                    eaten += token.text.length;
                    if (shown <= start) return null;
                    const slice = token.text.slice(0, Math.max(0, shown - start));
                    return (
                      <span key={tokenIndex} className={toneClass[token.tone || "fn"]}>
                        {slice}
                      </span>
                    );
                  })}
                  {rowIndex === lineIndex && !done ? (
                    <span className="ms-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.15em] bg-[#C878FF] align-middle animate-pulse" />
                  ) : null}
                  {done && rowIndex === lines.length - 1 ? (
                    <span className="ms-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.15em] bg-[#C878FF] align-middle animate-pulse" />
                  ) : null}
                </code>
              </div>
            );
          })}
        </pre>
      </div>
    </motion.div>
  );
}
