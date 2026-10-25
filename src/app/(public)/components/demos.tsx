"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardSpread } from "@/components/ui/card";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { File } from "@/components/ui/file";
import { Icon } from "@/components/ui/icon";
import { ConfirmDialog, Modal, ModalClose } from "@/components/ui/modal";
import { SearchInput } from "@/components/ui/search-input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useToast } from "@/components/ui/toast";

export type DemoProject = {
  id: string;
  title: string;
  tagline: string;
  summary: string;
  kind: string;
  state: string;
  serial: number;
};

const stateLabel: Record<string, string> = {
  live: "Live",
  in_progress: "In progress",
  archived: "Archived",
};

export function ProjectStatus({ state }: { state: string }) {
  return (
    <Badge tone={state === "live" ? "live" : "neutral"}>
      {stateLabel[state] ?? state}
    </Badge>
  );
}

// Segmented control and search driving a real filter over the seed projects, with the empty state it can lead to.
export function ProjectFilter({ projects }: { projects: DemoProject[] }) {
  const [kind, setKind] = useState("all");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const shown = projects.filter(
    (p) =>
      (kind === "all" || p.kind === kind) &&
      (!q || `${p.title} ${p.tagline} ${p.summary}`.toLowerCase().includes(q)),
  );
  const count = (k: string) => projects.filter((p) => p.kind === k).length;
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <SegmentedControl
          label="Project type"
          defaultValue="all"
          onChange={setKind}
          options={[
            { value: "all", label: "All", count: projects.length },
            { value: "work", label: "Work", count: count("work") },
            { value: "personal", label: "Personal", count: count("personal") },
          ]}
        />
        <div className="min-w-0 flex-[1_1_16rem]">
          <SearchInput
            label="Search projects"
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
        </div>
      </div>
      {shown.length ? (
        <CardSpread>
          {shown.slice(0, 3).map((p) => (
            <li key={p.id}>
              <Card
                serial={p.serial}
                title={p.title}
                status={<ProjectStatus state={p.state} />}
                href="#card"
                ratio
              >
                {p.tagline}
              </Card>
            </li>
          ))}
        </CardSpread>
      ) : (
        <EmptyState
          title={`No project matches “${query.trim()}”`}
          action={
            <Button variant="secondary" onClick={() => setQuery("")}>
              Clear search
            </Button>
          }
        >
          Search looks in project names, taglines and summaries. Try a stack or
          a place, such as Laravel or Kalimantan.
        </EmptyState>
      )}
    </div>
  );
}

export function RowActions({ title }: { title: string }) {
  const toast = useToast();
  return (
    <DropdownMenu
      trigger={
        <Button variant="quiet" icon aria-label={`Actions for ${title}`}>
          <Icon name="more" />
        </Button>
      }
      items={[
        { label: "Open record", href: "#dropdown-menu" },
        {
          label: "Copy link",
          onSelect: () =>
            toast.add({ title: "Link copied", description: title }),
        },
        { label: "Archive", disabled: true },
      ]}
    />
  );
}

const themes = ["System", "Light", "Dark"];

// The theme menu the shell will use (Fase 6): it really switches this page's theme.
export function ThemeMenu() {
  const [theme, setTheme] = useState("System");
  return (
    <DropdownMenu
      trigger={
        <Button variant="secondary">
          Theme: {theme}
          <Icon name="chevron-down" size="sm" />
        </Button>
      }
      items={themes.map((label) => ({ label }))}
      checked={theme}
      onCheckedChange={(v) => {
        setTheme(v);
        if (v === "System") delete document.documentElement.dataset.theme;
        else document.documentElement.dataset.theme = v.toLowerCase();
      }}
    />
  );
}

export function ToastDemo() {
  const toast = useToast();
  return (
    <Button
      variant="primary"
      onClick={() =>
        toast.add({ title: "Saved", description: "SOBAT-PS is published." })
      }
    >
      Save record
    </Button>
  );
}

export function ModalDemo() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Modal
        trigger={<Button variant="secondary">Preview import</Button>}
        title="Import 3 certifications"
        description="2 new rows will be added. 1 duplicate is skipped and left unchanged."
        actions={
          <>
            <ModalClose className="ui-button ui-button--secondary">
              Cancel
            </ModalClose>
            <ModalClose
              className="ui-button ui-button--primary"
              onClick={() =>
                toast.add({
                  title: "Imported",
                  description: "2 certifications added.",
                })
              }
            >
              Import 2 rows
            </ModalClose>
          </>
        }
      >
        <ul className="grid gap-1 text-sm text-ink-2">
          <li>Memulai Pemrograman dengan Dart · Dicoding · 2024-10</li>
          <li>Belajar Dasar SQL · Dicoding · 2023-10</li>
          <li className="text-ink-3 line-through">
            Fundamental Front-End Web · duplicate
          </li>
        </ul>
      </Modal>
      <ConfirmDialog
        trigger={<Button variant="secondary">Archive record</Button>}
        title="Archive PT HTSI web profile?"
        description="It disappears from the public site. You can publish it again from manage."
        confirmLabel="Archive"
        onConfirm={() =>
          toast.add({ title: "Archived", description: "PT HTSI web profile" })
        }
      />
    </div>
  );
}

export function DownloadDemo() {
  return (
    <File
      href="/cv"
      filename="Besar-Rachmat-Ikhsan-Pambudi-CV.pdf"
      format="PDF"
      fallback={{
        href: "https://www.linkedin.com/in/besarrahmat",
        label: "LinkedIn",
      }}
    />
  );
}
