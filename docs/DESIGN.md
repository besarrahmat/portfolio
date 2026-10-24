# Design — catatan keputusan dan audit

> Dibuat di Fase 3 (`docs/PLAN.md`). File ini adalah **catatan keputusan dan audit** (wondelai + Impeccable). Sistem desain final ditulis impeccable-documenter ke `DESIGN.md` di root pada Fase 12, dari hasil build; untuk token dan komponen, root yang menang (§4.3).
>
> Artefak Fase 3: direction contract di `.impeccable/surfaces/src-app-page-tsx.md` · draf token `docs/design/tokens.css` · sketsa `docs/design/overview-sketch.html` (buka lewat server statis, mis. `python3 -m http.server -d docs/design`, lalu `?theme=light|dark`) · kartu ronde keputusan di `.impeccable/mocks/decision/`.

## 1. Design Direction

**Dunia terpilih: The Meishi Exchange (名刺).** Dipilih Rahmat lewat decision page Impeccable (24 Okt 2026), kartu THE ROLL, jalur code-led (tidak ada image generation). Seed `seed:80a40aaf8476870a`, posisi 5 dari 7 kandidat.

**Tesis.** Situs memperkenalkan Rahmat seperti rapat bisnis Jepang dimulai: satu kartu nama diserahkan menghadap pembaca, dan sisi belakangnya adalah sistem yang menyajikan situs itu. Yang ditolak: hero dashboard di atas deretan kartu KPI.

**Bagaimana dunia ini mengisi topologi admin panel (yang mengikat):**

| Bagian admin panel   | Bentuk di dunia meishi                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| Latar halaman        | Meja rapat: 鼠 abu kebiruan (terang) / 藍 indigo (gelap)                                                  |
| Header Overview      | Satu meishi 91:55 menghadap pengunjung: nama, profesi, afiliasi (*Software Engineer, Global Collabo Tech*), lokasi; Download CV ada **di kartu** (depan dan belakang) |
| Record (proyek, dll.)| Kartu yang **tergeletak rata** di meja (`--shadow-flat` + garis tipis) dengan nomor seri `No. 001`; meishi melayang (`--shadow-float`). Tiga tingkat: meja → record → meishi |
| Tabel                | Tetap tabel; ID dan tanggal pakai huruf fixed-pitch supaya kolom sejajar                                  |
| Badge status         | Teks; hanya **Live** yang memakai 朱                                                                       |
| Fokus/hover record   | Kartu terangkat (bayangan lift), kartu lain diredam ke ink-3 (tanpa opacity, tetap AA)                    |
| Download CV di luar kartu | Dock CV muncul hanya saat kartu keluar viewport: di HP di bawah layar (jangkauan jempol), di desktop di topbar. Satu aksi primer per viewport |

**Ronde keputusan** (decision page, `.impeccable/mocks/decision/`): THE ROLL = Meishi Exchange; IMPECCABLE'S PICK = Basic Design Document (基本設計書, kandidat #1, paling akrab tetapi juga paling sering jadi pilihan default); challenger kompetitif = Event Display (collider); lima challenger ditolak dan masing-masing menyumbang satu disiplin (*raise*):

| Donor                  | Disiplin yang dipinjam                                                     |
| ---------------------- | -------------------------------------------------------------------------- |
| Daylight Section       | Setiap tanggal adalah cap tabular persis (`YYYY-MM`) di satu garis dasar   |
| Chromatophore Skin     | Satu warna sinyal, hanya untuk aksi hidup tunggal dan status Live          |
| Type Specimen          | Hierarki lewat kontras skala saja; tanpa kotak/ikon dekoratif             |
| Four-Shade Field       | Palet tertutup; warna kelima butuh tugas yang jelas                        |
| Title-Card Wall        | Fokus mengangkat satu kartu dan meredupkan sisanya                          |

**Jawaban wawancara shape (✅ Rahmat, 24 Okt 2026):** adegan fisik campur sehingga tema mengikuti perangkat dan kedua tema sama kuat · animasi hemat + 1 signature · scroll native · anti-goal: terlihat seperti template shadcn, terlalu artsy sampai sulit dipindai.

## 2. Pola wajib dari riset §3 (struktur, bukan gaya)

