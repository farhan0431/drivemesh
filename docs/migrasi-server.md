# Rencana migrasi instance yang sedang aktif

Rencana ini belum dijalankan. Server saat ini menjalankan frontend dan backend DriveMesh melalui PM2, Samba host untuk share `gdrive`, dan PostgreSQL dalam container Compose. Port 445, 5080, dan 5434 terikat pada semua antarmuka. Endpoint kredensial backend lama merespons tanpa sesi. Perubahan kode baru belum melindungi proses lama.

## Dampak

- Ada jeda akses web dan SMB selama pergantian. Koneksi dan transfer SMB yang sedang aktif akan terputus. Samba host juga memiliki konfigurasi printer bawaan; hentikan layanan host hanya setelah dampaknya disetujui.
- Data Google Drive tidak dihapus. Token dan share lama tidak dipindah otomatis: pengguna perlu membuat akun DriveMesh baru dan menghubungkan kembali akun Google mereka.
- Domain `drivemesh.farhan-dev.my.id` saat ini mengarah ke alamat publik server. Antarmuka server yang terdeteksi adalah `ens3` (`10.76.107.3`). Pengikatan SMB ke alamat tersebut dan penerusan NAT/firewall TCP 445 perlu diuji dari jaringan luar. Sebagian jaringan pengguna memblokir TCP 445.

## Urutan yang perlu disetujui sebelum deployment

1. Buat cadangan database yang dapat diverifikasi, file `.env`, konfigurasi Nginx, konfigurasi Samba host dan informasi proses PM2. Simpan cadangan dengan izin ketat; jangan memasukkan password ke log atau repo.
2. Pastikan profil `docker/apparmor/drivemesh-fuse.profile` telah dimuat dan akan dimuat ulang saat boot. Periksa `MASTER_KEY`, domain OAuth, sertifikat HTTPS dan nilai lingkungan. Siapkan password PostgreSQL acak baru, lalu rotasi password role dan `.env` secara terkoordinasi tanpa menampilkan nilainya.
3. Hentikan hanya proses PM2 DriveMesh dan Samba host setelah transfer berakhir; lepaskan mount lama secara aman. Jangan menghapus volume database atau membuang token lama tanpa cadangan. Pastikan port 445 dan 3080 bebas.
4. Atur `SMB_HOST` ke domain, `SMB_BIND_ADDRESS` ke alamat antarmuka yang dipilih, dan jalankan Compose dengan volume database lama yang telah dicadangkan serta volume Samba baru. Pastikan port 3080, 5080, dan 5434 hanya tersedia dari localhost. Konfirmasi reverse proxy HTTPS mengarah ke port yang benar.
5. Dengan dua akun DriveMesh dan minimal dua akun Google yang pemiliknya memberi izin, uji pendaftaran, login, penghubungan beberapa Drive, nama folder di Finder/Explorer, pembacaan dan penulisan yang didukung rclone, pembatasan silang, logout, pencabutan Drive dan pemulihan setelah restart. Uji SMB dari luar host dan konfirmasi enkripsi SMB serta lockout.
6. Jika verifikasi gagal, hentikan container baru, pulihkan konfigurasi dan kredensial dari cadangan, lalu hidupkan kembali layanan lama sesuai keputusan operator. Layanan lama memiliki risiko akses yang dijelaskan di atas; rollback bukan kondisi aman permanen.
