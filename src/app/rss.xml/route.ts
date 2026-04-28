import { createRssResponse } from "@/lib/rss";

export const revalidate = 3600;

export async function GET() {
  return createRssResponse();
}
