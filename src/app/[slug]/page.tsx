import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPostingJsonLd } from '@/components/seo/blog-posting-json-ld';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld';
import { buildMetadata } from '@/lib/metadata';
import {
  encodeSegment,
  formatDisplayDate,
  getAllPostSlugs,
  getPostBySlug,
  getPostTimestamps,
} from '@/lib/posts';
import { resolveImageUrl } from '@/lib/site';
import { PostComments } from '@/components/posts/post-comments';
import { Badge } from '@/components/ui/badge';
import { PostScrollProgress } from '@/components/posts/post-scroll-progress';
import { Tag } from '@/components/ui/tag';

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
      type: 'article',
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
    <main className="mx-auto flex max-w-4xl flex-col px-2">
      <PostScrollProgress />
      <BreadcrumbJsonLd
        items={[
          { name: '홈', path: '/' },
          { name: post.title, path },
        ]}
      />
      <BlogPostingJsonLd
        post={post}
        path={path}
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
      />
      <article className="flex w-full flex-col gap-4 py-10 sm:py-12 lg:py-14">
        <header className="site-panel flex flex-col gap-4 py-8 sm:py-10">
          <h1 className="text-5xl font-semibold text-gray-700 md:text-6xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <Tag key={tag} href={`/tags/${encodeSegment(tag)}`}>
                {tag}
              </Tag>
            ))}
          </div>
          {displayDate && (
            <Badge variant="secondary" className="w-fit">
              {displayDate}
            </Badge>
          )}
        </header>

        <div className="prose prose-slate prose-headings:tracking-tight prose-img:rounded-3xl prose-img:border prose-img:border-slate-200 max-w-none">
          {post.content}
        </div>

        <PostComments />
      </article>
    </main>
  );
}
