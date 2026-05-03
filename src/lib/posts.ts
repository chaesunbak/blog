import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { StaticImageData } from "next/image";
import { cache, type ReactNode } from "react";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { getMDXComponents } from "../../mdx-components";

const CONTENT_DIRECTORY = path.join(process.cwd(), "content");
const POST_FILENAME = "index.mdx";
const POSTS_PER_PAGE = 5;

const postFrontmatterSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  date: z.string().optional(),
  tags: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
});

const rehypePrettyCodeOptions = {
  theme: "github-dark",
  keepBackground: true,
};

export type PostMetadata = {
  title: string;
  description: string;
  category: string;
  date?: string;
  tags: string[];
  thumbnail?: StaticImageData | string;
};

export type Post = PostMetadata & {
  slug: string;
  body: string;
};

export type PostDetail = Post & {
  content: ReactNode;
};

export type TagSummary = {
  name: string;
  slug: string;
  count: number;
};

export type PaginatedResult<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

function getPostSourcePath(slug: string) {
  return path.join(CONTENT_DIRECTORY, slug, POST_FILENAME);
}

function humanizeSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function normalizeList(values?: string[]) {
  return [
    ...new Set((values ?? []).map((value) => value.trim()).filter(Boolean)),
  ];
}

function normalizeThumbnail(
  slug: string,
  thumbnail?: StaticImageData | string,
): StaticImageData | string | undefined {
  if (typeof thumbnail !== "string") {
    return thumbnail;
  }

  if (thumbnail.startsWith("./")) {
    return `/content-assets/${encodeSegment(slug)}/${thumbnail.slice(2)}`;
  }

  return thumbnail;
}

function normalizeMetadata(
  slug: string,
  metadata?: Partial<PostMetadata>,
): PostMetadata {
  return {
    title: metadata?.title?.trim() || humanizeSlug(slug),
    description: metadata?.description?.trim() || "",
    category: metadata?.category?.trim() || "Engineering",
    date: metadata?.date,
    tags: normalizeList(metadata?.tags),
    thumbnail: normalizeThumbnail(slug, metadata?.thumbnail),
  };
}

function sortPosts(a: Post, b: Post) {
  const aTime = a.date ? Date.parse(a.date) : Number.NaN;
  const bTime = b.date ? Date.parse(b.date) : Number.NaN;

  if (!Number.isNaN(aTime) || !Number.isNaN(bTime)) {
    return (
      (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime)
    );
  }

  return a.title.localeCompare(b.title, "ko");
}

function normalizeSearchTarget(value: string) {
  return value.toLocaleLowerCase("ko-KR");
}

function formatZodIssue(issue: z.core.$ZodIssue) {
  const fieldPath = issue.path.length > 0 ? issue.path.join(".") : "frontmatter";

  return `${fieldPath}: ${issue.message}`;
}

function parsePostSource(source: string, sourcePath: string) {
  let parsed: { content: string; data: unknown };

  try {
    parsed = matter(source);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";

    throw new Error(`Failed to parse frontmatter in ${sourcePath}: ${reason}`);
  }

  const metadataResult = postFrontmatterSchema.safeParse(parsed.data);

  if (!metadataResult.success) {
    const issues = metadataResult.error.issues.map(formatZodIssue).join("; ");

    throw new Error(
      `Invalid frontmatter in ${sourcePath}: ${issues}. Received: ${JSON.stringify(parsed.data)}`,
    );
  }

  const sanitizedContent = parsed.content.replace(
    /^\[##_Image\|.*?_##\]\s*$/gm,
    "",
  );

  return {
    body: sanitizedContent,
    metadata: metadataResult.data,
  };
}

function parseIsoDate(date?: string) {
  if (!date) {
    return undefined;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate.toISOString();
}

const getPostFileStats = cache(async (slug: string) => {
  try {
    return await fs.stat(getPostSourcePath(slug));
  } catch {
    return null;
  }
});

export const getPostTimestamps = cache(async (slug: string, date?: string) => {
  const stats = await getPostFileStats(slug);
  const publishedTime =
    parseIsoDate(date) ??
    (stats?.birthtimeMs ? stats.birthtime.toISOString() : undefined) ??
    stats?.mtime.toISOString();
  const modifiedTime = stats?.mtime.toISOString() ?? publishedTime;

  return {
    publishedTime,
    modifiedTime,
  };
});

export const getAllPostSlugs = cache(async () => {
  try {
    const entries = await fs.readdir(CONTENT_DIRECTORY, {
      withFileTypes: true,
    });

    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right, "ko"));
  } catch {
    return [];
  }
});

