import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content");
  
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const entries = fs.readdirSync(contentDir, { withFileTypes: true });
  
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      slug: entry.name,
    }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const { default: Post } = await import(`../../../content/${slug}/index.mdx`);
    
    return (
      <article>
        <Post />
      </article>
    );
  } catch (error) {
    notFound();
  }
}
