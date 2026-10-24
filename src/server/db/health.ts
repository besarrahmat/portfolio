import { cacheTag } from "next/cache";

import { getDb } from "./index";
import { health } from "./schema";

export const HEALTH_TAG = "health";

export async function getHealth() {
  "use cache";
  cacheTag(HEALTH_TAG);
  const row = await getDb().select().from(health).get();
  return row ?? null;
}
