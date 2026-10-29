# DriveMesh

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Nuxt 3](https://img.shields.io/badge/Nuxt-3-00DC82.svg)](https://nuxt.com)
[![Express](https://img.shields.io/badge/Express-4.21-white.svg)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791.svg)](https://www.postgresql.org)
[![Security: AES-256-GCM](https://img.shields.io/badge/Security-AES--256--GCM-emerald.svg)]()
[![SMB 3.1.1 Encrypted](https://img.shields.io/badge/Wire%20Encryption-SMB%203.1.1-green.svg)]()

> **Stateless Streaming Gateway** yang menjembatani **Google Drive** langsung ke sistem berkas jaringan bawaan perangkat (**Windows Explorer**, **macOS Finder**, dan **iPhone Files**) secara transparan, berkinerja tinggi, dan aman secara maksimal tanpa menyimpan file di server (*Zero Local Storage*).

---

## 🌟 Fitur Utama

- ⚡ **Zero Local Storage (Murni Stateless Streaming):** Server tidak menyimpan file pengguna di hardisk lokal. Data dialirkan langsung (*pass-through pipe*) dari Google Drive ke perangkat Anda.
- 📱 **Kompatibilitas Penuh Tanpa Install Aplikasi:**
  - **iPhone / iPad:** Buka aplikasi *Files* &rarr; *Connect to Server* (`smb://drivemesh.farhan-dev.my.id`).
  - **macOS:** Buka *Finder* &rarr; `Cmd + K` &rarr; `smb://drivemesh.farhan-dev.my.id/gdrive`.
  - **Windows:** Buka *File Explorer* &rarr; *Map network drive* &rarr; `\\drivemesh.farhan-dev.my.id\gdrive`.
- 🔐 **Keamanan Berlapis (Enterprise-Grade Security):**
  - **SMB 3.1.1 Wire Encryption** mencegah penyadapan data pada jaringan Wi-Fi/LAN.
  - Token Google OAuth2 disimpan terenkripsi dengan **AES-256-GCM**.
  - Password jaringan di-hash menggunakan algoritma memory-hard **scrypt / Argon2id**.
  - Sertifikat SSL **Let's Encrypt TLS 1.3** otomatis via Certbot.
- 🐘 **PostgreSQL & Docker Ready:** Database terisolasi menggunakan PostgreSQL 17 dengan deployment 1-klik via Docker Compose.
- 🎯 **Arsitektur Rapi & Bersih (Anti-AI Slop):**
  - Backend: Express.js dengan arsitektur **MVC murni** (`controllers`, `services`, `models`, `routes`).
  - Frontend: Nuxt 3 dengan **component & composables modular** berkecepatan tinggi.

---

## 🏗️ Struktur Arsitektur Monorepo

```
drivemesh/
├── docker/
│   ├── Dockerfile.server       # Container Express.js + rclone + Samba
│   └── Dockerfile.client       # Container Nuxt 3 SSR
├── docker-compose.yml          # Orkestrasi PostgreSQL + Server + Client
├── packages/
│   ├── client/                 # Nuxt 3 Web Portal (Port 3080)
│   │   ├── components/         # Modular UI Components (Auth, Devices, UI)
│   │   ├── composables/        # State & Business Logic Composables
│   │   ├── layouts/            # Layout Default
│   │   └── pages/index.vue     # Clean Orchestrator Page
│   ├── server/                 # Express.js Core Gateway (Port 5080)
│   │   ├── src/
│   │   │   ├── controllers/    # Request handlers (Auth, Credentials, Status)
│   │   │   ├── services/       # Business logic (Google Drive, Mount, Samba)
│   │   │   ├── models/         # PostgreSQL Data Access Models
│   │   │   ├── routes/         # Express API Routes
│   │   │   ├── database/       # Connection pool & migrations
│   │   │   ├── utils/          # AES-256-GCM cipher & hash helpers
│   │   │   └── app.ts          # Express App factory
│   └── shared/                 # Shared TypeScript interfaces & types
└── .env.example
```

---

## 🚀 Panduan Menjalankan (Self-Hosting)

### 1. Prasyarat
- Docker & Docker Compose
- Kredensial OAuth2 Google (Client ID & Client Secret) dari [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
  - *Authorized redirect URI:* `https://<domain-anda>/api/auth/google/callback`

### 2. Konfigurasi Lingkungan
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi variabel:
```env
DOMAIN=drivemesh.farhan-dev.my.id
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
POSTGRES_USER=drivemesh
POSTGRES_PASSWORD=your_secure_password
```

### 3. Jalankan dengan Docker Compose
```bash
docker compose up -d --build
```

Setelah berjalan:
- Dashboard Web: `https://<domain-anda>`
- Port SMB: `445` siap menerima koneksi dari iPhone, Mac, dan Windows.

---

## 📄 Lisensi
Didistribusikan di bawah lisensi MIT. Silakan kembangkan dan gunakan untuk kebutuhan pribadi maupun organisasi.
