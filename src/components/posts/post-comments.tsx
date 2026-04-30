'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const giscusConfig = {
  repo: 'chaesunbak/blog',
  'repo-id': 'R_kgDOQ8Igyw',
  category: 'Announcements',
  'category-id': 'DIC_kwDOQ8Igy84C1Gra',
  mapping: 'pathname',
  strict: '0',
  'reactions-enabled': '1',
  'emit-metadata': '0',
  'input-position': 'bottom',
  theme: 'light',
  lang: 'ko',
} as const;

export const PostComments = () => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    for (const [key, value] of Object.entries(giscusConfig)) {
      script.setAttribute(`data-${key}`, value);
    }

    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [pathname]);

  return (
    <section className="site-panel px-6 py-8 sm:px-10 sm:py-10">
      <div ref={containerRef} className="giscus" />
    </section>
  );
};
