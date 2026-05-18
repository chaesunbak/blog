import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { BlogPostingJsonLd } from '@/components/seo/blog-posting-json-ld';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld';
import { buildMetadata } from '@/lib/metadata';
import {
  encodeSegment,
  extractHeadings,
  formatDisplayDate,
  getAllPostSlugs,
  getPostBySlug,
  getPostTimestamps,
} from '@/lib/posts';
import { resolveImageUrl } from '@/lib/site';
import { PostComments } from '@/components/posts/post-comments';
import { PostNextRecommendation } from '@/components/posts/post-next-recommendation';
import { Badge } from '@/components/ui/badge';
import { PostScrollProgress } from '@/components/posts/post-scroll-progress';
import { Tag } from '@/components/ui/tag';
import { PostToc } from '@/components/posts/post-toc';

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
  const headings = extractHeadings(post.body);
  const { publishedTime, modifiedTime } = await getPostTimestamps(
    post.slug,
    post.date,
  );
  return (
    <main className="relative mx-auto flex max-w-3xl flex-col px-2">
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
      <aside className="absolute right-full top-10 hidden h-full w-72 pr-4 xl:block">
        <div className="sticky top-24">
          <PostToc headings={headings} />
        </div>
      </aside>

      <article className="flex w-full flex-col gap-4 pt-4 pb-10">
        <header className="site-panel flex flex-col gap-4 py-8 sm:py-10">
          {post.thumbnail && (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
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
      <PostNextRecommendation currentSlug={post.slug} />
    </main>
  );
}