1. **CV di paling atas**: Download CV di meishi Overview; di halaman lain di topbar. Satu aksi primer per viewport.
2. **Indeks/penomoran**: nomor seri `No. 001` per record = ID baris tabel = urutan di URL/admin. Bukan nomor section dekoratif.
3. **Diagram arsitektur per proyek**: dirender dari data (HTML/SVG), bukan screenshot. Sisi belakang meishi adalah diagram situs ini sendiri.
4. **Filter kategori**: segmented control All/Work/Personal di Projects (Fase 7); di mobile jadi daftar kartu.
5. **Timeline bertanggal persis**: Experience sebagai log dengan cap `YYYY-MM` tabular dan durasi dihitung.

## 3. Signature moment dan motion (top-design)

- **Signature moment:** "Turn the card over" (atau mengklik frasa *architecture diagram* di one-liner) memutar meishi sekali dalam 3D (`rotateY(180deg)`, 640 ms, `cubic-bezier(0.65, 0, 0.35, 1)`); sisi belakang menampilkan *This card is served by*: Browser → Worker (Cloudflare · Next.js 16 · Hono) → D1 + R2, dirender dari data. Sisi depan tetap berfungsi penuh tanpa pernah dibalik, dan sisi belakang juga memuat Download CV (flip tidak boleh mematikan konversi). Dengan `prefers-reduced-motion`, rotasi diganti crossfade 160 ms. Tombol memakai `aria-pressed`; sisi yang tersembunyi diberi `inert` + `aria-hidden`; fokus pindah ke judul sisi yang tampil. Di HP diagram disusun vertikal.
- **Easing:** `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` untuk umpan balik/UI, `--ease-flip` untuk flip. `ease`/`linear` tidak dipakai. Durasi: 120 ms umpan balik, 200 ms UI, 640 ms flip.
- **Custom cursor:** tidak (opt-in, tidak diminta).
- **Smooth scroll:** native (keputusan Rahmat). Saran top-design soal Lenis sengaja tidak diikuti: PRODUCT.md melarang membajak scroll.
- **Kontras skala:** top-design meminta display:body ≥ 10:1. Di dunia ini kontras dibawa oleh **objek** (kartu 560 px di desktop) dengan nama 52 px vs teks 12–17 px (≈ 3–4:1 untuk tipe). Display raksasa ditolak sejak §3.3 (memotong konten di layar kecil).

**Skor rubrik top-design awal (sketsa): ≈ 7,0/10**

| Kategori (bobot)        | Skor | Alasan                                                                                   |
| ----------------------- | ---- | ---------------------------------------------------------------------------------------- |
| Typography (25%)        | 7    | Huruf dokumen bisnis Jepang di skala kartu; kontras lewat objek, bukan display raksasa   |
| Composition (25%)       | 7    | Kartu asimetris + teks di meja; deretan tiga kartu proyek masih seragam                 |
| Motion (20%)            | 6    | Satu flip yang bercerita; tanpa koreografi load (sengaja hemat)                          |
| Color (15%)             | 8    | Triad 鼠/藍/朱 yang dimiliki dunia ini; satu sinyal                                       |
| Details (15%)           | 7    | `::selection`, focus ring, caret, `accent-color` bertema; state belum lengkap (Fase 5–7) |

Menuju 10: komposisi "di atas meja" yang lebih berani untuk kartu proyek (tidak tiga sama besar), koreografi masuk yang hemat (kartu diserahkan sekali saat load, tanpa animasi di tempat lain), state kosong/error/loading yang dirancang (Fase 5–7).

## 4. Typography (web-typography)

| Peran         | Huruf                                                     | Alasan                                                                                                   |
| ------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Kata (`--font-text`) | **BIZ UDPGothic** 400/700 (Morisawa, OFL)          | Huruf dokumen bisnis Jepang (UD = universal design); glyph JP dengan desain yang sama untuk versi JA      |
| Angka/ID/tanggal (`--font-figure`) | **BIZ UDGothic** 400/700 (fixed-pitch Latin) | **BIZ UDPGothic tidak punya fitur `tnum`** (diukur: lebar "1111" 100,8 px vs "0000" 121,6 px, sama dengan atau tanpa `tabular-nums`); BIZ UDGothic 80/80 px |

