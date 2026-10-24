# Website

> Dibuat di Fase 2 (`docs/PLAN.md`). Berisi kurasi konten §8, sitemap, dan page brief. Copy final ada di `content/seed/*.json` dan `docs/POSITIONING.md`; desain diputuskan di Fase 3. Audiens: tech lead / hiring manager perusahaan software terkait Jepang (`PRODUCT.md`). Satu tujuan konversi: **Download CV**.

## Kurasi §8 (✅ jawaban Rahmat 24 Okt 2026)

Status: **tampil** = masuk seed dengan `status: published` · **draft** = masuk seed tetapi tidak tampil · **sembunyi** = tidak masuk seed sama sekali · **butuh input** = menunggu data dari Rahmat.

### Profil, pendidikan, sertifikasi

| Item                                      | Status          | Catatan                                                                                         |
| ----------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------- |
| Nama, short name, alternate name          | tampil          | §11.1                                                                                           |
| Headline                                  | tampil          | "Full-stack web developer" (LinkedIn: "Web Developer \| Software Engineer")                    |
| Lokasi                                    | tampil          | ✅ "Cikarang, West Java, Indonesia" (lokasi sekarang; LinkedIn masih Malang, perbarui di Fase 13). Hanya kota, tanpa alamat |
| About                                     | tampil          | Ditulis ulang (`docs/POSITIONING.md`); `{experience_years}` dirender dari `experienceMonths`    |
| Foto profil                               | tampil          | ✅ `content/media/avatar.jpg` (800×800, tanpa metadata GPS/kamera; asli 2000×2000 disimpan Rahmat). Diunggah ke R2 sebagai `profile/avatar.jpg` saat seed (Fase 4/8) |
| Email kontak                              | butuh input     | Alias khusus portofolio, diisi lewat manage (Fase 7/8). Seed sengaja `null`                     |
| Bahasa (ID native, EN limited working)    | tampil          | Kemampuan bahasa Jepang tidak diklaim                                                           |
| Status ketersediaan                       | draft           | `null`; tampil hanya bila diisi dari manage                                                     |
| Universitas Brawijaya + IPK 3,52          | tampil          | ✅ IPK tampil; bulan lulus Jul 2023 dikonfirmasi Rahmat                                          |
| SMA Negeri 1 Tumpang                      | sembunyi        | ✅ tidak masuk seed                                                                              |
| 10 sertifikasi                            | tampil          | ✅ yang kedaluwarsa diberi badge "Expired" otomatis dari `expires_at`                            |

### Pengalaman

| Item                         | Status | Catatan                                                                                       |
| ---------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| Global Collabo Tech          | tampil | ✅ detail umum, tanpa nama klien; highlight dari Rahmat (melanjutkan pekerjaan MINORI; memimpin freelancer dan anak magang untuk proyek AI internal per departemen). Stack: Next.js, PHP |
| PT MINORI                    | tampil | Highlight dari Rahmat. Stack: Laravel, CodeIgniter, Next.js, PHP                                |
| PT HTSI                      | tampil | Highlight dari LinkedIn                                                                       |
| Dinas Kehutanan Kaltara      | tampil | Highlight dari LinkedIn; terhubung ke proyek SOBAT-PS                                          |

**Main stack (✅ Rahmat, 24 Okt 2026): Laravel, CodeIgniter, PHP, Next.js.** Stack per peran di Experience, About, CV, dan ringkasan stack di Overview hanya menyebut keempatnya (`skills.main`). Teknologi lain dipelajari dalam setahun terakhir: tetap tercantum di stack proyek yang benar-benar memakainya, tetapi tidak diklaim sebagai main stack. WordPress/Brizy (HTSI) dan Bootstrap (SOBAT-PS) disebut di teks highlight, bukan sebagai tag stack peran.

### Proyek (§8.4)

| #   | Proyek                           | Status        | Catatan                                                                                                     |
| --- | -------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------- |
| 1   | timetables                       | tampil ⭐     | ✅ state In progress; tanpa link. Case study jujur bahwa shell v2 memakai template Studio Admin (open source) |
| 2   | nikke-calculator                 | tampil ⭐     | ✅ state In progress; link live 404 (24 Okt) jadi tidak dicantumkan                                          |
| 3   | wedding                          | tampil ⭐     | ✅ case study tanpa link live, tanpa nama tamu/pasangan, tanpa screenshot                                     |
| 4   | policy-semver                    | tampil ⭐     | Link repo, Marketplace, npm (semua publik)                                                                   |
| 5   | SOBAT-PS (3 repo)                | tampil ⭐     | ✅ bukti Sinatra test; link live + repo publik `sobatps`; 2 repo privat tanpa URL                             |
| 6   | portfolio                        | tampil ⭐     | Metrik diisi dari angka nyata di Fase 12                                                                     |
| 7   | money-tracker-scrapped           | sembunyi      | ✅ tidak dipilih                                                                                             |
| 8   | ecommerce-laravel                | sembunyi      | README default, tanpa deskripsi                                                                              |
| 9   | mthrill-web                      | sembunyi      | README default, arsip                                                                                        |
| 10  | minori-test                      | sembunyi      | Tes rekrutmen                                                                                                |
| 11  | Learning log                     | sembunyi      | ✅ tidak dipilih                                                                                             |
| —   | forget_commit_existing_repo      | sembunyi      | Repo kosong (tanpa README, tanpa bahasa)                                                                     |
| —   | Web Profile PT-HTSI (tanpa repo) | tampil        | ✅ tanpa link: `pt-htsi.com` live, tetapi sekarang Astro 7 yang dibangun ulang orang lain (dicek 24 Okt 2026), bukan situs WordPress + Brizy buatan Rahmat |
| —   | Proyek di MINORI / GCT           | sembunyi      | ✅ NDA: hanya peran di Experience                                                                            |

