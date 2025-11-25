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
import { gfm } from 'turndown-plugin-gfm';

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

function parseVietnameseDate(dateStr) {
  if (!dateStr) return null;
  const months = [
    ['Tháng Mười Hai', 'Dec'], ['Tháng Mười Một', 'Nov'], ['Tháng Mười', 'Oct'],
    ['Tháng Chín', 'Sep'], ['Tháng Tám', 'Aug'], ['Tháng Bảy', 'Jul'],
    ['Tháng Sáu', 'Jun'], ['Tháng Năm', 'May'], ['Tháng Tư', 'Apr'],
    ['Tháng Ba', 'Mar'], ['Tháng Hai', 'Feb'], ['Tháng Một', 'Jan']
  ];
  
  let cleanStr = dateStr.trim();
  for (const [vn, en] of months) {
    if (cleanStr.startsWith(vn)) {
      cleanStr = cleanStr.replace(vn, en);
      break;
    }
  }
  const date = new Date(cleanStr);
  return isNaN(date.getTime()) ? null : date.toISOString();
}

function extractPostLinks(html) {
  const $ = cheerio.load(html);
  const posts = new Map(); // Use Map to avoid duplicates, keyed by URL
  
  $('article').each((_, el) => {
    const linkEl = $(el).find('a').first();
    let href = linkEl.attr('href');
    if (!href) return;

    // Normalize: ensure we have an absolute URL
    if (!href.startsWith('http')) {
      href = new URL(href, baseUrl).href;
    }

    // Keep only blog post URLs
    if (href.includes('/blog/') && !href.match(/\/page\/\d+/) && !href.match(/\/blog\/\d{4}\/\d{2}/) && href !== blogIndex && href !== `${baseUrl}/blog` && href !== `${baseUrl}/blog/`) {
      const dateStr = $(el).find('.published').text();
      const pubDate = parseVietnameseDate(dateStr);
      
      const updatedStr = $(el).find('.updated').text();
      const updatedDate = parseVietnameseDate(updatedStr);

      const tags = [];
      const catContainer = $(el).find('.cat-links, .cat-link');
      catContainer.find('a').each((_, a) => {
          tags.push($(a).text().trim());
      });

      posts.set(href, { url: href, pubDate, updatedDate, tags });
    }
  });

  // Fallback: if no articles found (different layout?), try original method but without date
  if (posts.size === 0) {
    $('a').each((_, el) => {
        let href = $(el).attr('href');
        if (!href) return;
        if (!href.startsWith('http')) {
          href = new URL(href, baseUrl).href;
        }
        if (href.includes('/blog/') && !href.match(/\/page\/\d+/) && !href.match(/\/blog\/\d{4}\/\d{2}/) && href !== blogIndex && href !== `${baseUrl}/blog` && href !== `${baseUrl}/blog/`) {
          posts.set(href, { url: href, pubDate: null, updatedDate: null, tags: [] });
        }
    });
  }

  return Array.from(posts.values());
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

async function processPost(postData) {
  const { url: postUrl, pubDate: listPubDate, updatedDate: listUpdatedDate, tags: listTags } = postData;
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
  
  let pubDate = listPubDate;
  if (!pubDate) {
    const pubDateStr = $('meta[property="article:published_time"]').attr('content') || 
                       $('.entry-date').attr('datetime') || 
                       $('.published').text(); // Try text content if class exists
    
    if (pubDateStr) {
        // If we got text like "Tháng Một 6, 2019", try to parse it
        if (pubDateStr.includes('Tháng')) {
            pubDate = parseVietnameseDate(pubDateStr);
        } else {
            pubDate = new Date(pubDateStr).toISOString();
        }
    }

    // Fallback to existing file's pubDate if still null
    if (!pubDate) {
        const existingPath = path.join(postDir, 'index.md');
        if (await fs.pathExists(existingPath)) {
            const content = await fs.readFile(existingPath, 'utf-8');
            const match = content.match(/pubDate:\s*["'](.*?)["']/);
            if (match && match[1]) {
                pubDate = match[1];
                console.log(`Using existing pubDate: ${pubDate}`);
            }
        }
    }

    // Final fallback to current date
    if (!pubDate) {
        pubDate = new Date().toISOString();
    }
  }

  let updatedDate = listUpdatedDate;
  if (!updatedDate) {
      const updatedStr = $('meta[property="og:updated_time"]').attr('content') || 
                         $('.updated').text();
      if (updatedStr) {
          if (updatedStr.includes('Tháng')) {
              updatedDate = parseVietnameseDate(updatedStr);
          } else {
              updatedDate = new Date(updatedStr).toISOString();
          }
      }
  }

  let tags = listTags;
  if (!tags || tags.length === 0) {
      tags = [];
      const catContainer = $('.cat-links, .cat-link, .tags-links');
      catContainer.find('a').each((_, a) => {
          const t = $(a).text().trim();
          if (t) tags.push(t);
      });
      // Deduplicate
      tags = [...new Set(tags)];
  }

  // Try common containers for the article body
  const contentEl = $('.post-content, article, .entry-content').first();
  
  // Pre-process tables: Ensure they have a thead for GFM compatibility
  contentEl.find('table').each((_, table) => {
      const $table = $(table);
      if ($table.find('thead').length === 0) {
          const firstRow = $table.find('tr').first();
          if (firstRow.length > 0) {
              const thead = $('<thead></thead>');
              firstRow.find('td').each((_, td) => {
                  // Replace td with th
                  const th = $('<th></th>').html($(td).html());
                  $(td).replaceWith(th);
              });
              thead.append(firstRow);
              $table.prepend(thead);
          }
      }
      
      // Clean up table cells: flatten lists and paragraphs to avoid newlines in markdown
      $table.find('td, th').each((_, cell) => {
          const $cell = $(cell);

          // Handle Lists: Convert <ul>/<li> to <br> separated lines
          $cell.find('ul, ol').each((_, list) => {
              const $list = $(list);
              const isOrdered = $list.is('ol');
              let listHtml = '';
              $list.find('li').each((i, li) => {
                  const prefix = isOrdered ? `${i + 1}. ` : '• ';
                  listHtml += prefix + $(li).html().trim() + '<br>';
              });
              $list.replaceWith(listHtml);
          });

          // Handle Paragraphs: Replace <p> with <br>
          $cell.find('p').each((_, p) => {
              const $p = $(p);
              $p.replaceWith($p.html() + '<br>');
          });

          // Unwrap divs
          $cell.find('div').each((_, div) => {
              $(div).replaceWith($(div).html());
          });
          
          // Remove &nbsp; if it's the only thing
          if ($cell.text().trim() === '' && $cell.html().includes('&nbsp;')) {
              $cell.html('');
          }

          // Final cleanup: remove newlines to prevent breaking markdown table
          // We rely on <br> for line breaks now.
          // Also Turndown might escape <br>, so we need to be careful. 
          // Actually, Turndown GFM plugin should handle <br> inside tables correctly.
          // But we must ensure the HTML input to Turndown doesn't have newlines that Turndown interprets as block breaks.
          let html = $cell.html();
          if (html) {
             html = html.replace(/\n/g, ' '); 
             $cell.html(html);
          }
      });
  });

  const htmlContent = contentEl.html() || '';

  const turndown = new TurndownService();
  turndown.use(gfm);
  
  // Custom rule to keep <br> as <br> string instead of newline to preserve table structure
  turndown.addRule('keep-br', {
    filter: 'br',
    replacement: function () {
      return '<br>';
    }
  });

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
${updatedDate ? `updatedDate: "${updatedDate}"` : ''}
${heroImage ? `heroImage: "${heroImage}"` : ''}
${tags && tags.length > 0 ? `tags: [${tags.map(t => `"${t}"`).join(', ')}]` : ''}
---

`;
  await fs.writeFile(path.join(postDir, 'index.md'), frontMatter + markdown);
  console.log(`Saved post: ${title} (${slug})`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length > 0) {
      const url = args[0];
      console.log(`Extracting single post: ${url}`);
      await processPost({ url, pubDate: null, updatedDate: null, tags: [] });
      return;
  }

  let pageUrl = blogIndex;
  while (pageUrl) {
    console.log('Fetching index page:', pageUrl);
    const html = await fetchPage(pageUrl);
    const posts = extractPostLinks(html);
    for (const post of posts) {
      await processPost(post);
    }
    const next = getNextPageUrl(html);
    pageUrl = next;
  }
}

main().catch((e) => console.error(e));
