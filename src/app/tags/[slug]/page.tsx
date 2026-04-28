import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostList } from "@/components/posts/post-list";
import { SearchForm } from "@/components/search/search-form";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { buildMetadata, createPaginatedPath } from "@/lib/metadata";
import {
  decodeSegment,
  encodeSegment,
  getAllTags,
  getPageFromSearchParam,
  getPostsByTag,
  paginateItems,
} from "@/lib/posts";

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
    title: `#${tag}`,
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

  const { items, currentPage, totalPages, totalItems } = paginateItems(
    posts,
    getPageFromSearchParam(resolvedSearchParams.page),
  );

  return (
    <main>
      <div className="site-frame flex w-full flex-col gap-10 py-10 sm:py-12 lg:py-14">
        <BreadcrumbJsonLd
          items={[
            { name: "홈", path: "/" },
            { name: "태그", path: "/tags" },
            { name: `#${tag}`, path: `/tags/${encodeSegment(tag)}` },
          ]}
        />
        <section className="site-panel px-8 py-8 sm:px-10 sm:py-10">
          <p className="text-sm font-semibold tracking-[0.25em] text-slate-400 uppercase">
            Tag View
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                #{tag}
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-500">
                이 태그가 달린 포스트 {totalItems}개를 최신순으로 모아봤습니다.
              </p>
            </div>
            <SearchForm className="max-w-xl" />
          </div>
        </section>

        <PostList
          posts={items}
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/tags/${encodeSegment(tag)}`}
        />
      </div>
    </main>
  );
}
