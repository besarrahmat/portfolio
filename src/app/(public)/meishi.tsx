"use client";

import { useEffect, useRef, useState } from "react";
import { File } from "@/components/ui/file";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";

type MeishiProps = {
  name: string;
  role: string;
  affiliation: string | null;
  location: string;
  availability: string | null;
  linkedin: string;
  /** False when no CV is stored: the card offers LinkedIn instead of a download that would fail. */
  hasCv: boolean;
  tagline: string;
  /** Set on the table beside the card: the ledger. */
  children?: React.ReactNode;
};

// What serves this very card (docs/DESIGN.md §3): drawn from this list, not a picture.
const SERVED_BY = [
  { name: "Browser", detail: "this page" },
  { name: "Worker", detail: "Cloudflare · Next.js 16 · Hono" },
  { name: "D1 + R2", detail: "content, files" },
];

const FILE = "Besar-Rachmat-Ikhsan-Pambudi-CV.pdf";

// The Overview hero: one meishi handed over facing the reader; turning it shows the system behind it.
export function Meishi(props: MeishiProps) {
  const [turned, setTurned] = useState(false);
  const hand = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLHeadingElement>(null);
  const back = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // One primary per viewport: the shell's CV dock steps aside while this card is on screen.
  useEffect(() => {
    const root = document.documentElement;
    const io = new IntersectionObserver(
      ([e]) => {
        root.toggleAttribute("data-meishi-out", !e.isIntersecting);
      },
      { threshold: 0.25 },
    );
    if (hand.current) io.observe(hand.current);
    return () => {
      io.disconnect();
      // Leaving Overview keeps its DOM alive but hidden (route state is preserved for Back), so
      // :has(.meishi-hand) still matches: mark the card out, or the next page would lose its CV.
      root.setAttribute("data-meishi-out", "");
    };
  }, []);

  // Keep reading order honest: land on the face that is now showing (not on first render).
  useEffect(() => {
    if (!moved.current) return;
    (turned ? back : front).current?.focus({ preventScroll: true });
  }, [turned]);

  const turn = (next: boolean) => {
    moved.current = true;
    setTurned(next);
  };

  const cv = props.hasCv ? (
    <File
      href="/cv"
      filename={FILE}
      format="PDF"
      fallback={{ href: props.linkedin, label: "LinkedIn" }}
    />
  ) : (
    <a className="ui-file__button" href={props.linkedin} rel="noopener">
      View on LinkedIn
    </a>
  );

  return (
    <section className="ov-hero" aria-label="Introduction">
      <div className="meishi-hand" data-turned={turned} ref={hand}>
        <Card {...props} turned={turned} front={front} back={back} cv={cv} />
        <button
          type="button"
          className="meishi__turn shell-js"
          aria-pressed={turned}
          onClick={() => turn(!turned)}
        >
          <Icon name="flip" />
          Turn the card over
        </button>
      </div>
      <div className="ov-table">
        <OneLiner tagline={props.tagline} onTurn={() => turn(true)} />
        {props.children}
      </div>
    </section>
  );
}

function Card({
  turned,
  front,
  back,
  cv,
  ...props
}: MeishiProps & {
  turned: boolean;
  front: React.RefObject<HTMLHeadingElement | null>;
  back: React.RefObject<HTMLHeadingElement | null>;
  cv: React.ReactNode;
}) {
  return (
    <div className="meishi">
      <div className="meishi__face" inert={turned} aria-hidden={turned}>
        <div className="meishi__who">
          <h1 ref={front} tabIndex={-1}>
            {props.name}
          </h1>
          <p className="meishi__role">{props.role}</p>
          <p className="meishi__affil">
            {props.affiliation && (
              <>
                {props.affiliation}
                <br />
              </>
            )}
            {props.location}
          </p>
          {props.availability && (
            <p className="meishi__open">{props.availability}</p>
          )}
        </div>
        <div className="meishi__foot">
          {props.hasCv && (
            <Link href={props.linkedin} external="LinkedIn">
              LinkedIn
            </Link>
          )}
          {cv}
        </div>
      </div>
      <div
        className="meishi__face meishi__face--back"
        inert={!turned}
        aria-hidden={!turned}
      >
        <div className="meishi__served">
          <h2 ref={back} tabIndex={-1}>
            This card is served by
          </h2>
          <ol className="meishi__flow">
            {SERVED_BY.map((n) => (
              <li key={n.name}>
                <b>{n.name}</b> {n.detail}
              </li>
            ))}
          </ol>
        </div>
        <div className="meishi__foot">
          <Link href="/projects/portfolio">How it's built</Link>
          {cv}
        </div>
      </div>
    </div>
  );
}

// The phrase "architecture diagram" in the one-liner is the second way to turn the card.
function OneLiner({
  tagline,
  onTurn,
}: {
  tagline: string;
  onTurn: () => void;
}) {
  const phrase = "architecture diagram";
  const at = tagline.indexOf(phrase);
  if (at < 0) return <p className="meishi-line">{tagline}</p>;
  return (
    <p className="meishi-line">
      {tagline.slice(0, at)}
      <button type="button" className="meishi-line__turn" onClick={onTurn}>
        {phrase}
      </button>
      {tagline.slice(at + phrase.length)}
    </p>
  );
}
