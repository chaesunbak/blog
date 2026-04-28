import type { Metadata } from "next";
import { PostList } from "@/components/posts/post-list";
import { buildMetadata, createPaginatedPath } from "@/lib/metadata";
import {
  getAllPosts,
  getPageFromSearchParam,
  paginateItems,
} from "@/lib/posts";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const currentPage = getPageFromSearchParam(params.page);

  return buildMetadata({
    title: currentPage > 1 ? `블로그 ${currentPage}페이지` : "블로그",
    path: createPaginatedPath("/", currentPage),
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
    <main className="site-frame flex w-full flex-col gap-10 py-10 sm:py-12 lg:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <PostList
          posts={items}
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/"
        />
      </div>
    </main>
  );
}
