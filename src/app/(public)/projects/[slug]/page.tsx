import type { Metadata } from "next";
import NextLink from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { cache, Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { formatSerial } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { layers } from "@/lib/diagram";
import { currentMonth, formatDuration, spanMonths } from "@/lib/format";
import {
  getProject,
  listExperiences,
  listSearchIndex,
} from "@/server/db/queries";
import { KIND_LABEL, Period } from "../record";
import { StateBadge } from "../state-badge";
import "../projects.css";
import Loading from "../../loading";

// One D1 read shared by generateMetadata and the page in the same request.
const load = cache(getProject);

type Project = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getProject>>>["project"]
>;

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const found = await load((await params).slug);
  if (!found?.project) return { title: "Project not found" };
  // shortcut: no project has a cover yet, so the static site OG image stands in; add cover_key images with Fase 8 uploads.
  return { title: found.project.title, description: found.project.tagline };
}

const TABS = {
  overview: "Overview",
  architecture: "Architecture",
  stack: "Stack",
  timeline: "Timeline",
  links: "Links",
} as const;
type Tab = keyof typeof TABS;

const NODE_KIND = {
  actor: "Person",
  service: "Service",
  database: "Database",
  storage: "Storage",
  library: "Library",
} as const;

// Client navigations re-render only below the shared (public) layout, so its loading.tsx cannot cover them:
// each page brings its own boundary to stay instant (Next 16 instant navigation).
export default function ProjectPage(props: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<Loading />}>
      <ProjectPageContent {...props} />
    </Suspense>
  );
}

// Read mode (docs/PLAN.md §7): a record header, then one view at a time. The view lives in ?tab= so Back
// and shared links land on the same view; views with no data are left out instead of shown empty.
async function ProjectPageContent({
  params,
  searchParams,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const found = await load(slug);
  // Mid-stream these become a client redirect and a noindex 404 (Next 16 streaming contract).
  if (found?.redirect) permanentRedirect(`/projects/${found.redirect}`);
  if (!found?.project) notFound();
  const p = found.project;

  const tabs = (Object.keys(TABS) as Tab[]).filter(
    (t) =>
      (t !== "architecture" || p.architecture) &&
      (t !== "stack" || p.skills.length > 0) &&
      (t !== "links" || p.links.length > 0),
  );
  const asked = (await searchParams).tab;
  const tab = tabs.find((t) => t === asked) ?? "overview";
  const serial =
    (await listSearchIndex()).projects.findIndex((r) => r.slug === p.slug) + 1;

  return (
    <article className="shell-page pd">
      <header className="pd-head">
        <p className="pd-serial">{formatSerial(serial)}</p>
        <Heading level={1}>{p.title}</Heading>
        <p className="pd-tagline">{p.tagline}</p>
        <p className="pd-facts">
          <StateBadge state={p.state} />
          <span>{KIND_LABEL[p.kind]}</span>
          <Period project={p} />
          <span>{p.role}</span>
        </p>
      </header>

      <nav aria-label="Project views" className="pd-tabs">
        <ul>
          {tabs.map((t) => (
            <li key={t}>
              <NextLink
                href={t === "overview" ? `/projects/${p.slug}` : `?tab=${t}`}
                scroll={false}
                className="ui-tabs__tab"
                data-active={t === tab || undefined}
                aria-current={t === tab ? "page" : undefined}
              >
                {TABS[t]}
              </NextLink>
            </li>
          ))}
        </ul>
      </nav>

      <section
        aria-label={TABS[tab]}
        className={
          tab === "architecture" ? "pd-panel pd-panel--wide" : "pd-panel"
        }
      >
        {tab === "overview" && <Overview p={p} />}
        {tab === "architecture" && p.architecture && (
          <Diagram title={p.title} architecture={p.architecture} />
        )}
        {tab === "stack" && <Stack p={p} />}
        {tab === "timeline" && <Timeline p={p} />}
        {tab === "links" && <Links p={p} />}
      </section>
    </article>
  );
}

function Overview({ p }: { p: Project }) {
  const cs = p.caseStudy;
  return (
    <>
      <div className="pd-prose">
        <p>{p.summary}</p>
      </div>
      {cs && (
        <>
          <Part title="Problem">
            <p>{cs.problem}</p>
          </Part>
          <Part title="Role">
            <p>{cs.role}</p>
          </Part>
          {cs.decisions.length > 0 && (
            <Part title="Decisions">
              <ul>
                {cs.decisions.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </Part>
          )}
          <Part title="Outcome">
            <p>{cs.outcome}</p>
          </Part>
        </>
      )}
      {p.metrics.length > 0 && (
        <Part title="Numbers">
          <dl className="pd-metrics">
            {p.metrics.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd className="figure">
                  {m.value}
                  {m.unit && ` ${m.unit}`}
                  <small>Source: {m.source}</small>
                </dd>
              </div>
            ))}
          </dl>
        </Part>
      )}
    </>
  );
}

