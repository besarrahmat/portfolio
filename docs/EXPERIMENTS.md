# Experiments

> Dibuat di Fase 7 (`docs/PLAN.md`). A/B test tidak dipakai (trafik terlalu kecil, §4.3); yang dipakai adalah **5-second test** dengan 3–5 orang. Hasil diisi Rahmat sebelum Fase 12.

## 5-second test: first viewport Overview

**Tujuan:** dalam 5 detik, pengunjung bisa menjawab *siapa ini, apa keahliannya, apa yang harus diklik*. Gagal bila ≥ 2 dari 5 orang tidak bisa menjawab salah satunya.

**Peserta:** 3–5 orang, idealnya developer atau orang yang pernah menilai kandidat. Bukan orang yang sudah melihat situs ini.

**Persiapan**
1. Buka `https://portfolio.besarrahmat.workers.dev/` (setelah Fase 7 dideploy) di HP peserta, atau HP kamu dengan tema mengikuti perangkat.
2. Jangan scroll. Sembunyikan layar sampai peserta siap.

**Skrip (baca apa adanya)**
> "Saya akan menunjukkan sebuah halaman selama lima detik, lalu menutupnya dan menanyakan beberapa hal. Tidak ada jawaban salah; yang diuji halamannya, bukan kamu."

Tunjukkan layar **tepat 5 detik**, tutup, lalu tanyakan berurutan tanpa petunjuk:
1. Halaman ini milik siapa?
2. Apa pekerjaan atau keahliannya?
3. Kalau kamu sedang mencari kandidat, apa yang akan kamu klik pertama?
4. Ada yang membingungkan atau menarik perhatian?

**Lembar jawaban**

| # | Peserta (peran) | Tanggal | 1. Siapa | 2. Keahlian | 3. Klik pertama | 4. Catatan | Lolos (1–3 benar) |
| - | --------------- | ------- | -------- | ----------- | --------------- | ---------- | ----------------- |
| 1 |                 |         |          |             |                 |            |                   |
| 2 |                 |         |          |             |                 |            |                   |
| 3 |                 |         |          |             |                 |            |                   |
| 4 |                 |         |          |             |                 |            |                   |
| 5 |                 |         |          |             |                 |            |                   |

**Jawaban yang dianggap benar:** (1) Besar Rachmat / Rahmat; (2) full-stack / web developer (Laravel, PHP, Next.js juga benar); (3) Download CV, atau membuka proyek.

**Setelah tes:** catat ringkasan + keputusan (ubah apa, atau tidak ada perubahan) di `docs/PLAN.md` §11.3 dan tandai langkah 5-second test di Fase 7 sebagai `[x]`.
