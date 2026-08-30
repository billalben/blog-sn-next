import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { formatDate } from "@/lib/date";
import { urlFor } from "@/lib/sanity";
import type { FullBlog } from "@/lib/types";

export const revalidate = 600;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const titleFromSlug = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const title = post?.title ?? titleFromSlug;
  const description = post?.smallDescription ?? title;

  return {
    title,
    description,
  };
}

export default async function BlogArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data: FullBlog | null = await getPostBySlug(slug);

  if (!data) {
    notFound();
  }

  return (
    <div className="mt-6 md:mt-8">
      <h1>
        <span className="block text-center text-base font-semibold uppercase tracking-wide text-primary">
          Billal Benz - Blog
        </span>
        <span className="mt-2 block text-center text-3xl font-bold leading-8 tracking-tight sm:text-4xl">
          {data.title}
        </span>
      </h1>

      <Image
        src={urlFor(data.titleImage).width(800).height(800).url()}
        width={800}
        height={800}
        sizes="(min-width: 768px) 800px, 100vw"
        alt="Title Image"
        priority
        className="mt-6 md:mt-8 rounded-lg border mx-auto"
      />

      <p className="mt-6 md:mt-8 text-center text-gray-600 dark:text-gray-300">
        {formatDate(data._updatedAt, "ddd, MMM D, YYYY h:mm A")}
      </p>

      <div className="prose prose-blue prose-md sm:prose-lg dark:prose-invert prose-li:marker:text-primary prose-a:text-primary my-10">
        <PortableText value={data.content} />
      </div>
    </div>
  );
}
