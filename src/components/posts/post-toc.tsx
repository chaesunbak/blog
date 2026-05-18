'use client';

import { useEffect, useRef, useState } from 'react';
import type { HeadingItem } from '@/lib/posts';
import { cn } from '@/lib/utils';

const inactiveColor: Record<number, string> = {
  2: 'text-gray-700 hover:text-gray-800',
  3: 'text-gray-600 hover:text-gray-700',
  4: 'text-gray-500 hover:text-gray-600',
};

function getInactiveColor(level: number) {
  return inactiveColor[level] ?? inactiveColor[4];
}

export function PostToc({ headings }: { headings: HeadingItem[] }) {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const headingElements = headings
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 },
    );

    headingElements.forEach((el) => observerRef.current!.observe(el));

    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="목차">
      <ul className="scrollbar-hidden max-h-[calc(100vh-8rem)] space-y-1.5 overflow-y-auto">
        {headings.map(({ id, text, level }) => (
          <li key={id} style={{ paddingLeft: `${(level - 1) * 12}px` }}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(id)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={cn(
                'block truncate text-sm leading-snug transition-colors',
                activeId === id
                  ? 'text-primary font-medium'
                  : getInactiveColor(level),
              )}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
