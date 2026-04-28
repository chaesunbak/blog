import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostingJsonLd } from "@/components/seo/blog-posting-json-ld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { buildMetadata } from "@/lib/metadata";
import {
  encodeSegment,
  formatDisplayDate,
  getAllPostSlugs,
  getPostBySlug,
  getPostTimestamps,
} from "@/lib/posts";
import { resolveImageUrl } from "@/lib/site";
import { Tag } from "@/components/ui/tag";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const path = `/${post.slug}`;
  const image = resolveImageUrl(post.thumbnail);
  const { publishedTime, modifiedTime } = await getPostTimestamps(
    post.slug,
    post.date,
  );

  return {
    ...buildMetadata({
      title: post.title,
      description: post.description,
      path,
      keywords: post.tags,
      images: image ? [image] : undefined,
      type: "article",
      publishedTime,
      modifiedTime,
    }),
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const displayDate = formatDisplayDate(post.date);
  const path = `/${post.slug}`;
  const { publishedTime, modifiedTime } = await getPostTimestamps(
    post.slug,
    post.date,
  );

  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "홈", path: "/" },
          { name: post.title, path },
        ]}
      />
      <BlogPostingJsonLd
        post={post}
        path={path}
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
      />
      <article className="site-frame flex w-full max-w-5xl flex-col gap-10 py-10 sm:py-12 lg:py-14">
        <header className="site-panel flex flex-col gap-4 px-8 py-8 sm:px-10 sm:py-10">
          <h1 className="text-6xl font-semibold text-gray-800">{post.title}</h1>
          <div className="flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <Tag key={tag} href={`/tags/${encodeSegment(tag)}`}>
                {tag}
              </Tag>
            ))}
          </div>

          {post.description ? (
            <p className="mt-5 max-w-3xl text-xl leading-9 text-slate-500 sm:text-2xl">
              {post.description}
            </p>
          ) : null}

          {displayDate ? (
            <time
              dateTime={post.date}
              className="mt-8 block text-sm font-medium tracking-[0.22em] text-slate-400 uppercase"
            >
              {displayDate}
            </time>
          ) : null}
        </header>

        <div className="site-panel px-6 py-6 sm:px-10 sm:py-10">
          <div className="prose prose-slate prose-headings:tracking-tight prose-img:rounded-3xl prose-img:border prose-img:border-slate-200 max-w-none">
            {post.content}
          </div>
        </div>
      </article>
    </main>
  );
}
