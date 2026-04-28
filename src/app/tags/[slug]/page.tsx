import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostList } from '@/components/posts/post-list';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld';
import { buildMetadata, createPaginatedPath } from '@/lib/metadata';
import {
  decodeSegment,
  encodeSegment,
  getAllTags,
  getPageFromSearchParam,
  getPostsByTag,
  paginateItems,
} from '@/lib/posts';

export async function generateStaticParams() {
  const tags = await getAllTags();

  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}): Promise<Metadata> {
  const [{ slug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const tag = decodeSegment(slug);
  const currentPage = getPageFromSearchParam(resolvedSearchParams.page);

  return buildMetadata({
    title: `'${tag}' 태그의 글 목록`,
    description: `${tag} 태그가 달린 포스트를 모아본 페이지입니다.`,
    path: createPaginatedPath(`/tags/${encodeSegment(tag)}`, currentPage),
    keywords: [tag],
  });
}

export default async function TagPostsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const tag = decodeSegment(slug);
  const posts = await getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  const { items, currentPage, totalPages } = paginateItems(
    posts,
    getPageFromSearchParam(resolvedSearchParams.page),
  );

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 py-10 sm:py-12 lg:py-14">
      <BreadcrumbJsonLd
        items={[
          { name: '홈', path: '/' },
          { name: '태그', path: '/tags' },
          { name: `#${tag}`, path: `/tags/${encodeSegment(tag)}` },
        ]}
      />
      <PostList
        posts={items}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/tags/${encodeSegment(tag)}`}
      />
    </main>
  );
}
