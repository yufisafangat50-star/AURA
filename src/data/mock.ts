

import type {
  User,
  Genome,
  Project,
  Canvas,
  Message,
  EvidenceReference,
} from "@/lib/types";

export const MOCK_USER_NEW: User = {
  id: "usr-new-001",
  email: "rina@student.ac.id",
  name: "Rina Amelia",
  created_at: "2026-07-24T10:00:00Z",
};

export const MOCK_USER_RETURNING: User = {
  id: "usr-ret-001",
  email: "budi@student.ac.id",
  name: "Budi Santoso",
  created_at: "2026-06-01T08:00:00Z",
};

export const MOCK_GENOME: Genome = {
  id: "gen-001",
  user_id: "usr-ret-001",
  fields_of_interest: ["Kesehatan Masyarakat", "Epidemiologi", "Data Science"],
  skills: ["Python", "SPSS", "Excel"],
  experience_level: "menengah",
  data_access: ["BPS", "Data Puskesmas"],
  constraints:
    "Waktu terbatas 4 bulan, akses data hanya wilayah Jawa Barat, tidak bisa survei lapangan langsung.",
  research_style_notes:
    "Tertarik pendekatan kuantitatif, suka cari pola di data besar. Pernah bantu riset dosen soal stunting.",
  updated_at: "2026-06-15T14:30:00Z",
};

export const MOCK_PROJECTS: Project[] = [
  {
    id: "prj-001",
    user_id: "usr-ret-001",
    title: "Faktor Penyebaran DBD di Jawa Barat",
    status: "active",
    created_at: "2026-06-15T14:30:00Z",
    updated_at: "2026-07-20T09:15:00Z",
  },
  {
    id: "prj-002",
    user_id: "usr-ret-001",
    title: "Hubungan Kualitas Udara dan ISPA",
    status: "draft",
    created_at: "2026-07-10T11:00:00Z",
    updated_at: "2026-07-10T11:00:00Z",
  },
];

export const MOCK_CANVAS: Canvas = {
  id: "cvs-001",
  project_id: "prj-001",
  problem:
    "Kasus DBD di Jawa Barat meningkat 23% dalam 3 tahun terakhir, tapi belum jelas faktor dominan yang mendorong penyebaran — apakah curah hujan, kepadatan penduduk, atau perilaku masyarakat.",
  research_question:
    "Bagaimana hubungan antara curah hujan, kepadatan penduduk, dan perilaku masyarakat terhadap angka kejadian DBD di kabupaten/kota Jawa Barat periode 2023–2025?",
  candidate_variables:
    "Dependen: angka kejadian DBD per 100.000 penduduk\nIndependen: curah hujan bulanan (mm), kepadatan penduduk (jiwa/km²), skor perilaku PSN (Pemberantasan Sarang Nyamuk)\nKontrol: altitude, akses fasilitas kesehatan",
  research_gap_notes:
    "Sebagian besar studi sebelumnya hanya meneliti faktor iklim ATAU faktor sosial secara terpisah. Belum banyak yang menggabungkan keduanya dalam satu model spasial di level kabupaten/kota.",
  candidate_methods:
    "Regresi panel data (fixed/random effects) atau GWR (Geographically Weighted Regression) untuk menangkap variasi spasial antar wilayah.",
  notes:
    "Perlu cek ketersediaan data curah hujan dari BMKG per kabupaten. Data PSN mungkin bisa dari Dinkes provinsi.",
  updated_at: "2026-07-20T09:15:00Z",
};

