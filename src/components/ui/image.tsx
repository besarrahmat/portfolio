import type { ReactNode } from "react";

type ImageProps = {
  src: string;
  /** Required: describe what the picture shows; "" only for pure decoration. */
  alt: string;
  width: number;
  height: number;
  caption?: ReactNode;
  /** Above-the-fold images load eagerly; everything else lazily. */
  priority?: boolean;
};

// Screenshot or diagram on card stock. Dimensions are required so the page never shifts while it loads.
export function Image({
  src,
  alt,
  width,
  height,
  caption,
  priority,
}: ImageProps) {
  // shortcut: plain <img>, no next/image optimisation on Workers yet; revisit with images in Fase 7/11.
  const img = (
    // biome-ignore lint/performance/noImgElement: next/image needs an image loader we have not set up on Workers.
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className="ui-image"
    />
  );
  return caption ? (
    <figure className="ui-figure">
      {img}
      <figcaption>{caption}</figcaption>
    </figure>
  ) : (
    img
  );
}
