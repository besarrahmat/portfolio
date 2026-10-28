import type { Metadata } from "next";
import NextForm from "next/form";
import NextLink from "next/link";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardSpread, formatSerial } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { SearchInput } from "@/components/ui/search-input";
import { type Column, Table } from "@/components/ui/table";
import { listProjects } from "@/server/db/queries";
import { hasPage, KIND_LABEL, Period, StackSummary } from "./record";
import { StateBadge } from "./state-badge";
import "./projects.css";
import Loading from "../loading";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every published project: what it is, its stack, when it ran and whether it is still live.",
};

// "Private repo" only when there is no public code to look at; SOBAT-PS has a public repo and a live site.
const privateOnly = (p: { links: { kind: string; visibility: string }[] }) =>
  p.links.some((l) => l.kind === "repo" && l.visibility === "private") &&
  !p.links.some((l) => l.kind === "repo" && l.visibility === "public");

type Row = Awaited<ReturnType<typeof listProjects>>[number] & {
  serial: number;
};

const SORTS = { no: "Number", name: "Name", newest: "Newest" } as const;
type Sort = keyof typeof SORTS;
type Params = { kind?: string; q?: string; sort?: Sort; skill?: string };

const one = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v)?.trim() || undefined;

// Filters, search and sort live in the URL: they work without JS, survive Back and can be shared.
function hrefFor(params: Params) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(
      ([k, v]) => v && !(k === "sort" && v === "no"),
    ) as [string, string][],
  ).toString();
  return qs ? `/projects?${qs}` : "/projects";
}

// Client navigations re-render only below the shared (public) layout, so its loading.tsx cannot cover them:
// each page brings its own boundary to stay instant (Next 16 instant navigation).
export default function Projects(props: PageProps<"/projects">) {
  return (
    <Suspense fallback={<Loading />}>
      <ProjectsContent {...props} />
    </Suspense>
  );
}