- **Payload:** slice latin keempat file = **75.968 byte (≈ 74 KB)**, diukur dari Google Fonts 24 Okt 2026 → di bawah 200 KB. Di app di-self-host lewat `next/font/local` (`src/app/fonts/`, empat slice latin yang sama + `OFL.txt`; Fase 5). `next/font/google` ditolak karena mengunduh ±500 slice JP setiap build. Karakter Jepang memakai Gothic sistem dari rantai fallback sampai slice JP ditambahkan untuk versi JA.
- **Cakupan glyph (diuji dengan teks nyata):** nama lengkap, em dash, kutip melengkung, elipsis, huruf beraksen (é ñ ü), dan teks Jepang (名刺設計書ベサール) ada di kedua font. **"→" tidak ada di BIZ UDPGothic** (U+2192 tidak di slice latin): panah wajib SVG.
- **Fallback eksplisit:** `"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic UI", "Yu Gothic", Meiryo, "Noto Sans JP", "Noto Sans CJK JP", system-ui, sans-serif`.
- **Fixed-pitch hanya untuk kolom yang harus sejajar** (tabel, tanggal, ID di tabel). Di teks bebas ("v1.0.1", "No. 001" di kartu) memakai font teks; fixed-pitch membuat titik bercelah lebar.
- **Skala fluid** (390 → 1440 px, `clamp()` dengan bagian rem agar zoom 200% tetap bekerja): xs 12 · sm 14 · base 16→17 · lg 18→20 · xl 20→24 · 2xl 24→32 · 3xl 30→44 · name 28→52. Tidak ada teks di bawah 12 px.
- Line-height: 1,1 (nama) · 1,2 (heading) · 1,4 (UI) · 1,6 (body). Measure `65ch`. Tracking nama −0,01em; label +0,08em.
- **Diagnostik web-typography: 9/10.** Gagal/tidak teruji: measure 65ch belum diuji dengan prosa panjang (sketsa tidak punya paragraf panjang; diuji di detail proyek Fase 7).
- ❓ Glyph JP saat JA: font yang sama, slice JP; belum dijadwalkan.

## 5. Tokens (refactoring-ui)

Sumber token sejak Fase 5: `src/app/globals.css` (`@theme static` dengan palet tertutup, `@theme inline` untuk peran semantik). `docs/design/tokens.css` tetap sebagai draf Fase 3 yang dipakai sketsa.

- **Palet 9 tingkat:** 鼠 nezumi (netral kebiruan, 50–900), 藍 ai (indigo, 50–900), 朱 shu (vermilion, 50–900). Abu-abu bernada biru; tidak ada `#000`/`#fff` selain teks di atas sinyal.
- **Strategi warna:** Committed. Meja (latar) memegang sebagian besar permukaan; kartu di atasnya; satu sinyal.
- **Peran semantik:**

| Token          | Terang                   | Gelap                     | Tugas                                   |
| -------------- | ------------------------ | ------------------------- | --------------------------------------- |
| `--table`      | nezumi-200 `#D6DDE4`     | ai-900 `#131B30`          | latar halaman                            |
| `--stock`      | `#F6F7F5`                | ai-800 `#1B2744`          | kartu dan sheet                          |
| `--meishi`     | `#F6F7F5`                | `#F6F7F5` (tetap)         | kartu nama Overview (objek, bukan tema)  |
| `--ink`        | nezumi-900 `#16191E`     | ai-50 `#EEF2FA`           | teks utama                               |
| `--ink-2`      | nezumi-700 `#3A4350`     | ai-200 `#B0C0E2`          | teks sekunder                            |
| `--ink-3`      | nezumi-600 `#4F5A68`     | ai-300 `#8299C9`          | label, meta, kartu yang diredupkan       |
| `--signal`     | shu-600 `#BE3620`        | shu-600 `#BE3620`         | isi tombol Download CV (teks putih)      |
| `--signal-text`| shu-700 `#9A2A19` (Fase 5) | shu-300 `#EC8A6F`       | label Live (5,63:1 di meja, 7,19:1 di stock) |
| `--danger-text`| shu-700                  | shu-300                   | pesan error form (tugas kedua 朱)          |
| `--line-strong`| nezumi-500 `#6A7685`     | ai-400 `#5873AC`          | border kontrol (3:1)                     |
| `--focus`      | ai-500 `#3C568F`         | ai-200 `#B0C0E2`          | focus ring                               |

