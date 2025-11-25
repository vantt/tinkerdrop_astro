# Pagefind Search Architecture

This document explains the technical implementation of the static search functionality in TinkerDrop using [Pagefind](https://pagefind.app/).

## Overview

Pagefind is a static search library that runs entirely in the browser. Unlike traditional search engines that require a backend server (like Elasticsearch or Algolia), Pagefind generates a static search index at build time. This index is then loaded by the client's browser to perform searches.

## How It Works

### 1. Indexing (Build Time)

The indexing process happens **after** Astro builds your site.

1.  **Astro Build:** `astro build` generates the static HTML files in the `dist/` folder.
2.  **Pagefind Scan:** The `pagefind --site dist` command scans these HTML files.
3.  **Content Extraction:** Pagefind looks for specific attributes to determine what to index:
    - `data-pagefind-body`: Marks the element containing the content to be indexed (e.g., the `<article>` tag in `BlogPost.astro`).
    - `data-pagefind-meta="title"`: Explicitly marks the page title.
    - _Default behavior:_ If no attributes are found, it indexes the `<body>` and tries to guess the title.
4.  **Index Generation:** Pagefind creates a `dist/pagefind/` directory containing:
    - `pagefind.js`: The main entry point script.
    - `wasm.*.pagefind`: WebAssembly modules for performance.
    - `*.pf_index`, `*.pf_fragment`: Binary chunks of the search index.

### 2. Searching (Client Time)

When a user visits the site:

1.  **UI Initialization:** The `Search.astro` component loads. It imports the Pagefind UI library.
2.  **User Query:** When the user types a query (e.g., "blog").
3.  **Request Index:** The browser requests `pagefind.js` and the necessary index chunks from the server.
4.  **Local Search:** The search logic runs inside the user's browser using WebAssembly. It filters the loaded index chunks and returns results.
5.  **Display:** The results are rendered in the modal.

## Data Flow Diagram

```mermaid
graph TD
    subgraph Build_Process [Build Process]
        A[Source Code (.astro, .md)] -->|astro build| B(dist/ folder HTML)
        B -->|pagefind --site dist| C{Pagefind Indexer}
        C -->|Extracts content| D[dist/pagefind/ Index Files]
    end

    subgraph Client_Side [Client Side Browser]
        E[User Input] -->|Triggers| F[Search.astro Component]
        F -->|Requests| G[pagefind.js]
        G -->|Fetches| H[Index Chunks (.pf_fragment)]
        H -->|Returns| G
        G -->|Computes Results| I[Search Results UI]
    end

    D -.->|Hosted on Server| G
```

## Development vs. Production

### Production

- **Workflow:** `npm run build` -> `dist/` folder created -> Pagefind runs -> `dist/pagefind/` created.
- **Serving:** The web server (e.g., Vercel, Netlify) serves the `dist/` folder, which includes the `pagefind` directory. Everything works automatically.

### Development (`npm run dev`)

- **Issue:** `npm run dev` serves files from memory and `src/`, it does **not** serve the `dist/` folder. Therefore, it cannot find the generated `pagefind` index.
- **Workaround:** We must manually copy the generated index to the `public/` folder, which Astro serves as static assets.
- **Steps to test search in dev:**
  1.  Run `npm run build` (to generate `dist/pagefind`).
  2.  Copy `dist/pagefind` to `public/pagefind`.
  3.  Run `npm run dev`.

> **Note:** The `public/pagefind` folder is added to `.gitignore` to prevent committing generated binary files to the repository.

## Key Files

- `src/components/Search.astro`: The UI component containing the search modal and input.
- `src/layouts/BlogPost.astro`: Defines the content structure for indexing using `data-pagefind-body`.
- `package.json`: Contains the build script `astro build && pagefind --site dist`.
- `src/styles/pagefind.css`: Custom styling to override Pagefind's default UI and ensure it matches the site's theme.
