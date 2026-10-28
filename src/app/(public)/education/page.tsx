import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { formatSerial } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Timeline } from "@/components/ui/progress-indicator";
import { certificateStatus, currentMonth } from "@/lib/format";
import { listCertifications, listEducation } from "@/server/db/queries";
import Loading from "../loading";
import "../pages.css";

export const metadata: Metadata = {
  title: "Education",
  description:
    "Degree and certifications, with expired certificates marked automatically from their expiry month.",
};

// English glosses for course titles issued in Indonesian, for the EN audience (critique, Fase 7).
// shortcut: keyed by certificate id in code; move to a column when the manage area (Fase 8) edits certificates.
const GLOSS: Record<string, string> = {
  "codingstudio-laravel-9": "Building Websites with Laravel 9",
  "codingstudio-frontend": "Front-End Web Fundamentals",
  "dicoding-ml-pemula": "Machine Learning for Beginners",
  "dicoding-analisis-data-python": "Data Analysis with Python",
  "dicoding-python": "Getting Started with Python Programming",
  "dicoding-sql": "SQL Fundamentals",
  "dicoding-data-science": "Data Science Fundamentals",
  "dicoding-java": "Getting Started with Java Programming",
  "dicoding-dart": "Getting Started with Dart Programming",
};

export default function EducationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EducationContent />
    </Suspense>
  );
}

// Read mode (docs/PLAN.md §7). Expiry is computed at request time in Rahmat's time zone, never stored.
async function EducationContent() {
  await connection();
  const [education, certifications] = await Promise.all([
    listEducation(),
    listCertifications(),
  ]);
  const now = currentMonth(new Date());
  // Newest first, like the rest of the site's logs.
  const certs = [...certifications].reverse();

  return (
    <div className="shell-page pg">
      <Heading level={1}>Education</Heading>
      {education.length > 0 && (
        <section aria-labelledby="degree" className="pg-section">
          <Heading level={2} id="degree">
            Degree
          </Heading>
          <Timeline
            now={now}
            entries={education.map((e) => ({
              id: e.id,
              title: `${e.degree}, ${e.field}`,
              org: e.institution,
              serial: 1,
              start: e.start,
              end: e.end,
              detail: e.grade && <p>GPA {e.grade}</p>,
            }))}
          />
        </section>
      )}
      {certs.length > 0 && (
        <section aria-labelledby="certs" className="pg-section">
          <Heading level={2} id="certs">
            Certifications
          </Heading>
          <ul className="ui-list">
            {certs.map((c, i) => {
              const status = certificateStatus(c.expiresAt, now);
              return (
                <li key={c.id}>
                  <div>
                    <p className="pg-serial">{formatSerial(i + 1)}</p>
                    <p className="ui-list__title">
                      {c.url ? (
                        <Link href={c.url} external={c.issuer}>
                          {GLOSS[c.id] ?? c.name}
                        </Link>
                      ) : (
                        (GLOSS[c.id] ?? c.name)
                      )}
                    </p>
                    {GLOSS[c.id] && (
                      <p className="ui-list__detail" lang="id">
                        {c.name}
                      </p>
                    )}
                    <p className="ui-list__detail">
                      {c.issuer}
                      {c.credentialId && (
                        <>
                          {" · Credential ID "}
                          <span className="figure">{c.credentialId}</span>
                        </>
                      )}
                    </p>
                    {/* Dates on their own line in every row, so rows with and without expiry match. */}
                    <p className="ui-list__detail figure">
                      Issued <time dateTime={c.issuedAt}>{c.issuedAt}</time>
                      {c.expiresAt && (
                        <>
                          {" · until "}
                          <time dateTime={c.expiresAt}>{c.expiresAt}</time>
                        </>
                      )}
                    </p>
                  </div>
                  {status === "expired" && (
                    <p className="ui-list__meta">
                      <Badge tone="expired">Expired</Badge>
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
