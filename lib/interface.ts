import type { SanityImageSource } from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/react";

export interface simpleBlogCard {
  title: string;
  smallDescription: string;
  currentSlug: string;
  titleImage: SanityImageSource;
  _updatedAt: string;
}

export interface fullBlog {
  currentSlug: string;
  title: string;
  content: PortableTextBlock[];
  titleImage: SanityImageSource;
  _updatedAt: string;
}
