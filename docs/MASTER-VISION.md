# MASTER VISION — Aura (ResearchPilot)

Status: Living document — dibaca ulang setiap kali menulis spek versi baru
Versi dokumen: 1.0
Cakupan: Berlaku untuk V1 sampai V5. Tidak berubah tiap versi, hanya direvisi kalau visi produk benar-benar bergeser.

---

## 1. Apa Produk Ini

Aura (nama produk: ResearchPilot) adalah AI Research Mentor yang membantu mahasiswa menemukan dan menyusun ide penelitian melalui dialog Socratic — bukan chatbot pencari jawaban, bukan generator judul skripsi instan.

**Bukan Aura:**
- Bukan chatbot tanya-jawab umum
- Bukan search engine literatur (seperti Google Scholar)
- Bukan generator proposal otomatis
- Bukan pengganti dosen pembimbing

**Adalah Aura:**
- Pendamping yang menggali proses berpikir ilmiah pengguna
- Sistem yang mengenal penggunanya secara personal dan berkembang seiring waktu
- Alat yang transparan — setiap rekomendasi bisa dijelaskan asal-usulnya

---

## 2. Masalah Inti yang Diselesaikan

Bukan "mahasiswa sulit mencari jurnal". Tapi:

> Mahasiswa tidak tahu bagaimana menemukan ide penelitian yang layak, sesuai kemampuan dan sumber daya yang mereka miliki, serta relevan dengan perkembangan ilmu saat ini.

Lima akar masalah yang mendasarinya (dipakai sebagai acuan saat mendesain fitur apa pun):

| Gap | Penjelasan singkat |
|---|---|
| Knowledge Gap | Informasi terlalu banyak, bukan terlalu sedikit |
| Reasoning Gap | Sulit menghubungkan potongan informasi jadi ide baru |
| Confidence Gap | Ragu apakah idenya layak, butuh validasi awal |
| Resource Gap | Ide gagal karena data/waktu/biaya tidak realistis |
| Guidance Gap | Dosen pembimbing tidak selalu tersedia |

Setiap fitur baru di versi mana pun harus bisa dijawab: **gap mana yang ia kurangi?** Kalau tidak menjawab salah satu dari lima ini, pertimbangkan ulang apakah fitur itu perlu.

---

## 3. Prinsip yang Tidak Boleh Dilanggar di Versi Manapun

Ini prinsip identitas produk. Implementasinya boleh berubah/disederhanakan per versi (lihat §5), tapi prinsipnya sendiri tidak boleh hilang.

1. **AI tidak langsung memberi jawaban.** Ia mengajukan pertanyaan yang mengarahkan pengguna berpikir lebih dulu.
2. **AI tidak boleh mengarang.** Kalau tidak tahu atau tidak menemukan bukti, AI harus bilang begitu — tidak membuat sitasi atau klaim fiktif.
3. **Setiap rekomendasi harus bisa dijelaskan.** Minimal: alasan, sumber, tingkat keyakinan.
4. **AI tidak menggantikan dosen.** AI membantu mahasiswa datang ke dosen dengan persiapan lebih matang, bukan sebagai otoritas akademik final.
5. **Keputusan akhir selalu di tangan pengguna.** AI merekomendasikan, tidak memutuskan.
6. **Sistem mengenal penggunanya.** Progres dan konteks pengguna dipertahankan lintas sesi — bukan tanya hal yang sama berulang-ulang (lihat konsep Research Genome, §4).

---

## 4. Konsep Inti yang Bertahan Lintas Versi

### Research Genome
Profil dinamis yang menggambarkan karakteristik penelitian seorang pengguna: bidang minat, metode yang dikuasai, tools/software, akses data, keterbatasan (waktu/biaya), preferensi pendekatan riset. Genome **milik User**, bukan milik satu Project — dibangun sekali, disempurnakan seiring waktu, dan dipakai ulang di project-project berikutnya tanpa mengulang wawancara dari nol.

### Research Canvas
Ringkasan visual yang selalu diperbarui dari hasil diskusi: Problem, Variables, Research Gap, Method, Dataset, Expected Contribution. Canvas ini yang membuat progres pengguna terlihat ("thinking is visible") — bukan tenggelam di riwayat chat panjang.

### Evidence-Grounded Recommendation
Semua rekomendasi (topik, metode, dataset) idealnya bisa ditelusuri ke sumber yang jelas. Untuk versi awal, sumber boleh terbatas (misal hanya Semantic Scholar), tapi prinsip "tidak menyimpulkan tanpa dasar" tetap berlaku.

---

## 5. Cara Menyederhanakan Tanpa Mengkhianati Visi

PRD asli membayangkan implementasi yang sangat kaya (multi-agent penuh, knowledge graph, ontology). Untuk pengembangan solo, implementasi disederhanakan bertahap — **tapi prinsip di §3 tetap harus terasa**, meski dengan cara paling sederhana:

| Prinsip | Implementasi ideal (PRD asli) | Implementasi minimal (boleh dipakai di versi awal) |
|---|---|---|
| AI bertanya dulu | Multi-turn Socratic dialogue penuh | Form terstruktur progresif + 1-2 pertanyaan open-ended |
| Tidak mengarang | RAG dari knowledge graph tervalidasi | RAG dari satu API literatur tepercaya (Semantic Scholar), selalu tampilkan sumber |
| Transparan | Confidence Engine dgn skor multi-dimensi | Tampilkan judul+link sumber di tiap rekomendasi |
| Mengenal pengguna | Long-term memory (episodic/semantic/project) | Genome tersimpan per-User, dipanggil ulang tiap project baru |
| Multi-agent (banyak spesialis) | 8+ agent terpisah dgn protokol komunikasi (ACP) | Satu LLM call dengan beberapa tools/function-calling |

Aturan umum: **boleh menyederhanakan cara, tidak boleh menghilangkan efeknya yang dirasakan pengguna.**

---

## 6. Roadmap Ringkas (Detail per Versi Ada di Dokumen Terpisah)

- **V1 — "AI menemukan ide penelitian":** Login, Chat, Research Interview, Genome sederhana, RAG jurnal (Semantic Scholar), Research Canvas.
- **V2:** Literature Agent, Critic Agent, Dataset Finder, Export proposal.
- **V3:** Knowledge Graph, Research Gap Engine, Recommendation Engine.
- **V4:** Multi-Agent penuh, Digital Twin, Research Memory jangka panjang.
- **V5:** AI Reviewer, AI Statistician, AI Coding.

Detail teknis tiap versi ditulis di `V{n}-SPEC.md` masing-masing, dibuat saat versi itu **akan** dikerjakan — bukan sekaligus di depan, karena arah V2 ke atas realistis akan berubah setelah melihat pemakaian nyata V1.

---

## 7. Kapan Dokumen Ini Direvisi

Hanya jika:
- Masalah inti (§2) ternyata salah dipahami setelah dapat feedback pengguna nyata
- Prinsip inti (§3) terbukti tidak relevan/tidak disukai pengguna
- Ada keputusan sadar untuk mengubah positioning produk

Perubahan fitur, teknologi, atau urutan roadmap **tidak** memerlukan revisi dokumen ini — itu urusan `V{n}-SPEC.md`.
