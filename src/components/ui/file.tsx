"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "./cx";
import { Icon } from "./icon";

export type DownloadState = "ready" | "downloading" | "done" | "error";

type FileProps = {
  href: string;
  /** Saved file name, e.g. "Besar-Rachmat-Ikhsan-Pambudi-CV.pdf". */
  filename: string;
  /** Format shown after the label, e.g. "PDF". */
  format: string;
  label?: string;
  /** Where to send people when the file cannot be fetched (decision: CV falls back to LinkedIn). */
  fallback: { href: string; label: string };
  /** Showcase only: pin a state instead of running the download. */
  state?: DownloadState;
};

// The signature microinteraction: ready → downloading (朱 fill tracks real bytes) → done.
// Without JS it is a plain download link; modifier clicks keep the browser's own behaviour.
export function File({
  href,
  filename,
  format,
  label = "Download CV",
  fallback,
  state: pinned,
}: FileProps) {
  const [state, setState] = useState<DownloadState>("ready");
  const [progress, setProgress] = useState<number | null>(null);
  const reset = useRef<ReturnType<typeof setTimeout>>(undefined);
  const shown = pinned ?? state;

  useEffect(() => () => clearTimeout(reset.current), []);

  async function download(e: React.MouseEvent<HTMLAnchorElement>) {
    if (pinned) return e.preventDefault(); // a showcase picture of a state, not a working link
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;
    e.preventDefault();
    if (state === "downloading") return;
    clearTimeout(reset.current);
    setState("downloading");
    setProgress(null);
    try {
      const res = await fetch(href);
      // A redirect means the file is missing (/cv → /cv/unavailable); saving that HTML as the PDF would be wrong.
      if (!res.ok || res.redirected || !res.body)
        throw new Error(String(res.status));
      const total = Number(res.headers.get("content-length")) || 0;
      const reader = res.body.getReader();
      const chunks: BlobPart[] = [];
      let received = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (total)
          setProgress(Math.min(100, Math.round((received / total) * 100)));
      }
      const url = URL.createObjectURL(
        new Blob(chunks, {
          type: res.headers.get("content-type") ?? undefined,
        }),
      );
      const a = Object.assign(document.createElement("a"), {
        href: url,
        download: filename,
      });
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setState("done");
      reset.current = setTimeout(() => setState("ready"), 4000);
    } catch {
      setState("error");
    }
  }

  return (
    <span className="ui-file">
      {/* No download attribute: the server names the file (Content-Disposition), and a missing file's
          redirect must open its page rather than be saved under the PDF name (no-JS and modifier clicks). */}
      <a
        href={href}
        onClick={download}
        aria-busy={shown === "downloading" || undefined}
        className={cx(
          "ui-file__button",
          `ui-file__button--${shown}`,
          shown === "downloading" &&
            progress === null &&
            "ui-file__button--indeterminate",
        )}
        style={
          progress !== null && shown === "downloading"
            ? ({ "--progress": `${progress}%` } as React.CSSProperties)
            : undefined
        }
      >
        <Icon name={shown === "done" ? "check" : "download"} size="sm" />
        <span>
          {shown === "downloading"
            ? "Downloading"
            : shown === "done"
              ? "Downloaded"
              : label}
          {shown === "downloading" && progress !== null && (
            <span className="figure"> {progress}%</span>
          )}
        </span>
        {shown !== "downloading" && shown !== "done" && <small>{format}</small>}
      </a>
      <span className="ui-visually-hidden" role="status">
        {shown === "downloading"
          ? `Downloading ${filename}`
          : shown === "done"
            ? `${filename} downloaded`
            : ""}
      </span>
      {shown === "error" && (
        <span className="ui-file__error" role="alert">
          The download failed. Try again, or open{" "}
          <a href={fallback.href}>{fallback.label}</a>.
        </span>
      )}
    </span>
  );
}
