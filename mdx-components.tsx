import type { CSSProperties } from 'react';
import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';

function resolveContentImageSrc(slug: string | undefined, src: string) {
  if (src.startsWith('./') && slug) {
    return `/content-assets/${encodeURIComponent(slug)}/${src.slice(2)}`;
  }

  return src;
}

const centeredImageStyle = {
  display: 'block',
  maxWidth: '100%',
  maxHeight: '60vh',
  height: 'auto',
  marginInline: 'auto',
} as const;

function getCenteredImageStyle(style?: CSSProperties) {
  return {
    ...centeredImageStyle,
    ...style,
  };
}

export function getMDXComponents(slug?: string): MDXComponents {
  return {
    img: (props) => {
      const { src, alt, style, ...rest } = props as ImageProps;

      if (typeof src === 'string') {
        const resolvedSrc = resolveContentImageSrc(slug, src);

        if (!rest.width || !rest.height) {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolvedSrc}
              alt={alt || ''}
              style={getCenteredImageStyle(style)}
            />
          );
        }

        return (
          <Image
            {...rest}
            src={resolvedSrc}
            alt={alt || ''}
            style={getCenteredImageStyle(style)}
          />
        );
      }

      return (
        <Image
          {...(props as ImageProps)}
          alt={alt || ''}
          style={getCenteredImageStyle(style)}
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
