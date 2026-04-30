import type { Metadata } from 'next';

import { PostList } from '@/components/posts/post-list';
import { buildMetadata, createPaginatedPath } from '@/lib/metadata';
import {
  getAllPosts,
  getPageFromSearchParam,
  paginateItems,
} from '@/lib/posts';
import { Hero } from '@/components/home/hero';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const currentPage = getPageFromSearchParam(params.page);

  return buildMetadata({
    title: 'chaesunbak 님의 블로그',
    path: createPaginatedPath('/', currentPage),
  });
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  const allPosts = await getAllPosts();
  const { items, currentPage, totalPages } = paginateItems(
    allPosts,
    getPageFromSearchParam(params.page),
  );

  return (
    <main className="site-frame mx-auto flex w-full max-w-5xl flex-col gap-10 py-10 sm:py-12 lg:py-14">
      {currentPage === 1 && <Hero />}
      <PostList
        posts={items}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/"
      />
    </main>
  );
}
