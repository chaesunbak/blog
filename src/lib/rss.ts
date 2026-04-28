import fs from "node:fs/promises";
import path from "node:path";
import { Feed } from "feed";
import { getAllPosts } from "@/lib/posts";
import { createAbsoluteUrl, siteConfig } from "@/lib/site";

export const RSS_REVALIDATE_SECONDS = 3600;
const CONTENT_DIRECTORY = path.join(process.cwd(), "content");
const POST_FILENAME = "index.mdx";

function parsePublishedDate(date?: string) {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

async function resolvePublishedDate(slug: string, date?: string) {
  const publishedDate = parsePublishedDate(date);

  if (publishedDate) {
    return publishedDate;
  }

  try {
    const sourcePath = path.join(CONTENT_DIRECTORY, slug, POST_FILENAME);
    const stats = await fs.stat(sourcePath);

    return stats.mtime;
  } catch {
    return new Date(0);
  }
}

export async function generateRssFeed() {
  const posts = await getAllPosts();
  const items = await Promise.all(
    posts.map(async (post) => ({
      ...post,
      url: createAbsoluteUrl(`/${post.slug}`),
      publishedDate: await resolvePublishedDate(post.slug, post.date),
    })),
  );
  const updated = items[0]?.publishedDate ?? new Date();
  const feed = new Feed({
    title: siteConfig.name,
    description: siteConfig.description,
    id: siteConfig.url,
    link: siteConfig.url,
    updated,
    language: "ko",
    copyright: `All rights reserved ${new Date().getFullYear()}, ${siteConfig.author.name}`,
    generator: "Next.js using feed",
    author: {
      name: siteConfig.author.name,
      link: siteConfig.author.url,
    },
    feedLinks: {
      rss2: createAbsoluteUrl(siteConfig.feedPath),
    },
  });

  items.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: post.url,
      link: post.url,
      description: post.description || post.title,
      date: post.publishedDate,
    });
  });

  return feed.rss2();
}

export async function createRssResponse() {
  const rss = await generateRssFeed();

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": `public, s-maxage=${RSS_REVALIDATE_SECONDS}, stale-while-revalidate=${RSS_REVALIDATE_SECONDS}`,
    },
  });
}