// Operate (docs/PLAN.md §7): a real table on wide screens, a stack of record cards on phones.
async function ProjectsContent({ searchParams }: PageProps<"/projects">) {
  const sp = await searchParams;
  const all: Row[] = (await listProjects()).map((p, i) => ({
    ...p,
    serial: i + 1,
  }));

  const kinds = [...new Set(all.map((p) => p.kind))];
  const kind = kinds.find((k) => k === one(sp.kind));
  const q = one(sp.q);
  const sort: Sort =
    (Object.keys(SORTS) as Sort[]).find((s) => s === one(sp.sort)) ?? "no";
  const skill = all
    .flatMap((p) => p.skills)
    .find((s) => s.id === one(sp.skill));
  const params: Params = { kind, q, sort, skill: skill?.id };

  const needle = q?.toLowerCase();
  const rows = all
    .filter((p) => !kind || p.kind === kind)
    .filter((p) => !skill || p.skills.some((s) => s.id === skill.id))
    .filter(
      (p) =>
        !needle ||
        [p.title, p.tagline, p.summary, ...p.skills.map((s) => s.name)]
          .join(" ")
          .toLowerCase()
          .includes(needle),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.title.localeCompare(b.title)
        : sort === "newest"
          ? b.periodStart.localeCompare(a.periodStart)
          : a.serial - b.serial,
    );

  const filtered = Boolean(kind || q || skill);
  const empty = (
    <EmptyState
      title="No project matches"
      action={<Link href="/projects">Clear filters</Link>}
    >
      {q ? `Nothing mentions “${q}”` : "Nothing fits this filter"}
      {kind || skill ? ` in ${skill?.name ?? KIND_LABEL[kind ?? "work"]}` : ""}.
      Clear the filters to see all {all.length} projects.
    </EmptyState>
  );

  const columns: Column<Row>[] = [
    {
      key: "no",
      header: "No.",
      figure: true,
      cell: (p) => formatSerial(p.serial).slice(4),
    },
    {
      key: "name",
      header: "Project",
      rowHeader: true,
      cell: (p) => (
        <span className="pj-name">
          {hasPage(p) ? (
            <NextLink href={`/projects/${p.slug}`}>{p.title}</NextLink>
          ) : (
            <>
              {p.title}
              <small className="pj-note">No write-up yet</small>
            </>
          )}
          {privateOnly(p) && <Badge>Private repo</Badge>}
        </span>
      ),
    },
    { key: "kind", header: "Kind", cell: (p) => KIND_LABEL[p.kind] },
    {
      key: "stack",
      header: "Stack",
      cell: (p) => <StackSummary skills={p.skills} />,
    },
    {
      key: "period",
      header: "Period",
      figure: true,
      cell: (p) => <Period project={p} />,
    },
    {
      key: "state",
      header: "State",
      cell: (p) => <StateBadge state={p.state} />,
    },
  ];

  return (
    <div className="shell-page pj">
      <Heading level={1}>Projects</Heading>
      <p className="pj-intro">
        {all.length} projects, numbered by importance. Private ones are shown
        through their architecture.
      </p>

      <div className="pj-controls">
        <nav aria-label="Filter by kind" className="ui-segmented">
          {[undefined, ...kinds].map((k) => (
            <NextLink
              key={k ?? "all"}
              href={hrefFor({ ...params, kind: k })}
              className="ui-segmented__item"
              data-pressed={k === kind || undefined}
              aria-current={k === kind ? "page" : undefined}
            >
              {k ? KIND_LABEL[k] : "All"}
              <span className="figure ui-segmented__count">
                {k ? all.filter((p) => p.kind === k).length : all.length}
              </span>
            </NextLink>
          ))}
        </nav>
        <NextForm action="/projects" className="pj-search" role="search">
          {kind && <input type="hidden" name="kind" value={kind} />}
          {sort !== "no" && <input type="hidden" name="sort" value={sort} />}
          {skill && <input type="hidden" name="skill" value={skill.id} />}
          <SearchInput label="Search projects" name="q" defaultValue={q} />
          <Button type="submit">Search</Button>
        </NextForm>
        <nav aria-label="Sort" className="pj-sort">
          <span aria-hidden="true">Sort</span>
          {(Object.keys(SORTS) as Sort[]).map((s) => (
            <NextLink
              key={s}
              href={hrefFor({ ...params, sort: s })}
              aria-current={s === sort ? "true" : undefined}
            >
              {SORTS[s]}
            </NextLink>
          ))}
        </nav>
      </div>

      {filtered && (
        <p className="pj-status" role="status">
          {rows.length} of {all.length} projects
          {kind && <> in {KIND_LABEL[kind]}</>}
          {skill && <> using {skill.name}</>}
          {q && <> matching “{q}”</>}.
          {/* With no rows the empty state already offers it once. */}
          {rows.length > 0 && (
            <>
              {" "}
              <Link href="/projects">Clear filters</Link>
            </>
          )}
        </p>
      )}

      <div className="pj-table">
        <Table
          caption="Projects"
          columns={columns}
          rows={rows}
          rowKey={(p) => p.id}
          empty={empty}
        />
      </div>
      <div className="pj-cards">
        {rows.length === 0 ? (
          empty
        ) : (
          <CardSpread>
            {rows.map((p) => (
              <li key={p.id}>
                <Card
                  serial={p.serial}
                  title={p.title}
                  href={hasPage(p) ? `/projects/${p.slug}` : undefined}
                  status={<StateBadge state={p.state} />}
                  headingLevel={2}
                >
                  <p>{p.tagline}</p>
                  {p.skills.length > 0 && (
                    <p className="pj-meta">
                      <StackSummary skills={p.skills} />
                    </p>
                  )}
                  <p className="pj-meta">
                    {KIND_LABEL[p.kind]} · <Period project={p} />
                    {privateOnly(p) && " · Private repo"}
                  </p>
                </Card>
              </li>
            ))}
          </CardSpread>
        )}
      </div>
    </div>
  );
}
