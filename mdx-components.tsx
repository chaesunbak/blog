import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    img: (props) => (
      <Image
        {...(props as ImageProps)}
        alt={props.alt || ""}
        style={{ maxWidth: "100%", height: "auto" }}
      />
    ),
  };
}
