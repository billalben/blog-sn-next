import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import type { FullBlog, SimpleBlogCard } from "@/lib/types";

const blogPostsQuery = groq`*[_type == "blog"] | order(_createdAt desc) {
  title,
  smallDescription,
  "currentSlug": slug.current,
  titleImage,
  _updatedAt
}`;

const blogBySlugQuery = groq`*[_type == "blog" && slug.current == $slug] {
  "currentSlug": slug.current,
  title,
  smallDescription,
  content,
  titleImage,
  _updatedAt
}[0]`;

const blogSlugsQuery = groq`*[_type == "blog" && defined(slug.current)] {
  "slug": slug.current
}`;

export async function getAllPosts(): Promise<SimpleBlogCard[]> {
  return client.fetch<SimpleBlogCard[]>(blogPostsQuery);
}

export async function getPostBySlug(slug: string): Promise<FullBlog | null> {
  return client.fetch<FullBlog | null>(blogBySlugQuery, { slug });
}

export async function getAllSlugs(): Promise<{ slug: string }[]> {
  return client.fetch<{ slug: string }[]>(blogSlugsQuery);
}
