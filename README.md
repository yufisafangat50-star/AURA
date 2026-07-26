# AURA — AI University Research Assistant

**AURA** (AI University Research Assistant) adalah asisten peneliti berbasis AI (Artificial Intelligence) yang dirancang untuk membantu mahasiswa dan peneliti merumuskan ide penelitian, menyusun *Research Canvas*, dan membedah literatur akademik melalui pendekatan Socratic Dialogue. 

Proyek ini dibangun menggunakan arsitektur modern untuk memastikan interaksi *real-time* yang lancar, aman, dan dapat diandalkan.

## 🚀 Fitur Utama

- **Socratic Brainstorming:** Menggunakan model AI (*Gemini 3 Flash*) untuk membimbing pengguna menggali ide riset, bukan sekadar memberikan jawaban instan.
- **Dynamic Research Canvas:** AI secara proaktif memperbarui variabel, pertanyaan penelitian, dan metode secara *real-time* seiring berjalannya diskusi.
- **Smart Literature Search:** Terintegrasi dengan **Semantic Scholar API**. Dilengkapi dengan *AI-in-the-Middle Evaluator* untuk menyaring artikel berdasarkan relevansi semantik, bukan sekadar pencocokan kata kunci.
- **Genome Profiling:** Sistem personalisasi (Genome) untuk menyesuaikan gaya diskusi AI dengan tingkat keahlian dan ketersediaan data pengguna.
- **Secure by Design:** Menggunakan *Row Level Security (RLS)* melalui Prisma `findFirst` untuk memastikan setiap sesi dan kanvas milik pengguna terisolasi dengan ketat.

## 🛠️ Stack Teknologi

- **Frontend:** [Next.js 15](https://nextjs.org/) (App Router), React, Tailwind CSS
- **Backend:** Next.js Route Handlers
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM:** [Prisma](https://www.prisma.io/)
- **AI Engine:** Google Generative AI (Gemini)
- **External API:** Semantic Scholar Graph API

## ⚙️ Persyaratan Sistem

- Node.js (v24 atau lebih baru disarankan)
- Kredensial Supabase (URL dan Anon Key)
- Google Gemini API Key
- Semantic Scholar API Key

## 🚦 Panduan Instalasi & Menjalankan Lokal

1. **Clone repositori**
   ```bash
   git clone <repo-url>
   cd aura
   ```

2. **Instal dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**
   Salin `env.example` menjadi `.env.local` dan isi kredensial yang dibutuhkan:
   ```bash
   cp env.example .env.local
   ```
   *Catatan: Pastikan mengatur `GEMINI_MODEL_NAME=gemini-3.5-flash` di dalam `.env.local` jika menggunakan tier gratis.*

4. **Siapkan Database (Prisma)**
   Pastikan Supabase Anda berjalan, lalu sinkronkan skema database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Jalankan Server Development**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000` (atau port lain sesuai konfigurasi).

## 🛡️ Keamanan
- Berkas migrasi database (`supabase/migrations/`) dan berkas log *scratch* telah dicegah masuk ke kontrol versi (`.gitignore`).
- Endpoint API diproteksi dengan mekanisme validasi kepemilikan ganda (Session Auth + RLS *Backend*).

---
*Dibangun untuk merevolusi tahap awal penelitian akademik.*
