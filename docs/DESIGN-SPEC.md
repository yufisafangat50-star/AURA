# DESIGN SPEC — Aura (ResearchPilot) V1

Status: Disepakati lewat eksplorasi mockup interaktif
Bergantung pada: `MASTER-VISION.md` (identitas produk), `V1-SPEC.md` (struktur halaman)

---

## 1. Konsep Visual

**"Notebook riset"** — workspace terasa seperti buku catatan penelitian fisik, bukan dashboard SaaS generik. Ini alasan tiap keputusan visual di bawah:

- Latar bertekstur dot-grid halus (bukan polos), mengingatkan kertas catatan
- Kartu Canvas dan referensi ditampilkan seperti *index card* — sedikit dirotasi tidak simetris (antara -1.2° s/d 0.8°), dengan penanda "pin" bulat kecil di atas, seolah ditempel di corkboard
- Chat bubble AI punya aksen kecil menyerupai *washi tape* di sudut atas
- Navigasi berbentuk tab kertas (menempel di garis pemisah header), bukan ikon melayang
- Sudut elemen tajam/minim radius (2-3px), bukan rounded-everything
- Border pemisah solid gelap, bukan shadow — desain tetap flat, kedalaman datang dari garis dan rotasi, bukan bayangan

## 2. Palet Warna (Sumber: referensi Color Hunt dari pengguna)

| Token | Hex | Pemakaian |
|---|---|---|
| `ink` | `#1E201E` | Teks utama, tombol tegas (background tombol primer), garis pemisah |
| `ink-soft` | `#3C3D37` | Teks sekunder/label |
| `sage` | `#697565` | **Satu-satunya warna aksen** — teks/ikon di atas tombol ink, isi pin, isi tab aktif, garis progres, border highlight saat Canvas ter-update |
| `paper` | `#ECDFCC` | Latar dasar workspace |
| `paper-card` | `#F7F1E4` / `#F4EEE1` | Latar kartu (index card, input) — sedikit lebih terang dari paper dasar untuk beda lapisan |
| `border-soft` | `#cfc6b2` | Border kartu & elemen non-tegas |
| `muted-text` | `#5b5642` / `#8a8370` | Teks tersier/placeholder |

**Aturan wajib**: hanya `sage` yang boleh jadi warna "hidup"/aksen. Semua warna lain netral. Jangan menambah warna baru (misal amber/teal/coral) — itu yang sebelumnya bikin desain terasa norak.

**Aturan kontras**: setiap ikon dan teks tombol harus punya warna eksplisit (bukan mewarisi default sistem) — di implementasi nyata (React/Tailwind), pastikan tidak ada teks/ikon yang mengandalkan warna `inherit` atau default putih dari komponen library, karena akan hilang di atas latar terang (`paper`).

## 3. Tipografi

- Heading/judul (nama app, judul section, judul card, pertanyaan interview) → font serif (identitas "jurnal akademik")
- Body text, label, UI chrome (tombol, placeholder, metadata) → font sans default sistem
- Label kecil (mis. "RESEARCH CANVAS", "LANGKAH 2/6") → uppercase, letter-spacing sedikit lebar, ukuran kecil (~11px)

## 4. Nada Bahasa (Copy)

Prinsip: **antusias seperti teman yang kepo, tapi objektif — tidak menjilat, tidak memvalidasi hal yang belum tentu benar.**

Contoh yang BENAR:
- "Seru nih, DBD! Cerita dong, kenapa topik ini yang bikin kamu penasaran?"
- "Oke, jadi ada pola musiman. Menurut kamu sendiri, ini lebih karena curah hujannya, atau ada faktor lain kayak sanitasi dan kepadatan penduduk yang ikut main?"

Contoh yang SALAH (hindari):
- "Bagus sekali! Ide yang sangat menarik!" (validasi kosong tanpa substansi)
- "Berikut adalah 10 judul skripsi untuk Anda" (instan, tidak menggali — melanggar prinsip inti di MASTER-VISION §3)
- Bahasa formal kaku ("Mohon masukkan data Anda") — app ini bukan aplikasi birokrasi

Semua microcopy tombol/label pakai kalimat aktif, sentence case (bukan Title Case), personal ("kamu", bukan "Anda").

## 5. Layout per Halaman (Ringkasan)

Detail struktur lengkap ada di `V1-SPEC.md` §3. Yang ditambahkan dari sisi visual:

- **Dashboard**: card project ditampilkan sebagai index card yang dirotasi acak ringan, disusun flex-wrap (bukan grid kaku sempurna)
- **Research Interview**: satu pertanyaan per layar, progress bar tipis (2px, warna ink), pilihan multi-select berupa chip persegi (bukan pill bulat) dengan border tegas
- **Chat + Canvas**: dua kolom. Chat kiri lebih lebar, bubble tanpa border radius besar. Canvas kanan berisi tumpukan index card kecil yang beri highlight border sage sesaat saat baru diperbarui dari hasil chat (animasi transisi warna border, bukan animasi gerak/pop)

## 6. Yang Sengaja Dihindari

- Card dengan shadow/elevation berlapis
- Border-radius besar/seragam di semua elemen (kesan "rounded SaaS default")
- Palet warna lebih dari satu warna aksen hidup
- Copy yang memuji tanpa substansi atau langsung memberi jawaban instan
- Ikon/teks yang mengandalkan warna default/inherit tanpa dicek kontrasnya di atas latar terang
