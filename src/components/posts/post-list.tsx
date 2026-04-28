import { PostListItem } from "@/components/posts/post-list-item";
import { PostPagination } from "@/components/posts/post-pagination";
import { type Post } from "@/lib/posts";

export function PostList({
  posts,
  currentPage,
  totalPages,
  basePath,
  emptyTitle = "아직 등록된 포스트가 없습니다.",
  emptyDescription = "새 글이 올라오면 이 자리에서 바로 볼 수 있어요.",
}: {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  basePath: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (posts.length === 0) {
    return (
      <section className="p-10 ">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          {emptyTitle}
        </h2>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-500">
          {emptyDescription}
        </p>
      </section>
    );
  }

  return (
    <section className="p-6 sm:p-8 lg:p-10">
      <div className="space-y-14">
        {posts.map((post) => (
          <PostListItem key={post.slug} post={post} />
        ))}
      </div>

      <PostPagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={basePath}
      />
    </section>
  );
}
