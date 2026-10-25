"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/heading";

// A page that throws renders here, inside the shell: nav, search and the CV dock keep working.
export default function PageError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => console.error(error), [error]);
  const digest = error instanceof Error && "digest" in error && error.digest;
  return (
    <div className="shell-page">
      <Heading level={1}>This page failed to load</Heading>
      <EmptyState
        title="Something went wrong on our side"
        action={
          <Button variant="primary" onClick={() => retry()}>
            Try again
          </Button>
        }
      >
        Try again in a moment. The CV download and the rest of the site still
        work.
        {typeof digest === "string" && (
          <>
            {" "}
            Reference <span className="figure">{digest}</span>.
          </>
        )}
      </EmptyState>
    </div>
  );
}