function Part({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pd-prose">
      <Heading level={2}>{title}</Heading>
      {children}
    </div>
  );
}

// Drawn from the project's architecture JSON: columns of nodes, then every connection in words.
function Diagram({
  title,
  architecture,
}: {
  title: string;
  architecture: NonNullable<Project["architecture"]>;
}) {
  const label = new Map(architecture.nodes.map((n) => [n.id, n.label]));
  return (
    <figure className="pd-diagram">
      <ol
        className="pd-layers"
        aria-label={`${title} architecture, left to right`}
      >
        {layers(architecture.nodes, architecture.edges).map((col) => (
          <li key={col[0].id}>
            <ul className="pd-layer">
              {col.map((n) => (
                <li key={n.id} className={`pd-node pd-node--${n.kind}`}>
                  <b>{n.label}</b>
                  <span>{NODE_KIND[n.kind]}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <figcaption className="pd-edges">
        Connections
        <ul>
          {architecture.edges.map((e) => (
            <li key={`${e.from}-${e.to}`}>
              {label.get(e.from)} <Icon name="arrow-right" size="sm" />
              <span className="ui-visually-hidden">to</span> {label.get(e.to)}
              {e.label && `: ${e.label}`}
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}

function Stack({ p }: { p: Project }) {
  return (
    <div className="pd-prose">
      <Heading level={2}>Built with</Heading>
      <ul className="pd-stack">
        {p.skills.map((s) => (
          <li key={s.id}>
            <NextLink href={`/projects?skill=${s.id}`}>
              <Badge tone="tag">{s.name}</Badge>
              <span className="ui-visually-hidden">
                {" "}
                (other projects using it)
              </span>
            </NextLink>
          </li>
        ))}
      </ul>
      <p>Each one links to every other project that uses it.</p>
    </div>
  );
}

async function Timeline({ p }: { p: Project }) {
  const now = currentMonth(new Date());
  const role = p.experienceId
    ? (await listExperiences()).find((e) => e.id === p.experienceId)
    : undefined;
  return (
    <div className="pd-prose">
      <Heading level={2}>When</Heading>
      <p>
        <Period project={p} /> ·{" "}
        <span className="figure">
          {formatDuration(spanMonths(p.periodStart, p.periodEnd, now))}
        </span>
      </p>
      {role && (
        <p>
          Built as {role.role} at <Link href="/experience">{role.company}</Link>
          .
        </p>
      )}
    </div>
  );
}

function Links({ p }: { p: Project }) {
  return (
    <ul className="pd-links">
      {p.links.map((l) =>
        l.visibility === "public" ? (
          <li key={l.label}>
            <Link href={l.url} external={new URL(l.url).hostname}>
              {l.label}
            </Link>
            <span>{l.kind}</span>
          </li>
        ) : (
          <li key={l.label}>
            <b>{l.label}</b>
            <Badge>{l.kind === "repo" ? "Private repo" : "Private"}</Badge>
          </li>
        ),
      )}
    </ul>
  );
}
