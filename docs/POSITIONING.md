# Positioning

> Dibuat di Fase 2 (`docs/PLAN.md`) dengan skill storybrand-messaging (create-website fase 2) dan made-to-stick (fase 3). Audiens, USP, dan tujuan konversi berasal dari `PRODUCT.md` dan `docs/MARKETING.md`. Copy untuk situs ditulis dalam bahasa Inggris; catatan dalam bahasa Indonesia.

## Fakta bersumber (dicek 24 Okt 2026)

Semua klaim di copy hanya boleh memakai baris di tabel ini. Fakta baru wajib masuk tabel dulu, lengkap dengan sumbernya.

| Fakta                                                                                                  | Sumber                                                                                                                         |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `policy-semver` terbit sebagai GitHub Action di Marketplace + CLI npm, rilis terakhir **v1.0.1** (2 Sep 2026) | `gh release list -R besarrahmat/policy-semver`, `npm view policy-semver version`, https://github.com/marketplace/actions/policysemver (200) |
| SOBAT-PS masih berjalan di domain Pemprov Kaltara (Laravel)                                           | `curl https://sobat-ps.kaltaraprov.go.id/` → 200, `<title>SOBAT-PS Dinas Kehutanan Provinsi Kalimantan Utara</title>`         |
| SOBAT-PS dikerjakan dari kontrak (Apr 2022–Sep 2023), PKL (Laravel 8), skripsi (API Lumen 10 + JWT), hingga rebuild Laravel 10 | LinkedIn §8.2, repo `pkl_sobatps_v2`, `skripsi_sobatps_api`, `sobatps`                                                          |
| nikke-calculator: **3 layanan berbagi 1 database** (Next.js di Vercel, NestJS + Prisma di Railway, Laravel + Filament di Laravel Cloud, Supabase Postgres) | README `nikke-calculator-nextjs` dan `nikke-calculator-laravel`                                                                 |
| Situs live nikke (`nikke-calculator-ten.vercel.app`) sekarang 404                                      | `curl` 24 Okt 2026 → tidak ada link live                                                                                       |
| wedding: setelah acara (Sep 2026) diubah jadi arsip statis; backend Laravel + Supabase dipensiunkan; data tamu dan rekening `server-only` | README `wedding-nextjs` § Status: static archive                                                                                |
| timetables v1 (SvelteKit, Jul 2026): timeline/agenda, favorit, deteksi bentrok, PWA, bulk import CSV; v2 (Next.js 16 + OpenNext + D1) dibangun di atas template admin open-source "Studio Admin" | Riwayat commit `timetables`, README (template arhamkhnz/next-shadcn-admin-dashboard)                                            |
| Pengalaman kerja: rentang digabung sejak Apr 2022, celah Nov 2023 tidak dihitung → **54 bulan** per Okt 2026 (dihitung saat render) | §8.2 + `mergeIntervals` (`src/lib/experience.test.ts`)                                                                          |
| GCT: melanjutkan pekerjaan dari MINORI; memimpin freelancer dan anak magang untuk proyek AI internal per departemen. MINORI: Laravel (utama), CodeIgniter (aplikasi lama yang masih dipakai), Next.js (sejak 2026) | Rahmat, 24 Okt 2026 |
| Main stack (Laravel, CodeIgniter, PHP, Next.js) dipakai di pekerjaan; teknologi lain dipelajari dalam setahun terakhir. Yang terbit publik dengan teknologi baru: wedding (arsip live), PolicySemVer (Marketplace/npm), portfolio ini | Rahmat, 24 Okt 2026 |
| Bug cache Next 16.4 di Workers ditemukan saat membangun situs ini; `'use cache'` dilepas               | `docs/PLAN.md` §11.3, opennextjs-cloudflare#1464, vercel/next.js#100345                                                         |

**Bukan fakta (jangan dipakai):** jumlah pengguna, trafik, angka performa produksi, testimoni, logo klien, kemampuan bahasa Jepang, jumlah test (belum dihitung dengan benar).

## BrandScript (SB7)