export const getAllPosts = cache(async (): Promise<Post[]> => {
  const slugs = await getAllPostSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const sourcePath = getPostSourcePath(slug);
      const source = await fs.readFile(sourcePath, "utf8");
      const { body, metadata } = parsePostSource(source, sourcePath);

      return {
        slug,
        body,
        ...normalizeMetadata(slug, metadata),
      };
    }),
  );

  return posts.sort(sortPosts);
});

export const getPostBySlug = cache(
  async (slug: string): Promise<PostDetail | null> => {
    const slugs = await getAllPostSlugs();

    if (!slugs.includes(slug)) {
      return null;
    }

    const sourcePath = getPostSourcePath(slug);
    const source = await fs.readFile(sourcePath, "utf8");
    const { body, metadata } = parsePostSource(source, sourcePath);
    const { content } = await compileMDX({
      source: body,
      components: getMDXComponents(slug),
      options: {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
        },
      },
    });

    return {
      slug,
      body,
      content,
      ...normalizeMetadata(slug, metadata),
    };
  },
);

export async function getRecommendedPost(
  currentSlug: string,
  tags: string[],
): Promise<Post | null> {
  const posts = await getAllPosts();
  const others = posts.filter((post) => post.slug !== currentSlug);

  if (others.length === 0) {
    return null;
  }

  if (tags.length > 0) {
    const tagSet = new Set(tags.map((tag) => normalizeSearchTarget(tag)));
    const tagMatch = others.find((post) =>
      post.tags.some((tag) => tagSet.has(normalizeSearchTarget(tag))),
    );

    if (tagMatch) {
      return tagMatch;
    }
  }

  const currentIndex = posts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex !== -1 && currentIndex + 1 < posts.length) {
    return posts[currentIndex + 1];
  }

  return others[0];
}

export async function getAllTags(): Promise<TagSummary[]> {
  const posts = await getAllPosts();
  const tagCounts = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    });
  });

  return [...tagCounts.entries()]
    .map(([name, count]) => ({
      name,
      count,
      slug: encodeSegment(name),
    }))
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.name.localeCompare(right.name, "ko");
    });
}

export async function getPostsByTag(tag: string) {
  const normalizedTag = normalizeSearchTarget(tag);
  const posts = await getAllPosts();

  return posts.filter((post) =>
    post.tags.some(
      (postTag) => normalizeSearchTarget(postTag) === normalizedTag,
    ),
  );
}

export async function searchPosts(query: string) {
  const normalizedQuery = normalizeSearchTarget(query.trim());

  if (!normalizedQuery) {
    return [];
  }

  const posts = await getAllPosts();

  return posts.filter((post) =>
    [post.title, post.description, post.body].some((field) =>
      normalizeSearchTarget(field).includes(normalizedQuery),
    ),
  );
}

export function encodeSegment(value: string) {
  return encodeURIComponent(value);
}

export function decodeSegment(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function formatDisplayDate(date?: string) {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsedDate);
}

export function getPageFromSearchParam(page?: string | string[]) {
  const rawPage = Array.isArray(page) ? page[0] : page;
  const parsedPage = Number(rawPage);

  if (!parsedPage || Number.isNaN(parsedPage) || parsedPage < 1) {
    return 1;
  }

  return Math.floor(parsedPage);
}

export function paginateItems<T>(
  items: T[],
  currentPage: number,
  perPage = POSTS_PER_PAGE,
): PaginatedResult<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safePage - 1) * perPage;

  return {
    items: items.slice(startIndex, startIndex + perPage),
    currentPage: safePage,
    totalPages,
    totalItems,
  };
}
