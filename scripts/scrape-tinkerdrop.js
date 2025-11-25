/*
 * Script Requirements:
 * 1. Crawl https://tinkerdrop.com/ to extract all blog posts.
 * 2. Handle pagination (Next page).
 * 3. Convert post content to Markdown.
 * 4. Download all images (content images + hero image) to the local folder.
 *    - Images should be saved directly in the post folder (no subfolder).
 *    - Hero image should be extracted from meta tags (og:image) or header style.
 * 5. Generate Frontmatter matching the project schema:
 *    - title, description, pubDate, heroImage, slug.
 * 6. Handle Vietnamese slugs (remove accents, keep characters).
 * 7. Filter out non-blog pages and archive links.
 */

import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import fs from 'fs-extra';
import path from 'path';

const baseUrl = 'https://tinkerdrop.com';
const blogIndex = baseUrl; // Home page contains blog list

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD') // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd') // Handle specific Vietnamese characters
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
}

async function fetchPage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.text();
}

function extractPostLinks(html) {
  const $ = cheerio.load(html);
  const links = new Set();
  $('a').each((_, el) => {
    let href = $(el).attr('href');
    if (!href) return;
    // Normalize: ensure we have an absolute URL
    if (!href.startsWith('http')) {
      href = new URL(href, baseUrl).href;
    }
    // Keep only blog post URLs (contain /blog/ and not pagination, and not archive dates)
    if (href.includes('/blog/') && !href.match(/\/page\/\d+/) && !href.match(/\/blog\/\d{4}\/\d{2}/) && href !== blogIndex && href !== `${baseUrl}/blog` && href !== `${baseUrl}/blog/`) {
      links.add(href);
    }
  });
  return Array.from(links);
}

function getNextPageUrl(html) {
  const $ = cheerio.load(html);
  // Find potential next page links by link text and filter href containing '/page/'
  const candidates = $('a:contains("Next"), a:contains("Next Page"), a:contains("›"), a:contains(">")');
  const nextLink = candidates.filter((i, el) => {
    const href = $(el).attr('href');
    return href && href.includes('/page/');
  }).first();
  if (nextLink.length) {
    const href = nextLink.attr('href');
    return new URL(href, baseUrl).href;
  }
  return null;
}

async function downloadImage(imgUrl, destFolder) {
  try {
    const url = new URL(imgUrl, baseUrl);
    const res = await fetch(url.href);
    if (!res.ok) return null;
    const buffer = await res.buffer();
    const filename = path.basename(url.pathname);
    const destPath = path.join(destFolder, filename);
    await fs.ensureDir(destFolder);
    await fs.writeFile(destPath, buffer);
    return filename;
  } catch (e) {
    console.error(`Failed to download image: ${imgUrl}`, e.message);
    return null;
  }
}

async function processPost(postUrl) {
  console.log(`Processing: ${postUrl}`);
  const html = await fetchPage(postUrl);
  const $ = cheerio.load(html);

  let title = '';
  $('h1').each((i, el) => {
    const t = $(el).text().trim();
    if (t && t !== 'Cái Thấy cái Biết' && t !== 'tinkerDrop') {
      title = t;
      return false; // break
    }
  });
  
  if (!title) {
    // Fallback to page title tag
    const pageTitle = $('title').text().trim();
    if (pageTitle) {
      title = pageTitle.split(' - ')[0]; // Remove site name suffix
    } else {
      title = 'untitled';
    }
  }
  
  if (title.toLowerCase() === 'tinkerdrop' || title === 'untitled') {
    console.warn(`Skipping post with invalid title: "${title}" (${postUrl})`);
    return;
  }

  const slug = slugify(title);
  const postDir = path.join('src', 'content', 'blog', slug);
  await fs.ensureDir(postDir);

  // Extract Hero Image
  // Priority: 1. og:image meta tag (most reliable), 2. div.ast-merged-advanced-header style
  let heroImage = '';
  const ogImage = $('meta[property="og:image"]').attr('content');
  if (ogImage) {
    const filename = await downloadImage(ogImage, postDir);
    if (filename) {
      heroImage = `./${filename}`;
    }
  } else {
    // Fallback to style parsing if og:image is missing
    const heroStyle = $('div.ast-merged-advanced-header').attr('style');
    if (heroStyle) {
      const match = heroStyle.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/);
      if (match && match[1]) {
        const filename = await downloadImage(match[1], postDir);
        if (filename) {
          heroImage = `./${filename}`;
        }
      }
    }
  }

  // Extract Metadata
  const description = $('meta[name="description"]').attr('content') || '';
  const pubDateStr = $('meta[property="article:published_time"]').attr('content') || 
                     $('.entry-date').attr('datetime') || 
                     new Date().toISOString();
  const pubDate = new Date(pubDateStr).toISOString();

  // Try common containers for the article body
  const contentEl = $('.post-content, article, .entry-content').first();
  const htmlContent = contentEl.html() || '';

  const turndown = new TurndownService();
  let markdown = turndown.turndown(htmlContent);

  // Handle images in content
  const imgTags = contentEl.find('img');
  for (let i = 0; i < imgTags.length; i++) {
    const img = imgTags[i];
    const src = $(img).attr('src') || $(img).attr('data-src');
    if (!src) continue;
    // Download to postDir (flattened)
    const filename = await downloadImage(src, postDir);
    if (filename) {
      const relPath = `./${filename}`;
      // Replace the original markdown image reference with the local one
      const escapedSrc = src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`!\\[.*?\\]\\(${escapedSrc}\\)`, 'g');
      markdown = markdown.replace(regex, `![](${relPath})`);
    }
  }
  
  const frontMatter = `---
title: "${title}"
description: "${description.replace(/"/g, '\\"')}"
pubDate: "${pubDate}"
${heroImage ? `heroImage: "${heroImage}"` : ''}
---

`;
  await fs.writeFile(path.join(postDir, 'index.md'), frontMatter + markdown);
  console.log(`Saved post: ${title} (${slug})`);
}

async function main() {
  let pageUrl = blogIndex;
  while (pageUrl) {
    console.log('Fetching index page:', pageUrl);
    const html = await fetchPage(pageUrl);
    const postLinks = extractPostLinks(html);
    for (const link of postLinks) {
      await processPost(link);
    }
    const next = getNextPageUrl(html);
    pageUrl = next;
  }
}

main().catch((e) => console.error(e));