- Di tema gelap, teks sekunder diwarnai dari hue indigo (bukan abu-abu): ditemukan oleh hook Impeccable (`gray-on-color`) lalu diperbaiki.
- **Meishi kebal tema:** `.meishi` memasang `--focus: --meishi-focus` (ai-500), `--line-strong: --meishi-line` (nezumi-500), `--rule: --meishi-rule`. Tanpa ini cincin fokus gelap di atas kartu hanya **1,70:1** (temuan critique, diverifikasi); dengan scope **6,69:1**, garis node 4,30:1.
- **Bayangan:** `--shadow-flat` (record di meja) · `--shadow-card` · `--shadow-lift` (hover/fokus) · `--shadow-float` (meishi, dock, menu).
- **Kontras WCAG AA:** diuji dengan skrip (`contrast.mjs`, rumus WCAG 2.x dengan self-check 21:1), **semua lolos**:

| Pasangan (terang)              | Rasio | Pasangan (gelap)                | Rasio |
| ------------------------------ | ----- | ------------------------------- | ----- |
| ink / stock                    | 16,39 | ink / stock                     | 13,18 |
| ink-2 / stock                  | 9,31  | ink-2 / stock                   | 8,09  |
| ink-3 / stock                  | 6,53  | ink-3 / stock                   | 5,17  |
| ink / table                    | 12,86 | ink / table                     | 15,25 |
| ink-2 / table                  | 7,30  | ink-2 / table                   | 9,36  |
| ink-3 / table                  | 5,12  | ink-3 / table                   | 5,99  |
| putih / signal                 | 5,62  | meishi-ink / meishi             | 16,39 |
| signal vs table (UI ≥ 3)       | 4,10  | signal vs table (UI ≥ 3)        | 3,05  |
| live text / stock (shu-700)    | 7,19  | live text / stock               | 5,94  |
| line-strong / stock (UI)       | 4,30  | line-strong / stock (UI)        | 3,14  |
| focus / stock · table (UI)     | 6,69 · 5,25 | focus / stock · table (UI) | 8,09 · 9,36 |

  Dua kegagalan di draf pertama (ink-3 terang di atas meja 4,25; putih di atas shu-500 4,30) diperbaiki dengan menggeser ink satu tingkat dan memakai shu-600 untuk isi tombol. Peredupan kartu awalnya `opacity: 0.55` dan menjatuhkan kontras di bawah AA, jadi diganti bayangan rata + ink-3.
- **Spasi:** hanya 4/8/16/24/32/48/64. Pengecualian yang disengaja: padding meishi dalam persen (`clamp(16px, 4.2%, 32px)` × `clamp(16px, 5.4%, 40px)`) karena margin kartu nama ikut skala kartunya; tinggi kontrol 44 px (target sentuh) dan topbar 52/56 px.
- **Bentuk:** radius kartu 3 px, kontrol 2 px, tanpa pill. Rasio kartu 91:55.
- **Bayangan:** `--shadow-card` (diam), `--shadow-lift` (fokus/hover), `--shadow-float` (menu, ⌘K); semuanya offset + blur lembut, versi gelap lebih pekat.
- **Permukaan browser:** `::selection` ai-200, `:focus-visible` 2 px ai, `caret-color`, `accent-color` diberi tema.
- **Diagnostik refactoring-ui: 8/8 → 10/10.** Blur dan grayscale lolos (dicek dengan `filter: grayscale(1)`: nama, tombol CV, dan one-liner tetap paling menonjol); label diredam; spasi di skala (setelah reset padding bawaan `button`); lebar teks dibatasi; kontras AA; bayangan sesuai elevasi.

## 6. Sketsa (first viewport)

`docs/design/overview-sketch.html` (responsif; dicek di 390 × 844 dan 1440 × 900, terang dan gelap, kartu depan/belakang, hover kartu proyek). Overflow horizontal: tidak ada di 320 px maupun 720 px (setara zoom 200% di 1440). Teks semuanya dari seed (`content/seed/*.json`), tanpa lorem ipsum.

