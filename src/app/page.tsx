import { connection } from "next/server";
import { Suspense } from "react";

import { getHealth } from "@/server/db/health";

// Fase 0 tracer: server-rendered page reading D1 through a tagged 'use cache' entry.
export default function Home() {
  return (
    <main>
      <h1>Besar Rachmat Ikhsan Pambudi</h1>
      <Suspense fallback={<p>Loading…</p>}>
        <HealthNote />
      </Suspense>
    </main>
  );
}

async function HealthNote() {
  await connection(); // D1 only exists at request time, not during `next build` prerender
  const row = await getHealth();
  return (
    <p data-testid="health-note">
      {row
        ? `${row.note} (${row.updatedAt.toISOString()})`
        : "no health row yet"}
    </p>
  );
}
