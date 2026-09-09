export function calculateReadingTime(htmlOrText: string | null | undefined): number {
  if (!htmlOrText) return 1;
  const text = htmlOrText
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function isPostPubliclyVisible(post: {
  status: string;
  published_at?: string | null;
  deleted_at?: string | null;
}): boolean {
  if (post.deleted_at) return false;
  if (post.status === "published") return true;
  if (
    post.status === "scheduled" &&
    post.published_at &&
    new Date(post.published_at).getTime() <= Date.now()
  ) {
    return true;
  }
  return false;
}

export function buildShareUrls(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
  };
}
