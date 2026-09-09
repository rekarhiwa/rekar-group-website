"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle, Send, Share2 } from "lucide-react";
import { buildShareUrls } from "@/lib/posts/utils";
import { Button } from "@/components/ui/button";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const shares = buildShareUrls(url, title);
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted">هاوبەشکردن:</span>
      <Button asChild size="sm" variant="outline">
        <a href={shares.facebook} target="_blank" rel="noreferrer">
          <Share2 className="h-4 w-4" />
          Facebook
        </a>
      </Button>
      <Button asChild size="sm" variant="outline">
        <a href={shares.telegram} target="_blank" rel="noreferrer">
          <Send className="h-4 w-4" />
          Telegram
        </a>
      </Button>
      <Button asChild size="sm" variant="outline">
        <a href={shares.whatsapp} target="_blank" rel="noreferrer">
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </Button>
      <Button asChild size="sm" variant="outline">
        <a href={shares.x} target="_blank" rel="noreferrer">
          X
        </a>
      </Button>
      <Button size="sm" variant="secondary" type="button" onClick={copyLink}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "کۆپی کرا" : "Copy Link"}
      </Button>
    </div>
  );
}
