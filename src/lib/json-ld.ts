import type { Post } from "@/lib/posts";
import {
  createAbsoluteUrl,
  createSearchUrlTemplate,
  resolveImageUrl,
  siteConfig,
} from "@/lib/site";

function createEntityReference(type: "Person" | "Organization") {
  return {
    "@type": type,
    name: siteConfig.author.name,
    url: siteConfig.author.url,
    sameAs: siteConfig.author.sameAs,
  };
}

export function createWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
    publisher: createEntityReference(siteConfig.author.type),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: createSearchUrlTemplate(),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function createPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    ...createEntityReference("Person"),
  };
}

export function createOrganizationJsonLd({
  name,
  url,
  sameAs = [],
}: {
  name: string;
  url: string;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    sameAs,
  };
}

export function createBreadcrumbJsonLd(
  items: {
    name: string;
    path: string;
  }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: createAbsoluteUrl(item.path),
    })),
  };
}

export function createBlogPostingJsonLd({
  post,
  path,
  publishedTime,
  modifiedTime,
  type = "BlogPosting",
}: {
  post: Pick<Post, "title" | "description" | "category" | "tags" | "thumbnail">;
  path: string;
  publishedTime?: string;
  modifiedTime?: string;
  type?: "BlogPosting" | "Article";
}) {
  const image = resolveImageUrl(post.thumbnail);
  const author = createEntityReference(siteConfig.author.type);

  return {
    "@context": "https://schema.org",
    "@type": type,
    headline: post.title,
    description: post.description || post.title,
    url: createAbsoluteUrl(path),
    mainEntityOfPage: createAbsoluteUrl(path),
    datePublished: publishedTime,
    dateModified: modifiedTime ?? publishedTime,
    author,
    publisher: author,
    inLanguage: siteConfig.language,
    articleSection: post.category,
    keywords: post.tags.join(", "),
    image: image ? [image] : undefined,
  };
}
