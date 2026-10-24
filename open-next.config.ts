import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

// Prerendered shells live in R2. No queue/tag cache: nothing revalidates since 'use cache' was dropped (Fase 0, §11.3).
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