- **390 px:** topbar 52 px (menu, OVERVIEW, cari) → meishi selebar layar dikurangi gutter 16 px (nama dua baris, *Full-stack web developer*, afiliasi + lokasi, LinkedIn ↗, Download CV · PDF); kartu boleh sedikit lebih tinggi dari 91:55 bila isinya butuh → "Turn the card over" → one-liner → ledger 3 kolom (4 yrs 6 mo · 6 · v1.0.1) → "On the table" dengan kartu SOBAT-PS (bukti Sinatra) **di dalam first viewport**. Record di HP tidak memakai rasio 91:55 supaya ringkas.
- **1440 px:** sidebar 240 px ("Rahmat", navigasi dengan *Design system* menggantikan *Components*, tema System/Light/Dark) → topbar dengan pencarian ⌘K → meishi ≈ 560 px di kiri, one-liner + ledger di kanan → tiga kartu proyek 91:55 di bawah, semuanya terlihat dalam 900 px.
- KPI tampil sebagai **ledger 3 kolom bergaris** dengan cap fixed-pitch di atas label kecil, bukan blok angka besar (craft-floor menolak template hero-metric). Pengalaman ditulis **"4 yrs 6 mo"** dari `experienceMonths` (✅ Rahmat). Profesi dan afiliasi ada **di bawah** nama (eyebrow di atas heading dilarang).
- One-liner versi tenang (✅ Rahmat): "Every private system here comes with its architecture diagram."; frasa *architecture diagram* adalah pemicu kedua untuk membalik kartu.
- Pencarian: di HP hanya ikon 44 px dengan label teks tersembunyi; `⌘K` hanya tampil di `pointer: fine`; nama aksesibel = label yang terlihat (WCAG 2.5.3).
- Duplikasi yang **sengaja dibiarkan**: tagline PolicySemVer (copy seed Fase 2) menyebut v1.0.1, sama dengan ledger yang diwajibkan page brief. Mengubahnya berarti mengubah copy yang sudah disetujui.

## 7. Critique (gerbang Fase 3)

Dijalankan dual-agent (A: review desain, B: detector + overlay browser), snapshot `.impeccable/critique/2026-10-24T10-10-47Z__docs-design-overview-sketch-html.md`.

**Skor awal: 22/32 (69%, Good), heuristik 7 dan 10 n/a.** Kesimpulan spesifisitas: dibuat khusus untuk produk ini (≈ 70% halaman hidup di dunia meishi); kelemahannya bagian di bawah kartu tergelincir ke pola hero → baris statistik → grid kartu, dan tema terang lebih datar dari gelap. Detector: 1 temuan (`tight-leading` pada one-liner); overlay browser bersih di kedua tema.

**Semua temuan diperbaiki (✅ Rahmat memilih "semua, termasuk minor"):**

| Sev | Temuan                                                        | Perbaikan                                                                                   |
| --- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| P1  | Kartu yang dibalik menghilangkan Download CV                  | CV di footer sisi belakang + dock CV saat kartu keluar viewport                             |
| P1  | Cincin fokus gelap di meishi 1,70:1                           | Token di-scope ke `.meishi` → 6,69:1                                                        |
| P2  | Ledger proporsional, terbungkus, "6 on the table", "54 months" | Grid 3 kolom fixed-pitch; "6 featured systems"; "4 yrs 6 mo"; "All 6 projects"            |
| P2  | Tema terang lebih lemah                                       | Record rata (`--shadow-flat` + garis), meishi `--shadow-float`                              |
| P2  | Bukti SOBAT-PS di bawah fold di HP                            | Record HP tanpa rasio 91:55; one-liner `text-xl` di HP                                      |
| —   | `tight-leading` one-liner                                     | line-height 1,3                                                                             |
| min | Headline 14 px, tanpa afiliasi                                | Profesi `text-lg`; baris afiliasi GCT                                                       |
| min | Dua "No. 001"                                                 | Serial di meishi dihapus                                                                     |
| min | Label pencarian ≠ nama aksesibel, 36 px, ⌘K di HP              | Label terlihat = nama; 44 px di HP; ⌘K hanya `pointer: fine`                                |
| min | Ikon putar terbaca "reload"; bukti jauh dari klaim            | Ikon kartu + panah; *architecture diagram* jadi pemicu kedua                                 |
| min | Urutan pembaca layar setelah flip                             | Fokus pindah ke h2 sisi belakang (atau h1 saat kembali)                                      |
| min | Diagram 3 kolom sesak di 390 px                               | Susunan vertikal di HP                                                                       |
| min | Nama ganda di desktop; "Components" tidak jelas               | Sidebar "Rahmat"; label "Design system" (rute tetap `/components`)                          |
| min | Format CV tidak disebut; LinkedIn tanpa tanda eksternal        | "Download CV · PDF"; ikon eksternal + teks tersembunyi                                       |
| min | Rotasi ikon tetap jalan di reduced motion                     | Dimatikan                                                                                    |

