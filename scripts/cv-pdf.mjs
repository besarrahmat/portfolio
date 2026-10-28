// Renders content/cv.md to an ATS-friendly PDF in the Jake's Resume layout (single column, centered header,
// ruled section headings, title/dates then org/location rows). Usage: npm run cv:pdf (writes content/media/cv.pdf).

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const repo = process.cwd();
const out = join(repo, "content/media/cv.pdf");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const bold = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
const link = (s) =>
  esc(s).replace(
    /\b((?:portfolio|linkedin|github)[\w.-]*\.(?:dev|com)[\w/.-]*)/g,
    '<a href="https://$1">$1</a>',
  );

const md = readFileSync(join(repo, "content/cv.md"), "utf8").replace(
  /<!--[\s\S]*?-->\s*/,
  "",
);
const [head, ...rest] = md.split(/\n## /);
const sections = Object.fromEntries(
  rest.map((s) => {
    const [title, ...body] = s.trim().split("\n");
    return [title, body.filter((l) => l.trim())];
  }),
);

// Header: centered name, role and location, contact links, the one-liner.
const headLines = head.split("\n").filter((l) => l.trim());
const name = headLines.find((l) => l.startsWith("# ")).slice(2);
const sub = headLines.filter((l) => !l.startsWith("#") && !l.startsWith(">"));
const quote = headLines.find((l) => l.startsWith("> "))?.slice(2);
let html = `<header><h1>${esc(name)}</h1>${sub.map((l) => `<p>${link(l.replace(/^Portfolio: /, ""))}</p>`).join("")}${
  quote ? `<p class="quote">${esc(quote)}</p>` : ""
}</header>`;

const row = (l, r) =>
  `<div class="row"><span>${l}</span><span>${r}</span></div>`;
const list = (items) =>
  items.length
    ? `<ul>${items.map((i) => `<li>${bold(i)}</li>`).join("")}</ul>`
    : "";
const section = (title, body) => `<section><h2>${title}</h2>${body}</section>`;

html += section("Summary", `<p>${bold(sections.Summary.join(" "))}</p>`);

// "**Role**, Company · Place, mode · Mon YYYY – Mon YYYY" then "- bullet" lines.
const entries = [];
for (const l of sections.Experience)
  if (l.startsWith("- ")) entries.at(-1).bullets.push(l.slice(2));
  else entries.push({ line: l, bullets: [] });
html += section(
  "Experience",
  entries
    .map(({ line, bullets }) => {
      const [who, where, when] = line.split(" · ");
      const [, role, org] = who.match(/^\*\*(.+?)\*\*, (.+)$/);
      return `<div class="entry">${row(`<b>${esc(role)}</b>`, esc(when))}${row(`<i>${esc(org)}</i>`, `<i>${esc(where)}</i>`)}${list(bullets)}</div>`;
    })
    .join(""),
);

// "- **Name** (2026, public): text"
html += section(
  "Projects",
  sections["Selected projects"]
    .map((l) => {
      const [, title, meta, text] = l.match(
        /^- \*\*(.+?)\*\* \((.+?)\): (.+)$/,
      );
      const [year, visibility] = meta.split(", ");
      return `<div class="entry">${row(`<b>${esc(title)}</b> <span class="muted">| ${esc(visibility)}</span>`, esc(year))}${list([text[0].toUpperCase() + text.slice(1)])}</div>`;
    })
    .join(""),
);

// "**Institution**, degree, field · dates · GPA"
html += section(
  "Education",
  sections.Education.map((l) => {
    const [who, when, grade] = l.split(" · ");
    const [, school, degree] = who.match(/^\*\*(.+?)\*\*, (.+)$/);
    return `<div class="entry">${row(`<b>${esc(school)}</b>`, esc(when))}${row(`<i>${esc(degree)}</i>`, `<i>${esc(grade ?? "")}</i>`)}</div>`;
  }).join(""),
);

html += section(
  "Certifications",
  `<p>${bold(sections.Certifications.join(" "))}</p>`,
);
html += section("Languages", `<p>${bold(sections.Languages.join(" "))}</p>`);

const font = (f) =>
  `url(data:font/woff2;base64,${readFileSync(join(repo, "src/app/fonts", f)).toString("base64")})`;
const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(name)} - CV</title><style>
@font-face{font-family:T;font-weight:400;src:${font("biz-udpgothic-400.woff2")}}
@font-face{font-family:T;font-weight:700;src:${font("biz-udpgothic-700.woff2")}}
@page{size:A4;margin:10mm 13mm}
body{font:9pt/1.3 T,sans-serif;color:#16191E;margin:0}
a{color:inherit;text-decoration:none}
header{text-align:center}
h1{font-size:20pt;line-height:1.1;margin:0 0 3pt}
header p{margin:1pt 0}
.quote{margin-top:4pt;font-weight:700}
i{font-style:normal;color:#3A4350}
h2{font-size:10pt;font-variant:small-caps;letter-spacing:.02em;margin:7pt 0 3pt;padding-bottom:1pt;border-bottom:.75pt solid #16191E;break-after:avoid}
p{margin:0}
.entry{margin:0 0 4pt;break-inside:avoid}
.row{display:flex;justify-content:space-between;gap:12pt}
.row span:last-child{flex:none;text-align:right}
.muted{font-weight:400}
ul{margin:1pt 0 0;padding-left:12pt}
li{margin:0}
</style></head><body>${html}</body></html>`;

const browser = await chromium.launch();
const tab = await browser.newPage();
await tab.setContent(page, { waitUntil: "load" });
await tab.evaluate(() => document.fonts.ready);
await tab.pdf({
  path: out,
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
});
await browser.close();
console.log("wrote", out);
