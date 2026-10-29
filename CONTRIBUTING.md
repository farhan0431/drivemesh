# Panduan Kontribusi DriveMesh

Terima kasih atas minat Anda untuk berkontribusi pada **DriveMesh**! Proyek ini bersifat sumber terbuka (*open-source*), dan kami menyambut kontribusi perbaikan *bug*, penambahan fitur, peningkatan keamanan, maupun dokumentasi.

---

## 🛠️ Standar Arsitektur Kode

1. **Backend (Express.js):**
   * Mengikuti pola **MVC & Service Pattern**:
     * `controllers/`: Hanya menangani *request/response* HTTP dan validasi dasar.
     * `services/`: Berisi logika bisnis (Google Drive API, Rclone FUSE streaming, Samba).
     * `models/`: Berisi akses data dan query PostgreSQL.
     * `utils/`: Fungsi kriptografi (AES-256-GCM, scrypt) dan format data.
   * **Jangan menumpuk banyak logika dalam 1 file.** Jaga agar setiap modul tetap ramping, modular, dan memiliki tanggung jawab tunggal (*Single Responsibility Principle*).

2. **Frontend (Nuxt 3):**
   * Mengikuti arsitektur **Component & Composable Driven**:
     * `components/`: Komponen UI modular terisolasi (misal: `GoogleAuthCard.vue`, `DeviceTabs.vue`).
     * `composables/`: Logika reaktif dan panggilan API (misal: `useGoogleAuth.ts`, `useCredentials.ts`).
     * `pages/index.vue`: Hanya bertindak sebagai orkestrator yang menyusun komponen-komponen utama.
   * **Anti-AI Slop:** Hindari desain generik dengan gradien ungu/pink berlebihan, kartu melayang tanpa fungsi (*glassmorphism* tebal), atau metrik palsu. Utamakan estetika *utilitarian*, berpresisi tinggi, dan performa instan (<150ms).

3. **Prinsip Utama Penyimpanan:**
   * **Zero Local File Storage:** DriveMesh tidak pernah menyimpan file pengguna di hardisk server lokal. Setiap fitur baru yang membaca berkas cloud wajib menerapkan pola *stateless streaming pass-through*.

---

## 🚀 Alur Kerja Kontribusi

1. *Fork* repositori ini ke akun GitHub Anda.
2. Buat *branch* fitur baru:
   ```bash
   git checkout -b feature/nama-fitur-anda
   ```
3. Lakukan perubahan dengan commit yang jelas:
   ```bash
   git commit -m "feat(auth): tambahkan integrasi passkey WebAuthn"
   ```
4. *Push* ke branch Anda:
   ```bash
   git push origin feature/nama-fitur-anda
   ```
5. Buka **Pull Request (PR)** dengan penjelasan perubahan yang telah Anda uji.
