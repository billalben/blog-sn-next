# Next.js + Sanity Blog

A modern, server-rendered blog powered by **Next.js 16** and **Sanity Studio v6**, styled with **Tailwind CSS v4** and **Base UI** (shadcn/ui). The front end is statically generated with ISR for speed, while Sanity Studio — managed as a pnpm workspace member — provides the headless CMS.

![Next.js](https://img.shields.io/badge/Next.js%2016-black?logo=next.js&logoColor=white)
![Sanity](https://img.shields.io/badge/Sanity%20v6-F03E2F?logo=sanity&logoColor=white)
![React 19](https://img.shields.io/badge/React%2019-61DAFB?logo=react&logoColor=black)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS%20v4-06B6D4?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)

## Features

- **Blog listing (`/`)** — statically generated with ISR, revalidating every 10 minutes.
- **Post pages (`/blog/[slug]`)** — prerendered at build time via `generateStaticParams`, also revalidating every 10 minutes.
- **Real metadata** — `generateMetadata` fetches the actual post title/description for each article.
- **404 handling** — requests for unknown slugs return a proper 404 page.
- **Dark mode** — light/dark/system theme switcher via `next-themes`.
- **Typed data access** — all GROQ queries are typed and centralized in `lib/blog.ts`, with parameters passed safely to prevent query injection.
- **Portable text** — rich article content rendered with `@portabletext/react`.
- **Sanity Studio in-repo** — the CMS lives in `sanity/` as a pnpm workspace member, sharing one lockfile.

## Tech Stack

| Technology                     | Role                                                            |
| ------------------------------ | --------------------------------------------------------------- |
| [Next.js 16](https://nextjs.org) | App Router, static generation (SSG) with ISR, Turbopack       |
| [React 19](https://react.dev)   | UI runtime                                                     |
| [Sanity Studio v6](https://www.sanity.io) | Headless CMS, schema and content management           |
| [next-sanity](https://github.com/sanity-io/next-sanity) | Sanity client + typed GROQ queries         |
| [Tailwind CSS v4](https://tailwindcss.com) | CSS-first styling (`@theme inline`)                   |
| [shadcn/ui](https://ui.shadcn.com) | Base UI components (`button`, `card`, `dropdown-menu`)       |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark mode theming        |
| [dayjs](https://day.js.org)     | Date formatting                                               |
| [pnpm](https://pnpm.io)         | Workspace package manager                                     |

## Getting Started

### Prerequisites

- Node.js 20.9+ (project built on v24)
- [pnpm](https://pnpm.io/installation)

### Install

```bash
pnpm install
```

### Environment Variables

Create a `.env.local` file at the project root:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

You can find your project ID in `sanity/sanity.config.ts` (or the Sanity dashboard). The `NEXT_PUBLIC_` prefix is intentional — these values are public and available in both server and client code.

### Run the blog

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run the Sanity Studio

```bash
pnpm studio
```

Open [http://localhost:3333](http://localhost:3333). The studio is a pnpm workspace member, so it shares the same lockfile and `node_modules` as the app.

## Scripts

| Command       | Description                             |
| ------------- | --------------------------------------- |
| `pnpm dev`    | Start the Next.js dev server            |
| `pnpm build`  | Production build (static + ISR)         |
| `pnpm start`  | Serve the production build              |
| `pnpm lint`   | Run ESLint (flat config)                |
| `pnpm studio` | Run the Sanity Studio dev server        |

## Project Structure

```
.
├── app/
│   ├── layout.tsx          # Root layout, theme provider, navbar
│   ├── page.tsx            # Blog listing (ISR, revalidates every 10 min)
│   ├── globals.css         # Tailwind v4 + shadcn theme tokens
│   └── blog/[slug]/
│       └── page.tsx        # Post detail (SSG via generateStaticParams, real metadata)
├── components/
│   ├── BlogCard.tsx        # Reusable post card
│   ├── Navbar.tsx
│   ├── ModeToggle.tsx      # Light/dark/system theme switcher
│   ├── theme-provider.tsx
│   └── ui/                 # Base UI shadcn components (button, card, dropdown-menu)
├── lib/
│   ├── sanity.ts           # Sanity client + image URL builder
│   ├── blog.ts             # Typed GROQ fetchers (getAllPosts, getPostBySlug, getAllSlugs)
│   ├── types.ts            # SimpleBlogCard / FullBlog types
│   ├── date.ts             # formatDate() helper
│   └── utils.ts            # cn() class-merge helper
└── sanity/                 # Sanity Studio (workspace package: my-blog)
    ├── sanity.config.ts
    ├── sanity.cli.ts
    └── schemaTypes/        # Blog document schema
```

## Content Model & Data Flow

**Schema** — a single `blog` document type (`sanity/schemaTypes/blog.ts`) with:

- `title` (string)
- `slug` (slug, generated from the title)
- `titleImage` (image)
- `smallDescription` (text)
- `content` (portable-text blocks)

**Rendering** — GROQ queries in `lib/blog.ts` are typed and parameterized:

- `getAllPosts()` powers the home listing.
- `getPostBySlug(slug)` powers the detail page and `generateMetadata`.
- `getAllSlugs()` feeds `generateStaticParams` to prerender every post at build time.

Both the listing and detail pages set `export const revalidate = 600`, so ISR refreshes content every 10 minutes without a rebuild. Sanity images are served from `cdn.sanity.io` via the `urlFor()` helper.

## Deployment

Deploy to [Vercel](https://vercel.com) by connecting the repository:

1. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in the Vercel project settings.
2. Push to your default branch (or create a preview deployment).

The `sanity/` directory is excluded from the deployment via `.vercelignore`.