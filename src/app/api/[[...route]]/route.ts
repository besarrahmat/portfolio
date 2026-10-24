import { Hono } from "hono";
import { handle } from "hono/vercel";

import { getHealth } from "@/server/db/health";

const app = new Hono().basePath("/api/v1");

app.get("/health", async (c) => {
  const row = await getHealth();
  return c.json({ service: "portfolio", ok: true, note: row?.note ?? null });
});

export const GET = handle(app);
