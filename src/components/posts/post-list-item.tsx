import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatDisplayDate, type Post } from '@/lib/posts';
import { cn } from '@/lib/utils';

export function PostListItem({ post }: { post: Post; showDivider?: boolean }) {
  const hasThumbnail = Boolean(post.thumbnail);
  const displayDate = formatDisplayDate(post.date);

  return (
    <article className="group py-2">
      <div
        className={cn(
          'grid gap-8',
          hasThumbnail && 'grid-cols-3 lg:items-start',
        )}
      >
        <div className="col-span-2 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="default">{post.category}</Badge>
            <Badge variant="secondary">{displayDate ?? '작성일 미정'}</Badge>
          </div>

          <div className="space-y-4">
            <h2 className="max-w-4xl text-2xl font-bold text-slate-800 transition-colors hover:text-blue-500">
              <Link href={`/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="max-w-4xl text-slate-600">{post.description}</p>
          </div>
        </div>

        {hasThumbnail ? (
          <Link
            href={`/${post.slug}`}
            className="block overflow-hidden rounded-lg p-4"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={post.thumbnail!}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 26rem"
              />
            </div>
          </Link>
        ) : null}
      </div>
    </article>
  );
}
