# Rencana Implementasi — Web Portofolio Bergaya "Admin Panel" (tanpa login)

> **Status:** draf v2 · **Dibuat:** 18 Oktober 2026 · **Diperbarui:** 24 Oktober 2026 (edge case per fase; hasil verifikasi path manage, email, dan rate limiting) · **Pemilik:** Besar Rahmat
> **Lokasi:** `docs/PLAN.md` di repo `portfolio`
> Rencana ini dibuat **dari nol**. Rencana lama dan dokumen rencana di repo `timetables` sengaja tidak dipakai. Dari `timetables` hanya **kodenya** yang dibaca, yaitu logika input data manual (§6.3).

---

## 0. Cara memakai dokumen ini

Setiap fase punya format yang sama: **Tujuan · Skill · Langkah · ❓ Pertanyaan · Artefak · Selesai bila · Verifikasi · Penutup fase** (stage + pesan commit, lihat aturan 6).

Status langkah: `[ ]` belum · `[~]` berjalan · `[x]` selesai · `[-]` dilewati (tulis alasannya).

**Prioritas edge case** (blok _Edge case_ di tiap fase, diurutkan dari prioritas tertinggi; tanda ✅ = sudah diputuskan Rahmat):

| Tanda | Arti                                                           | Kapan wajib tuntas                                           |
| ----- | -------------------------------------------------------------- | ------------------------------------------------------------ |
| 🔴 P0 | Keamanan, kehilangan data, situs mati, atau klaim yang salah   | Sebelum fase itu ditutup, lengkap dengan test/verifikasi     |
| 🟠 P1 | Hasil terlihat salah atau mengganggu pengunjung utama / Rahmat | Sebelum Fase 12                                              |
| 🟢 P2 | Jarang terjadi atau kosmetik                                   | Boleh ditunda dengan komentar `shortcut:` + catatan di §11.3 |

**Aturan untuk agent (Claude Code / Cursor) yang menjalankan rencana ini:**
1. Muat skill **Ponytail (level lite)** dan **Karpathy guidelines** sebelum mulai kerja di setiap sesi.
2. **Semua pertanyaan ke Rahmat wajib diajukan lewat tool `AskUserQuestion`**, bukan sebagai pertanyaan di teks balasan. Aturan ini berlaku untuk setiap ❓ di dokumen ini, untuk pertanyaan baru yang muncul di tengah kerja, dan untuk wawancara atau keputusan dari skill (wawancara Impeccable `init`/`shape`, "Decide with the user" di wondelai), kecuali ronde keputusan Impeccable (lihat pengecualian di bawah).
   - Maksimal 4 pertanyaan per panggilan. Bila lebih, pecah menjadi beberapa panggilan berurutan.
   - Setiap pertanyaan punya 2–4 opsi konkret. Opsi yang direkomendasikan ditaruh pertama dengan label "(Rekomendasi)", dan deskripsi opsi menjelaskan akibat memilihnya. Rahmat selalu bisa memilih "Other".
   - Untuk pilihan visual, isi kolom `preview` (sketsa first viewport, palet, contoh tipografi).
   - Tanyakan saat fase dimulai, atau segera saat pertanyaan muncul. Selama belum dijawab, kerjakan hanya bagian yang tidak bergantung pada jawabannya. Jangan memutuskan diam-diam.
   - Bila tool tidak tersedia (mis. sesi terjadwal tanpa pengguna), berhenti di titik keputusan dan tunggu. Jangan menebak.
   - Jawaban dicatat di §11.3 _Log keputusan_.
   - **Pengecualian: semua ronde keputusan Impeccable memakai cara Impeccable**, yaitu decision page (`impeccable serve-question`). Ini berlaku untuk ronde arah visual (Fase 3) dan ronde struktur halaman (`concept-seed --scope surface`) bila terjadi di Fase 6/7. AskUserQuestion hanya dipakai sebagai fallback milik Impeccable sendiri; prosedur lengkapnya ada di Fase 3.
3. Fase akhir (9–13) harus **sama rincinya** dengan fase awal. Di Fase 12 ada langkah wajib untuk mengecek ulang hal ini.
4. Sebelum menulis kode Next.js/Hono/OpenNext, baca dokumentasi **versi yang terpasang** (`node_modules/next/dist/docs/`, Context7). Versi framework berubah cepat.
5. Jangan mengarang klaim, angka, testimoni, atau metrik. Semua angka di situs harus punya sumber (aturan 8 create-website + Impeccable "claims stay uninventable").
6. **Git: agent tidak pernah menjalankan `git commit` atau `git push`. Rahmat yang commit sendiri.** Di akhir setiap fase (blok _Penutup fase_), agent:
   1. Menjalankan `git status` dan memastikan tidak ada rahasia (`.env*`, `.dev.vars`, token, nilai `MANAGE_PATH`) maupun artefak build (`node_modules/`, `.next/`, `.open-next/`, `.wrangler/`) yang ikut. Bila ada, perbaiki `.gitignore` dulu.
   - Menjalankan pemeriksaan yang **sama dengan pre-commit hook** (Biome, `tsc --noEmit`, test terkait) sebelum staging, supaya commit Rahmat tidak gagal karena hook.
   2. Menjalankan `git add` **hanya untuk file milik fase itu**. Bila ada perubahan di luar fase, sebutkan dan tanyakan lewat AskUserQuestion apakah ikut di-stage.
   3. Menampilkan `git diff --staged --stat`.
   4. Memberikan **pesan commit siap salin**: format Conventional Commits, bahasa Inggris, subjek ≤ 72 karakter, body berupa poin-poin perubahan penting, footer `Refs: docs/PLAN.md Fase N`.
   5. Berhenti. Fase berikutnya baru dimulai setelah Rahmat mengonfirmasi lewat AskUserQuestion bahwa commit sudah dibuat.
   - Bila perubahan satu fase lebih rapi dipecah menjadi beberapa commit, stage per kelompok: stage kelompok pertama, beri pesannya, tunggu Rahmat commit, lalu lanjut ke kelompok berikutnya.
   - Bila `git add` gagal karena file kunci `.git/index.lock` tidak bisa dihapus di folder yang terhubung, minta izin hapus untuk folder repo. Jangan mengakali dengan cara lain.
7. **Edge case:** fase tidak boleh ditutup selama ada edge case 🔴 di fase itu yang belum tertangani dan teruji. Edge case baru yang ditemukan di tengah kerja ditambahkan ke blok fasenya dengan prioritas; bila butuh keputusan, tanyakan lewat AskUserQuestion.

---

## 1. Ringkasan

Portofolio pribadi yang **tampil seperti admin panel** (sidebar, topbar, tabel data, kartu KPI, halaman detail record, command palette ⌘K), tetapi **publik tanpa login**. Polanya diambil dari tiga referensi: CV di bagian atas, indeks/penomoran, diagram sistem per proyek, filter kategori, metrik nyata, dan timeline bertanggal (§3).

Stack yang dipilih adalah **Next.js 16 + Hono + Cloudflare D1/R2**, dideploy ke **Cloudflare Workers via OpenNext**. Kombinasi TypeScript + React/Next.js + Hono (buatan developer Jepang) mewakili stack yang sedang populer di Jepang (§5).

Konten awal diambil dari **LinkedIn dan GitHub** (publik dan privat), lalu dikurasi (§8). Setelah itu konten dikelola lewat **area input manual di path rahasia** yang meniru logika `timetables`, dengan dua perbaikan keamanan: Cloudflare Access dan verifikasi token di server (§6.3).

Ada satu **modul khusus komponen** (`src/components/ui/`) yang penamaan dan anatominya mengacu ke component.gallery, plus halaman showcase-nya (§9). Desain dikerjakan dengan **Impeccable** dan **wondelai**, sedangkan jumlah kode dijaga dengan **Ponytail** dan **Karpathy** (§4).

---

## 2. Kriteria permintaan → di mana dipenuhi

| #   | Kriteria dari Rahmat                                                            | Dipenuhi di                     |
| --- | ------------------------------------------------------------------------------- | ------------------------------- |
| 1   | Riset referensi desain portofolio terkini, khususnya 3 situs                    | §3, input Fase 3                |
| 2   | Pakai skill Ponytail, Karpathy, wondelai, Impeccable (sudah terpasang)          | §4, setiap fase (baris "Skill") |
| 3   | Bergaya admin panel tanpa login, tetap mengambil dari referensi poin 1          | §3.4, §7, Fase 3, 6, 7          |
| 4   | Tech stack populer di Jepang saat ini                                           | §5                              |
| 5   | Data dasar dari LinkedIn + GitHub (privat & publik), hanya yang relevan         | §8, Fase 2                      |
| 6   | Data tambahan bisa diinput manual dengan logika mirip `timetables`              | §6.3, §6.4, Fase 8              |
| 7   | Bila perlu, satu modul yang isinya hanya komponen (referensi component.gallery) | §9, Fase 5                      |

---

## 3. Riset referensi desain

Ketiga situs dibuka langsung di browser (desktop 1440 px dan tampilan sempit), lalu teks, warna, dan font dianalisis pada 18 Okt 2026.

### 3.1 anandasatriaa.github.io

