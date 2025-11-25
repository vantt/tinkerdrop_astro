# Technical Overview: Tinker Drop

This document provides a technical overview of the Tinker Drop website, built with [Astro](https://astro.build/). It details how the system works, specifically focusing on data loading, routing, and rendering.

## System Architecture

The website is a static site generated (SSG) using Astro. It leverages **Content Collections** to manage blog posts and **Tailwind CSS** for styling.

### Core Technologies

- **Framework**: Astro
- **Styling**: Tailwind CSS (via Vite plugin)
- **Content Source**: Markdown files in `src/content/blog/`
- **Build Output**: Static HTML/CSS/JS

### Markdown Plugins

The system uses custom Remark plugins to enhance Markdown rendering:

- **`remark-youtube`**:
  - **Source**: `src/plugins/remark-youtube.js`
  - **Function**: Automatically detects YouTube URLs on their own lines and converts them into responsive embedded video players.
  - **Implementation**: Visits paragraph nodes, checks for YouTube URL patterns, and replaces the node with an HTML `<iframe>` wrapped in a responsive container.

## Project Structure

The project follows a standard Astro project structure:

```text
/
├── public/               # Static assets (favicon, robots.txt, etc.)
├── src/
│   ├── components/       # Reusable Astro components
│   │   ├── BlogCard.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   └── Pagination.astro
│   ├── content/          # Content collections
│   │   ├── blog/         # Markdown files for blog posts
│   │   └── config.ts     # Content collection schemas (Zod)
│   ├── layouts/          # Page layouts
│   │   ├── BlogPost.astro # Layout for single blog posts
│   │   └── Layout.astro   # Main HTML shell (<html>, <head>, <body>)
│   ├── pages/            # File-based routing
│   │   ├── blog/         # Blog routes (index and dynamic slug)
│   │   ├── index.astro   # Homepage (redirects to /blog)
│   │   └── rss.xml.js    # RSS feed generation
│   └── styles/           # Global styles
│       └── global.css
├── astro.config.mjs      # Astro configuration
├── tailwind.config.mjs   # Tailwind CSS configuration
└── package.json          # Project dependencies and scripts
```

## Data Loading (Content Collections)

Data is managed using Astro's Content Collections API.

1.  **Source**: Blog posts are stored as Markdown files in `src/content/blog/`.
2.  **Schema**: Defined in `src/content/config.ts`. It validates frontmatter (title, date, image, etc.) using Zod.
3.  **Access**: Components and pages access data using `getCollection('blog')`.

## Routing & Rendering Flows

This section details every `.astro` page file in `src/pages/` and its role in the application.

### 1. Homepage (`/`)

- **File**: `src/pages/index.astro`
- **Role**: Entry point for the domain.
- **Behavior**: Server-side redirect to `/blog`.

### 2. Blog Index (`/blog`)

- **File**: `src/pages/blog/index.astro`
- **Role**: Main landing page for the blog.
- **Behavior**:
  - Fetches all blog posts via `getCollection('blog')`.
  - Displays the first page of posts (limit: 6).
  - Renders the `Pagination` component if needed.

### 3. Blog Pagination (`/blog/page/[page]`)

- **File**: `src/pages/blog/page/[page].astro`
- **Role**: Handles paginated views of the blog index (e.g., `/blog/page/2`, `/blog/page/3`).
- **Behavior**:
  - `getStaticPaths()`: Generates routes for page 2 onwards based on total post count.
  - Renders the same layout and card grid as the main index, but for a specific slice of posts.

### 4. Single Blog Post (`/blog/[slug]`)

- **File**: `src/pages/blog/[...slug].astro`
- **Role**: Renders individual blog post pages.
- **Behavior**:
  - `getStaticPaths()`: Generates a static route for every markdown file in `src/content/blog/`.
  - Passes the full post object as props.
  - Renders the markdown content within the `BlogPost` layout.

### 5. RSS Feed (`/rss.xml`)

- **File**: `src/pages/rss.xml.js`
- **Role**: Generates the RSS 2.0 feed.
- **Behavior**:
  - Fetches all blog posts.
  - Returns an XML response with post metadata.

## System Diagram

The following diagram illustrates the data flow from content files to the final rendered pages.

```mermaid
graph TD
    subgraph Data_Source [Data Source]
        MD[Markdown Files<br/>src/content/blog/*.md]
    end

    subgraph Build_Process [Astro Build Process]
        CC[Content Collections API<br/>getCollection('blog')]

        MD --> CC

        subgraph Page_Generation [Page Generation]
            Home[src/pages/index.astro<br/>(Redirects to /blog)]

            BlogIndex[src/pages/blog/index.astro<br/>(Lists Posts)]
            CC -->|Fetch All & Sort| BlogIndex

            BlogPage[src/pages/blog/page/[page].astro<br/>(Pagination)]
            CC -->|getStaticPaths| BlogPage

            BlogPost[src/pages/blog/[...slug].astro<br/>(Single Post)]
            CC -->|getStaticPaths| BlogPost

            RSS[src/pages/rss.xml.js<br/>(RSS Feed)]
            CC -->|Map to XML Items| RSS
        end
    end

    subgraph Output [Static Output]
        RouteHome[/index.html]
        RouteBlog[/blog/index.html]
        RouteBlogPage[/blog/page/2/index.html]
        RoutePost[/blog/post-slug/index.html]
        RouteRSS[/rss.xml]

        Home --> RouteHome
        BlogIndex --> RouteBlog
        BlogPage --> RouteBlogPage
        BlogPost --> RoutePost
        RSS --> RouteRSS
    end

    subgraph User_Experience [User Experience]
        User((User))

        User -->|Visits /| RouteHome
        RouteHome -.->|Redirects| RouteBlog
        User -->|Visits /blog| RouteBlog
        RouteBlog -->|Next Page| RouteBlogPage
        User -->|Clicks Post| RoutePost
        User -->|Subscribes| RouteRSS
    end
```

## Key Components

- **`src/layouts/Layout.astro`**: The main shell of the application. Handles `<head>`, global styles, and the `<body>` structure.
- **`src/components/BlogCard.astro`**: Displays a summary of a post (image, title, date) on the index page.
- **`src/components/Pagination.astro`**: Handles navigation between pages of blog posts.
