# DriveMesh

DriveMesh menghubungkan satu atau lebih akun Google Drive ke share SMB pribadi untuk setiap akun DriveMesh. Pengguna mendaftar dengan username dan password, masuk ke dashboard, lalu memberi izin Google untuk setiap Drive yang ingin dihubungkan. Setelah masuk ke alamat server, pengguna memilih share `DriveMesh`; setiap Drive miliknya muncul sebagai folder bernama `Google Drive - Nama Akun`. Nama yang sama diberi nomor agar tetap berbeda. Share lama bernama username tetap tersedia sebagai alamat langsung tersembunyi untuk kompatibilitas. Finder, Windows Explorer, dan aplikasi Files menggunakan username serta password DriveMesh yang sama.

## Keamanan dan batas penggunaan

- Setiap akun mempunyai sesi web, akun sistem internal, direktori, dan mount rclone sendiri. Share `DriveMesh` memetakan setiap login ke direktori privatnya; direktori dan mount FUSE dibatasi dengan izin pemilik dan `default_permissions`. Akun Google yang sama tidak dapat dihubungkan ke dua akun DriveMesh sekaligus.
- OAuth menggunakan state, PKCE, sesi yang mengawali koneksi, dan ID token Google yang diverifikasi. Refresh token dienkripsi dengan `MASTER_KEY`; rclone membutuhkan salinan token di berkas yang hanya dapat dibaca root selama mount aktif. Data dan metadata juga dapat berada di memori atau cache sistem; jangan menganggap sistem sepenuhnya tanpa penyimpanan.
- SMB mewajibkan SMB3 dan enkripsi. Server web membatasi percobaan login, dan Samba mengunci akun sementara setelah lima kegagalan. Gunakan password unik minimal 6 karakter. Username dan password web juga merupakan kredensial SMB.
- SMB dapat diakses langsung melalui domain pada port TCP 445. Karena port ini akan menerima percobaan login dari internet, gunakan password unik yang kuat, pantau log, perbarui Samba, dan batasi alamat sumber dengan firewall jika memungkinkan. Beberapa ISP dan jaringan memblokir port 445; domain harus mengarah langsung ke server karena proxy HTTP biasa tidak meneruskan SMB. HTTPS harus diterminasi oleh reverse proxy tepercaya yang menambahkan alamat klien ke `X-Forwarded-For`; Compose mengatur `TRUST_PROXY=1` dan backend hanya diterbitkan ke localhost. Aplikasi tidak menyediakan TLS atau sertifikat secara otomatis.
- Operasikan hanya satu instance server per database dan volume Samba; penguncian perubahan share saat ini berlaku dalam satu proses, bukan lintas instance.
- Mode cache rclone `writes` memakai volume lokal persisten yang hanya dapat diakses root, terpisah untuk tiap koneksi Drive. File yang ditulis dapat tersimpan di disk tanpa enkripsi hingga selesai diunggah dan cache dibersihkan. Unggahan berlangsung di latar belakang; penutupan file di SMB tidak menjamin file sudah tersimpan di Google Drive. Pantau ruang disk; batas cache 4 GiB adalah target pembersihan, bukan batas keras untuk file yang sedang dipakai atau belum terunggah.
- Server menjalankan Samba dan mount FUSE sebagai root, dengan `SYS_ADMIN` dan akses `/dev/fuse`. Jalankan pada host khusus yang terisolasi, tetap perbarui dependensi, dan cadangkan database serta volume Samba. Isolasi aplikasi bukan pengganti isolasi host atau audit keamanan independen.
- Profil AppArmor bawaan Docker di beberapa host menolak FUSE meskipun `SYS_ADMIN` dan `/dev/fuse` tersedia. Compose menggunakan profil `drivemesh-fuse` yang hanya mengizinkan mount FUSE pada `/mnt/drivemesh/users/*/*/`; profil harus dimuat di host sebelum container dimulai. Profil ini terikat pada jalur mount bawaan dan tidak mendukung `MOUNT_POINT` lain tanpa perubahan kebijakan. Jangan menonaktifkan AppArmor secara global.
- Tidak ada fitur pemulihan password saat ini. Simpan password dengan aman. Google Drive dapat diputuskan dari dashboard; jika pencabutan token ke Google gagal, tinjau izin aplikasi di akun Google Anda.

