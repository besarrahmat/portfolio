"use server";

import { updateTag } from "next/cache";

import { guardManage } from "@/server/auth/manage-path";
import { getDb } from "@/server/db";
import { HEALTH_TAG } from "@/server/db/health";
import { health } from "@/server/db/schema";

export async function touchHealth(secret: string) {
  guardManage(secret); // actions are reachable by direct POST, so re-check here
  const now = new Date();
  await getDb()
    .insert(health)
    .values({ id: 1, note: `touched ${now.toISOString()}`, updatedAt: now })
    .onConflictDoUpdate({
      target: health.id,
      set: { note: `touched ${now.toISOString()}`, updatedAt: now },
    });
  updateTag(HEALTH_TAG);
}
