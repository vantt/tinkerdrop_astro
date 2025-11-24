# Implementation Plan - Personal Blog Setup & Design Replication

## Goal Description

Set up a personal blog using Astro CMS and Tailwind CSS, replicating the design of [blog-demo.wisp.blog](https://blog-demo.wisp.blog/).
The design features a clean, minimal aesthetic with the "Inter" font, a centered layout, and a high-contrast black-on-white color scheme.

## User Review Required

> [!IMPORTANT]
> I will be installing the `@astrojs/tailwind` integration. This is a standard procedure for Astro projects.

## Proposed Changes

### System Setup

#### [NEW] Tailwind CSS Configuration

- Install `@astrojs/tailwind` and `tailwindcss`.

#### [NEW] `src/pages/blog/[...slug].astro`

- Dynamic route for rendering blog posts.
- Uses `getCollection` to fetch posts.
- Uses `BlogPost` layout.

#### [NEW] `src/pages/about.astro`

- The About page.
- Uses `Layout.astro` (or a variation if needed for the wider text).
- Renders the "About Me" content.
- **Design Note**: Text is slightly smaller (18px) and wider than blog posts.

### Content

#### [NEW] `src/content/blog/healing-power-of-travel.md`

- Create a sample blog post using the scraped content.
- Frontmatter: title, description, pubDate, heroImage.

#### [NEW] `src/content/blog/about.md` (or just in `src/pages/about.astro`)

- I will create a markdown file for the About content as requested by the user, likely in `src/content/pages/about.md` or similar to keep it consistent, or just hardcode it if it's a single page, but user asked for markdown. Let's use a `pages` collection or just a direct markdown file import.
- **Decision**: Create `src/pages/about.md` directly for simplicity as Astro supports this.
- Frontmatter: title, layout.
- Verify:
  - Font is Inter.
  - Background is white, text is dark grey.
  - Content is centered with the correct max-width.

### Manual Verification

- Run `npm run dev` and open the local URL.
- Compare the local homepage with the screenshot of `blog-demo.wisp.blog`.
- Verify:
  - Font is Inter.
  - Background is white, text is dark grey.
  - Content is centered with the correct max-width.
