// First focusable element of the shell; jumps past the navigation.
export function SkipLink({ href = "#main" }: { href?: string }) {
  return (
    <a className="ui-skip-link" href={href}>
      Skip to content
    </a>
  );
}
