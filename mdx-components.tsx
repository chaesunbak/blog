import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

function resolveContentImageSrc(slug: string | undefined, src: string) {
  if (src.startsWith("./") && slug) {
    return `/content-assets/${encodeURIComponent(slug)}/${src.slice(2)}`;
  }

  return src;
}

export function getMDXComponents(slug?: string): MDXComponents {
  return {
    img: (props) => {
      const { src, alt, ...rest } = props as ImageProps;

      if (typeof src === "string") {
        const resolvedSrc = resolveContentImageSrc(slug, src);

        if (!rest.width || !rest.height) {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolvedSrc}
              alt={alt || ""}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          );
        }

        return (
          <Image
            {...rest}
            src={resolvedSrc}
            alt={alt || ""}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        );
      }

      return (
        <Image
          {...(props as ImageProps)}
          alt={alt || ""}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      );
    },
  };
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...getMDXComponents(),
    ...components,
  };
}
