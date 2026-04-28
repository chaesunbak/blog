import { JsonLd } from "@/components/seo/json-ld";
import { createBlogPostingJsonLd } from "@/lib/json-ld";
import type { Post } from "@/lib/posts";

export function BlogPostingJsonLd({
  post,
  path,
  publishedTime,
  modifiedTime,
  type,
}: {
  post: Pick<Post, "title" | "description" | "category" | "tags" | "thumbnail">;
  path: string;
  publishedTime?: string;
  modifiedTime?: string;
  type?: "BlogPosting" | "Article";
}) {
  return (
    <JsonLd
      id="blog-posting-json-ld"
      data={createBlogPostingJsonLd({
        post,
        path,
        publishedTime,
        modifiedTime,
        type,
      })}
    />
  );
}
