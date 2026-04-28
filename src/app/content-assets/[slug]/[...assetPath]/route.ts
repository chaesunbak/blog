import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const CONTENT_DIRECTORY = path.join(process.cwd(), "content");

const CONTENT_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function getContentType(filePath: string) {
  return CONTENT_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

function isSafeRelativePath(value: string) {
  return !path.isAbsolute(value) && !value.split("/").includes("..");
}

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ slug: string; assetPath: string[] }>;
  }
) {
  const { slug, assetPath } = await params;
  const relativeAssetPath = assetPath.join("/");

  if (!isSafeRelativePath(slug) || !isSafeRelativePath(relativeAssetPath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const absolutePath = path.join(CONTENT_DIRECTORY, slug, relativeAssetPath);

  try {
    const file = await fs.readFile(absolutePath);

    return new NextResponse(file, {
      headers: {
        "Content-Type": getContentType(absolutePath),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
