import type { SanityImageSource } from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/react";

export interface SimpleBlogCard {
  title: string;
  smallDescription: string;
  currentSlug: string;
  titleImage: SanityImageSource;
  _updatedAt: string;
}

export interface FullBlog {
  currentSlug: string;
  title: string;
  smallDescription: string;
  content: PortableTextBlock[];
  titleImage: SanityImageSource;
  _updatedAt: string;
}
