import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { getProfile, listExperiences } from "@/server/db/queries";
import Loading from "../loading";
import { Email } from "./email";
import "../pages.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "The CV first, then LinkedIn, email and GitHub. No contact form.",
};

const CV_FILE = "Besar-Rachmat-Ikhsan-Pambudi-CV.pdf";
// shortcut: follows the profile location (West Java = WIB); derive it from location if Rahmat moves zones.
const TIME_ZONE = "WIB (UTC+7), 2 hours behind Japan (JST)";
const flip = (s: string) => [...s].reverse().join("");

export default function ContactPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ContactContent />
    </Suspense>
  );
}

// Persuade (docs/PLAN.md §7): CV → LinkedIn → email → GitHub, in that order (❓ #16: no form, mailto + copy).
async function ContactContent() {
  await connection();
  const [profile, experiences] = await Promise.all([
    getProfile(),
    listExperiences(),
  ]);
  if (!profile) throw new Error("Profile row missing");
  const current = experiences.find((e) => e.end === null);
  const link = (kind: string) => profile.links.find((l) => l.kind === kind);
  const linkedin = link("linkedin");
  const github = link("github");
  // Only the reversed halves leave the server; the "@" and the whole address never do.
  const [local, domain] = profile.contactEmail?.split("@") ?? [];
  const email =
    local && domain ? ([flip(domain), flip(local)] as [string, string]) : null;

  return (
    <div className="shell-page pg">
      <Heading level={1}>Contact</Heading>
      <p className="pg-intro">
        The CV has everything in one page. For a conversation, LinkedIn is the
        quickest reply.
        {profile.availability && <> {profile.availability}</>}
      </p>
      {/* The meeting closes as it opened: the card in hand, with what a team abroad needs to plan a call. */}
      <section className="ct-card" aria-label="Business card">
        <p className="ct-card__name">{profile.name}</p>
        <p className="ct-card__role">
          {profile.headline}
          {current && (
            <span>
              {current.role}, {current.company}
            </span>
          )}
        </p>
        <dl>
          <div>
            <dt>Based in</dt>
            <dd>{profile.location}</dd>
          </div>
          <div>
            <dt>Time zone</dt>
            <dd>{TIME_ZONE}</dd>
          </div>
          {profile.languages.length > 0 && (
            <div>
              <dt>Languages</dt>
              <dd>
                {profile.languages
                  .map((l) => `${l.name} (${l.level.toLowerCase()})`)
                  .join(", ")}
              </dd>
            </div>
          )}
        </dl>
      </section>
      <ul className="ui-list ct-list">
        {profile.cvKey && (
          <li>
            <div>
              <p className="ui-list__title">CV</p>
              <p className="ui-list__detail">One page, English, PDF.</p>
            </div>
            {/* A plain link: the topbar/dock Download CV stays the single primary on screen. No download
                attribute: /cv sends the file name itself, and a missing CV must open /cv/unavailable, not save it. */}
            <a className="ui-link" href="/cv">
              {CV_FILE}
            </a>
          </li>
        )}
        {linkedin && (
          <li>
            <div>
              <p className="ui-list__title">LinkedIn</p>
              <p className="ui-list__detail">Messages and work history.</p>
            </div>
            <Link href={linkedin.url} external="LinkedIn">
              {linkedin.url.replace(/^https:\/\/(www\.)?/, "")}
            </Link>
          </li>
        )}
        {email && (
          // Needs JS to assemble; without it the row steps aside and LinkedIn above is the way in.
          <li className="shell-js">
            <div>
              <p className="ui-list__title">Email</p>
              <p className="ui-list__detail">
                Shown on request to keep it away from spam bots.
              </p>
            </div>
            <Email parts={email} />
          </li>
        )}
        {github && (
          <li>
            <div>
              <p className="ui-list__title">GitHub</p>
              <p className="ui-list__detail">
                Public repositories, including this site.
              </p>
            </div>
            <Link href={github.url} external="GitHub">
              {github.url.replace(/^https:\/\//, "")}
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
