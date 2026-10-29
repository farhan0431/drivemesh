<div align="center">
  <img src="packages/client/public/brand/drivemesh-logo.png" alt="Logo DriveMesh" width="112">
  <h1>DriveMesh</h1>
  <p>Hubungkan beberapa Google Drive ke satu share SMB pribadi.</p>
  <p><a href="https://drivemesh.farhan-dev.my.id/">Coba DriveMesh</a> · <a href="LICENSE">Lisensi MIT</a> · <a href="CONTRIBUTING.md">Kontribusi</a> · <a href="SECURITY.md">Keamanan</a> · <a href="CHANGELOG.md">Changelog</a></p>
</div>

DriveMesh adalah aplikasi self-hosted yang menghubungkan Google Drive ke Windows File Explorer, macOS Finder, dan aplikasi lain yang mendukung SMB3. Setiap pengguna membuat akun DriveMesh, menghubungkan satu atau beberapa akun Google, lalu masuk ke share `DriveMesh` menggunakan kredensial akun tersebut. Drive yang terhubung ditampilkan sebagai folder terpisah.

> **Status proyek:** Periksa keamanan, kompatibilitas, dan pemulihan data di lingkungan Anda sebelum menggunakannya untuk file penting. Proyek ini belum menjalani audit keamanan independen.

## Fitur

- Akun dan sesi web terpisah, dengan dashboard berbahasa Indonesia dan Inggris.
- Beberapa koneksi Google Drive per akun; tiap Drive ditampilkan sebagai folder yang mudah dikenali.
- Share SMB3 terenkripsi dengan direktori dan mount yang terpisah untuk setiap akun DriveMesh.
- OAuth Google dengan state dan PKCE; token pembaruan disimpan terenkripsi di database.
- Panduan koneksi untuk Windows, macOS, dan iOS, serta halaman Privacy Policy dan Terms of Service.

## Cara kerja

```text
Windows / macOS / iOS ── SMB3 terenkripsi ──> DriveMesh ── HTTPS ──> Google Drive
Browser                ── HTTPS ────────────> DriveMesh dashboard
```

Samba menangani login SMB; rclone memasang setiap Google Drive sebagai filesystem FUSE; Express menangani akun dan OAuth; PostgreSQL menyimpan data akun dan koneksi; Nuxt menyediakan antarmuka web. Sambungan ke DriveMesh menggunakan kredensial DriveMesh, bukan password Google.

**Penyimpanan dan batasan:** File yang sedang dibuat atau diubah dapat disimpan sementara dalam cache tulis persisten di disk server. Cache tidak dienkripsi oleh DriveMesh dan hanya dapat diakses oleh proses yang memiliki hak server. Penulisan di SMB dapat selesai sebelum unggahan latar belakang ke Google Drive selesai. Pantau ruang disk dan pastikan file telah sampai di Google Drive, terutama sebelum restart, pemutusan Drive, atau operasi pada file penting. Google Drive dan SMB tidak memiliki perilaku filesystem yang identik.

## Prasyarat

- Server Linux dengan Docker, Docker Compose, dan `/dev/fuse`.
- Akses administratif untuk memuat profil AppArmor yang disediakan pada host yang menggunakannya.
- Domain untuk web dan SMB, reverse proxy HTTPS dengan sertifikat, serta penerusan TCP 445 untuk SMB. Reverse proxy HTTP biasa tidak meneruskan SMB; sebagian ISP dan jaringan memblokir TCP 445.
- Proyek Google Cloud dengan Google Drive API aktif dan OAuth client jenis **Web application**. Untuk aplikasi dalam mode pengujian, tambahkan akun Google yang akan digunakan sebagai test users.

### Instalasi

1. Clone repositori dan siapkan konfigurasi:

   ```bash
   git clone https://github.com/farhan0431/drivemesh.git
   cd drivemesh
   cp .env.example .env
   ```

2. Edit `.env` dan isi `DOMAIN`, `SMB_HOST`, `SMB_BIND_ADDRESS`, `POSTGRES_PASSWORD`, `MASTER_KEY`, `GOOGLE_CLIENT_ID`, dan `GOOGLE_CLIENT_SECRET`. `DOMAIN` adalah host web tanpa skema; `SMB_HOST` adalah host SMB tanpa port. `SMB_BIND_ADDRESS` default `127.0.0.1` hanya menerima koneksi lokal: gunakan IP antarmuka server yang sesuai untuk akses dari perangkat lain. Gunakan rahasia unik; `MASTER_KEY` harus setidaknya 32 karakter dan dijaga tetap sama agar token lama dapat didekripsi. Jangan commit `.env`.

3. Di Google Cloud, daftarkan redirect URI berikut sesuai domain web Anda:

   ```text
   https://<DOMAIN>/api/auth/google/callback
   ```

   Konfigurasikan OAuth consent screen, homepage publik, Privacy Policy (`/privacy`), dan Terms of Service (`/terms`) sesuai penggunaan dan persyaratan Google. Penggunaan scope Google Drive dapat memerlukan verifikasi Google. Anda bertanggung jawab mengganti informasi operator pada halaman hukum untuk deployment Anda sendiri.

