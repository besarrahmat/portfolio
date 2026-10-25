"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import { Dialog } from "@base-ui/react/dialog";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/icon";
import { NAV } from "./nav";

type Entry = { href: string; label: string };
type Group = { value: string; items: Entry[] };

type CommandPaletteProps = {
  /** The compact index the server streams with the shell; absent while loading or if D1 is down. */
  projects?: { slug: string; title: string }[];
  skills?: { id: string; name: string }[];
};

const noSubscribe = () => () => {};
// null on the server: the shortcut hint only appears once the OS is known (no hydration mismatch).
const useIsMac = () =>
  useSyncExternalStore(
    noSubscribe,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => null,
  );

// ⌘K / Ctrl+K: jump to any page, project or skill. Without JS the button is hidden; the nav still works.
export function CommandPalette({
  projects = [],
  skills = [],
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const mac = useIsMac();
  const hintId = useId();

  useEffect(() => {
    if (mac === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() !== "k" || e.altKey || e.shiftKey) return;
      if (mac ? !e.metaKey || e.ctrlKey : !e.ctrlKey || e.metaKey) return;
      // Leave typing alone: Ctrl+K edits text in some fields; inside the palette it closes it.
      if (
        !open &&
        (e.target as Element).closest?.(
          "input, textarea, select, [contenteditable]",
        )
      )
        return;
      e.preventDefault();
      setOpen((o) => !o);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mac, open]);

  const groups: Group[] = [
    { value: "Pages", items: NAV },
    {
      value: "Projects",
      items: projects.map((p) => ({
        href: `/projects/${p.slug}`,
        label: p.title,
      })),
    },
    {
      value: "Skills",
      // shortcut: links to an anchor on /skills; Fase 7 gives each skill row id={skill.id}.
      items: skills.map((s) => ({ href: `/skills#${s.id}`, label: s.name })),
    },
  ].filter((g) => g.items.length > 0);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="shell-search shell-js"
        aria-keyshortcuts={
          mac === null ? undefined : mac ? "Meta+K" : "Control+K"
        }
      >
        <Icon name="search" />
        <span className="shell-search__label">
          Search pages, projects, skills
        </span>
        {mac !== null && (
          // biome-ignore lint/a11y/noAriaHiddenOnFocusable: <kbd> is not focusable; aria-keyshortcuts already says it.
          <kbd className="shell-search__kbd" aria-hidden="true">
            {mac ? "⌘K" : "Ctrl K"}
          </kbd>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="ui-backdrop" />
        <Dialog.Viewport className="shell-palette-viewport">
          <Dialog.Popup className="shell-palette" aria-label="Search">
            <Autocomplete.Root
              open
              inline
              items={groups}
              itemToStringValue={(item: Entry) => item.label}
              autoHighlight="always"
              keepHighlight
            >
              <div className="ui-search-input shell-palette__input">
                <Icon name="search" />
                <Autocomplete.Input
                  aria-label="Search pages, projects and skills"
                  placeholder="Pages, projects, skills"
                  aria-describedby={hintId}
                  enterKeyHint="go"
                />
              </div>
              <Dialog.Close className="ui-visually-hidden">Close</Dialog.Close>
              <div className="shell-palette__results">
                <Autocomplete.Empty>
                  <p className="shell-palette__empty">
                    No match. Try a project name or a skill such as Laravel.
                  </p>
                </Autocomplete.Empty>
                <Autocomplete.List>
                  {(group: Group) => (
                    <Autocomplete.Group
                      key={group.value}
                      items={group.items}
                      className="shell-palette__group"
                    >
                      <Autocomplete.GroupLabel className="shell-palette__label">
                        {group.value}
                      </Autocomplete.GroupLabel>
                      <Autocomplete.Collection>
                        {(item: Entry) => (
                          <Autocomplete.Item
                            key={item.href}
                            value={item}
                            onClick={() => go(item.href)}
                            className="ui-menu__item"
                          >
                            {item.label}
                          </Autocomplete.Item>
                        )}
                      </Autocomplete.Collection>
                    </Autocomplete.Group>
                  )}
                </Autocomplete.List>
              </div>
              {/* Keyboard users learn the keys here; touch screens hide it but screen readers still hear it. */}
              <p id={hintId} className="shell-palette__hint">
                Arrow keys to move, <kbd>Enter</kbd> to open, <kbd>Esc</kbd> to
                close.
              </p>
            </Autocomplete.Root>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
