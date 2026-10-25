import { Avatar as Base } from "@base-ui/react/avatar";

type AvatarProps = { src?: string; name: string; size?: "sm" | "lg" };

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

// Photo with an initials fallback while it loads or if it is missing; the name is the alt text.
export function Avatar({ src, name, size = "sm" }: AvatarProps) {
  return (
    <Base.Root className={`ui-avatar ui-avatar--${size}`}>
      {src && <Base.Image src={src} alt={name} className="ui-avatar__image" />}
      <Base.Fallback className="ui-avatar__fallback">
        <span aria-hidden="true">{initials(name)}</span>
        <span className="ui-visually-hidden">{name}</span>
      </Base.Fallback>
    </Base.Root>
  );
}