4. Pada host dengan AppArmor, tinjau dan muat profil berikut, serta pastikan profil dimuat kembali saat boot:

   ```bash
   sudo apparmor_parser -r docker/apparmor/drivemesh-fuse.profile
   ```

   Profil ini membatasi mount FUSE ke jalur bawaan `/mnt/drivemesh/users/*/*/`. Penggunaan jalur mount lain memerlukan penyesuaian profil.

5. Konfigurasikan reverse proxy HTTPS ke `127.0.0.1:3080`, lalu jalankan layanan:

   ```bash
   docker compose up -d --build
   docker compose ps
   ```

   Compose hanya menerbitkan frontend, API, dan PostgreSQL ke localhost; SMB diterbitkan pada alamat `SMB_BIND_ADDRESS`. Konfigurasi produksi mempercayai satu reverse proxy (`TRUST_PROXY=1`), yang harus meneruskan alamat klien dengan benar. Batasi akses firewall sesuai kebutuhan.

6. Buka `https://<DOMAIN>`, buat akun, dan hubungkan Google Drive dari dashboard. Gunakan username dan password DriveMesh untuk masuk dari perangkat:

   - Windows: buka `\\<SMB_HOST>` dan pilih `DriveMesh`, atau gunakan `\\<SMB_HOST>\DriveMesh` untuk Map Network Drive.
   - macOS: di Finder pilih **Go → Connect to Server**, lalu masukkan `smb://<SMB_HOST>/DriveMesh`.
   - iOS: di Files pilih **Connect to Server** dan masukkan alamat SMB yang ditampilkan dashboard.

Direktori awal share adalah daftar Drive yang terhubung. Buat folder dan simpan file **di dalam** folder Google Drive yang dipilih.

## Operasi dan keamanan

- Share `DriveMesh` memetakan pengguna ke direktori masing-masing. Akun Google yang sama tidak dapat dihubungkan ke dua akun DriveMesh sekaligus. Share lama berdasarkan username masih tersedia tetapi tidak ditampilkan dalam daftar share.
- SMB3 dan enkripsi diwajibkan. Password web yang sama digunakan untuk SMB; persyaratan minimum aplikasi adalah enam karakter, tetapi gunakan password yang lebih panjang, kuat, dan unik. Batasi alamat sumber TCP 445 dengan firewall jika memungkinkan dan pantau log.
- Refresh token Google dienkripsi dengan `MASTER_KEY`; saat mount aktif, rclone memerlukan token dalam konfigurasi lokal yang hanya dapat dibaca root. Konten cache tulis di disk tidak dienkripsi oleh DriveMesh. Metadata, log, memori, swap, dan cadangan juga dapat menyimpan data.
- Jalankan satu instance server untuk setiap database dan volume Samba. Container server menjalankan Samba dan FUSE sebagai root dengan `SYS_ADMIN` dan `/dev/fuse`; gunakan host terisolasi dan perbarui dependensi.
- Volume `drivemesh-pgdata` menyimpan akun dan token terenkripsi; `drivemesh-samba` menyimpan data autentikasi Samba; `drivemesh-write-cache` menyimpan cache tulis, termasuk file yang mungkin belum berhasil diunggah. Cadangkan sesuai kebutuhan beserta `MASTER_KEY` dan lindungi aksesnya. Batas cache 4 GiB per Drive adalah target pembersihan, bukan batas keras untuk file aktif atau yang belum terunggah.
- Pemulihan password mandiri dan penghapusan akun mandiri belum tersedia. Koneksi Google dapat diputus melalui dashboard; jika pencabutan token gagal, cabut akses dari pengaturan keamanan akun Google.

Lihat [SECURITY.md](SECURITY.md) untuk pelaporan kerentanan dan [panduan migrasi](docs/migrasi-server.md) untuk upgrade dari konfigurasi share lama.

## Pengembangan dan pengujian

Repositori ini menggunakan npm workspaces: `packages/client` (Nuxt 4), `packages/server` (Express dan TypeScript), serta `packages/shared` (tipe bersama). Dockerfile menggunakan Node.js 22.

```bash
npm ci
npm run build
```

Pengujian integrasi membutuhkan PostgreSQL **khusus pengujian**; nama database wajib mengandung `test`. Jangan gunakan database produksi.

```bash
TEST_DATABASE_URL=postgresql://user:password@localhost:5432/drivemesh_test \
  npm run test:integration --workspace=@drivemesh/server
```

Pengujian ini menggunakan respons Google dan gateway Samba tiruan. Pengujian SMB/FUSE dengan akun dan perangkat nyata tetap diperlukan untuk memvalidasi deployment. Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk alur kontribusi.

## Lisensi

DriveMesh tersedia berdasarkan [MIT License](LICENSE). Nama dan merek pihak ketiga merupakan milik pemiliknya masing-masing.