| Elemen                          | Isi                                                                                                                                                                                                                                                         |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Hero + keinginan**         | Tech lead / hiring manager di perusahaan software terkait Jepang. **Satu keinginan:** tahu sebelum wawancara apakah kandidat bisa merancang dan mengirim sistem produksi.                                                                                    |
| **2a. Masalah eksternal**       | Pekerjaan terbaik developer biasanya privat (NDA, repo tertutup); yang terlihat hanya daftar teknologi dan screenshot.                                                                                                                                      |
| **2b. Masalah internal**        | Takut salah pilih: sudah membuang waktu wawancara untuk kandidat yang ternyata hanya bisa mengikuti tutorial.                                                                                                                                                |
| **2c. Masalah filosofis**       | Kandidat seharusnya dinilai dari keputusan teknis yang bisa dicek, bukan dari klaim yang tidak bisa diverifikasi.                                                                                                                                             |
| **Villain**                     | Portofolio "daftar logo": deretan ikon framework, clone tutorial, dan screenshot tanpa keterangan peran.                                                                                                                                                    |
| **3a. Guide: empati**           | "Most of a developer's best work sits behind an NDA. You still need to judge it."                                                                                                                                                                         |
| **3b. Guide: otoritas**         | Bukti yang bisa dicek sendiri: SOBAT-PS masih berjalan di domain pemerintah provinsi; `policy-semver` terbit di GitHub Marketplace dan npm; situs ini sendiri adalah sistem produksi.                                                                       |
| **4a. Plan (proses)**           | 1. Scan the overview (one minute). 2. Open any project and read its architecture and decisions. 3. Download the CV and forward it.                                                                                                                         |
| **4b. Plan (kesepakatan)**      | Every number on this site links to its source. Private code stays private; no client names.                                                                                                                                                               |
| **5. CTA**                      | **Direct:** Download CV. **Transitional:** View projects · LinkedIn.                                                                                                                                                                                        |
| **6. Failure (taste)**          | Another interview round spent discovering what a diagram could have shown in two minutes.                                                                                                                                                                  |
| **7. Success**                  | Walk into the first interview already knowing how the candidate structures a system, which trade-offs he made, and where his code runs today.                                                                                                              |

**Aturan copy:** tidak ada kalimat pembuka yang dimulai dengan "I" atau "We". Rahmat disebut sebagai "Rahmat" (teks singkat) atau nama lengkap (header/SEO).

**Skor StoryBrand (Quick Diagnostic) untuk BrandScript ini: 9/10.** 7/7 baris terpenuhi; one-liner dinilai 2/3 sampai dipilih dan diuji (5-second test di Fase 7). Untuk 10/10: one-liner terpilih lolos cocktail party test dengan 3–5 orang.

## One-liner (5 variasi, dari yang paling mudah diulang)

| #   | One-liner                                                                                                                                                         | Catatan                                                       |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | "Judge the engineering, not the claims: every private system here comes with its architecture diagram."                                                          | Paling pendek; villain (claims) + solusi; hasil tersirat      |
| 2   | "Can't read a candidate's private code? Read the architecture of every system Rahmat built, starting with this site."                                            | Curiosity gap; menyebut bukti paling unik (situs ini)         |
| 3   | "Full-stack systems you can check before the interview: a live government system, a published GitHub Action, and a diagram for every private project."          | Paling konkret; paling panjang untuk diingat                  |
| 4   | "For teams shipping to Japanese clients: a full-stack developer whose portfolio is a production system you can inspect."                                         | Menyebut segmen; risiko terdengar seperti iklan lowongan      |
| 5   | "Hard to judge a full-stack candidate whose best work is private? Each system here shows its architecture and decisions, so you can decide before the first call." | Formula SB7 lengkap (masalah + solusi + hasil); cocok untuk About |

**Pilihan Rahmat (✅ 24 Okt 2026): #1** dipakai di Overview, LinkedIn, dan CV. #5 menjadi kalimat pembuka About.

**USP versi frontend (✅ 24 Okt 2026):** frasa "the stack Japanese teams ship" **dibuang dari copy situs** karena hanya bersandar pada artikel editorial (§5.1). Versi frontend: "The only portfolio that is itself the proof: an admin panel you can inspect, with an architecture diagram for every private system." Versi lengkap di `docs/MARKETING.md` tetap sebagai positioning internal.

## made-to-stick (SUCCESs)

Dinilai untuk pesan inti "private work, checkable proof" sesudah abstraksi diganti fakta bersumber.

