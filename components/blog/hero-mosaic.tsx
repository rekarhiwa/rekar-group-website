import { FeaturedTile } from "@/components/blog/featured-tile";
import type { Post } from "@/types/database";

export function HeroMosaic({ posts }: { posts: Post[] }) {
  const [featured, ...rest] = posts;
  const side = rest.slice(0, 2);

  if (!featured) return null;

  return (
    <div className="grid gap-3 lg:h-[28rem] lg:grid-cols-3 lg:grid-rows-2">
      <FeaturedTile
        post={featured}
        className="min-h-64 lg:col-span-2 lg:row-span-2 lg:min-h-0"
        titleClassName="text-xl sm:text-3xl"
      />
      {side.map((post) => (
        <FeaturedTile
          key={post.id}
          post={post}
          className="min-h-40 lg:min-h-0"
          titleClassName="text-base sm:text-lg"
        />
      ))}
    </div>
  );
}
