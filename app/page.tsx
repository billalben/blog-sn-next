import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { simpleBlogCard } from "../lib/interface";
import { client, urlFor } from "../lib/sanity";

export const revalidate = 600; // relevant for ISR 10 minutes

async function getData() {
  const query = `*[_type == "blog"] | order(_createdAt desc) {
    title,
    smallDescription,
    "currentSlug": slug.current,
    titleImage,
    _updatedAt
  }`;

  const data = await client.fetch(query);
  return data;
}

export default async function Home() {
  const data: simpleBlogCard[] = await getData();

  return (
    <div className="my-6 grid gap-5 sm:grid-cols-2">
      {data.map((post, idx) => (
        <Card key={idx}>
          <Image
            src={urlFor(post.titleImage).url()}
            alt={post.title}
            width={500}
            height={500}
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
              {dayjs(post._updatedAt).format("MMM D, YYYY")}
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
      ))}
    </div>
  );
}