**Verifikasi setelah perbaikan:** detector `[]` (exit 0). Satu `cramped-padding` pada `.face` di-ignore dengan alasan: padding `clamp(16px, 4.2%, 32px)` terukur 16 px di kartu 288 px, dan pemindaian statis tidak bisa menghitung clamp berbasis persen. Ignore disimpan di `.impeccable/config.json`, khusus untuk file ini. Di browser: fokus CV di meishi gelap memakai `#3C568F`, fokus di luar kartu `#B0C0E2`; tidak ada overflow di 320 px; dock CV muncul setelah scroll; flip lewat frasa memindahkan fokus ke "This card is served by". Critique ulang (skor baru) dijalankan saat build Fase 5–7.

## 8. Modul komponen (Fase 5)

48 komponen ✔ dari `docs/PLAN.md` §9 di `src/components/ui/`, dipamerkan di `/components` ("Design system"). Primitif interaktif dari **Base UI 1.9.0** tanpa gaya bawaan; semua gaya dari token di satu `ui.css`.

**Keputusan anatomi yang mengikat build berikutnya:**

- **Satu aksi primer per section** = tombol `primary` sumi (isi ink, teks stock). 朱 bukan varian Button: hanya File (Download CV), badge Live, dan teks error.
- **Disabled** tetap AA: teks ink-3 + garis putus-putus, bukan opacity. Disabled + tercentang tetap terlihat (isi ink-3).
- **Target sentuh:** `--control-h` 44 px di pointer kasar, 36 px di pointer halus (baris menu/tab/tabel desktop tetap padat). Field form selalu 44 px dengan teks ≥ 16 px. Link yang berdiri sendiri (bukan di dalam kalimat) ikut `--control-h`.
- **Record** = Card rata di meja (`--shadow-flat`) dengan serial `No. 001`; hover/fokus mengangkat satu kartu dan meredupkan yang lain ke ink-3 (`.ui-card-spread`).
- **Tanggal** = cap `YYYY-MM` fixed-pitch (`time`, `.figure`); Progress indicator adalah log bertanggal dengan durasi dari `formatDuration` ("4 yrs 6 mo").
- **Signature:** File siap → mengunduh (isian shu-800 mengikuti byte nyata) → selesai (centang "dicap" 200 ms) → siap lagi. Reduced motion: tanpa gerak, teks tetap berganti. Forced colors: isian memakai `Highlight`.
- **Popup** (menu, popover, select, combobox) memakai `--shadow-float` seperti meishi; tooltip dan toast terbalik (isi ink). Modal hanya untuk tugas yang butuh fokus terlindungi (preview import, konfirmasi arsip).
- **Ikon** satu set buatan sendiri (24 px, stroke 1,75) di `icon.tsx`; panah selalu SVG.

**Audit Impeccable (`/components`, 24 Okt 2026): 18/20, Excellent.**

| # | Dimensi | Skor | Temuan utama |
| - | ------- | ---- | ------------ |
| 1 | Accessibility | 3 | axe 0 pelanggaran serius di terang/gelap/forced-colors setelah hidrasi; nama Base UI (`aria-labelledby`) baru ada setelah hidrasi |
| 2 | Performance | 3 | gambar lazy, animasi transform/opacity, tanpa `will-change`; ukuran bundle Base UI belum diukur (Fase 11) |
| 3 | Theming | 4 | semua warna dari token; dua bayangan hard-coded di tombol CV diganti token |
| 4 | Responsive | 4 | tanpa scroll horizontal di 320/640 px; target sentuh diukur di emulasi Pixel 7 |
| 5 | Implementation integrity | 4 | detector `[]`; dunia meishi konsisten (serial, cap tanggal, satu sinyal) |

Diperbaiki selama audit: Live di atas meja 4,10:1 → shu-700; tombol primary di forced-colors (`ButtonText`/`ButtonFace`); bottom nav meluap di 320 px; link "Reference" dan tombol hapus chip di bawah 44 px; paragraf "straggler" (`text-wrap: pretty`); checkbox/switch disabled + tercentang kehilangan tanda; label demo dan field form tidak sejajar.

**Belum diuji:** Windows High Contrast dan Safari iOS sungguhan (hanya emulasi Chromium), keyboard virtual di perangkat nyata (Fase 8).
