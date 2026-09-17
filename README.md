# 🌟 Amanah Impact Foundation Platform

Platform Filantropi & Donasi Transparan Terintegrasi dengan **Backend Laravel 12**, **MySQL (Laragon)**, dan **Frontend React 19 + TypeScript + Tailwind CSS**.

---

## 🚀 Fitur Utama & Standarisasi Deploy Tools

1. **Dual Architecture (Localhost & GitHub Ready):**
   - **Backend:** Laravel 12 REST API (`/backend`) dengan 13 tabel database, Eloquent Models, Resource Controllers, Database Seeder, dan Autentikasi.
   - **Database:** MySQL via Laragon / XAMPP (`amanah_impact_foundation`).
   - **Frontend:** React 19 + TypeScript + Lucide Icons + Recharts + Leaflet Maps.
   - **Fullstack Dev Server:** Node.js Express server + Vite untuk kemudahan pengujian mandiri.

2. **Standarisasi Lengkap:**
   - **Landing Page Lengkap:**
     - Navbar dengan smooth scrolling otomatis ke setiap section.
     - Section Masalah (Highlight Merah) & Solusi (Highlight Hijau).
     - Section Video Demo / Mockup Interaktif (Desktop & Mobile view).
     - Section Pricing Plan Free / Pro (dengan Toggle Bulanan / Tahunan diskon 20%).
     - Testimoni (4 kartu donatur & mitra yayasan).
     - FAQ Accordion interaktif.
     - Call To Action (CTA) & Footer resmi ber-link `Dibuat oleh Contech ID` (`https://contech.id`).
   - **Autentikasi & Multi-Role:**
     - Register: Nama Lengkap, Email, No. HP/WhatsApp, Password.
     - Login: Email & Password.
     - Portal Super Admin terpisah dengan proteksi PIN/Akses Khusus.
   - **Manajemen Profil:**
     - Ubah Nama, Foto Profil, Email, dan Kata Sandi.
   - **Responsive & Dynamic Scaling:**
     - Responsif di perangkat Mobile, Tablet, dan Desktop.
     - Auto scale ~88% untuk laptop layar 1024px–1366px agar layout tetap proporsional.
   - **Fitur Tambahan:**
     - Dark Mode & Light Mode switch.
     - Multi-Bahasa: Indonesia (ID), English (EN), Arabic (AR), Mandarin (ZH), Japanese (JA).
     - Floating Feedback Widget di setiap tools.
     - Legal Modal: Ketentuan Layanan (Terms & Conditions) dan Pernyataan Penyangkalan (Disclaimer).
     - Pengaturan Database: Reset Data, Backup Data (Download JSON), dan Restore Data (Upload JSON).

---

## 🛠️ Panduan Menjalankan di Localhost (Laragon)

### 1. Persiapan Database MySQL di Laragon
1. Buka **Laragon** dan klik **Start All** (Apache & MySQL).
2. Buka **HeidiSQL** / **phpMyAdmin** atau terminal MySQL:
   ```sql
   CREATE DATABASE amanah_impact_foundation;
   ```

### 2. Menjalankan Backend Laravel
1. Buka terminal dan masuk ke folder `backend`:
   ```bash
   cd backend
   ```
2. Pastikan file `.env` sudah sesuai (salin dari `.env.example` jika belum ada):
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=amanah_impact_foundation
   DB_USERNAME=root
   DB_PASSWORD=
   ```
3. Jalankan migrasi dan seeder data lengkap:
   ```bash
   php artisan migrate:fresh --seed
   ```
4. Jalankan server Laravel:
   ```bash
   php artisan serve --port=8000
   ```
   *Backend API aktif di `http://localhost:8000/api`*

---

### 3. Menjalankan Frontend
1. Buka terminal baru di root folder proyek (`/Amanah Impact Foundation`):
2. Install dependencies (jika belum):
   ```bash
   npm install
   ```
3. Jalankan aplikasi:
   ```bash
   npm run dev
   ```
4. Buka di browser:
   `http://localhost:3000`

---

## 🔐 Akun Demo Siap Pakai

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `superadmin@amanah.org` | `admin123` |
| **Admin Donasi** | `admin@amanah.org` | `admin123` |
| **Donatur Reguler** | `budi@gmail.com` | `password123` |

---

## 📦 Struktur Repositori GitHub

```
├── backend/                  # Laravel 12 API
│   ├── app/Http/Controllers/ # REST API Controllers
│   ├── app/Models/           # Eloquent Models
│   ├── database/migrations/  # Skema Tabel MySQL
│   ├── database/seeders/     # Data Seeder Lengkap
│   └── routes/api.php        # Routing Endpoint API
├── src/                      # Frontend React Application
│   ├── components/           # UI Components & Modals
│   ├── lib/                  # Utilities & Database Handlers
│   ├── translations.ts       # Multi-language Dictionary
│   └── App.tsx               # Main Application
├── server.ts                 # Fullstack Dev Proxy Server
└── package.json
```

---
*Dibuat oleh [Contech ID](https://contech.id)*
