import type { Metadata } from "next";
import NextLink from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { cache, Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { formatSerial } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { currentMonth, formatDuration, spanMonths } from "@/lib/format";
import {
  getProject,
  listExperiences,
  listSearchIndex,
} from "@/server/db/queries";
import { Diagram } from "../diagram";
import { hasPage, KIND_LABEL, Period } from "../record";
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
  if (!found?.project || !hasPage(found.project))
    return { title: "Project not found" };
  // shortcut: no project has a cover yet, so the static site OG image stands in; add cover_key images with Fase 8 uploads.
  return { title: found.project.title, description: found.project.tagline };
}

const LINK_KIND = {
  live: "Live site",
  repo: "Repository",
  docs: "Docs",
  package: "Package",
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

// Read mode (docs/PLAN.md §7): the record opens with its architecture diagram, the proof the one-liner
// promises, then the story (no tabs; old ?tab= links land on the same page), its properties, and the next
// record so the page never dead-ends (critique questions, Fase 7).
async function ProjectPageContent({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const found = await load(slug);
  // Mid-stream these become a client redirect and a noindex 404 (Next 16 streaming contract).
  if (found?.redirect) permanentRedirect(`/projects/${found.redirect}`);
  // Thin records (no case study) are table rows only; their URL is a not-found.
  if (!found?.project || !hasPage(found.project)) notFound();
  const p = found.project;

  // Serials count every published record; previous/next skip the ones without a page.
  const index = (await listSearchIndex()).projects;
  const at = index.findIndex((r) => r.slug === p.slug);
  const pages = index.filter((r) => r.hasPage);
  const here = pages.findIndex((r) => r.slug === p.slug);
  const [prev, next] = [pages[here - 1], pages[here + 1]];

  return (
    <article className="shell-page pd">
      <header className="pd-head">
        <p className="pd-serial">{formatSerial(at + 1)}</p>
        <Heading level={1}>{p.title}</Heading>
        <p className="pd-tagline">{p.tagline}</p>
      </header>

      <KeyFacts p={p} />

      {p.architecture && (
        <section aria-label="Architecture" className="pd-arch">
          <Diagram title={p.title} architecture={p.architecture} />
        </section>
      )}

      <section aria-label="Case study" className="pd-body pd-panel">
        <Overview p={p} />
      </section>

      <MoreFacts p={p} />

      <nav aria-label="More projects" className="pd-next">
        {prev ? (
          <NextLink href={`/projects/${prev.slug}`} rel="prev">
            <Icon name="arrow-right" size="sm" className="pd-next__back" />
            <span>
              <small>{formatSerial(index.indexOf(prev) + 1)}</small>{" "}
              {prev.title}
            </span>
          </NextLink>
        ) : (
          <span />
        )}
        <Link href="/projects">All projects</Link>
        {next && (
          <NextLink href={`/projects/${next.slug}`} rel="next">
            <span>
              <small>{formatSerial(index.indexOf(next) + 1)}</small>{" "}
              {next.title}
            </span>
            <Icon name="arrow-right" size="sm" />
          </NextLink>
        )}
      </nav>
    </article>
  );
}

// The record's properties, like the side panel of an admin detail view, in two parts. Key facts (state with
// the live link beside it, period, stack) come before the story; the rest (role, kind, links) after it on
// phones. On desktop both sit in the right rail (critique, Fase 7).
function KeyFacts({ p }: { p: Project }) {
  const now = currentMonth(new Date());
  const live = p.links.find(
    (l) => l.visibility === "public" && l.kind === "live",
  );
  // Main stack first: it answers "does this fit our team?" at a glance.
  const stack = [...p.skills].sort((a, b) => Number(b.main) - Number(a.main));
  return (
    <aside aria-label="Project facts" className="pd-props pd-props--key">
      <dl>
        <div>
          <dt>State</dt>
          <dd className="pd-props__state">
            <StateBadge state={p.state} />
            {live?.visibility === "public" && (
              <Link href={live.url} external={new URL(live.url).hostname}>
                {new URL(live.url).hostname}
              </Link>
            )}
          </dd>
        </div>
        <div>
          <dt>Period</dt>
          <dd>
            <Period project={p} />{" "}
            <span className="pd-props__muted">
              ({formatDuration(spanMonths(p.periodStart, p.periodEnd, now))})
            </span>
          </dd>
        </div>
        {stack.length > 0 && (
          <div>
            <dt>Stack</dt>
            <dd>
              <ul className="pd-stack">
                {stack.map((s) => (
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
            </dd>
          </div>
        )}
      </dl>
    </aside>
  );
}

async function MoreFacts({ p }: { p: Project }) {
  const role = p.experienceId
    ? (await listExperiences()).find((e) => e.id === p.experienceId)
    : undefined;
  // The live link already sits beside the state; list the others here.
  const links = p.links.filter(
    (l) => !(l.visibility === "public" && l.kind === "live"),
  );
  return (
    <aside
      aria-label="More about this project"
      className="pd-props pd-props--more"
    >
      <dl>
        <div>
          <dt>Role</dt>
          <dd>
            {p.role}
            {role && (
              <>
                {" "}
                <span className="pd-props__muted">
                  at <Link href="/experience">{role.company}</Link>
                </span>
              </>
            )}
          </dd>
        </div>
        <div>
          <dt>Kind</dt>
          <dd>{KIND_LABEL[p.kind]}</dd>
        </div>
        {(links.length > 0 || p.slug === "portfolio") && (
          <div>
            <dt>Links</dt>
            <dd>
              <ul className="pd-links">
                {links.map((l) =>
                  l.visibility === "public" ? (
                    <li key={l.label}>
                      <Link href={l.url} external={new URL(l.url).hostname}>
                        {l.label}
                      </Link>
                      {l.label !== LINK_KIND[l.kind] && (
                        <span> {LINK_KIND[l.kind]}</span>
                      )}
                    </li>
                  ) : (
                    <li key={l.label}>
                      {l.label}{" "}
                      <Badge>
                        {l.kind === "repo" ? "Private repo" : "Private"}
                      </Badge>
                    </li>
                  ),
                )}
                {/* The component module this site is built from (moved out of the main nav, Fase 7). */}
                {p.slug === "portfolio" && (
                  <li>
                    <Link href="/components">Design system</Link>{" "}
                    <span>Components</span>
                  </li>
                )}
              </ul>
            </dd>
          </div>
        )}
      </dl>
    </aside>
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
