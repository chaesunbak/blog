import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags, getPostTimestamps } from "@/lib/posts";
import { createAbsoluteUrl, siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const postEntries = await Promise.all(
    posts.map(async (post) => {
      const { modifiedTime } = await getPostTimestamps(post.slug, post.date);

      return {
        slug: post.slug,
        tags: post.tags,
        lastModified: modifiedTime ?? new Date().toISOString(),
      };
    }),
  );
  const latestUpdate =
    postEntries.reduce<string>(
      (latest, post) =>
        post.lastModified > latest ? post.lastModified : latest,
      "",
    ) || new Date().toISOString();
  const tags = await getAllTags();

  return [
    {
      url: createAbsoluteUrl("/"),
      lastModified: latestUpdate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: createAbsoluteUrl("/tags"),
      lastModified: latestUpdate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: createAbsoluteUrl(siteConfig.feedPath),
      lastModified: latestUpdate,
      changeFrequency: "daily",
      priority: 0.4,
    },
    ...tags.map((tag) => {
      const taggedPosts = postEntries.filter((post) =>
        post.tags.includes(tag.name),
      );
      const lastModified =
        taggedPosts.reduce<string>(
          (latest, post) =>
            post.lastModified > latest ? post.lastModified : latest,
          "",
        ) || latestUpdate;

      return {
        url: createAbsoluteUrl(`/tags/${tag.slug}`),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      };
    }),
    ...postEntries.map((post) => ({
      url: createAbsoluteUrl(`/${post.slug}`),
      lastModified: post.lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