| Trait      | Skor | Alasan / perbaikan yang sudah diterapkan                                                                                                         |
| ---------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Simple     | 8    | Commander's Intent: "every system here can be checked". Satu CTA.                                                                                |
| Unexpected | 7    | Portofolio yang sendirinya adalah sistem produksi (admin panel publik, API read-only). Pola admin panel mematahkan ekspektasi "halaman hero".    |
| Concrete   | 8    | "Developer berpengalaman" → "3 services sharing 1 database", "v1.0.1 on GitHub Marketplace and npm", "a system still live on kaltaraprov.go.id". |
| Credible   | 8    | Semua bisa dicek: link Marketplace/npm, domain pemerintah, kode situs ini (repo publik). Tanpa testimoni.                                          |
| Emotional  | 6    | Identitas: "tech lead yang menilai keputusan, bukan logo". Lemah karena tidak ada cerita pengguna nyata; tidak boleh dikarang.                    |
| Stories    | 7    | Satu cerita kreativitas (di bawah), bersumber dari log keputusan.                                                                                 |
| **Total**  | **44/60** | **Band 7–8 (strong).** Trait terendah: Emotional. Perbaikan yang sah: 5-second test di Fase 7 dan, bila ada, kutipan nyata dari reviewer kode (dengan izin). |

### Abstraksi → konkret

| Abstrak                         | Konkret (bersumber)                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------------------- |
| "Experienced full-stack developer" | "4+ years of shipped work since April 2022" (54 bulan, dihitung dari data, bukan disimpan)          |
| "Builds scalable systems"       | "Three services, one database: a Next.js app, a NestJS API, and a Laravel admin panel"                  |
| "Open-source contributor"       | "PolicySemVer: a GitHub Action and npm CLI, v1.0.1, listed on GitHub Marketplace"                       |
| "Government project experience" | "SOBAT-PS, the social forestry information system of North Kalimantan's Forestry Office, still live"    |
| "Cares about privacy"           | "After the wedding, the invitation became a static archive; guest names never reach the browser"        |

### Bukti Sinatra test (✅ 24 Okt 2026)

**SOBAT-PS masih berjalan di `sobat-ps.kaltaraprov.go.id`** tiga tahun setelah kontrak selesai: "A government information system still live on kaltaraprov.go.id, three years after delivery." Satu fakta ini menjawab keraguan utama tech lead ("bisakah ia mengirim sistem yang dipakai klien sungguhan dan bertahan?"). `policy-semver` menjadi bukti kedua (kode publik yang bisa dibaca). Status live dicek otomatis mingguan (§11.1 "Link live mati"); bila mati, klaim "still live" disembunyikan.

### Satu cerita (plot kreativitas)

> While building this site, every page went silent after the first content update: the request simply never finished. Rahmat traced it to a cache bug between Next.js 16.4 and Cloudflare Workers, found the two open upstream issues, and removed the cache instead of waiting for a fix. Pages now read straight from the database on every request, and the decision, with its numbers, is in the project log.

Sumber: `docs/PLAN.md` §11.3 (24 Okt 2026), opennextjs-cloudflare#1464, vercel/next.js#100345. Ditempatkan di case study `portfolio` (tab Timeline/Decisions).

## About (untuk situs; bisa dipakai juga di LinkedIn)

> Most of a developer's best work sits behind an NDA, so this site shows how each system is built instead: its architecture, the decisions behind it, and where it runs today.
>
> Rahmat (Besar Rachmat Ikhsan Pambudi) is a full-stack web developer with 4+ years of shipped work since April 2022. He is a Software Engineer at Global Collabo Tech, a subsidiary of PT MINORI, which works with many clients in Japan, where he leads freelancers and interns building internal AI projects for individual departments. Before that, at PT MINORI, he built and maintained apps in Laravel, CodeIgniter, and Next.js, and as a contract developer he delivered SOBAT-PS, the social forestry information system that North Kalimantan's Forestry Office still runs today.
>
> Outside work he ships tools other developers can use, such as PolicySemVer, a versioning GitHub Action published on GitHub Marketplace and npm. His main stack is PHP with Laravel and CodeIgniter, plus Next.js.
>
> The fastest way to judge his work is to open a project. The fastest way to share it is the CV.

**Catatan:** "4+ years" dirender dari `mergeIntervals`, bukan teks tetap. Pekerjaan di MINORI dan GCT disebut secara umum dari highlight yang diberikan Rahmat, tanpa nama klien atau nama proyek.
