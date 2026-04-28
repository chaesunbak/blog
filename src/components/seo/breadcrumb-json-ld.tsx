import { JsonLd } from "@/components/seo/json-ld";
import { createBreadcrumbJsonLd } from "@/lib/json-ld";

export function BreadcrumbJsonLd({
  items,
}: {
  items: {
    name: string;
    path: string;
  }[];
}) {
  return (
    <JsonLd id="breadcrumb-json-ld" data={createBreadcrumbJsonLd(items)} />
  );
}