export const MOCK_REFERENCES: EvidenceReference[] = [
  {
    id: "ref-001",
    project_id: "prj-001",
    source_title:
      "Spatial Analysis of Dengue Hemorrhagic Fever and Its Relationship with Rainfall in West Java",
    source_url: "https://api.semanticscholar.org/CorpusID:12345678",
    source_provider: "Semantic Scholar",
    retrieved_at: "2026-07-18T10:00:00Z",
    relevance_note:
      "Menganalisis hubungan curah hujan dan DBD di Jabar — langsung relevan dengan variabel independen utama.",
  },
  {
    id: "ref-002",
    project_id: "prj-001",
    source_title:
      "The Role of Population Density in Dengue Transmission: A Systematic Review",
    source_url: "https://api.semanticscholar.org/CorpusID:87654321",
    source_provider: "Semantic Scholar",
    retrieved_at: "2026-07-18T10:05:00Z",
    relevance_note:
      "Systematic review yang menunjukkan kepadatan penduduk sebagai faktor signifikan — mendukung keputusan memasukkan variabel ini.",
  },
  {
    id: "ref-003",
    project_id: "prj-001",
    source_title:
      "Community-Based Mosquito Nest Eradication and Its Impact on DHF Incidence in Indonesia",
    source_url: "https://api.semanticscholar.org/CorpusID:11223344",
    source_provider: "Semantic Scholar",
    retrieved_at: "2026-07-19T08:30:00Z",
    relevance_note:
      "Studi tentang efektivitas PSN — relevan karena skor PSN adalah salah satu variabel independen yang dipertimbangkan.",
  },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: "msg-001",
    project_id: "prj-001",
    role: "assistant",
    content:
      "Halo Budi! 👋 Kamu sudah punya latar belakang epidemiologi dan data science — kombinasi yang keren. Ceritain dong, akhir-akhir ini ada fenomena kesehatan yang bikin kamu penasaran?",
    created_at: "2026-07-18T09:00:00Z",
  },
  {
    id: "msg-002",
    project_id: "prj-001",
    role: "user",
    content:
      "Aku lagi kepikiran soal DBD di Jawa Barat. Tiap musim hujan kasusnya naik terus, tapi kayaknya bukan cuma soal hujan doang.",
    created_at: "2026-07-18T09:01:00Z",
  },
  {
    id: "msg-003",
    project_id: "prj-001",
    role: "assistant",
    content:
      'Seru nih, DBD! Intuisi kamu menarik — "bukan cuma soal hujan." Menurut kamu sendiri, faktor lain apa yang mungkin ikut berperan? Coba sebutin 2-3 yang terlintas di kepala.',
    created_at: "2026-07-18T09:02:00Z",
  },
  {
    id: "msg-004",
    project_id: "prj-001",
    role: "user",
    content:
      "Hmm, mungkin kepadatan penduduk ya? Daerah padat kan lebih gampang nyamuknya nyebar. Terus juga perilaku masyarakat — kayak rajin nggak sih mereka bersihkan genangan air.",
    created_at: "2026-07-18T09:03:00Z",
  },
  {
    id: "msg-005",
    project_id: "prj-001",
    role: "assistant",
    content:
      "Oke, jadi ada tiga faktor: curah hujan, kepadatan penduduk, dan perilaku PSN. Nah, aku coba carikan beberapa studi yang sudah meneliti faktor-faktor ini...",
    created_at: "2026-07-18T09:04:00Z",
    references: [MOCK_REFERENCES[0], MOCK_REFERENCES[1]],
  },
  {
    id: "msg-006",
    project_id: "prj-001",
    role: "assistant",
    content:
      "Dari dua studi itu, yang menarik: kebanyakan riset sebelumnya cuma lihat faktor iklim ATAU sosial secara terpisah. Menurut kamu, kalau keduanya digabung dalam satu model, kira-kira tantangannya apa?",
    created_at: "2026-07-18T09:05:00Z",
  },
  {
    id: "msg-007",
    project_id: "prj-001",
    role: "user",
    content:
      "Tantangannya mungkin data yang nggak seragam ya? Data curah hujan dari BMKG per stasiun, tapi data perilaku PSN kan survei — beda level dan frekuensinya.",
    created_at: "2026-07-18T09:06:00Z",
  },
  {
    id: "msg-008",
    project_id: "prj-001",
    role: "assistant",
    content:
      'Tepat! Itu tantangan klasik di studi multifaktor. Satu pendekatan yang bisa menangani variasi spasial antar wilayah: Geographically Weighted Regression (GWR). Kamu pernah dengar metode ini? Atau lebih familiar dengan regresi panel data biasa?\n\nOh iya, aku juga nemu satu studi lagi soal PSN yang relevan:',
    created_at: "2026-07-18T09:07:00Z",
    references: [MOCK_REFERENCES[2]],
  },
];

export const FIELD_OPTIONS = [
  "Kesehatan Masyarakat",
  "Epidemiologi",
  "Data Science",
  "Machine Learning",
  "Statistik",
  "Lingkungan",
  "Pendidikan",
  "Ekonomi",
  "Psikologi",
  "Sosiologi",
  "Informatika",
  "Biologi",
];

export const SKILL_OPTIONS = [
  "Python",
  "R",
  "SPSS",
  "Stata",
  "Excel",
  "SQL",
  "Tableau",
  "MATLAB",
  "NVivo",
  "GIS/QGIS",
];

export const DATA_ACCESS_OPTIONS = [
  "BPS (Badan Pusat Statistik)",
  "BMKG",
  "Data instansi/organisasi",
  "Data Puskesmas/Dinkes",
  "Dataset publik (Kaggle, UCI, dsb.)",
  "Belum tahu / belum punya",
];
