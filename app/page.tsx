import BlogCard from "@/components/BlogCard";
import { getAllPosts } from "@/lib/blog";
import type { SimpleBlogCard } from "@/lib/types";

export const revalidate = 600;

export default async function Home() {
  const data: SimpleBlogCard[] = await getAllPosts();

  if (data.length === 0) {
    return (
      <div className="my-6 text-center text-muted-foreground">
        No posts yet. Check back soon.
      </div>
    );
  }

  return (
    <div className="my-6 grid gap-5 sm:grid-cols-2">
      {data.map((post) => (
        <BlogCard key={post.currentSlug} post={post} />
      ))}
    </div>
  );
}