## Menjalankan

1. Siapkan Docker Compose dan `/dev/fuse`. Tinjau `docker/apparmor/drivemesh-fuse.profile`, lalu muat profil dengan `sudo apparmor_parser -r docker/apparmor/drivemesh-fuse.profile` pada host yang memakai AppArmor. Atur agar profil dimuat kembali saat host dimulai ulang. Siapkan reverse proxy HTTPS yang meneruskan seluruh permintaan ke frontend pada port 3080.
2. Salin `.env.example` ke `.env`. Isi `DOMAIN` (host web tanpa skema), `SMB_HOST` (host perangkat tanpa port), `POSTGRES_PASSWORD`, `MASTER_KEY` yang acak dan unik, `GOOGLE_CLIENT_ID`, dan `GOOGLE_CLIENT_SECRET`. Atur `SMB_BIND_ADDRESS` ke alamat IP antarmuka server yang menerima koneksi domain; nilai default hanya dapat diakses dari host. Pastikan firewall dan NAT meneruskan TCP 445 ke antarmuka tersebut.
3. Aktifkan Google Drive API dan konfigurasikan OAuth consent serta redirect URI `https://<DOMAIN>/api/auth/google/callback` pada Google Cloud. Cantumkan URL publik `/privacy` dan `/terms` pada konfigurasi OAuth sesuai ketentuan Google. Untuk aplikasi Google yang masih dalam mode pengujian, tambahkan akun yang diizinkan sebagai test users.
4. Jalankan `docker compose up -d --build`. Buka `https://<DOMAIN>`, buat akun, kemudian hubungkan satu atau beberapa Google Drive dari dashboard. Gunakan alamat server di dashboard dan kredensial akun yang sama pada perangkat. Pilih share `DriveMesh`; untuk Map Network Drive di Windows gunakan alamat lengkap `\\<SMB_HOST>\DriveMesh`.

Volume `drivemesh-pgdata` menyimpan akun, sesi, dan token terenkripsi; volume `drivemesh-samba` menyimpan database password Samba. Cadangkan keduanya bersama `MASTER_KEY`. Mengganti atau kehilangan `MASTER_KEY` membuat token lama tidak dapat didekripsi; sambungkan kembali Drive setelah migrasi yang direncanakan.

## Upgrade dari versi share tunggal

Versi sebelumnya menyimpan satu token dan satu share global. Data lama **tidak diimpor otomatis** karena pemilik dan isolasinya tidak dapat dipastikan. Hentikan instance lama dan nonaktifkan share Samba lama sebelum menggunakan versi ini. Cadangkan database dan konfigurasi terlebih dahulu, buat akun baru, lalu hubungkan kembali Google Drive masing-masing. Pastikan port 445 tidak masih dilayani konfigurasi Samba lama.

## Pengembangan

Monorepo terdiri dari `packages/client` (Nuxt), `packages/server` (Express), dan `packages/shared`. Jalankan `npm install` dan `npm run build` untuk membangun semua paket. Pada pengembangan lokal, atur `NODE_ENV=development`, `DOMAIN=localhost:3080`, `SMB_HOST=localhost`, database, dan kredensial Google sendiri. Pengujian SMB/FUSE membutuhkan Linux dan hak yang sesuai; unit atau build saja tidak membuktikan isolasi file.

Pengujian integrasi API menggunakan database PostgreSQL **khusus pengujian** (nama database harus mengandung `test`):

```bash
TEST_DATABASE_URL=postgresql://user:password@localhost:5432/drivemesh_test npm run test:integration --workspace=@drivemesh/server
```

Pengujian ini memakai respons Google dan gateway Samba tiruan. Uji pula dengan dua akun Google nyata, FUSE, dan perangkat SMB sebelum mengoperasikan layanan.
