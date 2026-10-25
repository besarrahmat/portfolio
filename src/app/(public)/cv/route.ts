import { getCloudflareContext } from "@opennextjs/cloudflare";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getProfile } from "@/server/db/queries";

const FILENAME = "Besar-Rachmat-Ikhsan-Pambudi-CV.pdf";

// Always the latest CV from R2 (no-cache + ETag). Missing → a friendly page in the shell, never a 500.
// (notFound() in a route handler answers an empty 404, so the fallback is a redirect; File treats it as failure.)
export async function GET() {
  await connection();
  const key = (await getProfile())?.cvKey;
  const file = key ? await getCloudflareContext().env.MEDIA.get(key) : null;
  if (!file) {
    console.error(
      key
        ? `CV unavailable: no R2 object at ${key}`
        : "CV unavailable: profile.cv_key is empty",
    );
    redirect("/cv/unavailable");
  }
  return new Response(file.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(file.size),
      "Content-Disposition": `attachment; filename="${FILENAME}"`,
      "Cache-Control": "no-cache",
      ETag: file.httpEtag,
    },
  });
}
