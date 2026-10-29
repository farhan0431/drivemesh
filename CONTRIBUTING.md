# Berkontribusi ke DriveMesh

Terima kasih telah membantu DriveMesh. Laporan bug, perbaikan dokumentasi, pengujian, dan perubahan kode semuanya diterima.

## Sebelum mulai

- Untuk perubahan besar, buka issue terlebih dahulu agar ruang lingkup dan desain dapat dibahas.
- Laporkan kerentanan secara privat sesuai [SECURITY.md](SECURITY.md); jangan sertakan token, password, file pengguna, atau informasi sensitif dalam issue publik.
- Gunakan lingkungan pengembangan dan akun Google pengujian sendiri. Jangan menjalankan pengujian terhadap database atau Drive produksi tanpa memahami dampaknya.

## Lingkungan pengembangan

Gunakan Node.js 22, npm, PostgreSQL, dan Docker Compose. Lihat [README](README.md) untuk pengaturan OAuth, FUSE, Samba, reverse proxy, serta batasan keamanan. Setelah clone:

```bash
npm ci
npm run build
```

Pengujian integrasi menggunakan database PostgreSQL khusus pengujian yang namanya mengandung `test`:

```bash
TEST_DATABASE_URL=postgresql://user:password@localhost:5432/drivemesh_test \
  npm run test:integration --workspace=@drivemesh/server
```

Pengujian tersebut memalsukan Google dan gateway Samba; perubahan yang menyentuh mount, izin, SMB, atau cache juga membutuhkan pengujian yang sesuai pada lingkungan Linux terisolasi dan perangkat klien.

## Mengirim perubahan

1. Fork repositori dan buat branch dari `main`.
2. Buat perubahan yang terfokus dan tambahkan atau perbarui pengujian bila diperlukan.
3. Jalankan build dan pengujian yang relevan. Perbarui dokumentasi jika perilaku, konfigurasi, privasi, atau migrasi berubah.
4. Buka pull request yang menjelaskan masalah, solusi, cara menguji, dan dampak kompatibilitas atau keamanan.

Pertahankan pemisahan antarakun. Tinjau dampak perubahan pada kredensial, token, izin file, cache yang belum terunggah, dan sesi yang aktif. Cache tulis dapat menyimpan konten file sementara di disk; jangan membuat klaim bahwa server tidak pernah menyimpan data pengguna.

Dengan mengirim kontribusi, Anda setuju kontribusi tersebut didistribusikan dengan [lisensi MIT proyek](LICENSE).
