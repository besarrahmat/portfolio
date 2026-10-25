// Authored icon set: 24 px grid, one 1.75 stroke, round caps. BIZ UDPGothic has no "→", so arrows live here too.
const paths = {
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  check: "m5 12.5 4.5 4.5L19 7.5",
  "chevron-down": "m6 9 6 6 6-6",
  "chevron-right": "m9 6 6 6-6 6",
  "chevron-up-down": "m8 9 4-4 4 4M8 15l4 4 4-4",
  close: "M6 6l12 12M18 6 6 18",
  download: "M12 4v11M7 10l5 5 5-5M5 20h14",
  external:
    "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  file: "M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7zM14 3v4h4M9 13h6M9 17h4",
  flip: "M3 7h12v9H3zM9 19h11V10M18 12l2-2 2 2",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01",
  menu: "M4 7h16M4 12h16M4 17h16",
  more: "M4 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0M11 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0M18 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0",
  search: "M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM20 20l-4.5-4.5",
  upload: "M12 15V4M7 9l5-5 5 5M5 20h14",
  warning: "M12 4 2.5 20h19zM12 10v4M12 17h.01",
} as const;

export type IconName = keyof typeof paths;

type IconProps = {
  name: IconName;
  size?: "sm" | "md";
  /** Give a label only when the icon is the sole content; otherwise it stays decorative. */
  label?: string;
  className?: string;
};

export function Icon({ name, size = "md", label, className }: IconProps) {
  return (
    <svg
      className={["ui-icon", size === "sm" && "ui-icon--sm", className]
        .filter(Boolean)
        .join(" ")}
      viewBox="0 0 24 24"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={paths[name]} />
    </svg>
  );
}
