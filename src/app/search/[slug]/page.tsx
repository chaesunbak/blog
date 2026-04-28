import type { Metadata } from "next";
import { PostList } from "@/components/posts/post-list";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { buildMetadata, createPaginatedPath } from "@/lib/metadata";
import {
  decodeSegment,
  encodeSegment,
  getPageFromSearchParam,
  paginateItems,
  searchPosts,
} from "@/lib/posts";

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
  const query = decodeSegment(slug).trim();
  const currentPage = getPageFromSearchParam(resolvedSearchParams.page);

  return buildMetadata({
    title: `"${query}" 검색 결과`,
    description: `"${query}" 검색 결과 페이지입니다.`,
    path: createPaginatedPath(`/search/${encodeSegment(query)}`, currentPage),
    keywords: [query],
    noIndex: true,
  });
}

export default async function SearchPage({
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
  const query = decodeSegment(slug).trim();
  const posts = await searchPosts(query);
  const { items, currentPage, totalPages } = paginateItems(
    posts,
    getPageFromSearchParam(resolvedSearchParams.page),
  );

  return (
    <main className="site-frame flex w-full flex-col gap-10 py-10 sm:py-12 lg:py-14">
      <BreadcrumbJsonLd
        items={[
          { name: "홈", path: "/" },
          { name: "검색", path: `/search/${encodeSegment(query)}` },
        ]}
      />
      <PostList
        posts={items}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/search/${encodeSegment(query)}`}
        emptyTitle="검색 결과가 없습니다."
        emptyDescription="다른 키워드로 다시 찾아보거나 태그 페이지에서 주제별로 둘러보세요."
      />
    </main>
  );
}
