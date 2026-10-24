import type { Metadata } from "next";

import { guardManage } from "@/server/auth/manage-path";
import { getHealth } from "@/server/db/health";

import { touchHealth } from "./actions";

// shortcut: Fase 0 tracer dummy (proves [secret] guard + updateTag on Workers); delete after the tracer is measured.
// Blocking render (no Suspense): params are runtime data and the guard must run before any content.
export const instant = false;
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ManageTracer({
  params,
}: PageProps<"/m/[secret]">) {
  const { secret } = await params;
  guardManage(secret);
  const row = await getHealth();
  return (
    <main>
      <p>Manage tracer (dummy). Current note: {row?.note ?? "none"}</p>
      <form action={touchHealth.bind(null, secret)}>
        <button type="submit">Touch health row</button>
      </form>
    </main>
  );
}
