# DATA MODEL — Aura (ResearchPilot)

Status: Living document — direvisi tiap kali menambah entitas baru di versi manapun
Versi dokumen: 1.0
Cakupan: Skema entitas inti. Field boleh bertambah tiap versi, tapi struktur relasi dasar (User → Genome, User → Project → Canvas) tidak boleh berubah drastis karena semua versi bergantung padanya.

---

## 1. Prinsip Desain Data

- **Genome menempel ke User, bukan ke Project.** Ini yang membuat sistem "mengenal" pengguna lintas project (lihat MASTER-VISION §4).
- **Canvas menempel ke Project.** Setiap project punya progres dan konteks sendiri.
- **Semua entitas evidence/rekomendasi harus punya field sumber**, walau di V1 sumbernya sederhana (judul + link Semantic Scholar). Ini menjaga prinsip transparansi sejak awal, supaya tidak perlu migrasi besar saat butuh evidence tracking lebih detail di V3.
- **Jangan hapus data, tandai versi/riwayat.** Perubahan pada Canvas atau Genome sebaiknya bisa dilihat riwayatnya (lihat §6), meski implementasi versioning penuh baru masuk di versi lanjut.

---

## 2. Entitas Inti (Dipakai Sejak V1)

### User
```yaml
User:
  id: uuid
  email: string
  name: string
  created_at: timestamp
  # relasi:
  # - has_one Genome
  # - has_many Project
```

### Genome
Representasi profil riset pengguna. Field ini diisi bertahap lewat Research Interview dan disempurnakan lintas project.

```yaml
Genome:
  id: uuid
  user_id: uuid (FK -> User)
  fields_of_interest: string[]       # mis. ["kesehatan masyarakat", "machine learning"]
  skills: string[]                   # mis. ["Python", "SPSS"]
  experience_level: enum(pemula, menengah, lanjutan)
  data_access: string[]              # mis. ["BPS", "BMKG"]
  constraints: text                  # mis. "waktu terbatas 3 bulan, tidak ada akses RS"
  research_style_notes: text         # hasil pertanyaan open-ended bebas
  updated_at: timestamp
```

Catatan: di V1, ini bukan skor bintang seperti visual di PRD asli — cukup field teks/array. Representasi visual (radar chart dsb.) adalah keputusan UI, bukan struktur data, dan bisa ditambah kapan saja tanpa migrasi skema.

### Project
```yaml
Project:
  id: uuid
  user_id: uuid (FK -> User)
  title: string
  status: enum(draft, active, archived)
  created_at: timestamp
  updated_at: timestamp
  # relasi:
  # - has_one Canvas
  # - has_many Message (riwayat chat)
```

### Canvas
Representasi terstruktur dari progres berpikir dalam satu project. Field-nya sengaja longgar (text) di V1 — penstrukturan lebih detail (Variable sebagai entitas sendiri, dsb.) baru relevan mulai V2/V3.

```yaml
Canvas:
  id: uuid
  project_id: uuid (FK -> Project, one-to-one)
  problem: text
  research_question: text
  candidate_variables: text          # bebas dulu, bukan entitas terpisah di V1
  research_gap_notes: text
  candidate_methods: text
  notes: text
  updated_at: timestamp
```

### Message
Riwayat percakapan mentah. Disimpan lengkap walau Canvas sudah merangkum — untuk keperluan debug dan agar tidak kehilangan konteks.

```yaml
Message:
  id: uuid
  project_id: uuid (FK -> Project)
  role: enum(user, assistant)
  content: text
  created_at: timestamp
```

### EvidenceReference
Dipakai setiap kali sistem menampilkan hasil pencarian literatur (RAG). Entitas ini yang menjaga prinsip "tidak mengarang" di level data.

```yaml
EvidenceReference:
  id: uuid
  project_id: uuid (FK -> Project)
  source_title: string
  source_url: string
  source_provider: string            # mis. "Semantic Scholar"
  retrieved_at: timestamp
  relevance_note: text               # kenapa dokumen ini relevan, ditulis singkat oleh sistem
```

---

## 3. Entitas yang Ditambahkan di Versi Lanjut (Referensi, Bukan untuk Dibangun di V1)

Dicatat di sini supaya struktur V1 tidak perlu perubahan besar saat versi berikutnya datang — cukup penambahan tabel/relasi baru.

- **V2:** `Dataset` (metadata dataset yang direkomendasikan), `ProposalExport` (versi proposal yang diekspor), field `agent_source` di `EvidenceReference` (menandai literatur agent mana yang mengambil).
- **V3:** `Variable` sebagai entitas sendiri (dipisah dari `Canvas.candidate_variables`), `ResearchGapObject`, `ConceptNode` + `ConceptEdge` (knowledge graph sederhana).
- **V4:** `Decision` (log keputusan pengguna beserta alasan), `AgentMemory` (memori per-agent), `ProjectTimeline` (event historis).
- **V5:** `ReviewNote` (dari AI Reviewer), `AnalysisRun` (dari AI Statistician/Coding).

---

## 4. Yang Sengaja Tidak Dibuat di V1

- Tabel `Hypothesis` terpisah — cukup teks bebas di Canvas dulu.
- Tabel `Method` sebagai registry dengan metadata (needs_normality, dsb.) — baru relevan saat Methodology/Statistician Agent masuk (V3+).
- Knowledge Graph (`ConceptNode`/`ConceptEdge`) — butuh volume data yang di V1 belum ada gunanya.
- Sistem versioning penuh ala Git untuk Canvas/Proposal — cukup `updated_at`, riwayat detail baru dibutuhkan saat fitur Export/Compare masuk (V2+).

---

## 5. Indeks & Relasi Kunci untuk V1

- `Genome.user_id` — unique, satu user satu genome.
- `Project.user_id` — index, untuk listing project per user.
- `Canvas.project_id` — unique, satu project satu canvas.
- `Message.project_id` + `created_at` — index komposit untuk render riwayat chat berurutan.
- `EvidenceReference.project_id` — index, untuk menampilkan semua sumber yang pernah dipakai dalam satu project.

---

## 6. Catatan Riwayat/Audit (Minimal untuk V1)

Untuk V1, cukup pastikan `updated_at` selalu tercatat di `Genome` dan `Canvas`. Riwayat perubahan penuh (siapa mengubah apa, kapan, kenapa — sesuai konsep Decision History di PRD asli) **ditunda ke V4**, karena baru bernilai setelah ada cukup banyak siklus revisi nyata dari pengguna untuk dipelajari polanya.
