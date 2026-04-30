import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld';
import { PostComments } from '@/components/posts/post-comments';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: '방명록',
  description: '방문해주셔서 감사합니다. 댓글을 남겨주세요.',
  path: '/guestbook',
});

export default function GuestbookPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-10 sm:py-12 lg:py-14">
      <BreadcrumbJsonLd
        items={[
          { name: '홈', path: '/' },
          { name: '방명록', path: '/guestbook' },
        ]}
      />
      <div className="px-6 sm:px-10">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">방명록</h1>
      </div>
      <PostComments />
    </main>
  );
}
