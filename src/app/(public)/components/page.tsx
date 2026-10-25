import type { Metadata } from "next";
import { connection } from "next/server";
import { type ReactNode, Suspense } from "react";
import { NAV } from "@/components/shell/nav";
import { Accordion } from "@/components/ui/accordion";
import { Alert } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { DateInput } from "@/components/ui/date-input";
import { Drawer } from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { Fieldset } from "@/components/ui/fieldset";
import { File } from "@/components/ui/file";
import { FileUpload } from "@/components/ui/file-upload";
import { Footer } from "@/components/ui/footer";
import { Form } from "@/components/ui/form";
import { Header } from "@/components/ui/header";
import { Heading } from "@/components/ui/heading";
import { Icon, type IconName } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";
import { List } from "@/components/ui/list";
import { Navigation } from "@/components/ui/navigation";
import { Popover } from "@/components/ui/popover";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Timeline } from "@/components/ui/progress-indicator";
import { RadioButtons } from "@/components/ui/radio-button";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Stack } from "@/components/ui/stack";
import { type Column, Table } from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import { TextInput } from "@/components/ui/text-input";
import { Textarea } from "@/components/ui/textarea";
import { ToastProvider } from "@/components/ui/toast";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip } from "@/components/ui/tooltip";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { experienceMonths } from "@/lib/experience";
import { certificateStatus, currentMonth, formatDuration } from "@/lib/format";
import certifications from "../../../../content/seed/certifications.json";
import experiences from "../../../../content/seed/experiences.json";
import profile from "../../../../content/seed/profile.json";
import projects from "../../../../content/seed/projects.json";
import skills from "../../../../content/seed/skills.json";
import {
  type DemoProject,
  DownloadDemo,
  ModalDemo,
  ProjectFilter,
  ProjectStatus,
  RowActions,
  ThemeMenu,
  ToastDemo,
} from "./demos";
import "./showcase.css";

export const metadata: Metadata = {
  title: "Design system",
  description:
    "Every component this portfolio is built from, with its states and accessibility notes, in component.gallery order.",
};

const published = projects
  .filter((p) => p.status === "published")
  .sort((a, b) => a.sort_order - b.sort_order);
const demoProjects: DemoProject[] = published.map((p) => ({
  id: p.id,
  title: p.title,
  tagline: p.tagline,
  summary: p.summary,
  kind: p.kind,
  state: p.state,
  serial: p.sort_order,
}));
const [sobat, policy] = published;
const stackOptions = skills.map((s) => ({ value: s.id, label: s.name }));
const issuers = [...new Set(certifications.map((c) => c.issuer))].map((i) => ({
  value: i,
  label: i,
}));
const linkedin = profile.links.find((l) => l.kind === "linkedin")?.url ?? "";

// The architecture of this site as a picture, built from the same facts as the meishi's back (no stock image).
const diagram = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 200" font-family="sans-serif" font-size="16"><rect width="640" height="200" fill="#f6f7f5"/><g fill="none" stroke="#6a7685"><rect x="24" y="64" width="150" height="72" rx="2"/><rect x="230" y="64" width="190" height="72" rx="2"/><rect x="476" y="64" width="140" height="72" rx="2"/><path d="M174 100h56M420 100h56" stroke="#16191e"/></g><g fill="#16191e" font-weight="700"><text x="40" y="96">Browser</text><text x="246" y="96">Worker</text><text x="492" y="96">D1 + R2</text></g><g fill="#4f5a68" font-size="13"><text x="40" y="118">this page</text><text x="246" y="118">Next.js 16 · Hono</text><text x="492" y="118">content, files</text></g></svg>`,
)}`;

type Entry = { slug: string; name: string; note: string; children: ReactNode };

// Each component in its states. Hover and focus are live: point at or tab to anything below.
function Showcase({ slug, name, note, children }: Entry) {
  return (
    <section id={slug} aria-labelledby={`${slug}-h`} className="showcase">
      <div className="showcase__head">
        <Heading level={2} size="section" id={`${slug}-h`}>
          {name}
        </Heading>
        <Link
          href={`https://component.gallery/components/${slug}/`}
          external="component.gallery"
        >
          Reference
        </Link>
      </div>
      <p className="showcase__note">{note}</p>
      <div className="showcase__demo">{children}</div>
    </section>
  );
}

