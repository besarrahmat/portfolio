// Latin titles keep their letters ("Café" -> "cafe"); anything else is dropped.
export const slugify = (title: string) =>
  title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// `taken` must hold live slugs and old slugs from slug_redirects, so a redirect never gets shadowed.
export function uniqueSlug(title: string, taken: ReadonlySet<string>) {
  const base = slugify(title) || crypto.randomUUID().slice(0, 8);
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}
