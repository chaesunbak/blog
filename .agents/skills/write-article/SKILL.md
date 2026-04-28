---
name: write-article
description: Write or update a blog post in this repository. Use when creating a new post under content/, revising an existing post, choosing a post slug, or preparing article frontmatter, assets, and code blocks for publication.
---

# Write Article

Write posts directly in `content/<slug>/index.mdx`.

## Workflow

1. Decide whether this is a new post or an update to an existing post.
2. If updating, preserve the existing article path. Do not rename the folder unless the user explicitly asks for a path change.
3. If creating, choose the slug before writing any content.
4. Create `content/<slug>/index.mdx` and keep related assets in the same folder.
5. Add code fence languages for every fenced code block whenever possible.

## Post Shape

Use this frontmatter shape unless the existing post already uses a different pattern:

```mdx
---
title: 'Post title'
description: 'One-line summary'
category: '회고'
date: 'YYYY-MM-DD'
tags:
  - 'Tag'
thumbnail: './thumbnail.png'
---
```

- Omit `thumbnail` when the post does not use one.
- Match the quote style and field order already used in nearby posts when editing an existing article.

## Path Rules

- Treat `content/<slug>/` as a public URL contract. Once a post exists, do not change the path just because the title or wording changed.
- Slugs must be lowercase kebab-case.
- Slugs should be specific enough to stay unique over time.
- Prefer a problem, context, or outcome in the slug over a broad topic name.
- If a short generic slug is likely to be reused later, make it more specific now instead of creating a collision-prone path.
- If the ideal slug already exists, choose a more specific slug first.
- If overlap is unavoidable even after making it more specific, append a year suffix such as `-2026`.
- Do not append meaningless suffixes like `-2`, `-new`, or `-final`.

## Slug Examples

Do:

- `react-memo-chat-message-rerendering`
- `react-memo-streaming-chat-performance`
- `react-memo-2026`
- `nextjs-middleware-jwt-edge-runtime`
- `google-sheets-app-script-cors-error`

Don't:

- `react-memo`
- `react-memo-2`
- `react-memo-final`
- `nextjs`
- `troubleshooting`
- `new-post`

## Editing Rules

- Keep assets referenced with relative paths from the article folder.
- Prefer editing the existing post in place instead of recreating it.
- Preserve valid existing frontmatter unless the user asked for metadata changes.
- When fixing prose or examples, avoid changing the slug unless the user explicitly requested it.