function State({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="showcase__state">
      <p className="showcase__label">{label}</p>
      {children}
    </div>
  );
}

const iconNames: IconName[] = [
  "arrow-right",
  "check",
  "chevron-down",
  "chevron-right",
  "chevron-up-down",
  "close",
  "download",
  "external",
  "file",
  "flip",
  "info",
  "menu",
  "more",
  "search",
  "upload",
  "warning",
];

const certColumns: Column<(typeof certifications)[number]>[] = [
  {
    key: "name",
    header: "Certification",
    cell: (c) => c.name,
    rowHeader: true,
  },
  { key: "issuer", header: "Issuer", cell: (c) => c.issuer },
  {
    key: "issued",
    header: "Issued",
    cell: (c) => <time dateTime={c.issued_at}>{c.issued_at}</time>,
    figure: true,
  },
  {
    key: "expires",
    header: "Expires",
    cell: (c) =>
      c.expires_at ? <time dateTime={c.expires_at}>{c.expires_at}</time> : "—",
    figure: true,
  },
];

const entries = (): Entry[] => [
  {
    slug: "accordion",
    name: "Accordion",
    note: "Each trigger is a button inside a heading, with aria-expanded; several sections may stay open.",
    children: (
      <Accordion
        items={[
          { id: "role", title: "Role", content: sobat.role },
          { id: "summary", title: "What it does", content: sobat.summary },
        ]}
      />
    ),
  },
  {
    slug: "alert",
    name: "Alert",
    note: "Results of an action are announced (status for success, alert for errors); icons repeat the tone, text carries it.",
    children: (
      <div className="grid gap-4">
        <Alert title="Draft saved" tone="success">
          SOBAT-PS stays hidden until you publish it.
        </Alert>
        <Alert title="The slug is already taken" tone="error">
          “sobat-ps” belongs to another project. Change the title or type a new
          slug.
        </Alert>
        <Alert title="Seed data only">
          This list fills from D1 once the manage area ships.
        </Alert>
      </div>
    ),
  },
  {
    slug: "avatar",
    name: "Avatar",
    note: "The name is the accessible label; initials show while the photo loads or when it fails.",
    children: (
      <Stack direction="row" gap={6} className="items-start">
        <State label="No photo">
          <Avatar name={profile.name} size="lg" />
        </State>
        <State label="Photo failed">
          <Avatar name={profile.name} src="/media/missing.jpg" />
        </State>
      </Stack>
    ),
  },
  {
    slug: "badge",
    name: "Badge",
    note: "Status is a word, never colour alone. Only Live uses 朱; expired is struck through and says so.",
    children: (
      <Stack direction="row" gap={6} wrap>
        <ProjectStatus state="live" />
        <ProjectStatus state="in_progress" />
        <ProjectStatus state="archived" />
        <Badge tone="expired">Expired 2025-05</Badge>
        <Badge tone="tag">Laravel</Badge>
        <Badge tone="tag">Cloudflare Workers</Badge>
      </Stack>
    ),
  },
  {
    slug: "breadcrumbs",
    name: "Breadcrumbs",
    note: "A nav landmark named Breadcrumb; the last item is the current page (aria-current) and is not a link.",
    children: (
      <Breadcrumbs
        items={[
          { label: "Projects", href: "/projects" },
          { label: policy.title },
        ]}
      />
    ),
  },
  {
    slug: "button",
    name: "Button",
    note: "Primary is sumi ink: one per section. 朱 is reserved for Download CV. Disabled keeps AA text and turns dashed.",
    children: (
      <Stack direction="row" gap={4} wrap>
        <Button variant="primary">Publish</Button>
        <Button variant="secondary">Save draft</Button>
        <Button variant="quiet">Cancel</Button>
        <Button variant="secondary" disabled>
          Archive
        </Button>
        <Button variant="primary" loading>
          Saving
        </Button>
        <Tooltip content="Search projects and skills">
          <Button
            variant="secondary"
            icon
            aria-label="Search projects and skills"
          >
            <Icon name="search" />
          </Button>
        </Tooltip>
      </Stack>
    ),
  },
  {
    slug: "button-group",
    name: "Button group",
    note: "A labelled group of related actions; it wraps instead of overflowing on a 320 px screen.",
    children: (
      <ButtonGroup label="Record actions">
        <Button variant="primary">Publish</Button>
        <Button variant="secondary">Preview</Button>
        <Button variant="quiet">Discard changes</Button>
      </ButtonGroup>
    ),
  },
  {
    slug: "card",
    name: "Card",
    note: "Records lie flat on the table and lift on hover or focus while the others dim (still AA). The whole card is one link.",
    children: (
      <div id="card">
        <ProjectFilter projects={demoProjects} />
      </div>
    ),
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    note: "The whole 44 px row is the target; a native input underneath keeps forms and validation working.",
    children: (
      <div className="grid">
        <Checkbox name="featured" label="Show on Overview" defaultChecked />
        <Checkbox
          name="repo"
          label="Link the public repository"
          hint="Private repositories never show a link."
        />
        <Checkbox name="locked" label="Lock the slug" disabled defaultChecked />
      </div>
    ),
  },
  {
    slug: "combobox",
    name: "Combobox",
    note: "Typing filters the list and the result count is announced; arrows move, Enter picks, Esc closes.",
    children: (
      <div className="grid gap-6 sm:grid-cols-2">
        <Combobox
          label="Stack"
          items={stackOptions}
          placeholder="Type a technology"
        />
        <Combobox
          label="Skills used"
          items={stackOptions}
          multiple
          defaultValue={stackOptions.filter((o) =>
            ["laravel", "php", "bootstrap"].includes(o.value),
          )}
          placeholder="Add a skill"
        />
      </div>
    ),
  },
  {
    slug: "date-input",
    name: "Date input",
    note: "Months as YYYY-MM with a numeric keyboard; the format is in the hint, not only the placeholder.",
    children: (
      <div className="grid gap-6 sm:grid-cols-2">
        <DateInput label="Start month" name="start" defaultValue="2022-04" />
        <DateInput
          label="End month"
          name="end"
          optional
          error="End month is before the start month"
          defaultValue="2021-09"
        />
      </div>
    ),
  },
  {
    slug: "drawer",
    name: "Drawer",
    note: "Focus moves into the sheet and back to its trigger; swipe, Esc or the scrim close it.",
    children: (
      <Stack direction="row" gap={4} wrap>
        <Drawer
          side="left"
          title="Sections"
          trigger={<Button variant="secondary">Open navigation</Button>}
        >
          <Navigation items={NAV} current="/components" />
        </Drawer>
        <Drawer
          side="bottom"
          title="Filter projects"
          trigger={<Button variant="secondary">Open filters</Button>}
        >
          <RadioButtons
            legend="Project type"
            name="kind-sheet"
            defaultValue="all"
            options={[
              { value: "all", label: "All" },
              { value: "work", label: "Work" },
              { value: "personal", label: "Personal" },
            ]}
          />
        </Drawer>
      </Stack>
    ),
  },
  {
    slug: "dropdown-menu",
    name: "Dropdown menu",
    note: "Menu semantics with arrow keys and type-ahead. The theme menu switches this page; disabled items stay readable.",
    children: (
      <Stack direction="row" gap={4} wrap>
        <ThemeMenu />
        <RowActions title={sobat.title} />
      </Stack>
    ),
  },
  {
    slug: "empty-state",
    name: "Empty state",
    note: "Says what is missing and gives one way forward. No illustration, no invented numbers.",
    children: (
      <EmptyState
        title="No certifications in draft"
        action={<Button variant="secondary">Add a certification</Button>}
      >
        Published certifications appear on Education; drafts wait here.
      </EmptyState>
    ),
  },
  {
    slug: "fieldset",
    name: "Fieldset",
    note: "Related fields share a legend that screen readers announce with each field.",
    children: (
      <Fieldset legend="Period">
        <DateInput
          label="Start month"
          name="period-start"
          defaultValue="2026-08"
        />
        <DateInput label="End month" name="period-end" optional />
      </Fieldset>
    ),
  },
  {
    slug: "file",
    name: "File",
    note: "The signature: ready, then downloading (the fill follows real bytes), then done, stamped like a hanko. Without JS it is a plain link; if the file fails, LinkedIn is offered.",
    children: (
      <Stack direction="row" gap={6} wrap>
        <State label="Live">
          <DownloadDemo />
        </State>
        <State label="Downloading">
          <File
            href="/cv"
            filename="cv.pdf"
            format="PDF"
            fallback={{ href: linkedin, label: "LinkedIn" }}
            state="downloading"
          />
        </State>
        <State label="Done">
          <File
            href="/cv"
            filename="cv.pdf"
            format="PDF"
            fallback={{ href: linkedin, label: "LinkedIn" }}
            state="done"
          />
        </State>
        <State label="Failed">
          <File
            href="/cv"
            filename="cv.pdf"
            format="PDF"
            fallback={{ href: linkedin, label: "LinkedIn" }}
            state="error"
          />
        </State>
      </Stack>
    ),
  },
  {
    slug: "file-upload",
    name: "File upload",
    note: "A real file input under a large drop zone: tap on phones, drag on desktop. Size is checked before upload.",
    children: (
      <div className="grid gap-6 sm:grid-cols-2">
        <FileUpload
          label="CV"
          name="cv"
          accept="application/pdf"
          maxBytes={5 * 1024 * 1024}
        />
        <FileUpload
          label="Cover image"
          name="cover"
          accept="image/webp"
          maxBytes={1024 * 1024}
          error="This file is 3.2 MB; the limit is 1.0 MB."
        />
      </div>
    ),
  },
  {
    slug: "footer",
    name: "Footer",
    note: "A contentinfo landmark with the owner and the source; it clears the iPhone home bar.",
    children: (
      <div className="showcase__frame">
        <Footer>
          <span>© 2026 {profile.name}</span>
          <Link
            href="https://github.com/besarrahmat/portfolio"
            external="GitHub"
          >
            Source
          </Link>
        </Footer>
      </div>
    ),
  },
  {
    slug: "form",
    name: "Form",
    note: "Native validation messages appear on submit; focus moves to the first invalid field. Server errors map to fields by name.",
    children: (
      <Form>
        <TextInput label="Title" name="title" defaultValue={policy.title} />
        <TextInput
          label="Live URL"
          name="url"
          type="url"
          inputMode="url"
          optional
          placeholder="https://"
        />
        <Button type="submit" variant="primary">
          Save
        </Button>
      </Form>
    ),
  },
  {
    slug: "header",
    name: "Header",
    note: "The topbar frame: 52 px on phones, 56 px on desktop. The shell fills it in Fase 6.",
    children: (
      <div className="showcase__frame">
        <Header
          start={
            <>
              <Button variant="quiet" icon aria-label="Open menu">
                <Icon name="menu" />
              </Button>
              <span className="text-sm font-bold uppercase tracking-label">
                Design system
              </span>
            </>
          }
          end={
            <Button
              variant="quiet"
              icon
              aria-label="Search projects and skills"
            >
              <Icon name="search" />
            </Button>
          }
        />
      </div>
    ),
  },
  {
    slug: "heading",
    name: "Heading",
    note: "Hierarchy by scale only: no eyebrow above, no number before. Visual size is separate from document level.",
    children: (
      <div className="grid gap-2">
        <Heading level={3} size="page">
          Projects
        </Heading>
        <Heading level={3} size="section">
          On the table
        </Heading>
        <Heading level={3} size="record">
          {sobat.title}
        </Heading>
        <Heading level={3} size="label">
          Architecture
        </Heading>
      </div>
    ),
  },
  {
    slug: "icon",
    name: "Icon",
    note: "One authored set on a 24 px grid with a 1.75 stroke. Decorative by default; an icon alone gets a label.",
    children: (
      <ul className="showcase__icons">
        {iconNames.map((n) => (
          <li key={n}>
            <Icon name={n} />
            <span>{n}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    slug: "image",
    name: "Image",
    note: "Width and height are required so nothing shifts; alt says what the picture shows. Diagrams render from data.",
    children: (
      <Image
        src={diagram}
        alt="Architecture of this site: the browser calls a Cloudflare Worker running Next.js 16 and Hono, which reads content from D1 and files from R2."
        width={640}
        height={200}
        caption="This page, served from Cloudflare."
      />
    ),
  },
  {
    slug: "label",
    name: "Label",
    note: "Every field has a visible label that is also its accessible name; optional fields say so in words.",
    children: (
      <div className="grid gap-6 sm:grid-cols-2">
        <TextInput label="Issuer" name="issuer" defaultValue="Dicoding" />
        <TextInput
          label="Credential ID"
          name="credential"
          optional
          hint="Shown next to the certificate when present."
        />
      </div>
    ),
  },
  {
    slug: "link",
    name: "Link",
    note: "Underlined in text. Links that leave the site carry an icon and a hidden “opens …” phrase.",
    children: (
      <Stack direction="row" gap={6} wrap>
        <Link href="/projects">All projects</Link>
        <Link href={linkedin} external="LinkedIn">
          LinkedIn
        </Link>
        <Link href="https://sobat-ps.kaltaraprov.go.id" external="SOBAT-PS">
          sobat-ps.kaltaraprov.go.id
        </Link>
      </Stack>
    ),
  },
  {
    slug: "list",
    name: "List",
    note: "A ruled list; meta (issuer, dates) wraps under the title on phones instead of squeezing it.",
    children: (
      <Suspense
        fallback={<Skeleton lines={4} label="Loading certifications" />}
      >
        <CertificationList />
      </Suspense>
    ),
  },
  {
    slug: "modal",
    name: "Modal",
    note: "Only for tasks that need protected focus: an import preview and an archive confirmation. Esc never confirms.",
    children: <ModalDemo />,
  },
  {
    slug: "navigation",
    name: "Navigation",
    note: "Every item has a text label; the current page is marked by weight, card stock and aria-current.",
    children: (
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="max-w-60">
          <Navigation items={NAV} current="/components" />
        </div>
        <div className="showcase__frame self-start">
          <Navigation
            items={NAV.slice(0, 4)}
            current="/"
            layout="bar"
            label="Primary"
          />
        </div>
      </div>
    ),
  },
  {
    slug: "popover",
    name: "Popover",
    note: "Opens on press, so it works on touch; Esc or a press outside closes it and focus returns.",
    children: (
      <p className="text-sm text-ink-2">
        Experience:{" "}
        <Suspense fallback={<span className="figure text-ink">…</span>}>
          <ExperienceTotal />
        </Suspense>{" "}
        <Popover
          trigger={
            <Button variant="quiet" icon aria-label="How experience is counted">
              <Icon name="info" />
            </Button>
          }
          title="How experience is counted"
        >
          Work periods since 2022-04 are merged; overlaps count once and gaps
          are not counted. It is computed when the page renders.
        </Popover>
      </p>
    ),
  },
  {
    slug: "progress-bar",
    name: "Progress bar",
    note: "A progressbar role with its value as a percentage; unknown sizes slide instead of faking a number.",
    children: (
      <div className="grid gap-6 sm:grid-cols-2">
        <ProgressBar label="Uploading cv.pdf" value={64} />
        <ProgressBar label="Preparing import" value={null} />
      </div>
    ),
  },
  {
    slug: "progress-indicator",
    name: "Progress indicator",
    note: "Experience as a dated log: exact YYYY-MM stamps on one baseline, duration computed, the current role marked.",
    children: (
      <Suspense fallback={<Skeleton lines={6} label="Loading experience" />}>
        <ExperienceLog />
      </Suspense>
    ),
  },
  {
    slug: "radio-button",
    name: "Radio button",
    note: "A radiogroup under a legend; arrow keys move and select. Each option is a 44 px row.",
    children: (
      <RadioButtons
        legend="Status"
        name="status"
        defaultValue="draft"
        options={[
          { value: "draft", label: "Draft" },
          { value: "published", label: "Published" },
          { value: "archived", label: "Archived", disabled: true },
        ]}
      />
    ),
  },
  {
    slug: "search-input",
    name: "Search input",
    note: "type=search with a real label; 16 px text so iOS does not zoom. The live filter is in Card above.",
    children: <SearchInput label="Search skills" />,
  },
  {
    slug: "segmented-control",
    name: "Segmented control",
    note: "Toggle buttons with aria-pressed; exactly one segment is always on. It drives the Card demo above.",
    children: (
      <p className="text-sm text-ink-2">
        <Link href="#card">Try it on the project cards</Link>
      </p>
    ),
  },
  {
    slug: "select",
    name: "Select",
    note: "A listbox with type-ahead; the selected option is ticked and submitted through a hidden input.",
    children: (
      <div className="grid gap-6 sm:grid-cols-2">
        <Select
          label="Issuer"
          name="issuer-select"
          items={issuers}
          defaultValue="Dicoding"
        />
        <Select
          label="Project type"
          name="kind"
          items={[
            { value: "work", label: "Work" },
            { value: "personal", label: "Personal" },
          ]}
          disabled
        />
      </div>
    ),
  },
  {
    slug: "separator",
    name: "Separator",
    note: "A hairline rule between unrelated groups; most grouping is done with space instead.",
    children: (
      <div>
        <p className="text-sm">Published projects: {published.length}</p>
        <Separator />
        <p className="text-sm">Certifications: {certifications.length}</p>
      </div>
    ),
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    note: "Takes the shape of what is coming and announces once; it stops pulsing under reduced motion.",
    children: (
      <div className="grid gap-6 sm:grid-cols-2">
        <Skeleton shape="card" label="Loading project" />
        <Skeleton lines={4} label="Loading summary" />
      </div>
    ),
  },
  {
    slug: "skip-link",
    name: "Skip link",
    note: "The first Tab on every page; it appears on focus and jumps past the navigation.",
    children: (
      <p className="text-sm text-ink-2">
        Reload the page and press Tab once to see it at the top left.
      </p>
    ),
  },
  {
    slug: "spinner",
    name: "Spinner",
    note: "Only inside a control that is busy; the control's own label says what is happening.",
    children: (
      <Stack direction="row" gap={4}>
        <Spinner label="Saving" />
        <span className="text-sm text-ink-2">Saving</span>
      </Stack>
    ),
  },
  {
    slug: "stack",
    name: "Stack",
    note: "One direction, one gap from the 4 / 8 / 16 / 24 / 32 / 48 / 64 scale. No other spacing exists.",
    children: (
      <Stack direction="row" gap={2} wrap>
        {[1, 2, 4, 6, 8, 12, 16].map((g) => (
          <span
            key={g}
            className="showcase__gap figure"
            style={{ width: `calc(var(--spacing) * ${g})` }}
          >
            <VisuallyHidden>{g * 4} px</VisuallyHidden>
          </span>
        ))}
      </Stack>
    ),
  },
  {
    slug: "table",
    name: "Table",
    note: "A real table with caption, column and row headers. Dates are fixed-pitch and right-aligned; it scrolls sideways inside a focusable region.",
    children: (
      <Table
        caption="Certifications"
        columns={certColumns}
        rows={certifications}
        rowKey={(c) => c.id}
      />
    ),
  },
  {
    slug: "tabs",
    name: "Tabs",
    note: "Arrow keys move between tabs; the list scrolls sideways on phones rather than wrapping.",
    children: (
      <Tabs
        label={`${policy.title} details`}
        tabs={[
          {
            value: "overview",
            label: "Overview",
            content: <p className="max-w-[65ch]">{policy.summary}</p>,
          },
          {
            value: "role",
            label: "Role",
            content: <p className="max-w-[65ch]">{policy.role}</p>,
          },
          {
            value: "stack",
            label: "Stack",
            content: (
              <Stack direction="row" gap={2} wrap>
                <Badge tone="tag">TypeScript</Badge>
                <Badge tone="tag">GitHub Actions</Badge>
                <Badge tone="tag">Vitest</Badge>
              </Stack>
            ),
          },
        ]}
      />
    ),
  },
  {
    slug: "text-input",
    name: "Text input",
    note: "type and inputmode pick the right phone keyboard. Errors are linked to the field and named in words.",
    children: (
      <div className="grid gap-6 sm:grid-cols-2">
        <TextInput
          label="Slug"
          name="slug"
          defaultValue="policy-semver"
          hint="Lowercase letters, digits and dashes."
        />
        <TextInput
          label="Slug"
          name="slug-error"
          defaultValue="Policy SemVer"
          error="Use lowercase letters, digits and single dashes"
        />
        <TextInput
          label="Slug after publish"
          name="slug-locked"
          defaultValue="sobat-ps"
          disabled
          hint="Published slugs are locked."
        />
      </div>
    ),
  },
  {
    slug: "textarea",
    name: "Textarea",
    note: "Grows with its content up to 60% of the screen, then scrolls. Markdown is allowed in summaries.",
    children: (
      <Textarea label="Summary" name="summary" defaultValue={sobat.summary} />
    ),
  },
  {
    slug: "toast",
    name: "Toast",
    note: "Polite announcement, 5 s, paused while hovered or focused. It never holds the only copy of an error.",
    children: <ToastDemo />,
  },
  {
    slug: "toggle",
    name: "Toggle",
    note: "A switch for settings that apply at once. The label states what “on” means.",
    children: (
      <div className="grid">
        <Toggle
          label="Featured on Overview"
          name="featured-switch"
          defaultChecked
        />
        <Toggle
          label="Published"
          name="published"
          hint="Drafts are visible only in manage."
        />
        <Toggle label="Lock slug" name="lock" defaultChecked disabled />
      </div>
    ),
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    note: "Repeats the name of an icon button on hover and focus. It never holds anything you need to read.",
    children: (
      <Tooltip content="Download the CV as PDF">
        <Button variant="secondary" icon aria-label="Download the CV as PDF">
          <Icon name="download" />
        </Button>
      </Tooltip>
    ),
  },
  {
    slug: "visually-hidden",
    name: "Visually hidden",
    note: "Text for screen readers only, such as “(opens LinkedIn)” after an external link.",
    children: (
      <p className="text-sm text-ink-2">
        You see an icon after{" "}
        <Link href={linkedin} external="LinkedIn">
          LinkedIn
        </Link>
        ; screen readers also hear “(opens LinkedIn)”.
      </p>
    ),
  },
];

// Dates depend on "now", so these two render at request time (the rest of the page is static).
async function ExperienceLog() {
  await connection();
  const now = currentMonth(new Date());
  return (
    <Timeline
      now={now}
      entries={[...experiences]
        .sort((a, b) => b.start.localeCompare(a.start))
        .map((e) => ({
          id: e.id,
          title: e.role,
          org: e.company,
          start: e.start,
          end: e.end,
        }))}
    />
  );
}

async function ExperienceTotal() {
  await connection();
  const months = experienceMonths(
    experiences.filter((e) => e.counts_toward_experience),
    currentMonth(new Date()),
  );
  return <span className="figure text-ink">{formatDuration(months)}</span>;
}

async function CertificationList() {
  await connection();
  const now = currentMonth(new Date());
  return (
    <List
      items={certifications
        .filter((c) =>
          [
            "google-workspace-admin",
            "dicoding-python",
            "dicoding-java",
          ].includes(c.id),
        )
        .map((c) => {
          const expired = certificateStatus(c.expires_at, now) === "expired";
          return {
            id: c.id,
            title: c.name,
            detail: c.issuer,
            meta: (
              <>
                <time dateTime={c.issued_at}>{c.issued_at}</time>
                {expired && (
                  <Badge tone="expired">Expired {c.expires_at}</Badge>
                )}
              </>
            ),
          };
        })}
    />
  );
}

export default function ComponentsPage() {
  const list = entries();
  return (
    <ToastProvider>
      <div className="showcase-page">
        <header className="showcase-page__intro">
          <Heading level={1}>Design system</Heading>
          <p>
            The {list.length} components this portfolio is built from, in{" "}
            <Link
              href="https://component.gallery/components/"
              external="component.gallery"
            >
              component.gallery
            </Link>{" "}
            order. Each shows its states; hover, focus and keyboard work
            everywhere on the page.
          </p>
          <nav aria-label="Components">
            <ul className="showcase-page__index">
              {list.map((e) => (
                <li key={e.slug}>
                  <a href={`#${e.slug}`}>{e.name}</a>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        {list.map((e) => (
          <Showcase key={e.slug} {...e} />
        ))}
      </div>
    </ToastProvider>
  );
}