| Aspek         | Temuan                                                                                                                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Struktur      | Satu halaman berurutan: hero (foto + "Hubungi Saya") → Tentang → Tech stack (prosa) → Kontribusi profesional → **25 proyek**, masing-masing dengan screenshot + "Lihat Disini" → logo pendidikan/bootcamp → logo pengalaman → blog → kontak |
| Visual        | Terang (#F1F5F9), Inter, aksen ungu #6D28D9, tombol pill, radius 0 pada kartu                                                                                                                                                               |
| Kekuatan      | Inventaris sistem **nyata** yang lengkap (internal perusahaan, instansi pemerintah) dengan konteks perusahaan. Sangat relevan untuk pasar Indonesia                                                                                         |
| Kelemahan     | Daftar panjang tanpa filter atau hierarki. Peran dan hasil per proyek tidak tertulis. CTA hanya kontak (tidak ada CV). Bahasa campur                                                                                                        |
| **Diambil**   | Inventaris proyek kerja nyata + konteks organisasi                                                                                                                                                                                          |
| **Dihindari** | Daftar datar tanpa filter dan proyek tanpa peran/hasil                                                                                                                                                                                      |

### 3.2 divyanshigupta.vercel.app

| Aspek         | Temuan                                                                                                                                                                                                                                                                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Struktur      | Hero sinematik full-bleed + eyebrow "ENGINEER · EXPLORER · LEARNER" + 3 CTA (Projects, **Resume/CV PDF**, About) → kartu "focus areas" → About → **grid proyek dengan filter kategori**, tiap kartu memuat **metrik** (Accuracy 99.65%, Precision, Recall, F1) + tag + "Read case study" → timeline pengalaman → skill dikelompokkan per kategori → kartu kontak + form |
| Visual        | Gelap #101820 berselang dengan section krem, emas #D6A16B, Cormorant Garamond (display) + Inter                                                                                                                                                                                                                                                                         |
| **Diambil**   | CV di area paling atas, filter kategori, metrik per proyek, case study per proyek, skill dikelompokkan                                                                                                                                                                                                                                                                  |
| **Dihindari** | Foto dekoratif yang tidak membuktikan apa pun. Form kontak tanpa backend email yang jelas                                                                                                                                                                                                                                                                               |

### 3.3 taqi16-portfoilio.vercel.app

| Aspek         | Temuan                                                                                                                                                                                                                                                                                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Struktur      | Section bernomor "01 ABOUT … 06 CONTACT", marquee, indeks proyek "01 / 10" yang di-scroll horizontal. Tiap kartu proyek memuat **diagram sistem yang digambar dengan kode** (React → Go backend → SQLite), **bukan screenshot**. Ada halaman detail `/projects/<slug>`, journey timeline dengan **rentang tanggal persis**, skill bertab per kategori, dan **Download CV** |
| Visual        | Hampir hitam #0B0D0F, aksen mint #8AEBDF, Manrope, display raksasa (h1 ±184 px), radius 3 px                                                                                                                                                                                                                                                                               |
| **Diambil**   | Penomoran/indeks (cocok dengan ID baris tabel admin), **diagram arsitektur per proyek** (ideal untuk proyek privat tanpa screenshot), halaman detail per slug, tanggal persis                                                                                                                                                                                              |
| **Dihindari** | Scroll horizontal sebagai satu-satunya navigasi proyek (sulit di mobile dan keyboard). Display raksasa yang memotong konten di layar kecil                                                                                                                                                                                                                                 |

### 3.4 Pola bersama → bentuk di admin panel

| Pola dari referensi                      | Bentuk di admin panel                                                                                                   |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Nama + peran + **CTA CV** di paling atas | Header halaman _Overview_ + tombol aksi primer **"Download CV"** di toolbar                                             |
| Angka/metrik                             | **Kartu KPI**, hanya berisi angka nyata yang bisa dicek (lihat aturan §0.5)                                             |
| Filter kategori proyek                   | **Tabel data**: segmented control (All/Work/Personal/Learning), pencarian, sort. Di mobile berubah menjadi daftar kartu |
| Case study per slug                      | **Halaman detail record**: breadcrumb "Projects / timetables", tab Overview · Architecture · Stack · Timeline · Links   |
| Diagram sistem                           | Tab **Architecture**: diagram dirender dari data (HTML/SVG), bukan gambar                                               |
| Journey timeline                         | **Activity log / audit log** bertanggal                                                                                 |
| Skill per kategori                       | **Matriks skill** + "dipakai di N proyek" (tertaut ke proyeknya)                                                        |
| Penomoran section                        | ID record (#001) + breadcrumb                                                                                           |
| Kontak                                   | Panel _Contact_ + tombol aksi                                                                                           |

Pola admin modern yang ditambahkan: **command palette ⌘K** (Nielsen #7: efisiensi untuk pengguna ahli), badge status (Live · Archived · Private repo · In progress · Scrapped), toggle tema, dan sidebar yang menjadi bottom nav/drawer di mobile.

> **Kalibrasi Impeccable:** dua referensi jatuh ke kelompok tampilan "default AI" menurut Impeccable (krem + serif + emas; hampir hitam + satu aksen neon). Karena itu referensi dipakai untuk **struktur dan pola**. **Dunia visual** dipilih lewat ronde arah Impeccable di Fase 3. Bentuk "admin panel" adalah permintaan Rahmat sehingga **mengikat** ("the brief wins").

---

## 4. Skill dan gerbang kualitas

### 4.1 Peta skill

| Skill                                                                                                  | Peran                                                                                                                                                                                                            | Kapan                                                                                                      |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **ponytail** (lite)                                                                                    | Kode/dependensi seminimal mungkin. Sebut opsi yang lebih kecil, Rahmat yang memilih                                                                                                                              | Setiap sesi. `/ponytail-review` setelah tiap fase besar. `/ponytail-audit` dan `/ponytail-debt` di Fase 12 |
| **karpathy-guidelines**                                                                                | Asumsi eksplisit, perubahan bedah, kriteria sukses yang bisa diverifikasi                                                                                                                                        | Setiap sesi                                                                                                |
| **impeccable**                                                                                         | Otoritas desain: `init` → PRODUCT.md, `shape` + new-work (arah visual), craft-floor sebelum edit UI, `critique`/`audit`/`clarify`/`harden`/`optimize`/`adapt`/`polish`, finish reviewer + documenter → DESIGN.md | Fase 1, 3, 5–8, 11, 12                                                                                     |
| **metaskills:create-website** (wondelai)                                                               | Tracker perjalanan pesan → desain → konversi di `docs/CREATE-WEBSITE-PLAN.md`                                                                                                                                    | Fase 1 (intake) sampai Fase 12 (gerbang)                                                                   |
| one-page-marketing                                                                                     | Audiens, USP (swap test), satu tujuan konversi                                                                                                                                                                   | Fase 1                                                                                                     |
| storybrand-messaging                                                                                   | Pengunjung sebagai hero, Rahmat sebagai guide, one-liner, CTA langsung + transisional                                                                                                                            | Fase 2                                                                                                     |
| made-to-stick                                                                                          | SUCCESs: angka konkret, satu hook tak terduga, satu cerita, Sinatra test                                                                                                                                         | Fase 2                                                                                                     |
| top-design                                                                                             | Signature moment, kontras skala tipe, gerak ber-easing kustom                                                                                                                                                    | Fase 3                                                                                                     |
| web-typography                                                                                         | Pasangan font, skala fluid, 65ch, payload font < 200 KB, angka tabular                                                                                                                                           | Fase 3                                                                                                     |
| refactoring-ui                                                                                         | Grayscale dulu, skala spasi 4–64, palet 9 tingkat, abu-abu bernada, satu aksi primer per section                                                                                                                 | Fase 3, 5                                                                                                  |
| design-everyday-things, microinteractions                                                              | Affordance, state, umpan balik < 100 ms, satu signature moment                                                                                                                                                   | Fase 5, 6, 8                                                                                               |
| ux-heuristics                                                                                          | Trunk Test, 10 heuristik Nielsen, severity 0–4                                                                                                                                                                   | Fase 6, 7, 11                                                                                              |
| cro-methodology                                                                                        | Tabel Objection/Counter (Big 5) untuk konversi CV/kontak                                                                                                                                                         | Fase 7                                                                                                     |
| high-perf-browser                                                                                      | Core Web Vitals, cache, font, koneksi                                                                                                                                                                            | Fase 11                                                                                                    |
| steve-jobs-design-review                                                                               | **GATE** sebelum deploy, verdict biner                                                                                                                                                                           | Fase 12                                                                                                    |
| engineering:testing-strategy, engineering:deploy-checklist, code-craftsmanship:technical-documentation | Test, checklist deploy, README                                                                                                                                                                                   | Fase 4, 11, 13                                                                                             |

### 4.2 Ritme gerbang (default; ❓ boleh diubah)

- **Awal:** Fase 1 menjalankan Impeccable `init` + intake create-website sebelum ada desain apa pun.
- **Setelah tiap fase besar** (3, 5, 6, 7, 8, 11): Impeccable `critique`/`audit` (bila menyangkut UI) + `/ponytail-review` + ux-heuristics (bila halaman publik).
- **Sebelum deploy** (Fase 12): steve-jobs-design-review (GATE) + Impeccable `polish` → finish reviewer → documenter + `/ponytail-audit`.

### 4.3 Mencegah konflik antar skill

| Potensi konflik                                                                                                                                                                                                                                                   | Aturan                                                                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dua file DESIGN.** create-website menulis `docs/DESIGN.md`, Impeccable menulis `DESIGN.md` di root                                                                                                                                                              | `docs/DESIGN.md` = **catatan keputusan dan audit** wondelai (arah, tipografi, token, UX audit findings). `DESIGN.md` root = **sistem desain final** yang ditulis impeccable-documenter dari hasil build (Fase 12). Untuk token dan komponen, root yang menang. ❓ konfirmasi di Fase 1 |
| **Daftar font terlarang berbeda.** top-design melarang Inter/Roboto untuk hero dan menyarankan Space Grotesk/Fraunces/Instrument Serif. Impeccable justru menganggap Space Grotesk/Fraunces/Instrument Sans/Inter-as-display sebagai default yang harus dihindari | Pilihan font diputuskan di ronde arah Impeccable + web-typography. Font dari daftar Impeccable hanya boleh dipakai dengan alasan yang tidak bisa dipenuhi font lain                                                                                                                    |
| **Smooth scroll.** top-design menyarankan Lenis/Locomotive, sedangkan admin panel adalah permukaan _Operate_ dan ux-heuristics melarang membajak scroll                                                                                                           | Default: scroll **native**. ❓ di Fase 3 bila arah visual memintanya                                                                                                                                                                                                                   |
| create-website **Fase 9 (scorecard quiz)**                                                                                                                                                                                                                        | **Dilewati**: portofolio tidak punya funnel nurture. Tracker mencatat `skipped: satu CTA langsung sudah cukup`                                                                                                                                                                         |
| create-website **Fase 8 (CRO) dan A/B test**                                                                                                                                                                                                                      | Trafik portofolio terlalu kecil untuk A/B test yang signifikan. Pakai tabel O/CO + **5-second test** dengan 3–5 orang                                                                                                                                                                  |
| **Mode Impeccable per permukaan**                                                                                                                                                                                                                                 | Overview = _Persuade_. Projects/Skills (tabel) = _Operate_. Detail proyek dan /components = _Read_. Bentuk admin panel = brief-pinned                                                                                                                                                  |
| **Image generation**                                                                                                                                                                                                                                              | Tidak tersedia di sesi ini → jalur build Impeccable **code-led** (komposisi dijaga oleh direction contract, bukan comp gambar). ❓ bila nanti ada image generation                                                                                                                     |
| **Custom cursor** (top-design)                                                                                                                                                                                                                                    | Opt-in saja. Default: cursor native                                                                                                                                                                                                                                                    |
| Ponytail vs ambisi desain                                                                                                                                                                                                                                         | Ponytail membatasi **jumlah kode dan dependensi**, bukan kualitas desain. Impeccable membatasi **keputusan visual**                                                                                                                                                                    |

---

## 5. Stack: populer di Jepang

### 5.1 Bukti

| Teknologi                       | Bukti                                                                                                                  | Sumber                            |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| TypeScript + React + Next.js    | Disebut standar de facto lowongan frontend Jepang 2026. **Catatan:** klaim editorial tanpa dataset                     | @SOHO (2026)                      |
| Next.js tetap default           | Diskusi teknologi perusahaan Jepang mofmof (Feb 2026): Next.js masih jadi default. TanStack Start masih RC             | mofmof tech blog                  |
| Lanskap framework React         | Next.js 16 untuk produk besar. Astro unggul kepuasan untuk situs konten. TanStack Start RC. HonoX alpha (per Jul 2026) | Qiita, 14 Jul 2026                |
| React di pasar freelance Jepang | React 38,9% proyek (peringkat 1), Vue 20,5%, Laravel 13,6% (data 2024, lama)                                           | CodeZine/CAMELORS                 |
| **Hono**                        | Dibuat developer Jepang (Yusuke Wada). Rating positif 95% di State of JS 2025 (3 besar "most positive")                | @IT (ITmedia), blog Cloudflare JP |
| Vite/Vitest/Playwright          | Vite 98% positif. Vitest dan Playwright masing-masing tumbuh +14 poin pemakaian                                        | @IT (State of JS 2025)            |

> **Jujur soal bukti:** tidak ditemukan survei resmi khusus Jepang untuk 2026. Buktinya berupa artikel industri Jepang + survei global yang diberitakan media Jepang.

### 5.2 Stack terpilih (✅ diputuskan 18 Okt 2026)

| Lapisan              | Pilihan                                                                                    | Catatan                                            |
| -------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| Bahasa               | TypeScript (strict)                                                                        |                                                    |
| Framework            | **Next.js 16** (App Router, RSC, Server Actions, React 19.2)                               | React Compiler opsional ❓ (build lebih lambat)    |
| API publik           | **Hono 4** di `src/app/api/[[...route]]/route.ts` dengan `handle` dari `@hono/vercel`      | Pola resmi hono.dev untuk Next.js. **Hanya GET**   |
| Hosting              | **Cloudflare Workers** via `@opennextjs/cloudflare`                                        | Mendukung semua minor Next.js 16                   |
| Database             | **Cloudflare D1** + **Drizzle ORM** + drizzle-kit                                          | Pola sama dengan `timetables`                      |
| Penyimpanan file     | **Cloudflare R2**                                                                          | CV PDF, gambar proyek                              |
| Validasi             | **Zod 4**                                                                                  | Dipakai bersama oleh form manage dan Hono          |
| Styling              | **Tailwind CSS v4** + token dari arah Impeccable                                           |                                                    |
| Primitif aksesibel   | ❓ Base UI / Radix / shadcn (salin)                                                        | Untuk dialog, menu, popover, tabs, combobox, toast |
| Ikon                 | lucide-react + simple-icons (logo teknologi)                                               | Keduanya sudah dipakai di `timetables`             |
| Lint/format          | Biome 2 + Husky + lint-staged                                                              | Next.js 16 tidak lagi menjalankan lint saat build  |
| Test                 | Vitest (unit) + Playwright (e2e) + @axe-core/playwright                                    |                                                    |
| Proteksi area manage | **Cloudflare Access** (Zero Trust, login one-time PIN ke email) + verifikasi JWT di server | ✅ diputuskan                                      |
| Package manager      | ❓ pnpm atau npm                                                                           |                                                    |

Versi pasti dikunci di Fase 0 dengan `npm view <paket> version` dan dicek ulang lewat Context7.

### 5.3 Alternatif yang ditolak

- **Astro + Hono:** kepuasan tertinggi untuk situs konten, tetapi interaktivitas admin panel dan area manage harus dirakit manual dengan islands.
- **Nuxt 4 + Hono:** Vue kuat di Jepang, tetapi meninggalkan pengalaman Next/React Rahmat.
- **TanStack Start:** masih RC. Sudah dicoba di `money-tracker-scrapped`.
- **HonoX:** masih alpha.
- **Opsi paling kecil (Ponytail):** situs statis dari file JSON di repo, tanpa D1 dan tanpa area manage. Kodenya paling sedikit, tetapi **tidak memenuhi kriteria #6** (input manual ala `timetables`).

### 5.4 Risiko platform (wajib dibuktikan di Fase 0)

| Risiko               | Fakta                                                                                                                                                                                    | Mitigasi                                                                                                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CPU Workers Free** | 10 ms per permintaan, 100.000 permintaan/hari (dokumentasi limits Cloudflare)                                                                                                            | Halaman publik di-cache (`'use cache'` + `cacheTag`, `updateTag` saat publish) agar Worker jarang merender penuh. Bila tetap lewat → ❓ Workers Paid (US$5/bulan) atau prerender penuh + redeploy saat konten berubah |
| **Ukuran Worker**    | Dokumen OpenNext menyebut 3 MiB (Free)/10 MiB (Paid) terkompresi. Halaman limits Cloudflare sekarang menyebut 64 MiB tak terkompresi tanpa batas terkompresi. **Sumbernya bertentangan** | Ukur dengan `wrangler deploy --dry-run` di Fase 0                                                                                                                                                                     |
| **`proxy.ts`**       | Di Next.js 16 berjalan di runtime Node.js. OpenNext **belum** mendukung Node middleware                                                                                                  | Jangan pakai `proxy.ts`/middleware. Proteksi lewat Access + cek di server                                                                                                                                             |
| D1 Free              | ±5 juta baris dibaca/hari, 100 ribu baris ditulis/hari, 5 GB (artikel Mei 2026)                                                                                                          | Jauh di atas kebutuhan portofolio                                                                                                                                                                                     |

---

## 6. Arsitektur

### 6.1 Diagram

```
Pengunjung ──HTTPS──► Cloudflare (DNS, cache, WAF, aturan bot)
                         │
                         ├─ /<MANAGE_PATH>/*  ─► Cloudflare Access (OTP email atau GitHub, hanya akun Rahmat)
                         ▼                      │
                 Worker: Next.js 16 (OpenNext) ◄┘
                   ├─ Halaman publik (RSC + 'use cache' + cacheTag)
                   ├─ /api/v1/*  (Hono, GET saja, JSON)
                   └─ Area manage /[secret] (guardManage() per halaman; assertAdmin() memverifikasi JWT Access)
                         │                    │
                     D1 (Drizzle)        R2 (CV, gambar)
```

### 6.2 Struktur folder (usulan, co-location)

```
src/
  app/
    (public)/                 layout shell admin publik
      page.tsx                Overview
      projects/               tabel  +  [slug]/ detail
      experience/  skills/  education/  contact/
      components/             showcase modul komponen (❓ publik)
      cv/route.ts             unduh CV dari R2
    (manage)/m/[secret]/      area input manual (noindex); hanya cocok dengan secret runtime MANAGE_PATH, selain itu 404
    api/[[...route]]/route.ts Hono /api/v1
  components/ui/              ← MODUL KOMPONEN (presentational saja, §9)
  components/shell/           sidebar, topbar, command palette, theme toggle
  server/db/                  schema.ts, index.ts (getDb), queries.ts
  server/auth/                access.ts (assertAdmin), manage-path.ts (guardManage)
  lib/                        schemas.ts (Zod), parse.ts (bulk import), slug.ts, format.ts
content/seed/*.json           data awal dari §8 (Fase 2)
drizzle/                      migrasi
docs/                         PLAN.md + artefak wondelai (CREATE-WEBSITE-PLAN, MARKETING, CUSTOMER, POSITIONING, WEBSITE, DESIGN, EXPERIMENTS)
PRODUCT.md  DESIGN.md         Impeccable (root)
```

### 6.3 Logika input manual: port dari `timetables`, dengan perbaikan

**Yang dilakukan `timetables`** (dibaca dari `svelte-scrapped/src/routes/manage-007rvtk/*`, `src/lib/parse.ts`, `src/server/db/schema.ts`):
1. Area admin di **path acak tanpa login** (`/manage-<acak>`) + meta `noindex,nofollow` + banner peringatan.
2. **Aksi server per form** (create/delete). Input divalidasi **Zod** (`safeParse` → `fail(400, error.flatten())`).
3. ID `nanoid()`, kolom `createdAt`/`updatedAt`, `status: draft | published` (+ `canceled` di versi Next).
4. **Cek slug unik** sebelum insert + tabel `slug_redirects` untuk slug lama.
5. **Bulk import:** tempel teks → `parseStageBlock`/`parseCsv` menghasilkan baris `ok`/gagal + alasan → **preview di klien** → simpan baris valid → laporkan baris gagal.
6. Drizzle + D1 lewat binding `DB`. `getDb()` di-cache per request.

**Dipertahankan:** poin 1–6. **Diperbaiki:**

|     | Masalah di `timetables`                                                                            | Di portofolio                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔴  | `robots.txt` berisi `Disallow: /manage-007rvtk/`, sehingga **path rahasianya justru terpublikasi** | Path manage **tidak** ditulis di robots.txt maupun di konfigurasi build. Pakai meta `robots: noindex, nofollow` dari `metadata` layout manage. Header `X-Robots-Tag` tidak dipakai karena butuh nilai path saat build; halamannya juga di balik Access, jadi crawler tidak sampai ke sana                                                                                                                                                                                                                                                                                                                                                               |
| 🔴  | Tanpa proteksi: siapa pun yang tahu URL bisa **mengubah atau menghapus** data                      | **Cloudflare Access** di depan path + `assertAdmin()` di **baris pertama setiap Server Action** dan di setiap halaman manage. Alasannya: Server Action bisa dipanggil langsung lewat POST, dan URL `*.workers.dev`/preview tidak melewati Access. `workers_dev` dan preview URL dimatikan di wrangler                                                                                                                                                                                                                                                                                                                                                   |
| 🔴  | Path rahasia tertulis sebagai nama folder di repo                                                  | Folder kode memakai segmen dinamis `(manage)/[secret]/`. Nilainya dibandingkan dengan **secret runtime** `MANAGE_PATH` (Wrangler secret di produksi, `.dev.vars` lokal yang gitignored) yang dibaca lewat `getCloudflareContext().env`, sehingga **repo boleh publik** (✅). Tidak cocok atau secret kosong → 404 (_fail closed_). **Diuji 24 Okt:** `rewrites` di `next.config.ts` ikut terbit di file publik `/_next/static/<buildId>/_buildManifest.js` (`__rewrites`), dan isi file `.env*` di-inline OpenNext ke bundle (`.open-next/cloudflare/next-env.mjs`). Karena itu nilai path tidak boleh ada di `next.config.ts`, file `.env*`, atau kode |
| 🟠  | Hapus bersifat permanen                                                                            | **Soft delete** (status `archived`) + konfirmasi. Hard delete hanya untuk draft. ❓                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 🟢  | —                                                                                                  | Setelah simpan: `updateTag('<tag>')` (Next 16, read-your-writes) supaya halaman publik langsung segar                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 🟢  | Format import khusus jadwal                                                                        | Bulk import **JSON/CSV** per entitas (proyek, pengalaman, skill, sertifikasi) dengan pola preview + laporan gagal yang sama                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

### 6.4 Model data (draf; difinalkan di Fase 4 → `src/server/db/schema.ts`)

| Tabel                 | Kolom utama                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `profile` (singleton) | name (`Besar Rachmat Ikhsan Pambudi`), short_name (`Rahmat`), alternate_names (`Besar Rahmat`), headline, location, summary, avatar_key, cv_key, contact_email (alias khusus portofolio; tidak pernah dirender utuh, lihat Fase 7), links (JSON), availability ❓, updated_at                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `experiences`         | id, company, role, employment_type, location, work_mode, start (`YYYY-MM`), end (`YYYY-MM`, kosong = Present), summary, highlights (JSON), **disclosure** (`public`/`general`/`hidden`) ❓, counts_toward_experience (bool), sort_order, status, updated_at                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `education`           | id, institution, degree, field, start (`YYYY-MM`), end (`YYYY-MM`), grade ❓, status, updated_at                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `certifications`      | id, name, issuer, issued_at, **expires_at**, credential_id, url, status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `projects`            | id, **slug** (unik, dikunci setelah publish ❓), title, tagline, summary, role, experience_id (nullable), period_start/end (`YYYY-MM`), kind (`work`/`freelance`/`personal`/`learning`/`thesis`), **links** (JSON daftar: label, url, kind `repo`/`live`/`docs`/`package`, visibility `public`/`private`; **repo privat tanpa url**, karena satu proyek bisa punya beberapa repo/layanan), state (`live`/`archived`/`in_progress`/`scrapped`), status (`draft`/`published`/`archived`), **metrics** (JSON: label, value, unit, source), **architecture** (JSON: nodes/edges untuk diagram), cover_key (juga dipakai sebagai gambar OG proyek), featured, sort_order, created_at, updated_at (untuk optimistic lock) |
| `project_media`       | id, project_id, r2_key, alt, kind (`screenshot`/`diagram`), sort_order                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `skills`              | id, name, category (`language`/`framework`/`database`/`infra`/`tool`/`practice`), icon (slug simple-icons), first_used, last_used                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `project_skills`      | project_id, skill_id (n:m → "dipakai di proyek apa")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `slug_redirects`      | id, old_slug, new_slug, created_at (dari `timetables`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| i18n                  | ❓ kolom per bahasa (`title_en`, `title_ja`, …) atau tabel `translations`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

---

## 7. IA / sitemap (metafora admin panel)

| Rute               | Menu       | Isi                                                                                                                                                                           | Mode Impeccable |
| ------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `/`                | Overview   | Header (nama, headline, lokasi, status ketersediaan ❓), aksi primer **Download CV**, kartu KPI (hanya angka nyata), 3 proyek unggulan, activity log singkat, ringkasan stack | Persuade        |
| `/projects`        | Projects   | Tabel (#ID, nama, jenis, stack, periode, badge status), segmented filter, cari, sort. Di mobile berupa daftar kartu                                                           | Operate         |
| `/projects/[slug]` | —          | Breadcrumb, header record, tab Overview · Architecture · Stack · Timeline · Links, metrik bersumber, badge "Private repo"                                                     | Read            |
| `/experience`      | Experience | Activity log per perusahaan/peran dengan tanggal persis                                                                                                                       | Read            |
| `/skills`          | Skills     | Matriks per kategori + "dipakai di N proyek"                                                                                                                                  | Operate         |
| `/education`       | Education  | Pendidikan + sertifikasi (status kedaluwarsa otomatis dari `expires_at`)                                                                                                      | Read            |
| `/contact`         | Contact    | CV (satu file EN, ✅), LinkedIn, email alias khusus portofolio yang dirakit di browser saat diklik (✅), GitHub (urutan ❓)                                                   | Persuade        |
| `/components`      | Components | Showcase modul komponen ❓ publik                                                                                                                                             | Read            |
| `/api/v1/*`        | —          | JSON read-only ❓                                                                                                                                                             | —               |
| `/<MANAGE_PATH>/*` | —          | Area input manual (Access), mobile-first (✅)                                                                                                                                 | Operate         |

**Global:** sidebar (desktop) ↔ bottom nav + drawer (mobile), topbar (breadcrumb, ⌘K, toggle tema, tombol CV), skip link, halaman 404/500/loading/empty yang bergaya panel.

---

## 8. Inventaris konten (data mentah, dikurasi di Fase 2)

Diambil 18 Okt 2026 dari **LinkedIn** (dibaca di browser bawaan saat Rahmat sudah login) dan **GitHub `besarrahmat`**: 34 repo didaftar (publik dan privat), lalu README dan manifest (`package.json`/`composer.json`) dibaca untuk 25 repo yang berpotensi relevan. Hanya yang relevan untuk portofolio yang dicatat di sini.

### 8.1 Profil (LinkedIn)

- **Nama:** Besar Rachmat Ikhsan Pambudi (He/Him) · **Headline:** Web Developer | Software Engineer · **Lokasi:** Malang Regency, East Java.
- **About saat ini sudah usang** (masih "PHP Laravel 1,5 tahun, WordPress 1 tahun") → ditulis ulang di Fase 2.
- **Top skills:** Web Development, Full-Stack Development, PHP, MySQL, Laravel.
- **Bahasa:** Indonesia (native), English (limited working).

### 8.2 Pengalaman (LinkedIn)

| Periode             | Peran                                | Organisasi                             | Lokasi / mode             | Catatan                                                                                                  |
| ------------------- | ------------------------------------ | -------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------- |
| Jan 2026 – sekarang | Software Engineer (full-time)        | Global Collabo Tech                    | Cikarang Selatan, on-site | Next.js, PHP +6 skill · ❓ detail apa yang boleh tampil                                                  |
| Des 2023 – Jan 2026 | Full Stack Web Developer (full-time) | PT MINORI                              | Cikarang Selatan, on-site | PostgreSQL, PHP +6 skill · ❓                                                                            |
| Jul 2022 – Okt 2023 | Contract Web Developer               | PT Heat Transfer Solutions Indonesia   | Sidoarjo, remote          | WordPress + Brizy. Sistem penerimaan penawaran jasa, migrasi CMS. Proyek LinkedIn: "Web Profile PT-HTSI" |
| Apr 2022 – Sep 2023 | Contract Web Developer               | Dinas Kehutanan Prov. Kalimantan Utara | Bulungan, remote          | Laravel + Bootstrap. SOBAT-PS, review kode, debug, dokumentasi pelatihan                                 |

### 8.3 Pendidikan dan sertifikasi (LinkedIn)

- **Universitas Brawijaya**, S1 Teknologi Informasi, Agu 2018 – Jul 2023, IPK 3,52/4,00. ❓ tampilkan IPK? ❓ bulan lulus: LinkedIn menulis Jul 2023, cocokkan dengan ijazah.
- SMA Negeri 1 Tumpang, 2015–2018. ❓ biasanya tidak perlu ditampilkan.
- **10 sertifikasi:**
  - Google, _Configure your Workplace: Google Workspace for IT Admins_ (Nov 2023)
  - Coding Studio, _Mahir Membuat Website dengan Laravel 9_ (Nov 2023)
  - Coding Studio, _Fundamental Front-End Web_ (Nov 2023)
  - Dicoding, _Belajar Machine Learning untuk Pemula_ (Nov 2023, berlaku s.d. Nov 2026)
  - Dicoding, _Belajar Analisis Data dengan Python_ (Nov 2023, s.d. Nov 2026)
  - Dicoding, _Memulai Pemrograman dengan Python_ (Okt 2023, s.d. Okt 2026)
  - Dicoding, _Belajar Dasar SQL_ (Okt 2023, s.d. Okt 2026)
  - Dicoding, _Belajar Dasar Data Science_ (Okt 2023, s.d. Okt 2026)
  - Dicoding, _Memulai Pemrograman dengan Java_ (Mei 2022, **kedaluwarsa** Mei 2025)
  - Dicoding, _Memulai Pemrograman dengan Dart_ (Okt 2024, s.d. Okt 2027)
- ⚠️ Lima sertifikat Dicoding kedaluwarsa **bulan ini atau bulan depan** (Okt–Nov 2026). ❓ tampilkan dengan status "Expired" atau sembunyikan.

### 8.4 Proyek kandidat (GitHub)

| #   | Repo                                                                                                                                                                                                                                                             | Visibilitas               | Push terakhir           | Stack (dari manifest)                                                                                                                               | Ringkasan                                                                                                                              | Usulan                                                                                                                                                              |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `timetables`                                                                                                                                                                                                                                                     | privat                    | Jul 2026                | Next.js 16, React 19, Tailwind 4, Drizzle + D1, OpenNext Cloudflare, Zustand, TanStack Table                                                        | Jadwal festival multi-stage: timeline per stage, agenda, favorit, deteksi bentrok, zona waktu perangkat, bulk import                   | ⭐ Unggulan: case study + diagram, tanpa link kode                                                                                                                  |
| 2   | `nikke-calculator-nextjs` + `nikke-calculator-laravel`                                                                                                                                                                                                           | privat                    | Agu/Jul 2026            | Frontend Next.js 16 (Vercel) · API NestJS 11 + Prisma 7 (Railway) · Admin Laravel 13 + Filament 5 (Laravel Cloud) · Supabase Postgres · CI per path | Kalkulator progres game NIKKE: **3 layanan berbagi 1 database**                                                                        | ⭐ Unggulan (arsitektur multi-layanan)                                                                                                                              |
| 3   | `wedding-nextjs` + `wedding-laravel`                                                                                                                                                                                                                             | privat                    | Okt/Agu 2026            | Next.js 16 + next-intl + Framer Motion + Sentry + Jest · Laravel 13 + Filament 5 + Sanctum + Supabase Storage                                       | Undangan digital "Jawa × 日本 × Future": RSVP, guest lookup, idempotency key, CSP ketat. Sekarang arsip statis                         | ⭐ Kandidat · ❓ ada data pribadi (daftar tamu): case study tanpa link live?                                                                                        |
| 4   | `policy-semver`                                                                                                                                                                                                                                                  | **publik**                | Sep 2026                | TypeScript, pnpm monorepo, tsup, Vitest, Biome                                                                                                      | **GitHub Action + CLI npm v1.0.0, terbit di GitHub Marketplace**                                                                       | ⭐ Unggulan (open source yang terbit; bukti kuat untuk Sinatra test)                                                                                                |
| 5   | `sobatps` (publik, Laravel 10) + `pkl_sobatps_v2` (privat, Laravel 8) + `skripsi_sobatps_api` (privat, Lumen 10 + JWT)                                                                                                                                           | campuran                  | 2023                    | Laravel, Lumen, Bootstrap, DataTables                                                                                                               | SOBAT-PS: SI pemberdayaan masyarakat & perhutanan sosial (Dinas Kehutanan Kaltara), dari kontrak, PKL, sampai skripsi                  | ⭐ Case study kerja (3 repo digabung jadi 1 proyek)                                                                                                                 |
| 6   | `portfolio` (**repo ini**)                                                                                                                                                                                                                                       | ❓ publik/privat (Fase 0) | dibangun mulai Okt 2026 | Next.js 16, Hono, Drizzle + D1, R2, OpenNext Cloudflare, Cloudflare Access, Tailwind 4, Vitest, Playwright                                          | Portofolio bergaya admin panel tanpa login: area manage terproteksi (pola `timetables` + Access), API publik read-only, modul komponen | ⭐ **Unggulan**: case study + diagram arsitektur. Metriknya (Lighthouse, ukuran bundle, CPU Worker) diisi dari angka nyata di Fase 12. Tautan kode bila repo publik |
| 7   | `money-tracker-scrapped`                                                                                                                                                                                                                                         | privat, arsip             | Sep 2026                | TanStack Start, Workers, D1, Better Auth, Resend                                                                                                    | Buku kas rumah tangga yang dibatasi siklus gajian                                                                                      | ❓ tampil sebagai "Scrapped/Experiment" atau sembunyikan                                                                                                            |
| 8   | `ecommerce-laravel`                                                                                                                                                                                                                                              | publik                    | Nov 2023                | Laravel 10, Bootstrap                                                                                                                               | README masih default                                                                                                                   | ❓ butuh deskripsi dari Rahmat                                                                                                                                      |
| 9   | `mthrill-web`                                                                                                                                                                                                                                                    | privat, arsip             | Sep 2023                | Laravel 8, Jetstream, Livewire                                                                                                                      | README masih default                                                                                                                   | ❓ butuh deskripsi                                                                                                                                                  |
| 10  | `minori-test`                                                                                                                                                                                                                                                    | privat                    | Nov 2023                | Laravel 10, Breeze, DataTables                                                                                                                      | Tes kompetensi saat melamar ke PT Minori                                                                                               | Usul: **sembunyikan** (tes rekrutmen)                                                                                                                               |
| 11  | _Learning log_: `dicoding-openmusic-api`, `-bookshelf-api`, `-bookshelf-app`, `-notes-app`, `-callofduty-apps`, `-bike-sharing` · `hyperskill-tasklist`, `-steganocryptography`, `-parkinglot` · `blogging`, `bookapp`, `coursera-html-css-js`, `note`           | publik                    | 2021–2024               | Node.js/Hapi, JS, Python, Kotlin, Laravel                                                                                                           | Latihan kursus                                                                                                                         | Tabel "Learning" terpisah, bukan unggulan                                                                                                                           |
| —   | **Dikecualikan:** `karryn` (mod game), fork (`laravel-nova`, `bank-soal`, `genshin-impact-helper`), `portfolio-react` (template CRA kosong), `portfolio-laravel` (repo kosong), `policy-semver-test` (arsip uji), `forget_commit_existing_repo` (❓ belum dicek) |                           |                         |                                                                                                                                                     |                                                                                                                                        |                                                                                                                                                                     |

**Lima proyek unggulan:** `timetables`, `nikke-calculator`, `policy-semver`, SOBAT-PS, dan **`portfolio` (repo ini)**. `wedding` menjadi kandidat keenam bila Rahmat setuju (❓ Fase 2).

**Proyek kerja tanpa repo:** Web Profile PT-HTSI (WordPress + Brizy), proyek di PT MINORI dan Global Collabo Tech (❓ batasan NDA).

**Aturan proyek privat:** tampil sebagai case study + diagram arsitektur (pola §3.3), badge "Private repo", tanpa link kode. Screenshot hanya boleh bila tidak memuat data pribadi atau data klien.

---

## 9. Modul komponen (referensi component.gallery)

**Prinsip:**
- **Satu modul `src/components/ui/`** yang isinya **hanya komponen presentational**: tanpa fetch data, tanpa akses DB, tanpa logika bisnis; hanya props dan slot. Nama file mengikuti nama di component.gallery (mis. `breadcrumbs.tsx`, `empty-state.tsx`, `segmented-control.tsx`).
- **Referensi anatomi dan a11y:** halaman per komponen di component.gallery (60 komponen, 95 design system, 2.671 contoh), dibaca saat komponen itu dibangun.
- Komponen interaktif yang rumit (Modal, Drawer, Dropdown menu, Popover, Tooltip, Tabs, Combobox, Select, Toast) memakai **primitif headless** ❓. Focus trap tidak ditulis sendiri.
- Gaya datang dari **token arah Impeccable**, bukan gaya bawaan library.
- **Hanya komponen yang dipakai situs yang dibangun** (Ponytail). Komponen bertanda ✖ tidak dibuat.
- **Showcase `/components`:** tiap komponen ditampilkan dengan state lengkap (default/hover/focus/disabled/error/loading/empty) + catatan a11y + tautan ke halaman component.gallery-nya. Halaman ini sekaligus bukti keahlian UI.

| component.gallery             | Dipakai di                                         | Rencana                              |
| ----------------------------- | -------------------------------------------------- | ------------------------------------ |
| Accordion                     | Detail proyek (mobile), FAQ manage                 | ✔                                    |
| Alert                         | Pesan sukses/error di manage                       | ✔                                    |
| Avatar                        | Header Overview                                    | ✔                                    |
| Badge (Tag/Chip)              | Status proyek, tag stack                           | ✔                                    |
| Breadcrumbs                   | Detail proyek, manage                              | ✔                                    |
| Button                        | Semua                                              | ✔                                    |
| Button group                  | Toolbar aksi                                       | ✔                                    |
| Card                          | KPI, proyek unggulan                               | ✔                                    |
| Carousel                      | — (galeri pakai grid)                              | ✖                                    |
| Checkbox                      | Form manage                                        | ✔                                    |
| Color picker                  | —                                                  | ✖                                    |
| Combobox                      | Command palette ⌘K, pilih skill di manage          | ✔                                    |
| Date input                    | Periode di manage                                  | ✔                                    |
| Datepicker                    | — (Date input cukup)                               | ✖                                    |
| Drawer (Sheet)                | Nav dan filter di mobile                           | ✔                                    |
| Dropdown menu                 | Menu tema, aksi baris tabel                        | ✔                                    |
| Empty state                   | Tabel kosong, hasil filter kosong                  | ✔                                    |
| Fieldset                      | Form manage                                        | ✔                                    |
| File (Download)               | Download CV                                        | ✔                                    |
| File upload                   | Unggah CV/gambar di manage                         | ✔                                    |
| Footer                        | Shell                                              | ✔                                    |
| Form                          | Manage                                             | ✔                                    |
| Header                        | Topbar                                             | ✔                                    |
| Heading                       | Semua                                              | ✔                                    |
| Hero                          | — (diganti header halaman Overview)                | ✖ ❓ bila arah desain membutuhkannya |
| Icon                          | Semua                                              | ✔                                    |
| Image                         | Screenshot, diagram                                | ✔                                    |
| Label                         | Form                                               | ✔                                    |
| Link                          | Semua                                              | ✔                                    |
| List                          | Pengalaman, sertifikasi                            | ✔                                    |
| Modal (Dialog)                | Konfirmasi hapus, preview import                   | ✔                                    |
| Navigation                    | Sidebar / bottom nav                               | ✔                                    |
| Pagination                    | — (data < 50 baris)                                | ✖ ❓                                 |
| Popover                       | Info singkat di tabel                              | ✔                                    |
| Progress bar                  | Unggah file di manage                              | ✔                                    |
| Progress indicator (Timeline) | Experience / activity log                          | ✔                                    |
| Quote                         | — (tidak ada testimoni nyata; **jangan dikarang**) | ✖                                    |
| Radio button                  | Manage                                             | ✔                                    |
| Rating                        | — (jangan memberi bintang pada skill)              | ✖ ❓ level skill                     |
| Rich text editor              | — (Textarea + Markdown sederhana)                  | ✖ ❓                                 |
| Search input                  | Filter tabel, palette                              | ✔                                    |
| Segmented control             | Filter jenis proyek                                | ✔                                    |
| Select                        | Manage                                             | ✔                                    |
| Separator                     | Semua                                              | ✔                                    |
| Skeleton                      | State loading                                      | ✔                                    |
| Skip link                     | Shell                                              | ✔                                    |
| Slider                        | —                                                  | ✖                                    |
| Spinner                       | Tombol yang sedang memproses                       | ✔                                    |
| Stack                         | Utilitas layout                                    | ✔                                    |
| Stepper (Nudger)              | —                                                  | ✖                                    |
| Table                         | Projects, skills, sertifikasi                      | ✔                                    |
| Tabs                          | Detail proyek                                      | ✔                                    |
| Text input                    | Form                                               | ✔                                    |
| Textarea                      | Form                                               | ✔                                    |
| Toast                         | Notifikasi simpan di manage                        | ✔                                    |
| Toggle (Switch)               | Tema, featured/published di manage                 | ✔                                    |
| Tooltip                       | Tombol ikon                                        | ✔                                    |
| Tree view                     | —                                                  | ✖                                    |
| Video                         | —                                                  | ✖                                    |
| Visually hidden               | Label a11y                                         | ✔                                    |

---

## 10. Fase implementasi

### Fase 0 — Fondasi repo dan tracer bullet (bukti platform)

**Tujuan:** membuktikan stack berjalan di Cloudflare Free **sebelum** ada pekerjaan desain.
**Skill:** ponytail (lite), karpathy, engineering:deploy-checklist (versi ringan).
- [x] `git init` (tanpa commit; commit dilakukan Rahmat, aturan §0.6). ❓ identitas commit (nama/email). ❓ repo GitHub publik atau privat. Pola branch `main`/`dev` seperti repo lain. Buat `.gitignore` **sebelum** staging pertama.
- [x] `create-next-app@latest` (TypeScript, App Router, Tailwind 4, `src/`, tanpa ESLint karena diganti Biome). Baca `node_modules/next/dist/docs/` dulu.
- [x] **Dev server di port 3005:** script `"dev": "next dev -p 3005"`. Semua yang menunjuk ke dev lokal memakai `http://localhost:3005`, termasuk `baseURL` Playwright, `webServer.port`, konfigurasi live mode Impeccable, dan link di README.
- [x] **Node 24 LTS** (✅): `.nvmrc`, `engines` di `package.json` + `engine-strict`, dan `setup-node` di CI memakai versi yang sama.
- [x] Pasang `@opennextjs/cloudflare` + `wrangler`. Isi `wrangler.jsonc`: flag `nodejs_compat`, binding D1 `DB`, binding R2 `MEDIA`, preview URL nonaktif. `workers_dev` hanya boleh aktif sementara untuk tracer bila domain belum ada (lihat edge case). Panggil `initOpenNextCloudflareForDev()` di `next.config.ts` supaya binding dan `.dev.vars` terbaca di `next dev`.
- [x] Drizzle + D1: satu tabel `health` + migrasi. Endpoint `/api/v1/health` lewat Hono (sekaligus bukti Hono jalan di OpenNext).
- [x] Halaman `/` yang dirender di server dan membaca D1.
- [x] Deploy ke **Workers Free**. Catat: ukuran bundle (`wrangler deploy --dry-run --outdir`), CPU time median/p99 per halaman (dashboard Workers / `wrangler tail`), cold start. Live di `https://portfolio.besarrahmat.workers.dev`; angka di §11.3. CPU > 10 ms → ✅ Workers Paid.
- [x] Uji siklus `updateTag` di Workers sungguhan, lalu hapus route dummy `(manage)/m/[secret]`. **Gagal karena bug upstream:** request pertama setelah `updateTag` macet (opennextjs-cloudflare#1464, vercel/next.js#100345). ✅ `'use cache'` dilepas; route dummy, guard, dan `.dev.vars.example` dihapus (guard yang teruji ada di commit `12df560` untuk Fase 8).
- [x] Biome + Husky + ~~lint-staged~~ `biome check --staged` (✅ lint-staged dibuang), `tsc --noEmit`, kerangka Vitest + Playwright, CI GitHub Actions (lint, typecheck, test, build). CI hijau di `main` dan `dev`.
- [x] Alur branch (✅): kerja di `dev`, `main` untuk rilis; CI untuk push dan PR ke keduanya; `npm run deploy` menolak jalan di luar `main`. Default branch GitHub tetap `main`, tanpa ruleset (sama seperti repo lain).
- [x] `/impeccable hooks on` setelah scaffold ada. Bila hook tidak aktif, jalankan `impeccable detect --json` secara manual di tiap fase UI.

**Edge case (urut prioritas):**
- 🔴 **Belum ada domain saat tracer bullet.** Deploy pertama memakai `*.workers.dev`; ini aman karena belum ada area manage. `workers_dev: false` + preview URL mati **wajib** sebelum kode manage pertama kali dideploy (dicek lagi di Fase 8 dan 13).
- 🔴 **Cache tidak benar-benar segar di Workers.** `'use cache'` + `updateTag` butuh incremental cache dan tag cache OpenNext (mis. R2 + D1). Tracer wajib membuktikan siklus "ubah data → `updateTag` → halaman segar" di Workers sungguhan, bukan hanya di `next dev`. **Hasil:** siklus segar di `preview` lokal, tetapi di Workers sungguhan request pertama setelah `updateTag` macet (bug upstream di atas). Ditangani dengan tidak memakai `'use cache'`: data dibaca langsung dari D1 per request, jadi selalu segar. Strategi cache dievaluasi ulang di Fase 11 atau setelah bug ditutup.
- 🟠 **Route manage dengan path rahasia tidak jalan di Workers sungguhan.** Sudah diuji 24 Okt di `next dev` dan workerd lokal (`wrangler dev`) dengan Next 16.4.3 + OpenNext 1.20.13: segmen `[secret]` + secret runtime berjalan, sedangkan `rewrites` membocorkan path (§6.3). Respons manage dan 404-nya sudah `Cache-Control: private, no-cache, no-store` (✅ diuji), jadi tidak di-cache edge. Uji di Workers sungguhan diputuskan tetap di tracer ini (✅): secret di-set dengan `wrangler secret put`, halaman berisi teks dummy yang dihapus setelahnya, lalu cek path benar → 200, path acak → 404 tanpa teks halaman manage, header `Cache-Control` sama seperti di lokal, dan nilai secret tidak ada di `.open-next/`. **Hasil 24 Okt (build produksi, `opennextjs-cloudflare preview`):** dengan `cacheComponents`, `notFound()` di segmen dinamis selalu jadi **soft-404** (HTTP 200 + `noindex` + UI 404, tanpa isi manage, `no-store`) karena shell sudah di-stream; 404 asli hanya bisa lewat `proxy.ts` (dilarang). Karena itu route dipindah ke `(manage)/m/[secret]` (✅) agar URL publik yang salah tetap 404 asli; test e2e memeriksa "tanpa isi manage + noindex + no-store" untuk `/m/*`.
- 🟠 **Versi Node lokal berbeda.** `engine-strict` membuat install/dev gagal cepat dengan pesan jelas, bukan error aneh di tengah build.
- 🟢 **Port 3005 sudah dipakai proses lain.** Dev harus gagal, bukan pindah port diam-diam. Playwright memastikan server yang menjawab adalah proyek ini (cek `/api/v1/health`) sebelum test jalan.
- 🟢 **D1 lokal tertukar dengan remote.** Script npm terpisah dengan flag eksplisit: `db:migrate:local` / `db:migrate:remote`, `db:seed:local` / `db:seed:remote`. (`db:seed:*` ditunda ke Fase 4: belum ada data seed.)

**❓ Pertanyaan:** nama domain (sudah punya? `.dev`/`.id`/`.my.id`?) · repo publik atau privat · pnpm atau npm · identitas commit · **bila CPU > 10 ms:** Workers Paid atau prerender penuh.
**Artefak:** repo yang bisa jalan, URL deploy, angka ukuran dan CPU di §11.3.
**Selesai bila:** `/` dan `/api/v1/health` live di Workers Free, CI hijau, dan angka CPU/ukuran sudah tercatat.
**Verifikasi:** `curl` ke endpoint + smoke test Playwright ke URL deploy.
**Penutup fase (§0.6):** stage scaffold, konfigurasi, CI, **dan `docs/PLAN.md`** (rencana ini ikut di commit pertama), lalu beri pesan commit dan tunggu Rahmat commit. Contoh subjek: `chore: scaffold Next.js 16, Hono and D1 on Cloudflare Workers`.

### Fase 1 — Konteks produk dan strategi (skill dijalankan dari awal)

**Tujuan:** menghasilkan PRODUCT.md, satu audiens prioritas, dan **satu** tujuan konversi.
**Skill:** impeccable `init`; metaskills:create-website (intake + fase 1); one-page-marketing.
- [x] Jalankan `impeccable context` → `/impeccable init`: wawancara pengguna utama, tujuan, posisi unik, batasan. Hasilnya **PRODUCT.md** (Platform: web; Stack: Next.js 16 + Hono + D1, sudah diputuskan).
- [x] Intake create-website (7 pertanyaan) → `docs/CREATE-WEBSITE-PLAN.md` dengan penyesuaian §4.3 (Fase 9 di-skip, Fase 8 tanpa A/B test).
- [x] one-page-marketing: skor PVP untuk 2–3 segmen audiens, avatar satu paragraf, USP yang lolos **swap test** ("satu-satunya … yang …") → `docs/MARKETING.md`, `docs/CUSTOMER.md`.
- [x] Before/During/After versi portofolio: **Media** (LinkedIn, profil GitHub, link di CV), **Convert** (CV/kontak), **Referral** (tidak relevan, catat sebagai skipped).

**Edge case (urut prioritas):**
- 🟠 **Wawancara ganda.** Impeccable `init` dan intake create-website menanyakan hal yang sama. Gabungkan; jawaban yang sudah tercatat di §11 cukup dikonfirmasi, tidak ditanyakan ulang.
- 🟠 **Launcher Impeccable gagal** (`impeccable context` error). Ikuti fallback Impeccable: sampaikan bahwa context tidak termuat, baca PRODUCT.md/DESIGN.md langsung, dan lanjutkan. Kegagalan launcher tidak memblokir fase.
- 🟢 **Rahmat belum bisa memilih satu audiens.** Pakai skor PVP sebagai pembanding dan tanyakan ulang lewat AskUserQuestion dengan rekomendasi. Jangan memutuskan sendiri.

**❓ Pertanyaan:**
- Audiens utama: recruiter/HR, hiring manager/tech lead, perusahaan terkait Jepang, atau klien freelance?
- Aksi utama: unduh CV, LinkedIn, email, atau form kontak? Bagaimana urutannya?
- Status ketersediaan ("open to …") perlu tampil?
- Bahasa situs: EN saja, EN + ID, atau EN dengan JA nanti? Perlu siap i18n?
- Mobile-first?
- Pembagian `docs/DESIGN.md` vs `DESIGN.md` root (§4.3) disetujui?

**Artefak:** PRODUCT.md, `docs/CREATE-WEBSITE-PLAN.md`, `docs/MARKETING.md`, `docs/CUSTOMER.md`.
**Selesai bila:** PRODUCT.md ada dan sudah dikonfirmasi; satu tujuan konversi terkunci; tracker berisi semua fase beserta statusnya.
**Penutup fase (§0.6):** stage PRODUCT.md + `docs/` hasil fase ini, beri pesan commit, tunggu Rahmat. Contoh subjek: `docs: add product context and marketing strategy`.

### Fase 2 — Pesan dan kurasi konten

**Tujuan:** kata-kata yang dinilai pengunjung dalam 5 detik + seed data yang sudah dikurasi.
**Skill:** storybrand-messaging (fase 2 create-website), made-to-stick (fase 3), impeccable `clarify` (nanti di Fase 7).
- [x] Kurasi §8: tandai setiap item **tampil / sembunyi / butuh input**. → `docs/WEBSITE.md` § Kurasi.
- [x] BrandScript SB7 dengan **pengunjung sebagai hero** dan Rahmat sebagai guide (empati + otoritas). Tidak boleh ada kalimat pembuka yang dimulai dengan "I/We".
- [x] 5 variasi one-liner, diurutkan dari yang paling mudah diulang → Rahmat memilih satu. CTA langsung = Download CV. CTA transisional = Lihat proyek / LinkedIn.
- [x] made-to-stick: skor SUCCESs; ganti setiap abstraksi dengan **angka konkret yang benar** (mis. "3 layanan berbagi 1 database", "terbit v1.0.0 di GitHub Marketplace", "sistem informasi untuk Dinas Kehutanan Kaltara"); pilih satu bukti Sinatra test dan satu cerita.
- [x] Draf case study untuk **5 proyek unggulan** (§8.4, termasuk repo `portfolio` ini) + `wedding` bila disetujui: masalah → peran → keputusan teknis → hasil, + data diagram arsitektur (nodes/edges). Case study `portfolio` ditulis sebagai kerangka sekarang; angka-angkanya baru diisi di Fase 12.
- [x] Tulis ulang About untuk situs (opsional juga untuk LinkedIn).
- [x] Buat seed `content/seed/*.json` (profil, pengalaman, pendidikan, sertifikasi, proyek, skill, relasi proyek-skill) dari hasil kurasi.

**Edge case (urut prioritas):**
- 🔴 **Tahun pengalaman salah hitung** karena masa kerja tumpang tindih (HTSI & Dinas Kehutanan; MINORI → GCT di Jan 2026). Rentang digabung sejak Apr 2022 dan celah tidak dihitung (✅). Dihitung saat render oleh fungsi murni `mergeIntervals`, dengan unit test memakai data §8.2. Angkanya tidak disimpan di DB.
- 🔴 **Nama tidak konsisten.** Tampil "Besar Rachmat Ikhsan Pambudi" di header, SEO, dan nama file CV; "Rahmat" di teks singkat (✅). JSON-LD `Person.alternateName` memuat "Besar Rahmat" agar pencarian dengan ejaan GitHub tetap cocok.
- 🔴 **URL repo privat bocor.** Proyek privat disimpan dengan `visibility: private` **tanpa URL** di seed, HTML, dan API. URL repo privat memang 404 bagi orang lain, tetapi tetap membocorkan nama repo/organisasi.
- 🔴 **Data yang diputuskan disembunyikan ikut ke seed** (NDA, daftar tamu wedding, nomor HP, alamat). Sebelum staging, seed dicek otomatis dengan pola nomor HP, email pribadi, dan daftar kata kunci klien.
- 🟠 **Tanggal LinkedIn hanya presisi bulan.** Disimpan `YYYY-MM`; `end` kosong berarti "Present". Durasi ("10 bln") dihitung saat render.
- 🟠 **Satu proyek punya beberapa repo/layanan** (SOBAT-PS 3 repo, nikke 2 repo + API, wedding 2 repo). Dimodelkan sebagai daftar `links` (§6.4), bukan satu `repo_url`.
- 🟠 **Tanggal lulus berbeda antar sumber** (LinkedIn: Jul 2023). Dikonfirmasi Rahmat dari dokumen sebelum masuk seed.
- 🟢 **Proyek tanpa metrik bersumber.** Bagian metrik disembunyikan, tidak diisi perkiraan.

**❓ Pertanyaan:**
- Seberapa detail pekerjaan di Global Collabo Tech dan PT MINORI boleh ditampilkan (nama klien boleh, atau umum saja)?
- Proyek privat mana saja yang tampil?
- Wedding (ada data tamu): case study tanpa link live?
- IPK dan SMA ditampilkan?
- Sertifikat yang sudah kedaluwarsa: tampil dengan status atau disembunyikan?
- Foto profil?
- CV PDF terbaru: bahasa apa, format apa?
- Deskripsi untuk `ecommerce-laravel`, `mthrill-web`, `forget_commit_existing_repo`?

**Artefak:** `docs/POSITIONING.md`, `docs/WEBSITE.md` (sitemap + page briefs), `content/seed/*.json`.
**Selesai bila:** one-liner disetujui; setiap proyek unggulan punya copy, metrik bersumber, dan status tampil; tidak ada klaim tanpa sumber.
**Penutup fase (§0.6):** stage `docs/POSITIONING.md`, `docs/WEBSITE.md`, `content/seed/*.json`. Cek dulu bahwa seed tidak memuat data pribadi yang diputuskan disembunyikan. Contoh subjek: `docs: add positioning, page briefs and curated content seed`.

### Fase 3 — Arah visual (Impeccable shape + new-work)

**Tujuan:** dunia visual yang tidak generik, tetap dalam topologi admin panel.
**Skill:** impeccable `shape` → new-work (concept-seed + decision page Impeccable); top-design (signature moment), web-typography, refactoring-ui sebagai masukan; fase 4–6 create-website.
- [x] `/impeccable shape` untuk Overview (Persuade) + shell admin (Operate). Ronde wawancara 1 (maksimal 2).
- [x] new-work, karena belum ada otoritas visual: tulis **7 kandidat** dari dunia audiens (tidak semuanya dari alat/instrumen kerja; lihat aturan Impeccable), jalankan `impeccable concept-seed --scope direction --mode persuade`, lalu ikuti blok PRESENTATION yang dicetaknya. Bentuk admin panel = pinned. Pilihan diambil lewat **decision page Impeccable**:
  1. Jalankan `impeccable serve-question --schema` untuk melihat bentuk payload, lalu tulis payload-nya:
     - arah yang ditugaskan di posisi pertama, lengkap dengan baris _raise_ dari challenger;
     - kartu IMPECCABLE'S PICK bila ada;
     - challenger yang menang atau kompetitif sebagai alternatif penuh (`kind`, `catalogId`, verdict);
     - challenger yang kalah dalam baris ringkas;
     - `canonCard` (standar kategori);
     - re-roll (biasa / lebih aman / lebih berani) dan steer.
  2. `impeccable serve-question --start --payload <file>`, lalu buka URL yang dicetaknya di **browser bawaan** Claude desktop. Bila tidak bisa, pakai system opener; bila itu juga gagal, tampilkan URL-nya.
  3. Ambil jawaban dengan `impeccable serve-question --wait --key <key>` (jalankan di background atau dengan timeout panjang), dan ulangi selama exit code-nya 3. Jawaban keluar sebagai JSON.
  4. Bila Rahmat meminta **re-roll**: jalankan ulang concept-seed dengan `--from <seed-key> --reroll <n>` (tambah `--register safer|bolder` bila dipilih), kirim hasilnya dengan `--update --key <key yang sama>`, lalu `--wait` lagi. **Jangan** `--start` server kedua.
  5. Image generation tidak tersedia, jadi setiap kartu memakai sketsa HTML first viewport + chip palet, tanpa toggle build path (jalurnya code-led).
  6. **Fallback (cara Impeccable):** bila `--start` keluar dengan exit 2, ajukan pilihan lewat AskUserQuestion. Bila halaman ditutup tanpa jawaban (exit 4), ajukan sekali lewat AskUserQuestion. Bila tetap tidak ada jawaban, **berhenti dan tunggu**. Aturan §0.2 menggantikan default Impeccable yang melanjutkan tanpa pengguna.
  7. Ronde ini dijalankan dari sesi yang berjalan di Mac Rahmat (Claude Code/Cursor lokal), karena browser di Mac tidak bisa membuka server `localhost` yang berjalan di container cloud.
- [x] Ringkas pelajaran §3 menjadi **pola wajib** (CV di atas, indeks, diagram arsitektur, filter, timeline), bukan gaya visual.
- [x] Tulis **direction contract** (THESIS, OWN-WORLD, STORY, FIRST VIEWPORT, FORM + seed ref, FINISH) ke surface brief via `impeccable surface-brief write`. Baca ulang untuk memastikan keenam blok ada.
- [x] top-design: tetapkan **signature moment** (yang akan di-screenshot orang), skor rubrik awal, easing kustom (ease/linear dilarang), custom cursor = tidak (opt-in).
- [x] web-typography: pasangan font self-host via `next/font` (< 200 KB total), skala fluid `clamp()`, body 16–18 px, measure 65ch, **angka tabular** untuk tabel/KPI, aman di zoom 200%. ❓ dukungan glyph Jepang bila nanti ada JA.
- [x] refactoring-ui: hierarki dalam **grayscale dulu**, skala spasi 4/8/16/24/32/48/64, palet 9 tingkat + abu-abu bernada, skala bayangan, satu aksi primer per section. Tema terang dan gelap; default ditentukan dari satu kalimat "adegan fisik" (siapa membuka, di mana, dalam cahaya apa).
- [x] Sketsa HTML first viewport untuk mobile 390 px dan desktop 1440 px.

**Hasil Fase 3 (24 Okt 2026):** dunia **The Meishi Exchange** (名刺) dipilih lewat decision page (seed `seed:80a40aaf8476870a`, code-led); kontrak di `.impeccable/surfaces/src-app-page-tsx.md`; token `docs/design/tokens.css`; sketsa `docs/design/overview-sketch.html`; catatan dan audit `docs/DESIGN.md`. Critique dual-agent 22/32 → semua temuan P1/P2/minor diperbaiki, detector bersih. Rincian di §11.3.

**Edge case (urut prioritas):**
- ✅ 🔴 **Ronde decision page dijalankan dari sesi cloud.** (Dijalankan dari sesi lokal di Mac; browser bawaan memblokir iframe sketsa, jadi halaman dibuka di browser default lewat `open`.) Browser di Mac tidak bisa membuka `localhost` di container. Agent berhenti dan meminta sesi lokal; bila `--start` keluar dengan exit 2, pakai fallback AskUserQuestion (prosedur di atas).
- ✅ 🟠 **Dua kali re-roll tanpa pilihan.** (Tidak terjadi: dipilih di ronde pertama.) Sesuai Impeccable, tanyakan dulu kualitas apa yang kurang (lewat AskUserQuestion) sebelum re-roll ketiga.
- ✅ 🟠 **Palet terpilih gagal kontras** (2 pasangan gagal di draf pertama + cincin fokus gelap di meishi 1,70:1; semua diperbaiki dan diuji ulang, `docs/DESIGN.md` §5) WCAG AA (teks 4,5:1; teks besar dan elemen UI 3:1) di tema terang atau gelap. Token disesuaikan sebelum disetujui; cek kontras masuk syarat "token disetujui".
- ✅ 🟠 **Font tidak punya glyph yang dibutuhkan** (diuji di browser dengan teks nyata + JP: semua ada; hanya "→" yang tidak ada di BIZ UDPGothic, jadi panah wajib SVG) (huruf beraksen, nama lengkap, karakter Jepang bila JA nanti). Sediakan fallback stack eksplisit dan uji dengan teks nyata, bukan lorem ipsum.
- ✅ 🟢 **Payload font melewati 200 KB.** (slice latin 4 file = 75.968 byte; diukur ulang di build Fase 5) Subset Latin + variable font; ukur di build.

**Gerbang:** impeccable `critique` pada sketsa. ponytail-review tidak relevan karena belum ada kode produksi.
**❓ Pertanyaan:** arah visual mana yang dipilih (decision page Impeccable) · tema default (light/dark/system) · smooth scroll native atau library · tingkat animasi.
**Artefak:** surface brief + direction contract; draf token (CSS variables); sketsa; `docs/DESIGN.md` (Design Direction, Typography, Tokens).
**Selesai bila:** arah terkunci dan contract tertulis; token disetujui. _Catatan: `DESIGN.md` root baru ditulis di Fase 12 oleh impeccable-documenter, dari hasil build._
**Penutup fase (§0.6):** stage surface brief (`.impeccable/`), draf token, sketsa, dan `docs/DESIGN.md`. Contoh subjek: `docs: record visual direction contract and design tokens`.

### Fase 4 — Lapisan data

**Tujuan:** skema, migrasi, seed, dan validasi yang teruji.
**Skill:** ponytail, karpathy, code-craftsmanship:clean-code, engineering:testing-strategy.
- [x] Finalisasi skema Drizzle sesuai §6.4 + catatan `docs/WEBSITE.md` + index (slug unik, status, sort_order). ID teks = id seed; `casing: snake_case`; kolom JSON memakai tipe `json` yang membaca nilai rusak sebagai `null` (tidak melempar).
- [x] `drizzle-kit generate` → `wrangler d1 migrations apply` (lokal dan remote): `drizzle/0001_content.sql`.
- [x] Skema Zod per entitas di `src/lib/schemas.ts`, dipakai bersama oleh seed, form manage, dan Hono.
- [x] Query layer `src/server/db/queries.ts`: baca untuk publik ~~dengan `'use cache'` + `cacheTag('projects')` dst.~~ langsung dari D1 per request (✅, karena `'use cache'` dilepas di Fase 0). Operasi tulis hanya di Server Actions manage.
- [x] Script seed dari `content/seed/*.json`, **insert-only**: menolak jalan bila tabel sudah berisi. Setelah launch, D1 adalah sumber kebenaran (✅). `npm run db:seed:local` / `db:seed:remote` (`src/server/db/seed.ts`); seed juga mengunggah `profile/avatar.jpg` ke R2.
- [x] Unit test: ~~parser bulk import~~ (✅ pindah ke Fase 8 bersama parsernya), Zod (input invalid), slug unik + redirect, seed + query di skema hasil migrasi (`node:sqlite`).

**Edge case (urut prioritas):**
- 🔴 **Seed dijalankan ulang di produksi** dan menimpa editan dari area manage. Seed insert-only dan menolak jalan bila tabel sudah berisi (✅). Ada test untuk perilaku penolakan ini. **Selesai:** hitung baris dulu, menolak bila > 0 atau tidak terbaca; INSERT tanpa `OR REPLACE` sehingga tidak pernah menimpa; test `db.test.ts` (dibuktikan gagal saat penolakan dimatikan); seed ulang lokal dan remote menolak (106 baris).
- 🔴 **Migrasi remote gagal di tengah, atau kode lama rusak saat deploy.** Sebelum `migrations apply --remote`, catat bookmark D1 Time Travel. Migrasi mengikuti pola _expand → deploy → contract_: kolom baru dibuat nullable dulu, kolom lama dihapus di migrasi terpisah setelah kode baru live. **Selesai:** bookmark sebelum `0001` dicatat di §11.3; `0001` hanya menambah tabel (expand), tabel `health` dan situs live tidak terpengaruh.
- 🟠 **Slug bentrok atau kosong.** Dua judul yang sama → akhiran `-2`, `-3`. Judul yang menghasilkan slug kosong (mis. hanya karakter non-Latin) → ~~`nanoid`~~ 8 karakter acak dari `crypto.randomUUID()` (tanpa dependensi baru). Ada unit test (`src/lib/slug.test.ts`). `taken` wajib memuat slug lama dari `slug_redirects` (dipakai Fase 8).
- 🟠 **Kolom JSON rusak** (`metrics`, `architecture`, `links`). Divalidasi Zod saat tulis dan saat baca; bila gagal saat baca, bagian itu disembunyikan + dicatat di log, halaman tetap tampil. **Selesai:** `section()` di `queries.ts` + test JSON rusak dan bentuk salah.
- 🟠 **Satu perubahan memengaruhi banyak halaman** (proyek → Overview, Projects, detail, Skills, API, sitemap). Peta tag cache ditulis eksplisit di `queries.ts`; satu fungsi `invalidate(entity)` memanggil semua `updateTag` terkait. Test memastikan setiap entitas punya tag. `[-]` ✅ ditunda ke Fase 8/11: tanpa `'use cache'` tidak ada yang perlu di-invalidate (komentar `shortcut:` di `queries.ts`).
- 🟠 **Nilai yang bergantung waktu membeku di cache** (tahun pengalaman, "Present", status sertifikat kedaluwarsa). Halaman yang memuatnya memakai `cacheLife('days')` sehingga diperbarui paling lambat sehari sekali. Untuk sekarang tidak berlaku: semua dibaca per request, jadi tidak membeku; diulang bila cache kembali di Fase 11.
- 🟢 **Batas D1** (jumlah parameter per query, ukuran batch). Insert massal dipecah per batch. Seed: satu INSERT per baris lewat `wrangler d1 execute --file` (106 baris, lolos). Import file D1 tidak didokumentasikan atomik, jadi bila tulis gagal, seed mengosongkan lagi tabel yang tadi terbukti kosong (aman diulang); bila cleanup juga gagal, pesan error memberi perintah `time-travel restore --timestamp`. Diuji di Vitest, D1 lokal sementara (64 → 0 baris), dan D1 **remote** sementara `portfolio-seed-test` (dihapus setelahnya): file seed yang gagal di baris terakhir menyisakan 0 baris (import remote dan lokal ternyata atomik, meski tidak didokumentasikan); seed penuh 106 query → cleanup → 0 baris. Bulk import Fase 8 memakai `db.batch()`.

**❓ Pertanyaan:** ✅ model i18n = kolom per bahasa, kolom `*_ja` ditambah lewat migrasi expand saat JA dikerjakan · ✅ tanpa level skill · ✅ soft delete lewat `status = archived`.
**Selesai bila:** DB lokal dan remote berisi seed; semua test hijau.
**Penutup fase (§0.6):** stage skema, migrasi `drizzle/`, `schemas.ts`, `queries.ts`, script seed, dan test. Contoh subjek: `feat(db): add content schema, migrations, validation and seed`.

### Fase 5 — Modul komponen

**Tujuan:** semua komponen ✔ di §9 siap dipakai, aksesibel, dan sesuai token.
**Skill:** impeccable (baca `craft-floor.md` sebelum edit UI apa pun), refactoring-ui, design-everyday-things, microinteractions, ponytail.
- [ ] Pasang primitif headless yang dipilih. Bangun komponen ✔ memakai token.
- [ ] Setiap komponen punya state lengkap, fokus yang terlihat, target sentuh ≥ 44 px, dukungan `prefers-reduced-motion`, umpan balik < 100 ms.
- [ ] Satu **signature microinteraction** saja (mis. tombol CV dengan state siap → mengunduh → selesai), disesuaikan dengan contract.
- [ ] Halaman `/components`: urutan mengikuti component.gallery; tiap komponen menautkan halaman referensinya.
- [ ] Test: axe lewat Playwright di `/components`; Vitest untuk logika kecil (format tanggal, status kedaluwarsa).

**Edge case (urut prioritas):**
- 🟠 **Komponen form dipakai di HP**, karena area manage mobile-first (✅). Target sentuh ≥ 44 px, `type`/`inputmode` input yang tepat, dan keyboard virtual tidak menutupi field yang aktif.
- 🟠 **Teks sangat panjang** di Badge, Button, Tabs, Table (nama proyek panjang, URL panjang). Setiap komponen punya aturan potong/bungkus; teks yang terpotong tetap bisa dibaca lengkap (tooltip atau baris kedua).
- 🟠 **`prefers-reduced-motion`, `forced-colors` (mode kontras tinggi Windows), dan zoom 200%.** Setiap komponen diuji di ketiganya di halaman /components.
- 🟢 **Pembaruan primitif headless mengubah perilaku.** Versi dikunci; test axe + interaksi di /components menjadi test regresi.

**Gerbang:** impeccable `audit` (/components), `impeccable detect --json`, `/ponytail-review`.
**❓ Pertanyaan:** `/components` tampil publik di navigasi, atau hanya bisa dibuka lewat manage?
**Selesai bila:** semua komponen ✔ ada; axe tanpa pelanggaran serius; temuan audit sudah diterapkan.
**Penutup fase (§0.6):** stage `src/components/ui/`, halaman `/components`, dan test. Contoh subjek: `feat(ui): add component module and /components showcase`.

### Fase 6 — Shell admin panel

**Tujuan:** navigasi yang lolos Trunk Test di semua ukuran layar.
**Skill:** impeccable (Operate), ux-heuristics, microinteractions.
- [ ] Layout `(public)`: sidebar yang bisa dilipat (desktop) dan bottom nav + drawer (mobile). Setiap ikon nav punya label teks (hindari "mystery meat").
- [ ] Topbar: breadcrumb, ⌘K, toggle tema, tombol CV.
- [ ] Command palette: mencari proyek, skill, dan halaman dari indeks ringkas yang dikirim server.
- [ ] Tema light/dark/system tanpa kedip saat load, lewat script kecil di `<head>` (bukan cookie; lihat edge case).
- [ ] Halaman 404/500/loading/empty bergaya panel.
- [ ] Skip link, landmark, urutan fokus yang logis.
- [ ] Bila komposisi shell masih terbuka setelah direction contract (Impeccable: _whole surface inside an established world_), jalankan `impeccable concept-seed --scope surface --mode operate` lalu ambil pilihannya lewat decision page dengan prosedur Fase 3. Ronde ini dilewati bila contract sudah menetapkan komposisinya.

**Edge case (urut prioritas):**
- 🔴 **Tema di cookie membuat semua halaman dinamis**, sehingga cache rusak dan CPU Worker naik. Tema dibaca script kecil di `<head>` dari `localStorage` + `prefers-color-scheme`; server selalu merender HTML yang sama.
- 🟠 **⌘K hanya ada di Mac.** Pakai Ctrl+K di Windows/Linux dengan label tombol mengikuti OS, plus tombol cari yang terlihat untuk HP/layar sentuh. Shortcut tidak dibajak saat fokus sedang di input.
- 🟠 **JavaScript mati atau gagal dimuat.** Navigasi, konten, dan link CV tetap berfungsi karena semuanya HTML dari server; palette dan toggle tema boleh tidak tampil.
- 🟠 **Bottom nav menutupi konten / area aman iPhone.** Pakai `env(safe-area-inset-bottom)` + padding bawah konten; uji di 320 px dan mode landscape.
- 🟢 **Shortcut bentrok dengan browser** (mis. Ctrl+K di Firefox). `preventDefault` hanya saat halaman yang fokus, bukan saat address bar aktif.

**Gerbang:** impeccable `critique` (shell), audit ux-heuristics (severity 0–4), `/ponytail-review`.
**Selesai bila:** Trunk Test lolos di 390 px dan 1440 px; semua navigasi bisa dilakukan hanya dengan keyboard; tidak ada temuan severity 3–4.
**Penutup fase (§0.6):** stage `src/components/shell/`, layout `(public)`, halaman 404/500/loading. Contoh subjek: `feat(shell): add admin panel shell with navigation and command palette`.

### Fase 7 — Halaman publik

**Tujuan:** semua halaman berisi konten nyata dan konversi CV/kontak terjawab.
**Skill:** impeccable (mode sesuai halaman) + `clarify`, cro-methodology (fase 8 create-website), ux-heuristics (fase 7), made-to-stick.
- [ ] Untuk setiap halaman yang strukturnya masih terbuka (contract hanya mengikat Overview), jalankan `impeccable concept-seed --scope surface --mode <persuade|operate|read>` dan ambil pilihannya lewat decision page dengan prosedur Fase 3. Halaman yang strukturnya sudah jelas dari §7 dibangun langsung tanpa ronde.
- [ ] **Overview:** first viewport sesuai contract, KPI nyata, proyek unggulan, activity log singkat.
- [ ] **Projects:** tabel + filter + cari + sort; kartu di mobile; badge status.
- [ ] **Detail proyek:** tab Overview/Architecture/Stack/Timeline/Links. Diagram dirender dari JSON `architecture` (SVG/HTML, bukan gambar). Metrik disertai sumber.
- [ ] **Experience** (timeline), **Skills** (matriks + tautan proyek), **Education** (status kedaluwarsa), **Contact**.
- [ ] **CV:** satu CV bahasa Inggris (✅). `/cv` selalu mengunduh versi terbaru dari R2 dengan `Content-Disposition` dan nama file `Besar-Rachmat-Ikhsan-Pambudi-CV.pdf`.
- [ ] Metadata per halaman, **gambar OG statis** untuk halaman umum + **gambar cover proyek** sebagai OG halaman proyek bila ada (✅; `opengraph-image.tsx` dinamis tidak dipakai), JSON-LD `Person` (+ `alternateName`, **tanpa** `email`) + `ProfilePage`.
- [ ] **Tabel Objection/Counter** (Big 5 versi rekrutmen), counter ditempatkan **di titik ragu**, bukan di FAQ:

  | Objection                       | Counter (hanya bukti nyata)                                                             | Penempatan                    |
  | ------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------- |
  | Trust: "ini sungguhan?"         | Repo publik, listing Marketplace, tanggal kerja persis, sertifikat dengan credential ID | Dekat KPI dan proyek unggulan |
  | Fit: "cocok dengan stack kami?" | Matriks skill tertaut ke proyek; case study per stack                                   | Skills, detail proyek         |
  | Effort: "menilainya lama?"      | CV satu klik, ringkasan 30 detik di Overview                                            | Topbar + Overview             |
  | Timing: "tersedia?"             | Status ketersediaan (❓)                                                                | Header Overview               |
  | Price: gaji/rate                | Tidak ditampilkan (❓)                                                                  | —                             |

- [ ] **5-second test** dengan 3–5 orang: apakah mereka bisa menjawab "siapa ini, apa keahliannya, apa yang harus diklik"?

**Edge case (urut prioritas):**
- 🔴 **File CV hilang di R2 atau belum diunggah.** `/cv` membalas halaman ramah (bukan error 500), tombol CV berganti "Lihat di LinkedIn", dan kejadiannya dicatat di log. CV publik tidak memuat nomor HP/alamat rumah (✅), dan metadata PDF (author, path lokal) dibersihkan sebelum unggah.
- 🔴 **Gambar OG dinamis melewati batas CPU.** Diputuskan statis + cover proyek (✅). Test memastikan tidak ada route `opengraph-image` dinamis.
- 🔴 **Email dipanen bot spam.** **Diverifikasi 24 Okt:** Email Address Obfuscation Cloudflare tidak berlaku untuk HTML yang ditambahkan Worker maupun isi `<script>`, sedangkan payload RSC Next.js justru berada di `<script>`. Jadi alamat tetap terbaca bot. Diputuskan (✅): alias khusus portofolio yang **tidak pernah ada utuh** di HTML maupun payload RSC. Server hanya mengirim potongan yang diacak (mis. bagian lokal dan domain dibalik), lalu komponen klien merakitnya saat tombol "Tampilkan/Salin email" diklik dan membuka `mailto:`. Tanpa JS, yang tampil link LinkedIn. Test: HTML dan payload RSC semua halaman publik tidak memuat string alias.
- 🟠 **Hasil filter/cari kosong, atau belum ada proyek unggulan.** Tampilkan empty state dengan aksi ("Hapus filter"). Section Overview yang tidak punya isi disembunyikan, bukan berupa kotak kosong.
- 🟠 **Proyek tanpa data** `architecture`, metrik, atau link. Tab terkait disembunyikan, bukan tampil sebagai tab kosong.
- 🟠 **Tab detail proyek tidak bisa dibagikan.** Tab tersimpan di URL (`?tab=`), sehingga tombol Back dan link langsung bekerja.
- 🟠 **Item belum lengkap saat launch.** Tetap draft dan tidak tampil; tidak ada placeholder "Segera hadir" (✅).
- 🟢 **LinkedIn menyimpan pratinjau OG lama.** Setelah gambar/judul diganti, segarkan lewat LinkedIn Post Inspector (checklist Fase 13).

**Gerbang:** impeccable `critique` + `audit` per halaman, ux-heuristics, `/ponytail-review`, e2e Playwright (buka → lihat proyek → unduh CV) di mobile dan desktop.
**❓ Pertanyaan:** form kontak (butuh layanan email, mis. Resend) atau cukup mailto + salin email (rekomendasi) · feed aktivitas GitHub (rekomendasi: tunda).
**Selesai bila:** semua halaman berisi konten nyata; ≤ 3 langkah dari kedatangan sampai CV terunduh; e2e hijau.
**Penutup fase (§0.6):** stage halaman publik, route `/cv`, metadata/OG, tabel O/CO di `docs/WEBSITE.md`, dan e2e. Bila besar, pecah per halaman. Contoh subjek: `feat: add public portfolio pages and CV download`.

### Fase 8 — Area input manual (pola `timetables`) + Cloudflare Access

**Tujuan:** semua konten bisa dikelola tanpa menyentuh kode, dan area ini tertutup di **semua jalur akses**.
**Skill:** ponytail, karpathy, agent `security` (review), clean-code, testing-strategy, impeccable (Operate) untuk form, microinteractions (Saving… → Saved).
- [ ] Route `(manage)/m/[secret]/` (prefix `/m` dari hasil tracer Fase 0: soft-404). **Setiap halaman** memanggil `guardManage(params)` lalu `assertAdmin()`. `guardManage` membandingkan segmen URL dengan `MANAGE_PATH` dari `getCloudflareContext({ async: true }).env`; tidak cocok atau kosong → `notFound()`. Guard tidak cukup di layout saja (lihat edge case). Layout manage mengekspor `metadata` `robots: noindex, nofollow` + `referrer: no-referrer` (keduanya keluar sebagai tag meta, ✅ diuji) + banner "Area admin". Nilai `MANAGE_PATH` hanya ada di Wrangler secret (`wrangler secret put`) dan `.dev.vars` lokal; **tidak** di `vars` `wrangler.jsonc`, file `.env*`, atau `next.config.ts`. Jangan baca lewat `process.env`: di `next dev` nilainya kosong (✅ diuji).
- [ ] Tata letak manage **mobile-first** dan tetap responsif di desktop (✅): form satu kolom, aksi simpan menempel di bawah layar HP, upload dari galeri/kamera.
- [ ] **Preview draft** (✅): draft dirender dengan komponen halaman publik di dalam area manage (noindex, terlindungi Access), tidak lewat URL publik.
- [ ] `assertAdmin()`: verifikasi header `Cf-Access-Jwt-Assertion` terhadap JWKS tim (`https://<team>.cloudflareaccess.com/cdn-cgi/access/certs`), cek `aud`, `iss`, `exp`, dan email = Rahmat. Dipanggil di setiap halaman manage **dan** di baris pertama setiap Server Action. Unit test: token palsu, token kedaluwarsa, `aud` salah, header tidak ada.
- [ ] CRUD per entitas (list, create, edit, publish/unpublish, archive) dengan Zod + pesan error per field (apa yang salah + cara memperbaikinya), ID `nanoid`, `updatedAt`.
- [ ] Slug otomatis dari judul (`slugify` dari `timetables`), unik, **dikunci setelah publish**. Bila slug diganti → catat di `slug_redirects` + redirect 308.
- [ ] **Bulk import** (port `parse.ts`): tempel JSON/CSV → tabel preview (valid/tidak valid + alasan) → simpan yang valid → laporkan yang gagal.
- [ ] Unggah ke R2 lewat binding (CV PDF, gambar) dengan validasi tipe file dan ukuran (mis. PDF ≤ 5 MB, gambar ≤ 2 MB ❓).
- [ ] Setelah simpan → `updateTag()` untuk tag terkait.
- [ ] **Cloudflare Zero Trust:** aktifkan paket Free (±50 pengguna; verifikasi batas terbaru). Tambahkan dua IdP, **One-time PIN** dan **GitHub** (✅), keduanya dibatasi ke akun Rahmat. Buat aplikasi self-hosted untuk `<domain>/<MANAGE_PATH>` beserta semua sub-path-nya (cek aturan path/wildcard Access di dashboard), policy Allow hanya untuk identitas Rahmat, atur durasi sesi ❓. Path diisi di dashboard Zero Trust, tidak pernah ditulis di repo.
- [ ] Pastikan `workers_dev: false` dan preview URL nonaktif. Uji akses tanpa Access di **ketiga jalur** (domain, `*.workers.dev`, POST langsung ke Server Action) → harus ditolak.

**Edge case (urut prioritas):**
- 🔴 **Sesi Access habis saat mengisi form.** Submit diarahkan ke halaman login dan isian bisa hilang. Form menyimpan draft otomatis ke `sessionStorage`, memberi peringatan saat meninggalkan halaman dengan perubahan belum tersimpan, dan memulihkan draft setelah login ulang.
- 🔴 **Guard hanya di layout membocorkan isi halaman.** **Diuji 24 Okt:** `notFound()` di layout tetap mengirim isi halaman di payload RSC respons 404. Karena itu `guardManage()` dipanggil di **setiap** halaman. Test: path acak membalas 404 dan responsnya tidak memuat teks apa pun dari halaman manage.
- 🔴 **Nilai path rahasia masuk ke hasil build.** **Diuji 24 Okt:** isi file `.env*` di-inline OpenNext ke `.open-next/cloudflare/next-env.mjs`, dan `rewrites` terbit di `_buildManifest.js` publik. Nilai hanya boleh di Wrangler secret dan `.dev.vars`. Test CI: isi `.dev.vars` dengan nilai _canary_, build, lalu `grep` canary di `.next/` dan `.open-next/` harus kosong; plus cek tidak ada file `.env*` yang memuat `MANAGE_PATH`.
- 🔴 **Path rahasia bocor lewat header `Referer`** saat mengklik link keluar dari halaman manage. Ditangani dengan meta `referrer: no-referrer` dari `metadata` layout manage (✅ diuji keluar sebagai tag meta), yang menimpa `Referrer-Policy` situs (Fase 10).
- 🔴 **Terkunci dari area manage** (email OTP tidak datang, akses email hilang). Login GitHub menjadi metode kedua (✅). Bila keduanya gagal: prosedur darurat edit D1 lewat `wrangler d1 execute --remote` dari Mac, ditulis di README dan diuji sekali.
- 🔴 **Item ter-publish tidak sengaja** (mis. memuat data yang harusnya disembunyikan). Ada aksi **Unpublish** satu klik yang langsung memanggil `invalidate()`, plus checklist di README untuk meminta penghapusan dari cache mesin pencari.
- 🟠 **Edit bersamaan dari dua perangkat** (HP + laptop). Simpan memakai cek `updated_at` (optimistic lock). Bila data sudah berubah, simpan ditolak dengan pesan dan tombol muat ulang, bukan menimpa diam-diam.
- 🟠 **Bulk import menemukan slug/nama yang sudah ada.** Baris itu dilewati dan dilaporkan di preview (✅). Baris valid disimpan sekaligus dengan `db.batch()` (semua atau tidak sama sekali), jadi tidak ada import setengah jadi.
- 🟠 **File unggahan bermasalah:** ekstensi `.pdf` tapi isinya bukan PDF, foto HEIC dari iPhone, nama file Unicode/berspasi, ukuran terlalu besar. Cek _magic bytes_; HEIC ditolak dengan pesan "ekspor sebagai JPEG"; key R2 dibuat dari `nanoid`, bukan nama asli; batas ukuran ditegakkan di server.
- 🟠 **File lama tertinggal di R2** saat diganti/dihapus. Objek lama dihapus **setelah** referensi baru tersimpan, supaya kegagalan di tengah tidak membuat link rusak.
- 🟠 **Arsip/hapus entitas yang masih dipakai item terbit** (skill dipakai proyek, pengalaman dirujuk proyek). Ditolak dengan daftar item yang memakainya.
- 🟠 **Publish dengan data belum lengkap.** Validasi publish lebih ketat dari draft (mis. ringkasan, periode, dan minimal satu link atau diagram wajib); draft boleh setengah jadi.
- 🟠 **Slug perlu diganti setelah publish.** Slug terkunci; mengganti butuh konfirmasi "Buka kunci" dan otomatis membuat redirect. Rantai redirect (a→b→c) dipadatkan menjadi a→c; loop (a→b→a) ditolak.
- 🟠 **Kunci JWKS Access berganti.** JWKS di-cache dan diambil ulang saat `kid` tidak dikenal (`createRemoteJWKSet` dari `jose`); toleransi jam ±60 detik untuk `exp`/`nbf`.
- 🟠 **Path rahasia perlu diganti** (mis. pernah terlihat orang lain). Urutan: tambah path baru di aplikasi Access → `wrangler secret put MANAGE_PATH` → hapus path lama dari Access. Bila urutan tertukar, `assertAdmin()` tetap menolak karena tidak ada JWT Access.
- 🟠 **Secret hilang setelah deploy.** `MANAGE_PATH` wajib bertipe secret (`wrangler secret put`), bukan variabel teks biasa di dashboard. Variabel dashboard ditimpa `wrangler deploy` (kecuali `keep_vars`), sedangkan secret tidak dihapus kecuali lewat `wrangler secret delete` (✅ dokumentasi). Bila tetap hilang, area manage membalas 404 (_fail closed_), bukan terbuka.

**Gerbang:** review agent `security`, `/ponytail-review`, e2e Playwright untuk manage. Bypass khusus test hanya boleh di env lokal dan **tidak pernah** aktif di produksi; ada test yang memastikannya.
**❓ Pertanyaan:** nilai `MANAGE_PATH` (dibuat acak, disimpan sebagai Wrangler secret + `.dev.vars` lokal yang gitignored) · durasi sesi Access · hard atau soft delete · batas ukuran file · perlu riwayat versi konten?
**Selesai bila:** semua entitas bisa dikelola; ketiga jalur tanpa Access ditolak; perubahan tampil di halaman publik segera setelah disimpan.
**Penutup fase (§0.6):** stage area manage, `assertAdmin()`, upload R2, parser import, dan test. **Pastikan nilai `MANAGE_PATH`, team domain, dan `aud` Access tidak ikut ter-stage** (lokal di `.dev.vars` yang gitignored, produksi lewat `wrangler secret put`; `.dev.vars.example` hanya berisi nama variabel). Contoh subjek: `feat(manage): add protected content management area`.

### Fase 9 — API publik `/api/v1` (Hono, read-only) ❓

**Tujuan:** JSON publik yang kecil dan aman, sekaligus showcase Hono.
**Skill:** ponytail, karpathy, testing-strategy, high-perf-browser (header cache).
- [ ] Rute: `GET /api/v1/profile`, `/projects`, `/projects/:slug`, `/experience`, `/skills`, `/certifications`, `/health`.
- [ ] Hanya mengembalikan data `published`. Bentuk respons `{ data, meta }`; error `{ error: { code, message } }`; 404 untuk slug tidak dikenal; slug lama → 308 ke slug baru.
- [ ] Cache: `Cache-Control: public, s-maxage=…, stale-while-revalidate=…` + ETag. CORS hanya GET (❓ origin).
- [ ] Rate limit ditangani aturan WAF seluruh situs dari Fase 10, bukan kode.
- [ ] `GET /api/v1` mengembalikan indeks endpoint dalam JSON. OpenAPI tidak dibuat kecuali diminta.
- [ ] Test: Vitest dengan `app.request()` dari Hono, termasuk test bahwa draft **tidak pernah** keluar.

**Edge case (urut prioritas):**
- 🔴 **Field internal bocor lewat API** (catatan, URL repo privat, pengalaman `disclosure: hidden`, draft). Respons dibentuk dari daftar field yang diizinkan (DTO) yang **sama** dengan yang dipakai halaman publik; test snapshot memastikan field terlarang tidak pernah muncul. Email kontak tidak ikut di `/profile` (alasan sama dengan Fase 7).
- 🟠 **Scraping atau penyalahgunaan.** Ditangani aturan rate limiting WAF seluruh situs (Fase 10). Cloudflare yang membalas blokir (bawaan `429`), jadi Worker tidak terpanggil. Klien dianjurkan memakai cache (ETag).
- 🟠 **Slug lama dipakai di API.** Balas `301`/`308` dengan header `Location` **dan** body JSON berisi slug baru, karena sebagian klien tidak mengikuti redirect.
- 🟢 **Daftar membesar.** Parameter `limit`/`cursor` baru ditambahkan bila item > 50 (dicatat sebagai `shortcut:`).
- 🟢 **Bentuk respons berubah.** `/api/v1` tidak boleh berubah secara breaking; perubahan breaking menjadi `/api/v2`.

**❓ Pertanyaan:** perlu API publik? (rekomendasi: ya, kecil) · CORS terbuka untuk semua origin?
**Selesai bila:** semua endpoint lolos test; tidak ada data draft/archived yang bocor.
**Penutup fase (§0.6):** stage route Hono dan test-nya. Contoh subjek: `feat(api): add read-only Hono /api/v1`.

### Fase 10 — SEO, kesiapan i18n, analitik, kebijakan crawler, header keamanan

**Tujuan:** situs bisa ditemukan, aman, dan siap ditambah bahasa.
**Skill:** high-perf-browser, ponytail.
- [ ] `sitemap.ts`, `robots.ts` (**tanpa** path manage), canonical, `metadataBase`.
- [ ] i18n (bila dipilih di Fase 1): string UI terpusat, konten per bahasa, atribut `lang`, `hreflang` bila ada > 1 bahasa.
- [ ] Analitik: Cloudflare Web Analytics (gratis, tanpa cookie) ❓.
- [ ] Kebijakan crawler AI ❓: blokir (robots + fitur Cloudflare "Block AI bots") atau izinkan (supaya profil muncul di jawaban AI).
- [ ] Header keamanan: CSP ketat (pola `wedding-nextjs`), HSTS, Referrer-Policy, Permissions-Policy, X-Content-Type-Options.
- [ ] **Satu aturan rate limiting WAF.** Kuota paket Free (✅ diverifikasi 24 Okt): satu aturan, hitungan per IP, periode 10 detik, blokir 10 detik, aksi Block saja, request dari cache ikut dihitung. Cakupan seluruh situs, **kecuali** bot terverifikasi (field _Verified Bot_) dan `/_next/static/*` (✅). Aset statis memang tidak dihitung kuota Workers (✅ dokumentasi), jadi pengecualian ini hanya supaya pengunjung biasa tidak cepat kena ambang. Ambang awal longgar, mis. 100 request/10 detik per IP, lalu disetel dari data nyata. Aturan dikonfigurasi di dashboard dan dicatat di README.
- [ ] Matikan **Email Address Obfuscation** di Scrape Shield. Fitur ini tidak berlaku untuk HTML buatan Worker (✅ diverifikasi), dan bila suatu saat berlaku, skrip `email-decode`-nya bisa merusak hidrasi dan terblokir CSP.

**Edge case (urut prioritas):**
- 🟠 **CSP ketat memblokir skrip yang memang dipakai** (beacon Cloudflare Web Analytics, Access). Host/hash yang dibutuhkan ditambahkan; CSP dijalankan dulu dalam mode `Report-Only` lalu diuji di produksi.
- 🟠 **Banyak pengunjung berbagi satu IP** (NAT kantor/kampus, CGNAT operator seluler) ikut terblokir rate limit. Ambang awal sengaja longgar; setelah launch pantau Security → Events dan naikkan ambang bila ada blokir yang salah sasaran.
- 🟠 **Urutan WAF → Worker belum dikonfirmasi di zona sendiri.** Bukti dokumentasi (✅ 24 Okt): hanya request yang sampai ke Worker yang dihitung kuota dan tagihan; aturan WAF dengan aksi terminating (Block) menghentikan request sebelum tahap berikutnya; custom rules dan rate limiting memeriksa request sesuai _traffic sequence_. Konfirmasi akhir diputuskan di fase ini setelah domain terhubung (✅): lihat Traffic Sequence di dashboard, jalankan Cloudflare Trace untuk satu request ke `/`, lalu kirim request melewati ambang dan pastikan hitungan request di metrik Workers tidak ikut naik. Aturan WAF hanya berlaku di domain/route zona, tidak di `*.workers.dev`; ini alasan tambahan `workers_dev: false`.
- 🟠 **Konten ganda** di `*.workers.dev`, `www`, dan domain utama. Satu domain kanonis; `www` di-redirect 301; `metadataBase` dan canonical menunjuk domain utama.
- 🟠 **Blokir crawler AI ikut memblokir bot pratinjau** (LinkedInBot, WhatsApp, Slackbot). Uji pratinjau link di LinkedIn dan WhatsApp setelah aturan bot aktif.
- 🟢 **i18n aktif tapi terjemahan kosong.** Fallback ke EN per field, bukan teks kosong.

**Selesai bila:** Lighthouse SEO = 100; header keamanan lolos pemeriksaan (mis. securityheaders.com); robots.txt tidak membocorkan path manage; aturan rate limiting aktif dan sudah diuji (request di atas ambang → `429`).
**Penutup fase (§0.6):** stage `sitemap.ts`, `robots.ts`, metadata, konfigurasi header, i18n, dan catatan aturan WAF di README (aturannya sendiri hanya ada di dashboard). Contoh subjek: `feat(seo): add sitemap, metadata, analytics and security headers`.

### Fase 11 — Kualitas menyeluruh

**Tujuan:** cepat, aksesibel, tahan banting, dan teruji.
**Skill:** impeccable `harden` / `optimize` / `adapt` / `audit`, high-perf-browser, ux-heuristics, `/ponytail-review`, testing-strategy.
- [ ] **Performa:** TTFB < 800 ms, LCP < 2,5 s, INP < 200 ms, CLS < 0,1 (ukur di HP kelas menengah dengan 4G). JS halaman publik minimal, font subset + preload, gambar dimensinya dipesan, aset ber-hash dengan `immutable`. ❓ Cloudflare Images untuk optimasi gambar (ada panduan dari OpenNext).
- [ ] **CPU Worker:** ukur ulang seperti di Fase 0, kali ini dengan konten nyata; catat cache hit ratio.
- [ ] **A11y:** WCAG 2.2 AA; axe 0 pelanggaran serius; uji VoiceOver di jalur utama; zoom 200%.
- [ ] **Responsif:** 320, 390, 768, 1024, 1440, 1920 px. Uji konten ekstrem: judul sangat panjang, 0 item, 50 item.
- [ ] **Harden:** error boundary, state kosong/gagal, input ekstrem di manage, D1 gagal → pesan yang ramah.
- [ ] **Test lengkap:** unit (parser, Zod, `assertAdmin`, query), e2e (publik + manage + API), cek visual manual.

**Edge case (urut prioritas):**
- 🔴 **Kuota harian Workers Free habis** (mis. lonjakan bot) sehingga situs error sampai reset pukul 07.00 WIB. Pasang notifikasi usage Cloudflare di 80% + aturan rate limiting dan bot (Fase 10); keputusan upgrade ke Paid diambil saat itu lewat AskUserQuestion (✅).
- 🟠 **D1 gagal atau lambat.** Halaman publik tetap tersaji dari cache (stale) bila ada. Bila tidak ada cache, tampilkan halaman error bergaya panel dengan link CV/LinkedIn statis, bukan layar putih.
- 🟠 **Jaringan lambat dan perangkat lemah.** Anggaran LCP juga diuji dengan throttling "Slow 4G" + CPU 4×; gambar di bawah lipatan memakai `loading="lazy"`.
- 🟢 **Browser lama** (di bawah syarat Next.js 16: Safari 16.4 / Chrome 111). Konten tetap terbaca; fitur interaktif boleh hilang.

**Selesai bila:** semua anggaran di atas terpenuhi; test hijau di CI; tidak ada temuan severity 3–4 yang masih terbuka.
**Penutup fase (§0.6):** biasanya beberapa commit (perf, a11y, test, fix). Stage per kelompok sesuai aturan §0.6. Contoh subjek: `perf: meet Core Web Vitals budgets on public pages`, `test: add e2e coverage for public, manage and API`.

### Fase 12 — Gerbang sebelum deploy (wajib, tidak boleh dilewati)

**Tujuan:** verdict jujur sebelum ada pengunjung pertama.
**Skill:** steve-jobs-design-review (**GATE**, fase 10 create-website), impeccable `polish` → impeccable-finish-reviewer → impeccable-documenter, `/ponytail-audit`, `/ponytail-debt`, technical-documentation.
- [ ] **Cek ulang dokumen ini:** apakah Fase 9–13 dikerjakan serinci fase awal? Apakah semua ❓ sudah ditanyakan lewat AskUserQuestion, dijawab, dan tercatat di §11.3? Apakah setiap fase sebelumnya ditutup dengan stage + pesan commit, dan Rahmat sudah commit?
- [ ] steve-jobs-design-review dengan format resmi (Verdict, One Thing, Keeps its promise?, Cut list, Fix list, Back of the fence). Lihat situs dalam keadaan "dingin" seperti pengunjung baru, hitung langkah sampai nilai (≤ 3 ke CV), telusuri jalur gagal (404, D1 error, file CV hilang, JS mati).
- [ ] impeccable `polish` → ambil screenshot `desktop.png` (1440) dan `mobile.png` (390) ke `.impeccable/review/` → `impeccable detect --json` → panggil subagent **impeccable-finish-reviewer** (berisi contract, screenshot, temuan) → kerjakan disposisinya (ship / fix / rebuild / recapture).
- [ ] **impeccable-documenter** → `DESIGN.md` root + `.impeccable/design.json`.
- [ ] `/ponytail-audit` + `/ponytail-debt` → tutup temuan kritis. Sisa komentar `shortcut:` harus diterima Rahmat secara eksplisit.
- [ ] README: setup lokal, env, deploy, cara mengisi konten lewat manage, cara backup dan restore.
- [ ] Tutup tracker create-website: setiap fase berstatus `done` atau `skipped: alasan`.
- [ ] **Finalisasi case study `portfolio` (repo ini)** dengan angka nyata hasil ukur: skor Lighthouse, Core Web Vitals, ukuran bundle Worker, CPU median/p99, jumlah test. Diagram arsitektur dari §6.1. Masukkan lewat area manage, bukan ditulis langsung di kode.

**Edge case (urut prioritas):**
- 🟠 **Konten belum lengkap saat gerbang.** Launch dengan yang siap; item yang belum lengkap tetap draft (✅). Gerbang menilai situs yang benar-benar akan tayang, bukan rencananya.
- 🟠 **Verdict NOT DONE dua kali.** Daftar perbaikan yang tersisa diajukan lewat AskUserQuestion: tayangkan apa adanya, atau satu ronde perbaikan lagi (sesuai aturan Impeccable).
- 🟠 **Angka case study `portfolio` diukur sebelum perbaikan terakhir.** Ukur ulang setelah perbaikan terakhir, baru masukkan.
- 🟠 **Masih ada edge case 🟠 yang terbuka dari fase sebelumnya.** Daftar semua blok _Edge case_ di dokumen ini; yang 🟠 wajib tuntas di sini, yang 🟢 boleh tetap terbuka bila sudah tercatat.

**Selesai bila:** verdict **INSANELY GREAT** / reviewer _ship_; tidak ada temuan kritis yang terbuka; DESIGN.md root ada; case study `portfolio` terisi angka nyata.
**Penutup fase (§0.6):** stage perbaikan dari review, `DESIGN.md` + `.impeccable/design.json`, README, dan tracker. Contoh subjek: `docs: add DESIGN.md, README and pre-launch review fixes`.

### Fase 13 — Deploy dan pasca-deploy

**Tujuan:** produksi stabil, konten bisa diubah, ada backup.
**Skill:** engineering:deploy-checklist, systems-architecture:release-it (versi ringan), high-perf-browser.
- [ ] **Urutan:** stage konfigurasi produksi + workflow backup → beri pesan commit → Rahmat commit dan push → baru deploy produksi. Agent tidak pernah push. **Deploy dijalankan Rahmat secara manual** (✅): agent menyiapkan perintahnya di README, Rahmat yang menjalankan.
- [ ] Hubungkan domain kustom ke Worker; SSL aktif; **Access aktif untuk path manage di domain final**.
- [ ] Migrasi D1 remote + seed produksi; unggah CV ke R2.
- [ ] Smoke test produksi dengan Playwright ke URL live: semua halaman, unduh CV, API, manage (lewat Access), dan **akses manage tanpa Access ditolak**.
- [ ] Backup: D1 Time Travel (bawaan) + ❓ ekspor berkala `wrangler d1 export` ke **repo privat terpisah** via GitHub Actions (rekomendasi: mingguan). Uji restore sekali.
- [ ] Monitoring: Workers Observability/log; ❓ Sentry (seperti `wedding-nextjs`) atau cukup log Cloudflare.
- [ ] Tambahkan link portofolio ke LinkedIn (Featured + Contact info) dan README profil GitHub.
- [ ] Masukkan repo ini ke rutinitas upgrade dependensi Next.js yang sudah Rahmat punya.
- [ ] Pasca-launch: kumpulkan umpan balik nyata (pertanyaan recruiter, analitik) → lanjutkan dengan `metaskills:improve-website` bila perlu.

**Edge case (urut prioritas):**
- 🔴 **Urutan peluncuran tidak aman.** Urutan wajib: (1) domain aktif + SSL, (2) aplikasi Access untuk path manage aktif dan sudah diuji, (3) `workers_dev` dan preview URL mati, (4) baru deploy kode manage. Bila langkah 2 belum siap, deploy tanpa route manage dulu.
- 🔴 **Deploy rusak.** Rollback dengan `wrangler rollback` ke versi sebelumnya; prosedur ini diuji sekali sebelum launch. Migrasi D1 tidak ikut di-rollback, karena itu pola _expand → contract_ dari Fase 4 wajib.
- 🔴 **Urutan deploy manual tertukar.** README memuat urutan pasti: `db:migrate:remote` → `deploy` → smoke test. Rahmat menjalankannya sendiri (✅).
- 🟠 **Token API untuk backup bocor atau kedaluwarsa.** Token Cloudflare di GitHub Actions dibuat dengan izin minimum (hanya baca/ekspor D1), disimpan sebagai secret repo backup, dan diperbarui sebelum kedaluwarsa.
- 🟠 **Link live proyek mati.** GitHub Action mingguan mengecek semua link publik dan melaporkan yang gagal, tanpa mengubah situs otomatis (✅).
- 🟢 **Domain lupa diperpanjang / akun Cloudflare atau GitHub terkunci.** Auto-renew domain aktif; kode pemulihan 2FA disimpan offline.
- 🟢 **LinkedIn menampilkan pratinjau lama.** Segarkan lewat LinkedIn Post Inspector setelah launch dan setiap kali gambar OG berganti.

**Selesai bila:** produksi stabil 7 hari tanpa error kritis; perubahan konten lewat manage tampil segera; restore backup pernah diuji.
**Penutup fase (§0.6):** stage konfigurasi produksi (`wrangler.jsonc` tanpa rahasia), workflow GitHub Actions backup, dan pembaruan README. Contoh subjek: `chore: add production config and weekly D1 backup workflow`.

---

## 11. Keputusan

### 11.1 Sudah diputuskan (18 dan 24 Okt 2026)

| Keputusan                        | Pilihan                                                                                                                                                                                                                                              |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Asal rencana                     | Dibuat baru dari nol; rencana lama tidak dipakai; semua keputusan produk lama diputuskan ulang                                                                                                                                                       |
| Stack                            | Next.js 16 + Hono + D1 (Drizzle) + R2 di Cloudflare via OpenNext                                                                                                                                                                                     |
| Proteksi area manage             | Path rahasia + Cloudflare Access (OTP) + verifikasi JWT di server                                                                                                                                                                                    |
| Bahasa dan lokasi rencana        | Bahasa Indonesia; `docs/PLAN.md`                                                                                                                                                                                                                     |
| Sumber LinkedIn                  | Dibaca lewat browser bawaan saat Rahmat sudah login                                                                                                                                                                                                  |
| Cara bertanya                    | Semua pertanyaan (❓ dan yang muncul di tengah kerja) wajib lewat tool AskUserQuestion (§0.2). Pengecualian: ronde keputusan Impeccable (arah visual dan struktur halaman) memakai decision page Impeccable, dengan AskUserQuestion sebagai fallback |
| Proyek unggulan                  | Lima: `timetables`, `nikke-calculator`, `policy-semver`, SOBAT-PS, dan repo `portfolio` ini (§8.4)                                                                                                                                                   |
| Alur git                         | Di akhir tiap fase agent hanya men-stage + memberi pesan commit. Rahmat yang commit dan push (§0.6)                                                                                                                                                  |
| Port dev lokal                   | `3005` (`next dev -p 3005`, Fase 0)                                                                                                                                                                                                                  |
| Nama di situs                    | "Besar Rachmat Ikhsan Pambudi" (header, SEO, nama file CV), "Rahmat" di teks singkat, "Besar Rahmat" sebagai `alternateName`                                                                                                                         |
| KPI tahun pengalaman             | Rentang kerja digabung sejak Apr 2022, tumpang tindih dan celah tidak dihitung, dihitung saat render                                                                                                                                                 |
| Sumber kebenaran konten          | D1 setelah launch; seed insert-only, hanya untuk DB kosong                                                                                                                                                                                           |
| Duplikat saat bulk import        | Dilewati dan dilaporkan di preview                                                                                                                                                                                                                   |
| Login area manage                | One-time PIN email + GitHub (keduanya hanya akun Rahmat) + prosedur darurat `wrangler d1`                                                                                                                                                            |
| Path manage                      | Segmen dinamis `[secret]` dibandingkan dengan secret runtime `MANAGE_PATH` (Wrangler secret / `.dev.vars`), guard di setiap halaman, 404 bila tidak cocok; tidak memakai `rewrites` (bocor ke `_buildManifest.js`); repo boleh publik                |
| Preview draft                    | Ya, di dalam area manage                                                                                                                                                                                                                             |
| Area manage di HP                | Mobile-first, tetap responsif di desktop                                                                                                                                                                                                             |
| Gambar OG                        | Statis untuk halaman umum + cover proyek untuk halaman proyek                                                                                                                                                                                        |
| Email publik                     | Alias khusus portofolio yang tidak pernah utuh di HTML/payload; dirakit di browser saat diklik; tanpa JS → LinkedIn                                                                                                                                  |
| CV                               | Satu CV bahasa Inggris di `/cv`, tanpa nomor HP/alamat; fallback ke LinkedIn bila file hilang                                                                                                                                                        |
| Deploy                           | Manual oleh Rahmat                                                                                                                                                                                                                                   |
| Kuota Workers Free habis         | Notifikasi di 80% + aturan rate limiting dan bot; upgrade diputuskan saat terjadi                                                                                                                                                                    |
| Rate limiting                    | Satu aturan WAF (kuota Free) untuk seluruh situs, kecuali bot terverifikasi dan `/_next/static/*`; per IP; ambang awal longgar (mis. 100 request/10 detik); urutan WAF → Worker dikonfirmasi di Fase 10                                              |
| Node.js                          | 24 LTS                                                                                                                                                                                                                                               |
| Konten belum lengkap saat launch | Launch yang siap; sisanya tetap draft, tanpa placeholder                                                                                                                                                                                             |
| Link live mati                   | Dicek otomatis mingguan dan dilaporkan; situs tidak diubah otomatis                                                                                                                                                                                  |

### 11.2 Keputusan terbuka (❓), ditanyakan saat fasenya

| #   | Pertanyaan                                                                  | Rekomendasi                                                        | Fase |
| --- | --------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---- |
| 1   | Audiens utama                                                               | Satu prioritas (pilih di sesi PVP)                                 | 1    |
| 2   | Aksi utama dan urutan CTA                                                   | CV → LinkedIn → email                                              | 1    |
| 3   | Bahasa situs dan kesiapan i18n                                              | EN, siap i18n                                                      | 1    |
| 4   | Mobile-first                                                                | Ya                                                                 | 1    |
| 5   | Pembagian `docs/DESIGN.md` vs `DESIGN.md` root                              | Sesuai §4.3                                                        | 1    |
| 6   | Status ketersediaan ("open to …")                                           | Tampil bila memang terbuka                                         | 1    |
| 7   | Detail NDA pekerjaan (GCT, MINORI)                                          | Umum, tanpa nama klien                                             | 2    |
| 8   | Proyek privat yang tampil; wedding; money-tracker                           | Sesuai usulan §8.4                                                 | 2    |
| 9   | IPK, SMA, sertifikat kedaluwarsa                                            | IPK tampil, SMA tidak, expired diberi badge                        | 2    |
| 10  | Foto profil; isi CV terbaru (format sudah diputuskan: satu CV EN)           | —                                                                  | 2    |
| 11  | Arah visual (decision page Impeccable)                                      | Pilihan Rahmat                                                     | 3    |
| 12  | Tema default; smooth scroll; tingkat animasi                                | Dari adegan fisik; scroll native; animasi hemat                    | 3    |
| 13  | Primitif headless                                                           | Base UI (headless, tanpa gaya bawaan)                              | 0/5  |
| 14  | Model i18n; level skill; soft delete                                        | Kolom per bahasa; tanpa level; soft delete                         | 4    |
| 15  | `/components` publik                                                        | Ya, sebagai bukti keahlian UI                                      | 5    |
| 16  | Form kontak vs mailto                                                       | mailto + salin email                                               | 7    |
| 17  | Feed aktivitas GitHub                                                       | Tunda                                                              | 7    |
| 18  | Nilai `MANAGE_PATH`; durasi sesi Access; batas ukuran file; riwayat versi   | —                                                                  | 8    |
| 19  | API publik`/api/v1` + CORS                                                  | Ya, kecil, GET saja                                                | 9    |
| 20  | Analitik                                                                    | Cloudflare Web Analytics                                           | 10   |
| 21  | Kebijakan crawler AI                                                        | — (keputusan nilai, bukan teknis)                                  | 10   |
| 22  | Cloudflare Free vs Paid (bila CPU/ukuran gagal di Fase 0, atau kuota habis) | Putuskan setelah angka Fase 0; kuota habis → putuskan saat terjadi | 0/11 |
| 23  | Domain, repo publik/privat, package manager, identitas commit               | —                                                                  | 0    |
| 24  | Slug dikunci setelah publish                                                | Ya                                                                 | 8    |
| 25  | Backup D1 ke repo privat                                                    | Ya, mingguan                                                       | 13   |
| 26  | Monitoring error (Sentry vs log Cloudflare)                                 | Log Cloudflare dulu                                                | 13   |
| 27  | Ritme gerbang skill (§4.2)                                                  | Sesuai §4.2                                                        | 1    |
| 28  | React Compiler                                                              | Aktifkan bila waktu build masih wajar                              | 0    |

### 11.3 Log keputusan (diisi selama kerja)

| Tanggal    | Keputusan                                                                                                                                                                                                                                                                                                                                                              | Alasan                                                                                                            | Fase        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------- |
| 2026-10-18 | Stack, proteksi manage, bahasa/lokasi rencana, sumber LinkedIn (§11.1)                                                                                                                                                                                                                                                                                                 | Jawaban Rahmat                                                                                                    | Perencanaan |
| 2026-10-18 | Pertanyaan via AskUserQuestion; repo `portfolio` masuk proyek unggulan; agent hanya stage + pesan commit                                                                                                                                                                                                                                                               | Permintaan Rahmat                                                                                                 | Perencanaan |
| 2026-10-18 | Semua ronde keputusan Impeccable memakai decision page Impeccable (Fase 3, dan Fase 6/7 bila terjadi)                                                                                                                                                                                                                                                                  | Permintaan Rahmat                                                                                                 | Perencanaan |
| 2026-10-18 | Dev server lokal di port 3005                                                                                                                                                                                                                                                                                                                                          | Permintaan Rahmat                                                                                                 | Perencanaan |
| 2026-10-24 | 16 keputusan edge case (nama, KPI pengalaman, sumber data, duplikat import, login darurat, path manage, preview, manage di HP, OG, email, CV, deploy, kuota, Node, konten kurang, link mati); lihat §11.1                                                                                                                                                              | Jawaban Rahmat                                                                                                    | Perencanaan |
| 2026-10-24 | Hasil verifikasi: Email Obfuscation Cloudflare tidak efektif untuk Next.js di Workers; paket Free mendapat 1 aturan rate limiting (per IP, periode 10 detik); `rewrites` membocorkan path di `_buildManifest.js` publik; guard di layout saja membocorkan isi halaman; isi `.env*` di-inline OpenNext ke bundle; `process.env` tidak membaca `.dev.vars` di `next dev` | Uji di scaffold Next 16.4.3 + OpenNext 1.20.13 (`next dev` dan `wrangler dev`) + dokumentasi Cloudflare           | Perencanaan |
| 2026-10-24 | Email dirakit di browser saat diklik; rate limiting seluruh situs kecuali bot terverifikasi; path manage lewat segmen `[secret]` + secret runtime                                                                                                                                                                                                                      | Jawaban Rahmat (dua pertama); yang ketiga konsekuensi hasil uji atas keputusan "path dari env, repo boleh publik" | Perencanaan |
| 2026-10-24 | Uji route `[secret]` di Workers sungguhan tetap di tracer Fase 0; konfirmasi urutan WAF → Worker tetap di Fase 10. Tambahan hasil cek: respons manage `private, no-store`; hanya request yang sampai ke Worker dihitung kuota; aset statis tidak dihitung; secret tidak dihapus `wrangler deploy`                                                                      | Jawaban Rahmat + uji `wrangler dev` + dokumentasi Cloudflare                                                      | Perencanaan |
| 2026-10-24 | Fase 0: Node 24.22.1 dari tarball resmi nodejs.org (`~/.local/node24`, SHA256 dicek) karena Mac ini Node 26; npm; repo GitHub publik; belum ada domain → `workers.dev`; identitas commit = git global (`Besar Rahmat`, email noreply GitHub); React Compiler aktif; lint-staged dibuang (pakai `biome check --staged`); siklus cache diuji lewat tombol di halaman dummy manage | Jawaban Rahmat | 0 |
| 2026-10-24 | Versi terkunci: Next 16.4.3, React 19.3.0, OpenNext 1.20.13, Wrangler 4.152.0, Hono 4.13.13 (`hono/vercel` bawaan, tanpa paket `@hono/vercel`), Drizzle 0.45.4 / kit 0.31.11, Biome 2.6.2, Vitest 5.0.5, Playwright 1.64.1, TypeScript 5 (bawaan create-next-app) | `npm view` + dokumentasi terpasang | 0 |
| 2026-10-24 | Cache: R2 incremental cache + DO queue + D1 tag cache (resep "small site" OpenNext). Terbukti di `opennextjs-cloudflare preview`: tulis D1 langsung tanpa `updateTag` tidak terlihat; lewat Server Action + `updateTag` langsung segar | Uji lokal workerd; ulangi di Workers sungguhan setelah deploy | 0 |
| 2026-10-24 | Ukuran Worker (`wrangler deploy --dry-run`): 5.766,97 KiB, gzip 1.216,55 KiB → di bawah batas Free 3 MiB terkompresi | Ukur lokal | 0 |
| 2026-10-24 | Route manage pindah ke `(manage)/m/[secret]`: dengan `cacheComponents`, `notFound()` di segmen dinamis = soft-404 (200 + noindex), jadi `[secret]` di root membuat semua URL satu-segmen yang salah ikut 200 | Uji build produksi + docs Next 16.4 (streaming → status codes) + jawaban Rahmat | 0 |
| 2026-10-24 | Deploy pertama: `portfolio.besarrahmat.workers.dev`, startup Worker 15 ms, gzip 1.216,28 KiB. CPU (`wrangler tail`, 50 request per route, termasuk isolate dingin): `/` p50 39 / p90 209 / p99 444 ms (min 20); `/api/v1/health` p50 12 / p90 72 / p99 147 ms; 404 statis p50 11 / p90 42 / p99 281 ms. Semua 200, tetapi seluruh request `/` di atas 10 ms | Ukur di Workers sungguhan | 0 |
| 2026-10-24 | ❓ #22 diputuskan: **Workers Paid** (US$5/bulan). Baseline Next di Worker sudah ~11 ms, jadi Free tidak realistis tanpa merombak arsitektur | Jawaban Rahmat | 0 |
| 2026-10-24 | Alur branch: `dev` untuk kerja, `main` untuk rilis; CI di push/PR ke keduanya; deploy hanya dari `main`; tanpa ruleset GitHub | Jawaban Rahmat | 0 |
| 2026-10-24 | Peringatan saat build/deploy dibiarkan: "DOQueueHandler not exported" dan "internal Durable Objects" berasal dari proxy binding lokal (worker hasil build tetap mengekspor kelasnya); "Preview URLs disabled" memang disengaja (§6.3); DEP0190 dari kode OpenNext | Cek `.open-next/worker.js` + docs | 0 |
| 2026-10-24 | Uji `updateTag` di Workers: Server Action berhasil, tetapi `GET /` berikutnya macet >30 detik (tail tidak mencatat kedua invocation). Penyebab: dedupe `'use cache'` lintas request di Next 16.4 menunggu tulisan cache milik invocation yang sudah selesai (opennextjs-cloudflare#1464, vercel/next.js#100345, keduanya masih terbuka). Downgrade tidak mungkin (16.0–16.4.0 punya RCE) | Uji e2e + `wrangler tail` + issue upstream | 0 |
| 2026-10-24 | `'use cache'` dilepas: D1 dibaca per request (biaya CPU ditanggung Workers Paid). Route dummy manage, `guardManage` + test-nya, dan `.dev.vars.example` dihapus; Fase 8 memulihkan guard dari commit `12df560`. Konfigurasi R2/DO/D1 tag cache dibiarkan untuk Fase 11. Secret `MANAGE_PATH` di produksi boleh tetap ada | Jawaban Rahmat | 0 |
| 2026-10-24 | Setelah `'use cache'` dilepas (live, 50 request per route): `/` p50 50 / p90 238 ms (min 17), `/api/v1/health` p50 14 ms, 404 p50 11 ms; semua `ok`, e2e 3/3 lulus di URL live | Ukur di Workers sungguhan | 0 |
| 2026-10-24 | Binding DO queue, D1 tag cache, dan `WORKER_SELF_REFERENCE` dibuang karena tidak ada lagi yang me-revalidate. Peringatan "internal Durable Objects" hilang; bundle turun jadi gzip 1.031,82 KiB. Peringatan "DOQueueHandler not exported" juga dihilangkan (✅ permintaan Rahmat): entry kustom `worker.js` di root hanya me-re-export handler `default` dari `.open-next/worker.js` (pola custom worker OpenNext), lalu migrasi `v2` `deleted_classes: ["DOQueueHandler"]` menghapus namespace DO yang kosong secara permanen. Bila Fase 11 memakai DO lagi, kelasnya harus di-re-export di `worker.js` dengan tag migrasi baru | Uji `preview` + dry-run + docs Cloudflare (DO migrations) | 0 |
| 2026-10-24 | Diverifikasi di produksi (versi `0c3b3204`, commit `d8aa42c`): migrasi `v2` diterima, API Cloudflare tidak lagi mencatat namespace DO untuk script `portfolio`, binding tinggal `DB`, `MEDIA`, dan `NEXT_INC_CACHE_R2_BUCKET`, e2e 3/3 lulus di URL live, CI hijau di `main` dan `dev`. **Kriteria "Selesai bila" Fase 0 terpenuhi** | `wrangler versions view` + API DO namespaces + e2e + `gh run list` | 0 |
| 2026-10-24 | Biome 2.6 ikut memformat Markdown dan sempat memformat ulang `docs/PLAN.md` (padding tabel, `*x*` → `_x_`, baris kosong); isi teks tidak diubah. Markdown kini dikecualikan dari Biome | Kejadian saat setup | 0 |
| 2026-10-24 | Fase 1: audiens utama = tech lead / hiring manager perusahaan software terkait Jepang (PVP 25/30); tujuan konversi = Download CV, urutan CTA CV → LinkedIn → email; status ketersediaan tampil hanya bila terbuka; bahasa EN saat launch, JA bahasa kedua yang pasti (siap i18n; font wajib punya glyph JP atau fallback teruji); mobile-first; pembagian DESIGN.md (§4.3) dan ritme gerbang (§4.2) disetujui (❓ #1–6, #27) | Jawaban Rahmat | 1 |
| 2026-10-24 | Fase 1: USP "The only portfolio that is itself the proof …" (lolos swap test); di frontend tanpa daftar tech stack dalam kurung. GCT adalah anak perusahaan PT MINORI, yang bekerja sama dengan dan memiliki banyak klien Jepang (boleh disebut, tanpa nama klien). Frasa "the stack Japanese teams ship" diuji kredibilitasnya di Fase 2 | Jawaban Rahmat | 1 |
| 2026-10-24 | Fase 1: launcher `impeccable context` berjalan; live mode Impeccable ditunda ke Fase 3 (belum ada UI); `buildPath` tidak dicatat karena image generation tidak tersedia (jalur code-led, §4.3). Wawancara Impeccable `init` dan intake create-website digabung; jawaban §11 tidak ditanyakan ulang. **Kriteria "Selesai bila" Fase 1 terpenuhi** | Jalannya fase | 1 |
| 2026-10-24 | Fase 2: detail GCT/MINORI umum tanpa nama klien (highlight dibiarkan draft); wedding jadi unggulan ke-6 (tanpa link live/data tamu); money-tracker, learning log, ecommerce-laravel, mthrill-web disembunyikan; IPK tampil, SMA tidak; sertifikat kedaluwarsa diberi badge "Expired"; foto profesional (file menyusul, Fase 8); CV EN didraf agent dari seed (`content/cv.md`); lulus Jul 2023 dikonfirmasi (❓ #7–10) | Jawaban Rahmat | 2 |
| 2026-10-24 | Fase 2: one-liner #1 "Judge the engineering, not the claims: every private system here comes with its architecture diagram."; frasa "the stack Japanese teams ship" dibuang dari copy situs (USP frontend diperbarui di PRODUCT.md dan MARKETING.md); bukti Sinatra = SOBAT-PS masih live di `sobat-ps.kaltaraprov.go.id`; timetables dan nikke berstatus In progress | Jawaban Rahmat | 2 |
| 2026-10-24 | Fase 2: koreksi §8 dari sumber: `policy-semver` rilis terakhir v1.0.1 (bukan v1.0.0); situs live nikke 404; timetables v2 memakai template open-source Studio Admin (diakui di case study); SOBAT-PS live (HTTP 200, Laravel). Kontributor semua repo unggulan hanya `besarrahmat` (+ bot) | `gh`, `npm view`, `curl` | 2 |
| 2026-10-24 | Fase 2: 🔴 tahun pengalaman = `experienceMonths` (`src/lib/experience.ts`), 54 bulan per Okt 2026 dari seed, diuji; 🔴 seed dicek `src/lib/seed.test.ts` (email, nomor HP, denylist nama dalam bentuk hash SHA-256 agar daftarnya sendiri tidak bocor, link privat tanpa URL), dibuktikan gagal dengan file seed buruk sementara. Lokasi profil dan URL web profile HTSI masih butuh input | Test + uji mutasi | 2 |
| 2026-10-24 | Fase 2 (revisi sebelum commit): lokasi profil = Cikarang, West Java (lokasi sekarang); foto profesional di `content/media/avatar.jpg` (diperkecil ke 800 px, tanpa metadata GPS/kamera); highlight GCT (melanjutkan pekerjaan MINORI, memimpin freelancer dan anak magang untuk proyek AI internal per departemen) dan MINORI (Laravel, CodeIgniter lama, Next.js sejak 2026); web profile HTSI tampil **tanpa link** karena `pt-htsi.com` sekarang Astro 7 yang dibangun ulang orang lain | Jawaban Rahmat + `curl` (generator Astro v7.0.7) | 2 |
| 2026-10-24 | Fase 2 (revisi): **main stack = Laravel, CodeIgniter, PHP, Next.js** (`skills.main`). Experience, About, CV, dan ringkasan stack Overview hanya menyebut keempatnya; teknologi lain baru dipelajari setahun terakhir, tetap tercantum di stack proyek yang memakainya (jujur per proyek) dan tampil di Skills sebagai "Used in projects". PolicySemVer dan portfolio ikut dihitung sebagai terbit publik bersama wedding | Jawaban Rahmat | 2 |
| 2026-10-24 | Fase 2 (revisi): urutan unggulan SOBAT-PS → PolicySemVer → **Wedding** → NIKKE → Timetables → Portfolio (`sort_order` di seed, urutan di CV) | Jawaban Rahmat | 2 |
| 2026-10-24 | Fase 3: wawancara shape: adegan fisik campur → tema ikut perangkat (kedua tema sama kuat); animasi hemat + 1 signature; scroll native; anti-goal = terlihat template shadcn, terlalu artsy sulit dipindai | Jawaban Rahmat | 3 |
| 2026-10-24 | Fase 3: arah visual **The Meishi Exchange** (名刺; kartu THE ROLL, kandidat #5 dari 7, seed `seed:80a40aaf8476870a`), jalur code-led (tanpa image generation). Pick = Basic Design Document; challenger kompetitif = Event Display; 5 challenger ditolak menyumbang disiplin (`docs/DESIGN.md` §1) | Decision page Impeccable | 3 |
| 2026-10-24 | Fase 3: font BIZ UDPGothic (teks) + BIZ UDGothic (angka/ID/tanggal fixed-pitch) karena BIZ UDPGothic **tidak punya `tnum`** (diukur); slice latin 74 KB; glyph JP teruji; "→" tidak ada → panah SVG. Palet 鼠/藍/朱 9 tingkat, 28 pasangan kontras AA lolos; meishi memakai token sendiri (fokus gelap 1,70 → 6,69:1) | Ukur di browser + skrip kontras | 3 |
| 2026-10-24 | Fase 3 (critique): afiliasi "Software Engineer, Global Collabo Tech" tampil di meishi; pengalaman ditulis "4 yrs 6 mo" dari `experienceMonths`; one-liner versi tenang "Every private system here comes with its architecture diagram." (seed `profile.tagline`, CV, POSITIONING diperbarui); semua temuan critique (P1, P2, minor) diperbaiki di sketsa | Jawaban Rahmat | 3 |
| 2026-10-24 | Fase 3: token dan direction contract **disetujui**; `.claude/launch.json` (server sketsa) dihapus, tidak di-stage. **Kriteria "Selesai bila" Fase 3 terpenuhi** | Jawaban Rahmat | 3 |
| 2026-10-24 | Fase 4: ❓ #14 = i18n kolom per bahasa (kolom `*_ja` ditambah saat JA dikerjakan), tanpa level skill, soft delete lewat `status = archived`. `queries.ts` membaca D1 langsung; peta tag + `invalidate(entity)` + `cacheLife` ditunda ke Fase 8/11. Parser bulk import + test CSV pindah ke Fase 8. Agent menjalankan migrasi + seed remote | Jawaban Rahmat | 4 |
| 2026-10-24 | Fase 4: bookmark D1 Time Travel sebelum `0001_content` = `00000008-00000000-0000510e-73b6dab2123f868b710724933709d375` (pulihkan: `wrangler d1 time-travel restore DB --bookmark=<itu>`). Migrasi + seed lokal dan remote: profile 1, experiences 4, education 1, certifications 10, projects 7, skills 27, project_skills 56; avatar R2 sama byte-per-byte; seed ulang menolak; `/api/v1/health` live tetap `ok`. Zod 4.6.5 ditambahkan. Workaround: `drizzle-orm/sqlite-proxy` 0.45 hanya membaca `casing` dari argumen ketiga. Uji di D1 remote sementara: import file atomik (gagal di baris terakhir → 0 baris) dan cleanup seed mengosongkan semua tabel; DB uji dihapus, `portfolio-db` tidak disentuh. **Kriteria "Selesai bila" Fase 4 terpenuhi** | `wrangler d1 execute --json` + `cmp` + `curl` + Vitest 28 test | 4 |

---

## 12. Risiko dan mitigasi

| Risiko                                                                               | Dampak                                 | Mitigasi                                                                                                                |
| ------------------------------------------------------------------------------------ | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| CPU Workers Free 10 ms terlampaui oleh SSR                                           | Error 1102 / halaman gagal             | Cache/prerender; ukur di Fase 0 dan 11; fallback Workers Paid                                                           |
| Ukuran bundle melewati batas                                                         | Deploy gagal                           | Ukur di Fase 0; pangkas dependensi (Ponytail); fallback Paid                                                            |
| Access di-bypass (workers.dev, POST langsung ke action)                              | Konten diubah atau dihapus orang lain  | `assertAdmin()` di setiap action + `workers_dev: false` + test tiga jalur                                               |
| Data pribadi atau data klien bocor (daftar tamu wedding, NDA)                        | Masalah hukum atau reputasi            | Kurasi di Fase 2; case study tanpa data asli; screenshot disaring                                                       |
| Klaim atau metrik dikarang                                                           | Kepercayaan runtuh saat dicek          | Hanya angka bersumber (aturan 8 + Impeccable)                                                                           |
| Desain generik ("template admin")                                                    | Tidak berkesan                         | Ronde arah Impeccable + finish reviewer + steve-jobs gate                                                               |
| Over-engineering                                                                     | Lambat selesai, sulit dirawat          | Ponytail: hanya komponen dan fitur yang dipakai; opsi kecil selalu disebut                                              |
| Next.js 16 / OpenNext berubah cepat                                                  | Kode berdasarkan API lama              | Kunci versi; baca dokumentasi terpasang; Context7                                                                       |
| Sertifikat Dicoding kedaluwarsa Okt–Nov 2026                                         | Info usang                             | Status otomatis dari `expires_at`                                                                                       |
| Data LinkedIn usang (About)                                                          | Pesan tidak konsisten                  | Tulis ulang di Fase 2; perbarui LinkedIn di Fase 13                                                                     |
| Penyederhanaan di fase-fase akhir                                                    | Fase 9–13 dikerjakan setengah          | Cek ulang wajib di awal Fase 12                                                                                         |
| Seed ulang menimpa editan produksi                                                   | Konten hilang                          | Seed insert-only (Fase 4)                                                                                               |
| Sesi Access habis saat mengisi form                                                  | Isian hilang                           | Draft otomatis di `sessionStorage` + peringatan sebelum keluar (Fase 8)                                                 |
| Path manage bocor (repo publik, `_buildManifest.js`, file `.env*`, header `Referer`) | Area manage jadi target                | Segmen `[secret]` + secret runtime, guard di setiap halaman, Access, meta `no-referrer`, test grep hasil build (Fase 8) |
| Email dipanen bot                                                                    | Spam ke alias                          | Alamat tidak pernah utuh di HTML/payload; dirakit saat diklik (Fase 7)                                                  |
| OG dinamis / tema di cookie                                                          | CPU Worker melewati batas, cache rusak | OG statis + cover; tema lewat script `<head>` (Fase 6–7)                                                                |
| Kuota harian Workers Free habis                                                      | Situs mati sampai 07.00 WIB            | Notifikasi 80% + aturan rate limiting dan bot (Fase 10–11)                                                              |
| Deploy atau migrasi rusak                                                            | Situs mati / data tidak cocok          | Bookmark Time Travel + expand → contract + `wrangler rollback` teruji (Fase 4, 13)                                      |

---

## 13. Sumber

**Referensi desain:**
- https://anandasatriaa.github.io
- https://divyanshigupta.vercel.app
- https://taqi16-portfoilio.vercel.app
- https://component.gallery/components/

**Skill:**
- https://ponytail.dev
- https://github.com/multica-ai/andrej-karpathy-skills
- https://skills.wondel.ai/
- https://impeccable.style

**Stack dan tren Jepang:**
- @IT — State of JavaScript 2025: https://atmarkit.itmedia.co.jp/ait/articles/2603/11/news053.html
- @SOHO — TS × React × Next.js 2026: https://atsoho.com/blog/ts-react-nextjs-demand-2026
- mofmof — alternatif Next.js (Feb 2026): https://www.mof-mof.co.jp/tech-blog/2026/02/09/093215
- Qiita — framework React 2026: https://qiita.com/nogataka/items/c7c59e908be3a88dc1a8
- CodeZine/CAMELORS — ranking framework freelance: https://codezine.jp/news/detail/19385
- Cloudflare Blog JP — kisah Hono: https://blog.cloudflare.com/ja-jp/the-story-of-web-framework-hono-from-the-creator-of-hono

**Platform:**
- Next.js 16: https://nextjs.org/blog/next-16
- OpenNext Cloudflare: https://opennext.js.org/cloudflare
- Hono + Next.js: https://hono.dev/docs/getting-started/nextjs
- Batasan Workers: https://developers.cloudflare.com/workers/platform/limits/
- Batas free tier Cloudflare (Mei 2026): https://eastondev.com/blog/en/posts/dev/20260526-cloudflare-free-limits/
- Access one-time PIN: https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/
- Paket Zero Trust Free (2020, verifikasi ulang): https://blog.cloudflare.com/zero-trust-week-setting-up-cloudflare-one-as-a-small-business/
- Email Address Obfuscation: https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/
- Email Obfuscation dan performa: https://www.corewebvitals.io/pagespeed/say-goodbye-to-cloudflare-email-obfuscation
- Rate limiting rules: https://developers.cloudflare.com/waf/rate-limiting-rules/
- Workers pricing (kuota hanya untuk request yang sampai ke Worker; aset statis gratis): https://developers.cloudflare.com/workers/platform/pricing/
- Urutan fase WAF: https://developers.cloudflare.com/waf/feature-interoperability
- Traffic sequence (resmi): https://blog.cloudflare.com/traffic-sequence-which-product-runs-first/ dan https://developers.cloudflare.com/data-localization/regional-services/http-requests/
- Secret dan `keep_vars` di Wrangler: https://developers.cloudflare.com/workers/wrangler/configuration/
- Urutan WAF dan Workers (komunitas): https://community.cloudflare.com/t/workers-behavior-with-firewall-rules/109182 dan https://community.cloudflare.com/t/if-i-enable-rate-limiting-will-ddos-s-requests-be-charged-with-workers/528701

**Data pribadi:** LinkedIn `besarrahmat` (experience, education, skills, certifications, projects, languages), daftar 34 repo GitHub `besarrahmat` + README/manifest dari 25 di antaranya, kode repo `timetables`.
