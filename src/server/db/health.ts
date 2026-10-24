import { getDb } from "./index";
import { health } from "./schema";

// No 'use cache': on Workers a read after updateTag can hang (opennextjs-cloudflare#1464); revisit in Fase 11.
export async function getHealth() {
  const row = await getDb().select().from(health).get();
  return row ?? null;
}
