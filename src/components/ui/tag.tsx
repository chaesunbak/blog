import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Tag({
  children,
  className,
  href,
  count,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  count?: number;
}) {
  const content = (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-[#334155] transition-colors hover:bg-slate-200/80',
        className,
      )}
    >
      <span className="mr-0.5 text-[#64748b]">#</span>
      {children}
      {count !== undefined && (
        <span className="ml-2 rounded-full px-2 py-0.5 text-sm font-bold text-slate-500">
          {count}
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
