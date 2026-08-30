# Next.js + Sanity Blog

A modern blog built with **Next.js 16** (App Router), **Sanity Studio v6**, **Tailwind CSS v4**, and **Base UI** (shadcn/ui). Features a dark-mode toggle, ISR-based static rendering, and typed Sanity data access.

## Tech Stack

- [Next.js 16](https://nextjs.org) — App Router, static generation (SSG) with ISR, Turbopack
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com) — CSS-first configuration (`@theme inline`)
- [shadcn/ui](https://ui.shadcn.com) — Base UI components (`button`, `card`, `dropdown-menu`)
- [Sanity Studio v6](https://www.sanity.io) — headless CMS + schema, managed as a pnpm workspace member
- [next-sanity](https://github.com/sanity-io/next-sanity) — typed GROQ queries and image URL builder
- [next-themes](https://github.com/pacocoursey/next-themes) — dark mode
- [pnpm](https://pnpm.io) — workspace package manager

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
│   └── date.ts             # formatDate() helper
└── sanity/                 # Sanity Studio (workspace package: my-blog)
    ├── sanity.config.ts
    └── schemaTypes/        # Blog document schema
```

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

You can find your project ID in `sanity/sanity.config.ts` (or the Sanity dashboard). These values are public — the `NEXT_PUBLIC_` prefix is intentional so they're available in both server and client code.

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

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `pnpm dev`         | Start the Next.js dev server                 |
| `pnpm build`       | Production build (static + ISR)              |
| `pnpm start`       | Serve the production build                   |
| `pnpm lint`        | Run ESLint (flat config)                     |
| `pnpm studio`      | Run the Sanity Studio dev server             |

## Data & Rendering

- **Content model**: a single `blog` document in Sanity (`sanity/schemaTypes/blog.ts`) with `title`, `slug`, `titleImage`, `smallDescription`, and portable-text `content`.
- **Blog listing** (`/`): static with ISR — revalidates every 10 minutes.
- **Post pages** (`/blog/[slug]`): prerendered at build time via `generateStaticParams`, also revalidating every 10 minutes. `generateMetadata` fetches the real post title/description, and missing slugs return a 404.
- All GROQ queries are typed and centralized in `lib/blog.ts`; parameters are passed safely to prevent query injection.

## Deployment

Deploy to [Vercel](https://vercel.com) by connecting the repository. Set the two environment variables above in the Vercel project settings. The `sanity/` directory is excluded from the deployment via `.vercelignore`.