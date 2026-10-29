# Changelog

Perubahan penting proyek dicatat di sini. Bagian **Unreleased** mencatat perubahan yang belum ditandai sebagai rilis; nomor dan tanggal rilis akan ditambahkan ketika versi diterbitkan.

## Unreleased

### Documentation

- Added third-party license notices for rclone, Samba, application dependencies, and externally loaded fonts.

No other changes are recorded.

## 0.0.1 — 2026-10-29

### Ditambahkan

- Akun DriveMesh dengan sesi web dan login SMB, serta dukungan beberapa Google Drive per akun.
- Landing page, dashboard, halaman login dan pendaftaran, pemilih bahasa Indonesia/Inggris, serta Privacy Policy dan Terms of Service.
- Logo dan favicon DriveMesh, panduan perangkat, serta nama folder Drive yang lebih mudah dibaca.
- Pengujian nama folder dan isolasi akun, termasuk pemeriksaan OAuth dan kepemilikan Drive dengan layanan tiruan.

### Diubah

- Share utama menjadi `DriveMesh`; share berdasarkan username tetap tersedia secara tersembunyi untuk kompatibilitas.
- Mount menggunakan cache tulis persisten agar operasi baca-tulis dan perubahan posisi file lebih kompatibel dengan klien SMB. Unggahan ke Google Drive berlangsung di latar belakang.
- Dokumentasi instalasi, keamanan, kontribusi, dan migrasi diperbarui sesuai arsitektur multiakun.

### Keamanan

- Pemisahan sesi, identitas sistem, direktori, dan mount berdasarkan akun; autentikasi OAuth menggunakan state dan PKCE.
- Token pembaruan Google disimpan terenkripsi; SMB3 dengan enkripsi diwajibkan. Cache tulis lokal tidak dienkripsi oleh DriveMesh.
- Pembatasan percobaan login dan profil AppArmor untuk jalur mount FUSE bawaan.

### Migrasi

- Data dari konfigurasi share tunggal lama tidak diimpor secara otomatis. Lihat [panduan migrasi](docs/migrasi-server.md).
