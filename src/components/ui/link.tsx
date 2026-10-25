import NextLink from "next/link";
import type { ComponentProps } from "react";
import { cx } from "./cx";
import { Icon } from "./icon";
import { VisuallyHidden } from "./visually-hidden";

type LinkProps = ComponentProps<"a"> & {
  href: string;
  /** Marks a link that leaves the site: icon plus hidden "(opens <site>)" text. */
  external?: string;
};

// Internal links go through next/link; external ones say where they lead.
export function Link({
  href,
  external,
  className,
  children,
  ...rest
}: LinkProps) {
  const cls = cx("ui-link", className);
  if (external)
    return (
      <a {...rest} href={href} className={cls} rel="noopener">
        {children}
        <Icon name="external" size="sm" />
        <VisuallyHidden>(opens {external})</VisuallyHidden>
      </a>
    );
  return (
    <NextLink {...rest} href={href} className={cls}>
      {children}
    </NextLink>
  );
}
