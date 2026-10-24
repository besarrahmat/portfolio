# Create Website Plan

## Context

Dimulai 24 Okt 2026 (Fase 1 `docs/PLAN.md`). Tracker ini memetakan sepuluh fase metaskills:create-website ke fase di `docs/PLAN.md`. Status fase rencana tetap dicatat di `docs/PLAN.md`.

**Intake:**

| #   | Pertanyaan                     | Jawaban                                                                                                                                                                                      |
| --- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Produk dan untuk siapa         | Portofolio pribadi bergaya admin panel publik tanpa login, untuk tech lead / hiring manager perusahaan software terkait Jepang (`PRODUCT.md`)                                               |
| 2   | POSITIONING/CUSTOMER sudah ada | Tidak (tanpa run create-business). Fase 1 membuat `docs/CUSTOMER.md`                                                                                                                       |
| 3   | Satu tujuan konversi           | Download CV (`/cv`); sekunder LinkedIn → email                                                                                                                                               |
| 4   | Multi-page atau landing        | Multi-page (`docs/PLAN.md` §7)                                                                                                                                                               |
| 5   | Stack dan lokasi kode          | Next.js 16 + Hono + D1/R2 di Cloudflare Workers via OpenNext; repo ini                                                                                                                       |
| 6   | Aset bukti                     | `policy-semver` v1.0.0 di GitHub Marketplace, SOBAT-PS (Dinas Kehutanan Kaltara), situs live ini, 10 sertifikasi. **Tidak ada** testimoni, logo klien, atau metrik bersumber (`PRODUCT.md`) |
| 7   | Seberapa penting craft         | Tinggi: desain dan kerapian situs adalah bagian dari bukti (prinsip "situs adalah demonstrasinya"); Fase 4–5 dijalankan penuh lewat Impeccable                                               |

## Phase Status

| Phase | Skill                    | Status                                                              | Artifact                   | Fase PLAN    | Date       |
| ----- | ------------------------ | ------------------------------------------------------------------- | -------------------------- | ------------ | ---------- |
| 1     | one-page-marketing       | done                                                                | MARKETING.md, CUSTOMER.md  | 1            | 2026-10-24 |
| 2     | storybrand-messaging     | done                                                                | POSITIONING.md, WEBSITE.md | 2            | 2026-10-24 |
| 3     | made-to-stick            | done                                                                | POSITIONING.md, WEBSITE.md | 2            | 2026-10-24 |
| 4     | top-design               | pending                                                             | DESIGN.md                  | 3            |            |
| 5     | web-typography           | pending                                                             | DESIGN.md                  | 3            |            |
| 6     | refactoring-ui           | pending                                                             | DESIGN.md                  | 3, 5         |            |
| 7     | ux-heuristics            | pending                                                             | DESIGN.md                  | 6, 7, 11     |            |
| 8     | cro-methodology          | pending (tanpa A/B test: tabel O/CO + 5-second test dengan 3–5 orang) | WEBSITE.md, EXPERIMENTS.md | 7            |            |
| 9     | scorecard-marketing      | skipped: satu CTA langsung sudah cukup, tidak ada funnel nurture    | —                          | —            | 2026-10-24 |
| 10    | steve-jobs-design-review | pending (GATE)                                                      | WEBSITE.md                 | 12           |            |

Statuses: pending · in-progress · awaiting-evidence · done · deferred: <reason> · skipped: <reason>

**Pembagian file DESIGN (✅ 24 Okt 2026):** `docs/DESIGN.md` = catatan keputusan dan audit wondelai; `DESIGN.md` di root = sistem desain final dari impeccable-documenter (Fase 12). Untuk token dan komponen, root yang menang.

## Key Decisions

| Date       | Phase | Decision                                                                                          | Rationale                                                     |
| ---------- | ----- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 2026-10-24 | 1     | Niche: tech lead / hiring manager perusahaan software terkait Jepang                              | Skor PVP tertinggi (25/30); dipilih Rahmat                    |
| 2026-10-24 | 1     | Tujuan konversi: Download CV; urutan CTA CV → LinkedIn → email                                    | Dipilih Rahmat                                                |
| 2026-10-24 | 1     | USP "The only portfolio that is itself the proof …" (lihat MARKETING.md)                          | Lolos swap test; dipilih Rahmat. Di frontend tanpa daftar tech stack dalam kurung (koreksi Rahmat) |
| 2026-10-24 | 1     | Bahasa EN saat launch, JA sebagai bahasa kedua yang pasti; situs siap i18n                        | Dipilih Rahmat                                                |
| 2026-10-24 | 1     | Mobile-first                                                                                      | Pengunjung sering membuka dari LinkedIn di HP; dipilih Rahmat |
| 2026-10-24 | 9     | Dilewati                                                                                          | `docs/PLAN.md` §4.3                                           |
| 2026-10-24 | 2     | One-liner #1; frasa stack Jepang dibuang; bukti Sinatra = SOBAT-PS live                            | Dipilih Rahmat                                                |
| 2026-10-24 | 8     | Tanpa A/B test                                                                                    | Trafik terlalu kecil (`docs/PLAN.md` §4.3)                    |

## Next Actions

- [x] Fase 2: BrandScript + 5 one-liner + made-to-stick (`docs/POSITIONING.md`)
- [x] Fase 2: frasa "the stack Japanese teams ship" dibuang dari copy situs (Rahmat)
- [x] Lokasi profil (Cikarang), foto profesional, highlight GCT/MINORI, status web profile HTSI (Rahmat, Fase 2)
- [ ] Perbarui lokasi LinkedIn ke Cikarang (Rahmat, Fase 13)
- [ ] Tautkan URL situs di LinkedIn, README profil GitHub, dan CV setelah launch (Rahmat, Fase 13)
