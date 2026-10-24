# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router) + Hono 4 + Cloudflare D1 (Drizzle) + R2, dideploy ke Cloudflare Workers (Paid) via OpenNext. Sudah diputuskan dan berjalan sejak Fase 0 (`docs/PLAN.md` §5.2).

## Users

**Pengguna utama:** tech lead atau hiring manager di perusahaan software yang terkait Jepang (di Indonesia atau di Jepang) yang sedang menilai kandidat full-stack/web developer. Situasinya: membuka link portofolio dari LinkedIn, profil GitHub, atau CV, sering di HP di sela pekerjaan, dan ingin memutuskan dalam beberapa menit apakah kandidat layak diwawancara. Tugasnya: menilai apakah kandidat bisa merancang dan mengirim sistem produksi, bukan hanya mengikuti tutorial.

Audiens lain (recruiter/HR, hiring manager remote global, klien freelance) tidak dilayani secara khusus. Mereka tetap bisa memakai situs, tetapi keputusan konten dan copy berpihak ke pengguna utama.

**Pemilik (pengguna area manage):** Rahmat, yang mengelola konten lewat area input manual di path rahasia (di balik Cloudflare Access), terutama dari HP.

## Product Purpose

Portofolio pribadi Besar Rachmat Ikhsan Pambudi yang tampil seperti **admin panel publik tanpa login** (sidebar, topbar, tabel data, kartu KPI, halaman detail record, command palette). Tujuannya: pengunjung utama **mengunduh CV** setelah melihat bukti kerja yang bisa dicek. Sukses = CV diunduh, lalu (sekunder) kunjungan ke LinkedIn atau kontak email.

## Positioning

"The only portfolio that is itself the proof: an admin panel on the stack Japanese teams ship (Next.js 16 + Hono + D1 on Workers), with an architecture diagram for every private system."

Kalimat di atas adalah positioning internal. **Bila dimunculkan di frontend, daftar tech stack dalam kurung dihapus** (✅ Rahmat, 24 Okt 2026): "The only portfolio that is itself the proof: an admin panel on the stack Japanese teams ship, with an architecture diagram for every private system." Stack ditunjukkan lewat halaman proyek `portfolio`, bukan di kalimat ini.

Mekanismenya bisa dicek pengunjung: situs ini sendiri adalah sistem produksi (D1, API publik read-only, area manage terproteksi) dan termasuk proyek unggulan. Proyek privat yang tidak bisa diberi link kode dijelaskan lewat diagram arsitektur yang dirender dari data, bukan screenshot.

## Operating Context

- Pengunjung datang dari LinkedIn, profil GitHub `besarrahmat`, atau link di CV. Situs adalah tujuan, bukan saluran akuisisi.
- Penilaian dilakukan cepat dan sering di HP; desain **mobile-first**, tetap kaya di desktop.
- Pengunjung terbiasa dengan pola alat kerja (tabel, filter, breadcrumb, ⌘K); bentuk admin panel memakai kebiasaan itu.
- Pengalaman kerja Rahmat yang relevan untuk audiens: Software Engineer di Global Collabo Tech (Jan 2026–sekarang), anak perusahaan PT MINORI; sebelumnya Full Stack Web Developer di PT MINORI (Des 2023–Jan 2026). PT MINORI bekerja sama dengan dan memiliki banyak klien dari Jepang. Detail pekerjaan dan nama klien tidak ditampilkan (diputuskan di Fase 2).

## Capabilities and Constraints

- Halaman publik: Overview, Projects (tabel + detail per slug), Experience, Skills, Education, Contact, Components (`docs/PLAN.md` §7).
- Satu aksi primer: **Download CV** (satu CV bahasa Inggris di `/cv`). Urutan CTA: CV → LinkedIn → email. Email adalah alias khusus portofolio yang dirakit di browser saat diklik dan tidak pernah utuh di HTML.
- Status ketersediaan ("Open to …") tampil **hanya bila memang terbuka**, diatur dari area manage.
- Bahasa: **EN saat launch, JA sebagai bahasa kedua yang sudah pasti** (belum dijadwalkan). Struktur data dan teks harus siap i18n; font yang dipilih harus punya glyph Jepang atau fallback yang teruji.
- Konten dikelola di D1 lewat area manage (pola `timetables`); seed hanya untuk DB kosong.
- Proyek privat tampil **tanpa URL repo**.
- Belum diputuskan: detail NDA per pekerjaan, proyek privat mana yang tampil, IPK/SMA, sertifikat kedaluwarsa, foto profil (semuanya Fase 2).

## Brand Commitments

- Nama: "Besar Rachmat Ikhsan Pambudi" di header, SEO, dan nama file CV; "Rahmat" di teks singkat; "Besar Rahmat" sebagai `alternateName`.
- Bentuk admin panel adalah permintaan pemilik dan **mengikat**. Dunia visual di dalamnya belum ditentukan (Fase 3).

## Evidence on Hand

- `policy-semver`: GitHub Action + CLI npm v1.0.0, terbit di GitHub Marketplace (repo publik).
- SOBAT-PS: sistem informasi untuk Dinas Kehutanan Prov. Kalimantan Utara (kontrak, PKL, skripsi; 3 repo).
- `timetables`, `nikke-calculator` (3 layanan berbagi 1 database), dan repo `portfolio` ini sebagai proyek unggulan (privat kecuali `portfolio`).
- 10 sertifikasi (Google, Coding Studio, Dicoding), S1 Teknologi Informasi Universitas Brawijaya.
- Situs live: `https://portfolio.besarrahmat.workers.dev`.
- **Tidak ada:** testimoni, logo klien, metrik produksi bersumber, screenshot proyek privat. Semua itu tidak boleh dikarang. Metrik repo `portfolio` diisi dari angka nyata di Fase 12.

## Product Principles

1. **Bukti di atas klaim.** Setiap angka dan klaim punya sumber yang bisa dicek. Bila tidak ada sumber, bagiannya disembunyikan.
2. **Situs adalah demonstrasinya.** Arsitektur, kecepatan, dan kerapian situs ini sendiri adalah bagian dari portofolio.
3. **Satu tujuan.** Setiap halaman mengarah ke Download CV; tidak ada CTA yang bersaing.
4. **Hormati privasi dan NDA.** Pekerjaan privat dijelaskan lewat peran, keputusan, dan diagram, tanpa link kode, nama klien, atau data pribadi.
5. **Siap untuk pembaca Jepang.** Konten dan struktur tidak boleh menghalangi versi JA nanti.

## Accessibility & Inclusion

WCAG 2.2 AA: kontras teks 4,5:1 (teks besar dan elemen UI 3:1) di tema terang dan gelap, navigasi keyboard penuh (termasuk ⌘K dan tabel), skip link, aman di zoom 200%, dan tidak membajak scroll.
