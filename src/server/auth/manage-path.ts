import { getCloudflareContext } from "@opennextjs/cloudflare";
import { notFound } from "next/navigation";

// The XOR loop has no early exit; only the length can leak, and the path also sits behind Cloudflare Access.
export function isManagePath(
  segment: string,
  secret: string | undefined,
): boolean {
  if (!secret || segment.length !== secret.length) return false; // fail closed when MANAGE_PATH is unset
  let diff = 0;
  for (let i = 0; i < secret.length; i++)
    diff |= segment.charCodeAt(i) ^ secret.charCodeAt(i);
  return diff === 0;
}

/** Call first in every manage page and Server Action: unknown segment → 404. */
export function guardManage(segment: string): void {
  if (!isManagePath(segment, getCloudflareContext().env.MANAGE_PATH))
    notFound();
}
