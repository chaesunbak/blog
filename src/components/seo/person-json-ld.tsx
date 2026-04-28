import { JsonLd } from "@/components/seo/json-ld";
import { createPersonJsonLd } from "@/lib/json-ld";

export function PersonJsonLd() {
  return <JsonLd id="person-json-ld" data={createPersonJsonLd()} />;
}
