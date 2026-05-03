'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { type Post } from '@/lib/posts';

const AUTO_NAVIGATE_MS = 10_000;
const VISITED_KEY = 'visited_posts';

type RecommendedPost = Pick<Post, 'slug' | 'title' | 'thumbnail'>;

function getVisitedSlugs(): Set<string> {
  try {
    const raw = sessionStorage.getItem(VISITED_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function markVisited(slug: string) {
  try {
    const visited = getVisitedSlugs();
    visited.add(slug);
    sessionStorage.setItem(VISITED_KEY, JSON.stringify([...visited]));
  } catch {
    // sessionStorage unavailable
  }
}

export function PostNextRecommendation({
  currentSlug,
  candidates,
  latestPost,
}: {
  currentSlug: string;
  candidates: RecommendedPost[];
  latestPost: RecommendedPost | null;
}) {
  const router = useRouter();
  const [post, setPost] = useState<RecommendedPost | null>(null);
  const [isLatestFallback, setIsLatestFallback] = useState(false);
  const [activated, setActivated] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const visited = getVisitedSlugs();
    const pick = candidates.find((c) => !visited.has(c.slug)) ?? null;
    if (pick) {
      setPost(pick);
      setIsLatestFallback(false);
    } else if (latestPost && !visited.has(latestPost.slug)) {
      setPost(latestPost);
      setIsLatestFallback(true);
    } else {
      setPost(null);
      setIsLatestFallback(false);
    }
  }, [currentSlug, candidates, latestPost]);

  const triggerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const startedAtRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const targetHref = `/${post?.slug}`;

  useEffect(() => {
    router.prefetch(targetHref);
  }, [targetHref]);

  useEffect(() => {
    if (dismissed || !post) {
      return;
    }

    const target = triggerRef.current;

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          markVisited(currentSlug);
          setActivated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [dismissed, post]);

  const stopCountdown = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startedAtRef.current = null;
    if (progressRef.current) {
      progressRef.current.style.transform = 'scaleX(0)';
    }
  }, []);

  const navigate = useCallback(() => {
    stopCountdown();
    router.push(targetHref);
  }, [targetHref]);

  const dismiss = useCallback(() => {
    stopCountdown();
    setDismissed(true);
  }, [stopCountdown]);

  useEffect(() => {
    if (!activated || dismissed) {
      return;
    }

    const tick = (now: number) => {
      if (startedAtRef.current === null) {
        startedAtRef.current = now;
      }

      const elapsed = now - startedAtRef.current;
      const progress = Math.min(elapsed / AUTO_NAVIGATE_MS, 1);

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      if (progress >= 1) {
        navigate();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      startedAtRef.current = null;
    };
  }, [activated, dismissed]);

  if (dismissed || !post) {
    return null;
  }

  return (
    <>
      <div ref={triggerRef} aria-hidden="true" className="h-px w-full" />
      <div
        role="region"
        aria-label="다음 글 추천"
        className={cn(
          'fixed inset-x-0 bottom-4 z-50 mx-auto w-[calc(100%-1rem)] max-w-2xl rounded-2xl border border-slate-200 bg-white p-3 transition-all duration-500 ease-out sm:px-4',
          activated
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0',
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex min-w-0 items-center gap-3 sm:flex-1">
            {post.thumbnail ? (
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-slate-900 sm:size-16">
                <Image
                  src={post.thumbnail}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="size-14 shrink-0 rounded-xl bg-slate-100 sm:size-16" />
            )}

            <div className="min-w-0 flex-1">
              <div className="text-xs text-slate-400 sm:text-sm">
                {isLatestFallback ? '최신 글' : '이 글도 좋아하실 거예요'}
              </div>
              <div className="line-clamp-2 text-sm font-semibold text-slate-800 sm:truncate sm:text-base">
                {post.title}
              </div>
            </div>
          </div>

          <div className="flex gap-2 sm:ml-auto sm:shrink-0 sm:items-center">
            <Button
              variant="ghost"
              onClick={dismiss}
              className="h-auto flex-1 px-3 py-2 text-sm sm:flex-none sm:px-4"
            >
              취소
            </Button>
            <Button
              onClick={navigate}
              className="relative h-auto flex-1 overflow-hidden bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 sm:flex-none sm:px-4"
            >
              <span
                ref={progressRef}
                aria-hidden="true"
                className="absolute inset-0 origin-left bg-blue-200/70 will-change-transform"
                style={{ transform: 'scaleX(0)' }}
              />
              <span className="relative inline-flex items-center gap-1.5">
                지금 읽기
                <ArrowRight className="size-4" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
