import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld';
import { Tag } from '@/components/ui/tag';
import { buildMetadata } from '@/lib/metadata';
import { getAllTags } from '@/lib/posts';

export const metadata: Metadata = buildMetadata({
  title: '태그 목록',
  description: '관심 있는 주제별로 포스트를 모아볼 수 있는 태그 목록입니다.',
  path: '/tags',
});

export default async function TagsPage() {
  const tags = await getAllTags();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col py-10 sm:py-12 lg:py-14">
      <BreadcrumbJsonLd
        items={[
          { name: '홈', path: '/' },
          { name: '태그', path: '/tags' },
        ]}
      />
      <section className="flex flex-wrap gap-4">
        {tags.map((tag) => (
          <Tag key={tag.slug} href={`/tags/${tag.slug}`} count={tag.count}>
            {tag.name}
          </Tag>
        ))}
      </section>
    </main>
  );
}
