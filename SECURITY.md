# Kebijakan keamanan

## Melaporkan kerentanan

Jangan membuka issue publik untuk kerentanan yang dapat mengekspos akun, token, atau data pengguna. Kirim laporan secara privat ke **fhanfarhann@gmail.com** dengan subjek `DriveMesh security report`. Jika tersedia pada repositori, Anda juga dapat menggunakan fitur pelaporan kerentanan privat GitHub.

Sertakan versi atau commit, deskripsi dampak, langkah reproduksi yang aman, dan konfigurasi yang relevan. Jangan kirim password, token, salinan data pengguna, atau file sensitif. Hindari menguji pada instance milik orang lain tanpa izin.

Belum ada kebijakan dukungan versi, jaminan waktu respons, atau jadwal perbaikan yang ditetapkan. Hingga versi dukungan diumumkan, gunakan commit terbaru yang telah Anda tinjau dan pantau perubahan keamanan proyek.

## Batasan deployment

DriveMesh memproses isi file di server dan menggunakan cache tulis persisten yang tidak dienkripsi oleh aplikasi. Token aktif juga diperlukan oleh rclone di konfigurasi lokal yang dibatasi untuk root. SMB3 terenkripsi dan HTTPS melindungi koneksi saat transit, tetapi bukan enkripsi end-to-end terhadap operator server.

Publikasi TCP 445 ke internet meningkatkan permukaan serangan. Gunakan password kuat dan unik, batasi sumber dengan firewall jika memungkinkan, perbarui host dan Samba, serta jalankan layanan pada host yang terisolasi. Server memerlukan hak tinggi untuk Samba dan FUSE. Lihat [README](README.md#operasi-dan-keamanan) untuk detail operasional dan cadangan.
