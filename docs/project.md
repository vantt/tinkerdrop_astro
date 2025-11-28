# Project Context

## Purpose

TinkerDrop is a personal blog and content site designed to share knowledge and insights. The project focuses on providing a high-quality reading experience with a clean, modern design. It includes functionality for migrating content from external sources and supports rich media integration.

## Tech Stack

- **Framework**: Astro 5.x
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS 4.x (via `@tailwindcss/vite`)
- **Deployment**: Vercel (Static/Serverless)
- **Search**: Pagefind
- **Content**: Markdown/MDX
- **Key Libraries**:
  - `@tailwindcss/typography`: For beautiful prose styling
  - `cheerio` & `turndown`: For content scraping and migration
  - `remark-youtube`: For embedding video content

## Project Conventions

### Code Style

- **TypeScript**: Strict mode enabled (`astro/tsconfigs/strict`).
- **Formatting**: Prettier (implied standard).
- **Styling**: Utility-first with Tailwind CSS. Custom typography configuration in `tailwind.config.mjs` for optimal readability.

### Architecture Patterns

- **Rendering**: Static Site Generation (SSG) by default, with Vercel adapter for deployment.
- **Routing**: Astro's file-based routing.
- **Content Management**: Content collections (implied by Astro usage) or Markdown files.
- **Assets**: Optimized using Astro's image service (Sharp).

### Testing Strategy

- Currently, no explicit testing framework is set up.
- Validation relies on TypeScript checks and build verification (`astro check`, `astro build`).

### Git Workflow

- Standard feature-branch workflow.
- Commits should be descriptive.

## Domain Context

- The site ("TinkerDrop") likely covers technical topics, "tinkering," or educational content.
- Content migration is a key part of the workflow, as evidenced by the `scrape:tinkerdrop` script.

## Important Constraints

- **Performance**: High priority on static generation and asset optimization.
- **Deployment**: Must be compatible with Vercel's environment.

## External Dependencies

- **Vercel**: Hosting and deployment platform.
- **Google Fonts**: Inter font family.
