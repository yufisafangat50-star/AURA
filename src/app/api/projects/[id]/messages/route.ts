import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI, FunctionDeclaration, Schema, SchemaType } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Basic throttling for Semantic Scholar
let lastApiCall = 0;
async function semanticScholarThrottle() {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;
  if (timeSinceLastCall < 1000) {
    await new Promise((resolve) => setTimeout(resolve, 1000 - timeSinceLastCall));
  }
  lastApiCall = Date.now();
}

async function searchLiterature(query: string, yearStart?: number, yearEnd?: number) {
  console.log(`[SEMANTIC SCHOLAR SEARCH] Query: "${query}", Year: ${yearStart}-${yearEnd}`);
  await semanticScholarThrottle();
  
  const apiKey = process.env.SEMANTIC_SCHOLAR_API_KEY;
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }

  let url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=10&fields=title,authors,year,abstract,url`;
  if (yearStart && yearEnd) {
    url += `&year=${yearStart}-${yearEnd}`;
  } else if (yearStart) {
    url += `&year=${yearStart}-`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const errText = await res.text();
    console.error(`[SEMANTIC SCHOLAR ERROR] ${res.status}: ${errText} (URL: ${url})`);
    return { error: "Failed to fetch from Semantic Scholar" };
  }
  const data = await res.json();
  
  if (!data.data || data.data.length === 0) {
    return { results: [] };
  }

  const rawResults = data.data.map((p: any) => ({
    title: p.title,
    authors: p.authors?.map((a: any) => a.name).join(", "),
    year: p.year,
    abstract: p.abstract ? p.abstract.substring(0, 300) + "..." : "No abstract available",
    url: p.url,
  }));

  const evalPrompt = `Evaluasi relevansi ${rawResults.length} abstrak berikut terhadap TOPIK INTI pencarian: "${query}".
Tugasmu: HANYA pilih paper yang TOPIK UTAMANYA benar-benar sama persis dengan query (bukan sekadar "domain yang mirip").
Jika query mencari "volatilitas harga", abaikan paper tentang "prediksi penyakit tanaman" meski sama-sama soal pertanian.
Keluarkan HANYA array JSON berisi indeks (angka 0 sampai ${rawResults.length - 1}) dari paper yang relevan. Jika tidak ada yang relevan, keluarkan []. Contoh output: [0, 2, 5]. TIDAK BOLEH ADA TEKS LAIN SELAIN ARRAY JSON.