**Urutan unggulan (✅ Rahmat):** SOBAT-PS (Sinatra) → PolicySemVer → Wedding → NIKKE → Timetables → Portfolio.

### Koreksi terhadap §8 (hasil cek sumber 24 Okt 2026)

- `policy-semver`: rilis terakhir **v1.0.1** (2 Sep 2026), bukan v1.0.0.
- nikke-calculator: situs live sekarang 404.
- timetables v2 dibangun di atas template open-source Studio Admin; v1 (SvelteKit) yang lengkap fiturnya.
- SOBAT-PS masih live di `sobat-ps.kaltaraprov.go.id`.

## Sitemap

Mengikuti `docs/PLAN.md` §7 tanpa perubahan: `/` Overview · `/projects` · `/projects/[slug]` · `/experience` · `/skills` · `/education` · `/contact` · `/components` · `/api/v1/*` · `/<MANAGE_PATH>/*`. Topbar setiap halaman memuat tombol **Download CV**.

## Page briefs

Struktur visual diputuskan di Fase 3; brief ini hanya mengikat isi dan urutan prioritas.

| Halaman              | Pertanyaan pengunjung yang dijawab                     | Isi (urut prioritas)                                                                                                                                                                        | CTA                                    |
| -------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Overview `/`         | "Layak diwawancara?" dalam 5 detik                    | Nama + headline + afiliasi (GCT) + one-liner #1 versi tenang · bukti Sinatra (SOBAT-PS still live) · KPI nyata: tahun pengalaman (dihitung), jumlah proyek unggulan, rilis PolicySemVer · 3 proyek unggulan · activity log singkat · ringkasan main stack (4 skill) | Download CV · View projects            |
| Projects `/projects` | "Apa saja yang pernah ia kirim?"                      | Tabel (#ID, nama, jenis, stack, periode, state). Filter jenis. Badge "Private repo" untuk link privat                                                                                       | Buka detail                            |
| Detail proyek        | "Bagaimana ia berpikir?"                              | Tagline · masalah → peran → keputusan → hasil · diagram dari `architecture` · metrik bersumber (bagian disembunyikan bila kosong) · links                                                   | Download CV · LinkedIn                 |
| Experience           | "Di mana dan berapa lama?"                            | Timeline per peran, tanggal `YYYY-MM`, durasi dihitung, highlight bila ada                                                                                                                 | Download CV                            |
| Skills               | "Stack-nya cocok dengan tim kami?"                    | **Main stack** (4 skill) di atas, lalu teknologi lain per kategori sebagai "Used in projects"; masing-masing "used in N projects" dari `project_skills`; tanpa level/bintang                                                                                                             | Lihat proyek terkait                   |
| Education            | "Latar formal?"                                       | Universitas Brawijaya + IPK · sertifikasi dengan badge Expired                                                                                                                             | —                                      |
| Contact              | "Bagaimana menghubungi?"                              | CV → LinkedIn → email (dirakit saat diklik)                                                                                                                                                | Download CV                            |

**Pesan per halaman:** tidak ada kalimat pembuka "I/We"; setiap angka punya sumber di `docs/POSITIONING.md` § Fakta bersumber.

## Catatan untuk Fase 4 (model data)

Seed menambah atau mengubah beberapa hal dari draf §6.4:
- `experiences.skills` (daftar id skill), karena Experience menampilkan stack per peran.
- `projects.case_study` (`problem`, `role`, `decisions[]`, `outcome`), karena §6.4 belum punya tempat untuk copy case study.
- `profile.tagline` dan `profile.languages`.
- `skills.main` (boolean): main stack yang boleh diklaim di Experience, About, CV, dan Overview.
- `skills.first_used` / `last_used` **tidak** disimpan: dihitung dari periode proyek lewat `project_skills`.
- `links[].url` tidak ada untuk link `private` (dijaga test `src/lib/seed.test.ts`).
- Pengalaman di Overview ditampilkan sebagai **"N yrs M mo"** dari `experienceMonths` (Fase 3); perlu formatter + test di Fase 4/7.

## CV

Draf teks di `content/cv.md`, dari seed yang sama. Rahmat mengekspor ke PDF dengan nama file "Besar Rachmat Ikhsan Pambudi - CV.pdf". Lima sertifikat Dicoding kedaluwarsa Okt–Nov 2026: perbarui baris sertifikasi di CV sebelum dikirim.
