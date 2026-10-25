import { connection } from "next/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardSpread } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { experienceMonths } from "@/lib/experience";
import { currentMonth, formatDuration } from "@/lib/format";
import {
  getProfile,
  listCertifications,
  listExperiences,
  listProjects,
  listSkills,
} from "@/server/db/queries";
import { Meishi } from "./meishi";
import { StateBadge } from "./projects/state-badge";
import "./overview.css";

// Persuade (docs/PLAN.md §7): who this is in five seconds, proof on the table, Download CV on the card.
export default async function Overview() {
  await connection(); // D1 only exists at request time
  const [profile, projects, experiences, certifications, skills] =
    await Promise.all([
      getProfile(),
      listProjects(),
      listExperiences(),
      listCertifications(),
      listSkills(),
    ]);
  if (!profile) throw new Error("Profile row missing");

  const now = currentMonth(new Date());
  const counted = experiences.filter((e) => e.countsTowardExperience);
  const months = experienceMonths(counted, now);
  const since = counted.map((e) => e.start).sort()[0];
  const current = experiences.find((e) => e.end === null);
  const featured = projects.filter((p) => p.featured);
  const release = projects
    .find((p) => p.slug === "policy-semver")
    ?.metrics.find((m) => m.label === "Latest release")?.value;
  const linkedin = profile.links.find((l) => l.kind === "linkedin")?.url ?? "";
  const mainStack = skills.filter((s) => s.main);

  // Activity log: the newest dated records already on the site, so it never disagrees with the pages.
  const activity = [
    ...experiences.map((e) => ({
      id: `e-${e.id}`,
      month: e.start,
      text: `Joined ${e.company} as ${e.role}`,
      href: "/experience",
    })),
    ...projects.map((p) => ({
      id: `p-${p.id}`,
      month: p.periodStart,
      text: `Started ${p.title}`,
      href: `/projects/${p.slug}`,
    })),
    ...certifications.map((c) => ({
      id: `c-${c.id}`,
      month: c.issuedAt,
      text: `Certified: ${c.name}`,
      href: "/education",
    })),
  ]
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 5);

  return (
    <div className="shell-page ov">
      <JsonLd
        profile={profile}
        jobTitle={current?.role}
        org={current?.company}
      />
      <Meishi
        name={profile.name}
        role={profile.headline}
        affiliation={current ? `${current.role}, ${current.company}` : null}
        location={profile.location}
        availability={profile.availability}
        linkedin={linkedin}
        hasCv={Boolean(profile.cvKey)}
        tagline={profile.tagline}
      >
        <dl className="ov-ledger">
          {months > 0 && (
            <div>
              <dt>shipping since {since}</dt>
              <dd className="figure">{formatDuration(months)}</dd>
            </div>
          )}
          {featured.length > 0 && (
            <div>
              <dt>featured systems</dt>
              <dd className="figure">{featured.length}</dd>
            </div>
          )}
          {release && (
            <div>
              <dt>PolicySemVer on Marketplace</dt>
              <dd className="figure">v{release}</dd>
            </div>
          )}
        </dl>
      </Meishi>

      {featured.length > 0 && (
        <section aria-labelledby="on-the-table" className="ov-section">
          <div className="ov-section__head">
            <Heading level={2} id="on-the-table">
              On the table
            </Heading>
            <Link href="/projects">All {projects.length} projects</Link>
          </div>
          <CardSpread>
            {featured.slice(0, 3).map((p) => (
              <li key={p.id}>
                <Card
                  serial={projects.indexOf(p) + 1}
                  title={p.title}
                  href={`/projects/${p.slug}`}
                  status={<StateBadge state={p.state} />}
                  ratio
                >
                  {p.tagline}
                </Card>
              </li>
            ))}
          </CardSpread>
        </section>
      )}

      <div className="ov-columns">
        {activity.length > 0 && (
          <section aria-labelledby="activity" className="ov-section">
            <Heading level={2} id="activity">
              Activity log
            </Heading>
            <ol className="ov-log">
              {activity.map((a) => (
                <li key={a.id}>
                  <time className="figure" dateTime={a.month}>
                    {a.month}
                  </time>
                  <Link href={a.href}>{a.text}</Link>
                </li>
              ))}
            </ol>
          </section>
        )}
        {mainStack.length > 0 && (
          <section aria-labelledby="stack" className="ov-section">
            <Heading level={2} id="stack">
              Main stack
            </Heading>
            <ul className="ov-stack">
              {mainStack.map((s) => (
                <li key={s.id}>
                  <Badge tone="tag">{s.name}</Badge>
                </li>
              ))}
            </ul>
            <Link href="/skills">Every skill and where it was used</Link>
          </section>
        )}
      </div>
    </div>
  );
}

type Profile = NonNullable<Awaited<ReturnType<typeof getProfile>>>;

// ProfilePage + Person for search engines. No email, ever (docs/PLAN.md Fase 7).
function JsonLd({
  profile,
  jobTitle,
  org,
}: {
  profile: Profile;
  jobTitle?: string;
  org?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      alternateName: profile.alternateNames,
      jobTitle,
      worksFor: org && { "@type": "Organization", name: org },
      address: { "@type": "PostalAddress", addressLocality: profile.location },
      sameAs: profile.links.map((l) => l.url),
    },
  };
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON from our own D1 row, "<" escaped so it cannot close the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
