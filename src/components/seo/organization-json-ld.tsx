import { JsonLd } from "@/components/seo/json-ld";
import { createOrganizationJsonLd } from "@/lib/json-ld";

export function OrganizationJsonLd({
  name,
  url,
  sameAs,
}: {
  name: string;
  url: string;
  sameAs?: string[];
}) {
  return (
    <JsonLd
      id="organization-json-ld"
      data={createOrganizationJsonLd({ name, url, sameAs })}
    />
  );
}
