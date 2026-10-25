"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";

// The choice lives in localStorage (never a cookie: that would make every page dynamic). The inline
// script in app/layout.tsx applies it before first paint; this control only changes and re-applies it.
type Theme = "system" | "light" | "dark";
const KEY = "theme";
const listeners = new Set<() => void>();

function read(): Theme {
  try {
    const t = localStorage.getItem(KEY);
    return t === "light" || t === "dark" ? t : "system";
  } catch {
    return "system"; // storage blocked: follow the device
  }
}

function apply(theme: Theme) {
  if (theme === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
}

function write(theme: Theme) {
  try {
    if (theme === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, theme);
  } catch {}
  apply(theme);
  for (const l of listeners) l();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange); // another tab changed it
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

const options = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function ThemeControl() {
  // The server snapshot is "system", so hydration matches; the stored choice shows right after.
  const theme = useSyncExternalStore(subscribe, read, () => "system" as const);
  // React clears <html> attributes on the dev Strict Mode remount; re-apply (a no-op in production).
  useLayoutEffect(() => apply(read()), []);
  return (
    <div className="shell-theme shell-js">
      <SegmentedControl
        label="Theme"
        options={options}
        defaultValue="system"
        value={theme}
        onChange={(v) => write(v as Theme)}
      />
    </div>
  );
}
