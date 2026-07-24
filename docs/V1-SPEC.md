# V1 SPEC — "AI Menemukan Ide Penelitian"

Status: Siap dikerjakan
Bergantung pada: `MASTER-VISION.md`, `DATA-MODEL.md` (baca dulu sebelum mengerjakan spek ini)
Urutan kerja yang disepakati: **Frontend dulu, baru Backend**

---

## 1. Tujuan V1

Dalam satu sesi (target < 1 jam), mahasiswa yang belum punya ide penelitian bisa keluar dengan:
- Genome yang menggambarkan minat & kemampuannya
- Diskusi awal tentang masalah yang ingin diteliti
- Beberapa referensi jurnal awal yang relevan
- Research Canvas yang terisi sebagian (problem, kandidat variabel, kandidat metode)

**Yang secara sengaja TIDAK masuk V1** (jangan dikerjakan, supaya scope tidak melebar):
- Proposal lengkap / auto-generate proposal
- Multi-agent (Literature/Critic/Dataset Agent terpisah) — cukup satu LLM dengan tools
- Knowledge Graph, Research Gap Engine otomatis
- Export ke dokumen (PDF/Word)
- Kolaborasi multi-user / sharing project

---

## 2. Alur Pengguna (User Flow)

```
Sign up / Login
     ↓
Dashboard (kosong, ajakan "Buat Project Baru")
     ↓
Buat Project Baru
     ↓
[Jika Genome belum ada] → Research Interview (penuh)
[Jika Genome sudah ada] → Ringkasan Genome + 1 pertanyaan delta
     ↓
Chat + Canvas (halaman utama kerja)
     ↓
User mengetik masalah/minat → AI menggali via chat
     ↓
AI memanggil pencarian literatur (Semantic Scholar) saat relevan
     ↓
Canvas ter-update otomatis berdasarkan hasil diskusi
     ↓
User bisa kembali kapan saja, Canvas & histori chat persisten
```

---

## 3. Halaman & Komponen Frontend (Urutan Pengerjaan)

### 3.1 Auth (Login/Signup)
- Pakai layanan siap pakai (Clerk atau Supabase Auth — pilih salah satu, jangan bangun sendiri)
- Halaman: Login, Signup, (lupa password ditangani otomatis oleh layanan auth)

### 3.2 Dashboard
- List project milik user (kartu sederhana: judul, status, terakhir diubah)
- Tombol "Buat Project Baru"
- State kosong yang ramah untuk user baru

### 3.3 Research Interview (kondisional)
- **Kasus A — Genome belum ada (user baru):**
  Form multi-step, progresif:
  1. Bidang yang diminati (multi-select + free text "lainnya")
  2. Skill/software yang dikuasai (multi-select: Python, R, SPSS, Stata, Excel, lainnya)
  3. Pengalaman relevan (organisasi/magang/kerja — free text singkat)
  4. Akses data yang dimiliki (multi-select: BPS, BMKG, data instansi, tidak ada/belum tahu)
  5. Keterbatasan (waktu tersedia, catatan bebas)
  6. Pertanyaan open-ended penutup: "Ceritakan masalah yang menurutmu penting untuk diteliti" (teks bebas, ini yang dikirim ke LLM apa adanya, bukan diproses jadi field terstruktur)
- **Kasus B — Genome sudah ada (project baru dari user lama):**
  Tampilkan ringkasan Genome yang ada + satu pertanyaan: "Masih relevan, atau ada yang baru?" Kalau user pilih "ada yang baru", munculkan hanya sub-field yang relevan (bukan ulangi semua 6 pertanyaan).
- Setelah selesai → redirect ke halaman Chat + Canvas

