import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/date";
import { urlFor } from "@/lib/sanity";
import type { SimpleBlogCard } from "@/lib/types";

export default function BlogCard({ post }: { post: SimpleBlogCard }) {
  return (
    <Card>
      <Image
        src={urlFor(post.titleImage).width(500).height(500).url()}
        alt={post.title}
        width={500}
        height={500}
        sizes="(min-width: 640px) 50vw, 100vw"
        className="mx-auto h-50 rounded-t-lg object-cover"
      />

      <CardContent className="mt-5">
        <h3 className="line-clamp-2 text-lg font-bold" title={post.title}>
          {post.title}
        </h3>
        <p
          className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-300"
          title={post.smallDescription}
        >
          {post.smallDescription}
        </p>
        <p className="mt-2 text-right text-xs font-semibold text-gray-600 dark:text-gray-300">
          {formatDate(post._updatedAt, "MMM D, YYYY")}
        </p>
        <Button
          className="mt-7 w-full"
          render={<Link href={`/blog/${post.currentSlug}`} />}
          nativeButton={false}
        >
          Read More
        </Button>
      </CardContent>
    </Card>
  );
}