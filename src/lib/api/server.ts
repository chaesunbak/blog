import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { type Post, getPostBySlug, getRecommendedCandidates } from '@/lib/posts';

const app = new Hono().basePath('/api');

const toThumbnailUrl = (thumbnail: Post['thumbnail']): string | null => {
  if (!thumbnail) return null;
  if (typeof thumbnail === 'string') return thumbnail;
  return thumbnail.src;
};

const routes = app.get(
  '/posts/:slug/recommendation',
  zValidator('query', z.object({ visited: z.string().optional() })),
  async (c) => {
    const slug = c.req.param('slug');
    const { visited: visitedRaw } = c.req.valid('query');
    const visited = new Set(visitedRaw ? visitedRaw.split(',') : []);

    const post = await getPostBySlug(slug);
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    const { candidates, latestPost } = await getRecommendedCandidates(
      post.slug,
      post.tags,
    );

    const pick = candidates.find((p) => !visited.has(p.slug));
    if (pick) {
      return c.json({
        slug: pick.slug,
        title: pick.title,
        thumbnail: toThumbnailUrl(pick.thumbnail),
        reason: 'tag_match' as const,
      });
    }

    if (latestPost && !visited.has(latestPost.slug)) {
      return c.json({
        slug: latestPost.slug,
        title: latestPost.title,
        thumbnail: toThumbnailUrl(latestPost.thumbnail),
        reason: 'latest' as const,
      });
    }

    return c.json({ error: 'No recommendation available' }, 404);
  },
);

export type AppType = typeof routes;
export default app;