### 3.4 Chat + Canvas (halaman utama)
Layout dua panel (referensi Bab VIII PRD asli, disederhanakan):
- **Panel kiri: Chat** — riwayat percakapan, input teks, indikator loading saat AI merespons/mencari literatur
- **Panel kanan: Canvas** — menampilkan field: Problem, Research Question (kalau sudah terbentuk), Kandidat Variabel, Catatan Research Gap, Kandidat Metode. Update otomatis (bukan manual-edit oleh user di V1 — cukup read-only hasil dari AI, editing manual bisa masuk V2 kalau dibutuhkan)
- Ketika AI menyertakan referensi jurnal dalam jawabannya, tampilkan sebagai kartu kecil (judul + link), bukan hanya teks biasa

### 3.5 Halaman Genome (opsional tapi disarankan)
- Halaman sederhana untuk user melihat/edit Genome miliknya sendiri di luar konteks project — memberi rasa "sistem mengenal saya" secara eksplisit.

---

## 4. Kontrak API / Fungsi Backend yang Dibutuhkan Frontend

Ditulis dari sudut pandang frontend supaya saat backend dibangun, bentuknya sudah jelas.

```
POST /api/genome                 → simpan hasil Research Interview (create/update)
GET  /api/genome                 → ambil Genome milik user yang login
POST /api/projects               → buat project baru
GET  /api/projects               → list project milik user
GET  /api/projects/:id           → detail project (termasuk Canvas)
POST /api/projects/:id/messages  → kirim pesan user, terima respons AI (termasuk update Canvas & evidence jika ada)
GET  /api/projects/:id/messages  → riwayat chat
```

Catatan desain: endpoint `POST .../messages` adalah titik paling penting — di baliknya nanti backend melakukan: (1) susun context dari Genome + Canvas + histori chat, (2) panggil LLM dengan tool "cari_literatur" yang tersedia, (3) kalau LLM manggil tool itu → query Semantic Scholar API → masukkan hasil ke context → LLM lanjut merespons, (4) LLM juga menghasilkan update Canvas sebagai bagian dari output terstruktur, (5) simpan semuanya, kembalikan ke frontend.

---

## 5. Cakupan Backend (Dikerjakan Setelah Frontend Solid)

- Setup FastAPI (atau Next.js API routes — putuskan saat mulai, tidak krusial di V1) + koneksi PostgreSQL (pgvector extension aktif meski V1 belum pakai vector search penuh)
- Implementasi skema dari `DATA-MODEL.md` §2 (User, Genome, Project, Canvas, Message, EvidenceReference)
- Integrasi Semantic Scholar API (free, tidak perlu API key untuk basic search) — dipanggil sebagai tool dari LLM, bukan selalu dipanggil di setiap pesan
- Satu system prompt "Mentor" yang menjalankan prinsip di `MASTER-VISION.md` §3 (bertanya dulu, tidak mengarang, jelaskan sumber) — bentuk tool-calling ke fungsi pencarian literatur
- Endpoint yang menyusun context builder sederhana: Genome + Canvas + N pesan terakhir → jadi prompt

---

## 6. Definisi "Selesai" untuk V1

V1 dianggap selesai kalau:
- [ ] User baru bisa signup, mengisi Research Interview, dan masuk ke Chat+Canvas
- [ ] User lama yang bikin project kedua **tidak** diminta mengisi ulang 6 pertanyaan dari nol
- [ ] Chat dengan AI terasa menggali (bukan langsung kasih judul skripsi di respons pertama)
- [ ] Minimal satu kali dalam sesi normal, AI memanggil pencarian Semantic Scholar dan menampilkan sumbernya dengan link yang valid
- [ ] Canvas ter-update mengikuti progres chat, terlihat oleh user tanpa refresh manual
- [ ] Data persisten — user bisa logout, login lagi, dan project + Canvas + histori chat masih ada

## 7. Definisi "Belum Perlu Dikhawatirkan" untuk V1
- Skalabilitas ribuan user (target awal: dipakai sendiri + beberapa teman untuk validasi)
- Biaya token LLM dioptimasi habis-habisan (boleh dioptimasi nanti kalau sudah ada traksi)
- Desain visual yang sangat polished — fungsional dan rapi cukup, bukan pixel-perfect