Daftar Paper:
${rawResults.map((r: any, i: number) => `[${i}] Judul: ${r.title}\nAbstrak: ${r.abstract}`).join("\n\n")}`;

  try {
    const evalModelName = process.env.GEMINI_MODEL_NAME || "gemini-3.5-flash";
    const evalModel = genAI.getGenerativeModel({ model: evalModelName });
    const evalResult = await evalModel.generateContent(evalPrompt);
    let evalText = evalResult.response.text().trim();

    if (evalText.startsWith("\`\`\`json")) evalText = evalText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    if (evalText.startsWith("\`\`\`")) evalText = evalText.replace(/\`\`\`/g, "").trim();
    
    const relevantIndices = JSON.parse(evalText);
    if (Array.isArray(relevantIndices)) {
      const results = relevantIndices
        .filter((idx) => typeof idx === "number" && idx >= 0 && idx < rawResults.length)
        .map((idx) => rawResults[idx]);
      return { results: results.slice(0, 5) }; 
    }
  } catch (error) {
    console.error("[EVALUATOR ERROR] Failed to parse evaluator response or call AI", error);
  }

  return { results: rawResults.slice(0, 5) };
}

async function searchDataset(query: string) {
  console.log(`[KAGGLE SEARCH] Query: "${query}"`);
  
  const username = process.env.KAGGLE_USERNAME;
  const key = process.env.KAGGLE_KEY;
  
  if (!username || !key) {
    console.error("[KAGGLE ERROR] Credentials not found");
    return { error: "Kaggle credentials not configured" };
  }
  
  const authHeader = 'Basic ' + Buffer.from(`${username}:${key}`).toString('base64');
  const url = `https://www.kaggle.com/api/v1/datasets/list?search=${encodeURIComponent(query)}&sortBy=relevance`;
  
  const res = await fetch(url, { headers: { Authorization: authHeader } });
  if (!res.ok) {
    const errText = await res.text();
    console.error(`[KAGGLE ERROR] ${res.status}: ${errText}`);
    return { error: "Failed to fetch from Kaggle" };
  }
  
  const data = await res.json();
  if (!data || data.length === 0) {
    return { results: [] };
  }
  
  const rawResults = data.map((d: any) => ({
    title: d.title,
    url: d.url,
    description: d.description ? d.description.substring(0, 300) + "..." : "No description available",
    author: d.creatorName,
    coverage_period: d.lastUpdated,
    license: d.licenseName || "Unknown",
  }));

  const evalPrompt = `Evaluasi relevansi ${rawResults.length} dataset berikut terhadap KEBUTUHAN PENCARIAN DATASET: "${query}".
Tugasmu: HANYA pilih dataset yang benar-benar relevan dan berguna untuk menjawab kebutuhan query.
Keluarkan HANYA array JSON berisi indeks (angka 0 sampai ${rawResults.length - 1}) dari dataset yang relevan. Jika tidak ada yang relevan, keluarkan []. Contoh output: [0, 2]. TIDAK BOLEH ADA TEKS LAIN SELAIN ARRAY JSON.

Daftar Dataset:
${rawResults.map((r: any, i: number) => `[${i}] Judul: ${r.title}\nDeskripsi: ${r.description}`).join("\n\n")}`;

  try {
    const evalModelName = process.env.GEMINI_MODEL_NAME || "gemini-3.5-flash";
    const evalModel = genAI.getGenerativeModel({ model: evalModelName });
    const evalResult = await evalModel.generateContent(evalPrompt);
    let evalText = evalResult.response.text().trim();

    if (evalText.startsWith("\`\`\`json")) evalText = evalText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    if (evalText.startsWith("\`\`\`")) evalText = evalText.replace(/\`\`\`/g, "").trim();
    
    const relevantIndices = JSON.parse(evalText);
    if (Array.isArray(relevantIndices)) {
      const results = relevantIndices
        .filter((idx) => typeof idx === "number" && idx >= 0 && idx < rawResults.length)
        .map((idx) => rawResults[idx]);
      return { results: results.slice(0, 5) }; 
    }
  } catch (error) {
    console.error("[KAGGLE EVALUATOR ERROR] Failed to parse evaluator response or call AI", error);
  }

  return { results: rawResults.slice(0, 5) };
}

const cari_literatur_declaration: FunctionDeclaration = {
  name: "cari_literatur",
  description: "Cari referensi jurnal, paper, atau literatur akademik dari Semantic Scholar.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      query: {
        type: SchemaType.STRING,
        description: "Kata kunci pencarian akademik (bahasa Inggris lebih baik).",
      },
      year_start: {
        type: SchemaType.INTEGER,
        description: "Tahun awal publikasi (opsional)",
      },
      year_end: {
        type: SchemaType.INTEGER,
        description: "Tahun akhir publikasi (opsional)",
      },
    },
    required: ["query"],
  },
};

const update_canvas_declaration: FunctionDeclaration = {
  name: "update_canvas",
  description: "Perbarui Research Canvas pengguna jika ada elemen baru yang disepakati dari diskusi.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      problem: { type: SchemaType.STRING },
      research_question: { type: SchemaType.STRING },
      candidate_variables: { type: SchemaType.STRING },
      research_gap_notes: { type: SchemaType.STRING },
      candidate_methods: { type: SchemaType.STRING },
      notes: { type: SchemaType.STRING },
    },
    required: [],
  },
};

const cari_dataset_declaration: FunctionDeclaration = {
  name: "cari_dataset",
  description: "Mencari dataset publik (hanya melalui Kaggle) berdasarkan kata kunci pencarian. Gunakan alat ini HANYA jika sumber data kemungkinan ada di Kaggle. Jika user mencari data spesifik institusi lokal (misal: BPS, BMKG, data kementerian), arahkan mereka langsung ke situs resminya dalam percakapan, JANGAN gunakan tool ini.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      query: {
        type: SchemaType.STRING,
        description: "Kata kunci pencarian dataset (berbahasa Inggris lebih disarankan untuk Kaggle, misal: 'indonesia weather', 'stunting prevalence').",
      },
    },
    required: ["query"],
  },
};

const tools = [{
  functionDeclarations: [cari_literatur_declaration, cari_dataset_declaration, update_canvas_declaration],
}];

async function generateWithRetry(model: any, history: any[]) {
  let retries = 3;
  let delay = 6500; 

  while (retries > 0) {
    try {
      return await model.generateContent({ contents: history });
    } catch (error: any) {
      const isRetryable = error.status === 429 || error.status === 503 || 
                          (error.message && (error.message.includes("429") || error.message.includes("503")));
      if (isRetryable && retries > 1) {
        console.warn(`[Gemini API] Retryable error hit (${error.status || 'message match'}). Retrying in \${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        retries--;
        delay *= 1.5; 
      } else {
        throw error;
      }
    }
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: projectId } = await params;
    
    const project = await prisma.project.findFirst({
      where: { id: projectId, user_id: user.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: { project_id: projectId },
      orderBy: { created_at: "asc" },
      include: { 
        references: {
          orderBy: { retrieved_at: "asc" }
        },
        dataset_references: {
          orderBy: { retrieved_at: "asc" }
        }
      }
    });

    return NextResponse.json({ data: messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await params;

  try {
    const { content, isCritic, isLiteratureAgent } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, user_id: user.id },
      include: { canvas: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const genome = await prisma.genome.findUnique({
      where: { user_id: user.id },
    });

    const userMessage = await prisma.message.create({
      data: {
        project_id: projectId,
        role: "user",
        content,
        is_critic: isCritic || false,
        is_literature_agent: isLiteratureAgent || false,
      },
    });

    const history = await prisma.message.findMany({
      where: { project_id: projectId },
      orderBy: { created_at: "desc" },
      take: 20,
    });

    history.reverse();

    const geminiHistory: any[] = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    geminiHistory.push({
      role: "user",
      parts: [{ text: content }],
    });

    const contextInfo = `
KONTEKS USER:
Genome:
Bidang minat: ${genome?.fields_of_interest?.join(", ")}
Skills: ${genome?.skills?.join(", ")}
Akses data: ${genome?.data_access?.join(", ")}
Keterbatasan: ${genome?.constraints}
Catatan gaya riset: ${genome?.research_style_notes}

Canvas Saat Ini:
Problem: ${project.canvas?.problem}
Research Question: ${project.canvas?.research_question}
Variables: ${project.canvas?.candidate_variables}
Research Gap: ${project.canvas?.research_gap_notes}
Methods: ${project.canvas?.candidate_methods}
Notes: ${project.canvas?.notes}`;

    let systemInstruction = "";
    let activeTools: any = tools;

    if (isCritic) {
      systemInstruction = `Kamu bertindak sebagai Critic Agent, bagian dari Aura yang bertugas menantang ide riset user secara tajam namun konstruktif.
Tugas utamamu adalah membaca isi Canvas penelitian saat ini dan secara eksplisit mencari kelemahan: apakah metode cocok dengan ukuran data yang disebutkan, apakah variabel yang dipilih benar-benar bisa diukur, apakah ada bias yang belum dipertimbangkan.

ATURAN UTAMA CRITIC:
1. Kamu HARUS tetap sopan dan konstruktif (bukan menjatuhkan).
2. Fokus balasan HANYA pada kritik tajam terkait metodologi, variabel, dan masalah di Canvas. Jangan mengajari teori dasar, melainkan tunjukkan kelemahannya langsung.
3. Hindari menyisipkan penjelasan konsep/metodologi umum yang tidak diminta user secara eksplisit.
4. JANGAN mengarang atau mengasumsikan kelemahan yang tidak didukung oleh apa yang benar-benar tertulis di Canvas atau pernah disebutkan user. Kritik harus berbasis fakta yang ada, bukan dugaan/template kritik generik (contoh yang DIHINDARI: menuduh 'ukuran datamu kurang' padahal user belum pernah menyebutkan angka sampel).
5. Keputusan akhir tetap di tangan user — kamu menantang untuk memperkuat pemikirannya, bukan untuk memaksakan perubahan.
6. Tetap gunakan sapaan "kamu" secara konsisten, JANGAN beralih ke "Anda" meski nada kritiknya lebih tegas dari Mentor biasa.
${contextInfo}`;
      activeTools = undefined;
    } else if (isLiteratureAgent) {
      systemInstruction = `Kamu bertindak sebagai Literature Agent, bagian dari Aura yang bertugas melakukan pencarian literatur mendalam.

TUGAS UTAMA:
1. Baca Canvas penelitian user saat ini (problem, research question, variabel, metode).
2. Tentukan 3-5 variasi kata kunci pencarian (dalam bahasa Inggris) yang masing-masing mengeksplorasi sudut berbeda dari topik riset user. Contoh variasi:
   - Satu query fokus pada metode yang disebutkan di Canvas
   - Satu query fokus pada variabel utama
   - Satu query fokus pada domain/konteks spesifik (misal "Indonesia" atau konteks geografis relevan)
   - Satu query kombinasi variabel + metode
3. Panggil tool cari_literatur untuk SETIAP variasi query tersebut secara berurutan.
4. Setelah semua hasil terkumpul, sajikan RINGKASAN POLA mentah:
   - Berapa total paper relevan yang ditemukan dari semua pencarian
   - Metode apa yang paling sering dipakai (hitung dari judul dan abstrak)
   - Variabel apa yang paling sering diteliti
   - Apakah ada sudut atau pendekatan yang BELUM muncul di hasil pencarian
   Sajikan pola ini sebagai FAKTA DESKRIPTIF (misal "5 dari 8 paper menggunakan Random Forest"), BUKAN sebagai kesimpulan definitif tentang "gap" riset. Biarkan user yang menyimpulkan.

ATURAN:
1. Tetap gunakan sapaan "kamu" secara konsisten.
2. JANGAN menyimpulkan "ini adalah research gap yang harus kamu isi". Cukup sajikan pola mentah.
3. JANGAN membangun visualisasi hubungan antar paper atau knowledge graph.
4. Sebutkan nama penulis utama (et al.) dari setiap paper dalam ringkasan.
5. Hindari menyisipkan penjelasan konsep/metodologi umum yang tidak diminta.
6. JANGAN mengarang referensi. Semua harus dari hasil tool cari_literatur.
7. JANGAN PERNAH menuliskan tautan/URL atau mendaftar referensi secara manual dengan list bernomor. Sistem otomatis merender kartu literatur di bawah pesanmu.
${contextInfo}`;
      // Literature Agent hanya butuh cari_literatur, tanpa update_canvas dan cari_dataset
      activeTools = [{ functionDeclarations: [cari_literatur_declaration] }];
    } else {
      systemInstruction = `Kamu adalah Aura, AI Research Mentor yang antusias namun objektif. Tugasmu adalah mendampingi mahasiswa merumuskan ide penelitian melalui dialog Socratic.

ATURAN UTAMA (TIDAK BOLEH DILANGGAR):
1. JANGAN PERNAH memberikan judul skripsi/tesis instan atau menyuapi jawaban langsung.
2. Jangan menawarkan daftar pilihan topik/opsi riset (apalagi dalam format bernomor/list) sebelum minimal 3-4 pertukaran percakapan berjalan. Di awal percakapan, fokus membangun pemahaman dan rasa penasaran bersama: gali pengalaman pribadi user, tanya alasan di balik ketertarikannya, tanya dugaan sebab yang sudah dia pikirkan sendiri. Berikan SATU pertanyaan terbuka per giliran, bukan daftar. Baru setelah masalah/arah minatnya cukup jelas dari sisi user sendiri, boleh mulai menawarkan sudut pandang atau opsi arah riset, itu pun idealnya disampaikan sebagai kalimat mengalir, bukan daftar bernomor formal, kecuali user sendiri yang minta dibuatkan daftar.
3. Bertanyalah untuk memancing proses berpikir user (gali masalah, variabel, atau gap). JANGAN memulai balasan dengan kalimat framing/penjelasan umum sebelum bertanya (contoh yang DIHINDARI: 'Fokus pada X memberikan dimensi baru yang krusial karena...'). Langsung ke pertanyaan yang menggali, atau gabungkan observasi singkat (maksimal 1 kalimat pendek) DENGAN pertanyaan dalam kalimat yang sama. Jangan dipisah menjadi paragraf framing lalu paragraf pertanyaan.
4. JANGAN mengarang (halusinasi) referensi jurnal. Jika ditanya tentang literatur atau state-of-the-art, SELALU gunakan tool \`cari_literatur\`. Sebelum menyajikan hasil pencarian literatur ke user, periksa apakah hasilnya benar-benar relevan dengan topik yang sedang dibahas. Jika hasil pencarian tidak relevan atau meleset topik, JANGAN ditampilkan sebagai referensi — katakan terus terang ke user bahwa pencarian belum menemukan literatur yang cocok, jangan paksakan hasil yang ada.
5. JANGAN PERNAH menuliskan tautan/URL atau mendaftar referensi secara manual dengan list bernomor. Sistem otomatis merender kartu literatur di bawah pesanmu.
6. WAJIB mensintesis dan MENYEBUTKAN kontribusi dari KESELURUHAN artikel (misal 5 artikel) yang dikembalikan oleh tool \`cari_literatur\`. Kamu harus mengutip nama penulis utama (et al.) dari kelima artikel tersebut di dalam paragraf bahasanmu yang mengalir, agar user melihat bahwa seluruh referensi benar-benar dibahas. Jangan hanya memilih 1 atau 2 contoh saja!
7. Keputusan akhir selalu di tangan user. Kamu hanya merekomendasikan dan memvalidasi logika.
8. PROAKTIF MEMPERBARUI CANVAS: Jangan menunggu percakapan selesai! Setiap kali user memberikan informasi substantif yang jelas mengenai topik, variabel, atau gap riset (bahkan di giliran ke-2 atau ke-3), KAMU WAJIB SEGERA memanggil tool \`update_canvas\`. Lebih baik memperbarui canvas secara bertahap (incremental) daripada membiarkannya kosong.
9. Jangan mengarang atau mengasumsikan informasi apa pun tentang Genome atau Canvas user yang tidak pernah mereka sebutkan atau sepakati secara eksplisit dalam percakapan.
10. Saat memanggil update_canvas, HANYA sertakan field yang benar-benar berubah dari diskusi saat ini. Jangan menimpa field dengan versi yang lebih pendek/kurang detail dari isi sebelumnya kecuali user secara eksplisit meminta untuk mengubah/menyederhanakan bagian itu.
11. Hindari pujian yang berlebihan atau general terhadap pertanyaan/pernyataan user (contoh yang DILARANG: 'pertanyaan yang sangat tajam dan kritis', 'ide yang luar biasa'). Kalau user menunjukkan pemikiran yang baik, tunjukkan itu dengan cara MELANJUTKAN diskusi ke poin yang lebih dalam, bukan dengan kalimat pujian terpisah di awal balasan.
12. EMPIRICAL FIRST: Jangan pernah memaksa atau menggiring user ke satu metode analitik tertentu (misal GAM, ARIMA, dll) di awal hanya karena metode itu populer di literatur. Selalu ingatkan bahwa pemilihan metode di *machine learning* atau analitik data sangat bergantung pada bentuk, pola, dan distribusi data aktual milik user (pendekatan *data-driven*). Arahkan diskusi untuk melakukan *Exploratory Data Analysis (EDA)* atau uji asumsi terlebih dahulu sebelum mengunci model akhir.
13. Saat merujuk ke hasil pencarian literatur dalam balasanmu, jangan melebih-lebihkan relevansi sebuah paper. Jika sebuah paper cuma membahas topik yang bertetangga/mirip domain (misal soal produksi/yield saat user bertanya soal harga), katakan itu secara jujur sebagai 'literatur terkait tapi tidak persis membahas ini', jangan disajikan seolah langsung menjawab pertanyaan.
14. Hindari menyisipkan penjelasan konsep/metodologi umum yang tidak diminta user secara eksplisit (contoh yang DIHINDARI: menjelaskan apa itu exploratory data analysis atau kenapa itu penting, padahal user tidak bertanya soal itu). Fokus balasan pada konteks spesifik yang sedang dibahas dan pertanyaan yang menggali, bukan mengajari konsep umum.
15. SUMBER DATA LOKAL: Tool \`cari_dataset\` hanya terhubung ke Kaggle. Jika topik atau kebutuhan data user sangat spesifik pada institusi lokal (seperti BPS, BMKG, Kemenkes, atau portal Satu Data), JANGAN memaksakan memanggil tool \`cari_dataset\`. Langsung sarankan secara eksplisit dalam percakapan agar user mengunjungi situs resmi lembaga tersebut (berikan arahan nama lembaganya, misal: 'Data iklim harian bisa diakses melalui portal data online BMKG').

NADA BAHASA:
Gunakan sapaan "kamu". Antusias seperti teman diskusi yang penasaran, tapi tetap objektif.
ANTI AI-SLOP: Hapus TOTAL segala bentuk basa-basi generik AI (contoh: "Tentu, saya bantu...", "Sebagai model AI...", "Menarik sekali!", "Berikut adalah penjelasan..."). Langsung berikan jawaban, observasi, atau pertanyaan tanpa kalimat pengantar atau penutup klise. Bicaralah secara to-the-point dan natural.
Jelaskan konsep/teori rumit SESEDERHANA MUNGKIN dengan analogi sehari-hari yang memikat, TANPA menghilangkan esensi teknisnya. Pembahasan tidak boleh kaku bak buku teks.
Gunakan Bahasa Indonesia yang baik dan benar sesuai kaidah EYD, meski nadanya santai. Istilah asing/teknis WAJIB ditulis miring (markdown italic *seperti ini*) secara konsisten.
Hindari tanda hubung panjang (—) dan penggunaan titik dua (:) untuk memisahkan klausa dalam kalimat. Gunakan kalimat penuh atau tanda baca standar (koma, titik) sebagai gantinya.

${contextInfo}`;
      activeTools = tools;
    }

    const modelName = process.env.GEMINI_MODEL_NAME || "gemini-flash-latest";
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
      tools: activeTools,
    });

    let result = await generateWithRetry(model, geminiHistory);
    let responseText = "";
    const allRetrievedReferences: any[] = [];
    const allRetrievedDatasetReferences: any[] = [];

    while (result.response.functionCalls() && result.response.functionCalls()!.length > 0) {
      const calls = result.response.functionCalls()!;
      
      const modelParts = result.response.candidates?.[0]?.content?.parts || [];
      geminiHistory.push({
        role: "model",
        parts: modelParts
      });

      const functionResponses = [];

      for (const call of calls) {
        if (call.name === "cari_literatur") {
          const { query, year_start, year_end } = call.args as any;
          const searchResult = await searchLiterature(query, year_start, year_end);
          
          if (searchResult.results) {
            for (const r of searchResult.results) {
              const newRef = await prisma.evidenceReference.create({
                data: {
                  project_id: projectId,
                  source_title: r.title,
                  source_authors: r.authors,
                  publication_year: r.year,
                  abstract_snippet: r.abstract,
                  source_url: r.url,
                  source_provider: "Semantic Scholar",
                  relevance_note: r.abstract,
                }
              });
              allRetrievedReferences.push(newRef);
            }
          }

          functionResponses.push({
            functionResponse: {
              name: "cari_literatur",
              response: searchResult,
            }
          });
        } else if (call.name === "cari_dataset") {
          const { query } = call.args as any;
          const searchResult = await searchDataset(query);
          
          if (searchResult.results) {
            for (const r of searchResult.results) {
              const newRef = await prisma.datasetReference.create({
                data: {
                  project_id: projectId,
                  dataset_title: r.title,
                  source_url: r.url,
                  dataset_subtitle: r.description,
                  creator: r.author,
                  coverage_period: r.coverage_period,
                  license: r.license,
                }
              });
              allRetrievedDatasetReferences.push(newRef);
            }
          }

          functionResponses.push({
            functionResponse: {
              name: "cari_dataset",
              response: searchResult,
            }
          });
        } else if (call.name === "update_canvas") {
          
          const args = call.args as any;
          
          if (project.canvas) {
            const checkField = (fieldValue: any, originalValue: string | null) => 
              typeof fieldValue === 'string' && fieldValue.trim().length > 0 ? fieldValue : originalValue;

            const newData = {
              problem: checkField(args.problem, project.canvas.problem),
              research_question: checkField(args.research_question, project.canvas.research_question),
              candidate_variables: checkField(args.candidate_variables, project.canvas.candidate_variables),
              research_gap_notes: checkField(args.research_gap_notes, project.canvas.research_gap_notes),
              candidate_methods: checkField(args.candidate_methods, project.canvas.candidate_methods),
              notes: checkField(args.notes, project.canvas.notes),
            };

            await prisma.canvas.update({
              where: { id: project.canvas.id },
              data: {
                ...newData,
                updated_at: new Date().toISOString(),
              }
            });

            project.canvas = { ...project.canvas, ...newData, updated_at: new Date() };
          }
          
          functionResponses.push({
            functionResponse: {
              name: "update_canvas",
              response: { success: true },
            }
          });
        }
      }

      geminiHistory.push({
        role: "user",
        parts: functionResponses
      });

      result = await generateWithRetry(model, geminiHistory);
    }

    responseText = result.response.text();

    const assistantMessage = await prisma.message.create({
      data: {
        project_id: projectId,
        role: "assistant",
        content: responseText,
        is_critic: isCritic || false,
        is_literature_agent: isLiteratureAgent || false,
      },
    });

    if (allRetrievedReferences.length > 0) {
      await prisma.evidenceReference.updateMany({
        where: { id: { in: allRetrievedReferences.map(r => r.id) } },
        data: { message_id: assistantMessage.id },
      });
    }

    if (allRetrievedDatasetReferences.length > 0) {
      await prisma.datasetReference.updateMany({
        where: { id: { in: allRetrievedDatasetReferences.map(r => r.id) } },
        data: { message_id: assistantMessage.id },
      });
    }

    return NextResponse.json({ 
      data: {
        ...assistantMessage,
        references: allRetrievedReferences.length > 0 ? allRetrievedReferences : undefined,
        dataset_references: allRetrievedDatasetReferences.length > 0 ? allRetrievedDatasetReferences : undefined
      } 
    });
  } catch (error: any) {
    console.error("Error in /api/projects/:id/messages:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
