import { createWebSiteJsonLd } from "@/lib/json-ld";
import { JsonLd } from "@/components/seo/json-ld";

export function WebSiteJsonLd() {
  return <JsonLd id="website-json-ld" data={createWebSiteJsonLd()} />;
}
