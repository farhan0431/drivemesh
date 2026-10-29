# Migrasi dari versi share tunggal

Panduan ini berlaku untuk operator yang masih menggunakan konfigurasi DriveMesh lama dengan satu token dan satu share global. **Data lama tidak diimpor otomatis:** kepemilikan dan isolasi data tidak dapat dipastikan. Versi multiakun memerlukan akun DriveMesh baru dan penghubungan ulang masing-masing akun Google.

## Sebelum migrasi

1. Jadwalkan jeda layanan. Koneksi SMB dan transfer yang sedang berlangsung akan terputus; pastikan transfer dan unggahan ke Google Drive sudah selesai.
2. Buat dan verifikasi cadangan database, konfigurasi lingkungan, konfigurasi Samba dan reverse proxy, serta informasi proses yang diperlukan untuk pemulihan. Lindungi cadangan karena dapat berisi kredensial atau token.
3. Siapkan konfigurasi OAuth, domain, HTTPS, TCP 445, `MASTER_KEY`, dan profil AppArmor sesuai [README](../README.md#instalasi). Pastikan profil AppArmor akan dimuat saat boot.

## Migrasi dan verifikasi

1. Hentikan proses DriveMesh lama dan share Samba lama secara terkoordinasi. Pastikan tidak ada layanan lama yang masih mendengarkan pada port yang diperlukan.
2. Konfigurasikan dan jalankan versi multiakun sesuai [petunjuk instalasi](../README.md#instalasi). Jangan menjalankan dua instance server terhadap database dan volume Samba yang sama.
3. Buat akun DriveMesh, hubungkan ulang Google Drive yang dimiliki masing-masing pengguna, lalu uji login dan share `DriveMesh` dari perangkat pengguna.
4. Uji pembuatan folder, unggahan, pembacaan, restart, dan pemisahan akses dengan akun yang berbeda. Pastikan file yang diuji benar-benar muncul di Google Drive dan tinjau status cache sebelum menghentikan layanan.
5. Jika migrasi gagal, gunakan cadangan dan rencana pemulihan yang telah diverifikasi. Tinjau risiko konfigurasi lama sebelum mengaktifkannya kembali.

Menghubungkan atau memutus Drive dari DriveMesh tidak dimaksudkan untuk menghapus file asli di Google Drive. Namun, perubahan atau penghapusan file yang dilakukan melalui share dapat memengaruhi Drive tersebut.
