# ⚡ ZeScore - Smart Kiosk Evaluation System for PT3 Expo

[![Zetech Sub-Product](https://img.shields.io/badge/Zetech-Ecosystem-blue?style=for-the-badge)](https://zetech.id)
[![React Version](https://img.shields.io/badge/React-18/19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-Fast-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Secure-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

**ZeScore** adalah aplikasi penilaian dan _voting_ berbasis web (_Web App_) yang dirancang khusus untuk merekapitulasi nilai Proyek Tingkat 3 (PT3) pada gelaran International Seminar & Expo secara cepat, akurat, dan aman. Berada di bawah ekosistem **Zetech**, aplikasi ini mengusung pendekatan **Kiosk Mode** untuk meminimalkan antrean di lapangan dan menjamin integritas data dari manipulasi nilai (_double-voting_).

---

## ✨ Fitur Utama (Multi-Role System)

Aplikasi ini memisahkan hak akses menjadi 3 peran utama dengan alur kerja yang terisolasi:

1. **👑 Admin Dashboard (Powered by Horizon UI)**
   - Manajemen _master data_ tim peserta expo (_Participants_).
   - Impor dan validasi data penilai (NIM Mahasiswa & NIDN Dosen).
   - Visualisasi grafik perolehan nilai dan _voting_ secara _real-time_.
   - Ekspor rekapitulasi nilai akhir untuk kebutuhan pleno akademik.

2. **💻 Participant Mode (Device Lock)**
   - Autentikasi tim peserta untuk mengaktifkan terminal meja masing-masing.
   - Mengunci tampilan peramban (_browser_) ke halaman utama penilaian (_Kiosk Interface_).
   - Proteksi _routing_ ketat agar audiens publik tidak dapat mengakses menu internal.

3. **🎯 Guest Evaluator (Kiosk Interface - Tanpa Login)**
   - **Mahasiswa (Audience):** Validasi NIM _real-time_. Dibatasi hanya dapat memberikan 1 suara (_vote_) untuk 1 tim terbaik di seluruh expo.
   - **Dosen (Juri):** Validasi NIDN _real-time_. Akses ke _form_ penilaian multi-kategori (Inovasi, Presentasi, Teknis) untuk semua stan expo.
   - **Auto-Reset State:** Layar otomatis kembali ke halaman awal dalam 3 detik setelah _submit_ sukses untuk mengantisipasi antrean penilai berikutnya.

---

## 🛠️ Tech Stack

### Frontend (Client-Side)

- **Core:** React.js + Vite (TypeScript Configuration)
- **Styling & UI:** Tailwind CSS + Horizon UI Tailwind React (Admin Core Layout)
- **State Management:** Zustand (Lightweight & Fast Session Handling)
- **Data Fetching:** TanStack Query (React Query) & Axios

### Backend & Database (Recommended Architecture)

- **Runtime:** Node.js (Express.js / NestJS)
- **Database:** PostgreSQL / MySQL
- **ORM:** Prisma ORM

---

## 📁 Struktur Folder Proyek

```text
src/
├── assets/                  # Aset statis (Logo Zetech, ZeScore, Icon)
├── components/              # Komponen global (Button, Input, Loader kustom)
├── config/                  # Konfigurasi instance API (Axios Base)
├── layouts/                 # Tata letak pembungkus (AdminLayout vs KioskLayout)
├── features/                # Modul Fitur Berbasis Logika Bisnis
│   ├── auth/                # Halaman login Admin & Tim Peserta
│   ├── kiosk/               # Form penilaian & logika validasi NIM/NIDN (Meja Expo)
│   └── admin/               # Panel kontrol admin, tabel rekap, dan grafik analitik
├── store/                   # Manajemen state global (Zustand)
├── types/                   # Definisi tipe data TypeScript (.ts)
└── utils/                   # Fungsi utilitas pembantu (Validasi regex NIM/NIDN)
```
