'use client';

import { useEffect, useRef } from 'react';

export function PostScrollProgress() {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId = 0;
    let scrollableHeight = 0;

    const updateLayoutValues = () => {
      const { scrollHeight, clientHeight } = document.documentElement;
      scrollableHeight = scrollHeight - clientHeight;
    };

    const updateProgress = () => {
      if (!progressBarRef.current) {
        return;
      }

      if (scrollableHeight <= 0) {
        progressBarRef.current.style.transform = 'scaleX(0)';
        return;
      }

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const progress = Math.min(Math.max(scrollTop / scrollableHeight, 0), 1);

      progressBarRef.current.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateProgress);
    };

    const onResize = () => {
      updateLayoutValues();
      onScroll();
    };

    updateLayoutValues();
    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 bg-transparent"
    >
      <div
        ref={progressBarRef}
        className="bg-primary/20 h-full origin-left will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
