# 🎮 Labirin Quest TKJ — Koleksi Implementasi Game Edukasi

> Game web bergaya *maze quest* untuk belajar **Dasar-Dasar Teknik Komputer dan Jaringan (TKJ)**.
> Seluruh isi folder ini adalah hasil generasi dari **satu prompt spesifikasi yang sama** ke beberapa AI assistant berbeda.

---

## 📌 Penjelasan Folder Ini

Folder ini adalah **ruang eksperimen "prompt → game"**. Alurnya:

1. Satu brief/specifikasi tunggal ditulis sebagai sumber (**lihat [🧠 Prompt Asli](#-prompt-asli)** di bawah).
2. Brief tersebut diberikan ke beberapa AI assistant berbeda: **ChatGPT, Claude, Grok, Meta AI, Qwen, dan Gemini**.
3. Masing-masing assistant menghasilkan **satu versi game yang berdiri sendiri**. Jadi seluruh berkas `.html` di root folder ini adalah **output dari prompt yang sama** — bukan level, mode, atau fitur terpisah dari satu game besar.
4. Satu versi (Gemini) kemudian dipecah menjadi **proyek multi-file** di `versi-gemini/` agar menjadi basis pengembangan yang lebih rapi.

### 🎯 Tujuan folder

- **Membandingkan hasil generasi AI** pada brief yang identik: kelengkapan mekanik, kualitas visual, efisiensi kode, dan jumlah bank soal.
- **Menyimpan prompt sumber** supaya bisa dipakai ulang atau dituning pada iterasi berikutnya.
- **Menyediakan basis refactor** (`versi-gemini/`) yang sudah modular dan enak dikembangkan.

### 📁 Struktur Folder

```
game-labirin/
├── README.md                        # Dokumen ini: prompt sumber + penjelasan folder
├── labirin-quest-tkj-chatgpt.html   # Hasil ChatGPT  — berkas tunggal
├── labirin-quest-tkj-claude.html    # Hasil Claude   — berkas tunggal
├── labirin-quest-tkj-grok.html      # Hasil Grok     — berkas tunggal
├── labirin-quest-tkj-metaai.html    # Hasil Meta AI  — berkas tunggal (React)
├── labirin-quest-tkj-qwen.html      # Hasil Qwen     — berkas tunggal
└── versi-gemini/                    # Hasil Gemini   — proyek multi-file (HTML/CSS/JS)
    ├── index.html                   #   Struktur antarmuka, HUD soal, canvas, modal
    ├── css/style.css                #   Tema cyber-neon, animasi, layout responsif
    ├── js/questions.js              #   Bank soal TKJ + penjelasan edukatif
    ├── js/audio.js                  #   Web Audio API: musik instrumen (BGM) + SFX
    ├── js/maze.js                   #   Grid labirin, 4 ruang opsi (A–D), gerbang
    ├── js/entities.js               #   Avatar pemain + AI monster acak
    ├── js/particles.js              #   Kembang api, ledakan bom, partikel animasi
    ├── js/game.js                   #   Game loop, skor, nyawa, transisi soal
    └── README.md                    #   Dokumentasi lengkap versi ini
```

### 🧪 Perbandingan Versi

| Berkas | Pembuat | Bank soal | Bentuk | Catatan |
|---|---|---|---|---|
| `labirin-quest-tkj-chatgpt.html` | ChatGPT | 5 | Berkas tunggal | Versi paling ringkas. Format soal ringkas `{q, a, opts, why}`, kode sangat padat, estetika visual paling sederhana dari semua versi. |
| `labirin-quest-tkj-claude.html` | Claude | 20 | Berkas tunggal | Bank soal terbanyak di antara versi berkas tunggal. Mekanik lengkap (segel ruang, kembang api, bom, SFX), kode minified sehingga kurang enak dibaca. |
| `labirin-quest-tkj-grok.html` | Grok | 10 | Berkas tunggal | Struktur kode paling rapi dan berlabel jelas (`{q, options, correct}`), visual paling lengkap, mudah dibaca dan dipelajari. |
| `labirin-quest-tkj-metaai.html` | Meta AI | 10 | Berkas tunggal | Dibangun sebagai **React Artifact**: React + ReactDOM + `htm` sudah di-*bundle* di dalam berkas, jadi tetap bisa dibuka offline tanpa CDN. |
| `labirin-quest-tkj-qwen.html` | Qwen | 10 | Berkas tunggal | Versi paling rapi dari sisi kode vanilla JS, memakai state terstruktur (`G{state, qi, score, lives, ...}`). |
| `versi-gemini/` | Gemini | 21 | **Multi-file** | Versi termodular: logika dipecah ke 6 modul JS terpisah dengan komentar per modul. Bank soal terlengkap (21 soal, 14 kategori) + penjelasan edukatif. Basis pengembangan terbaik. |

> **Catatan:** seluruh versi mengimplementasikan **mekanik inti yang sama** — 4 ruang opsi jawaban (A/B/C/D), monster yang bergerak acak, penyegelan ruang jawaban benar, efek kembang api + centang untuk jawaban benar, efek bom + tanda ✗ untuk jawaban salah (tanpa langsung gugur), serta musik latar instrumen sintetis.

### 🎨 Perbedaan Utama yang Terlihat Saat Main

| Aspek | ChatGPT | Claude | Grok | Meta AI | Qwen | Gemini (`versi-gemini/`) |
|---|---|---|---|---|---|---|
| Bank soal | 5 | 20 | 10 | 10 | 10 | **21** |
| Kualitas visual | ★★☆☆☆ | ★★★☆☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | **★★★★★** |
| Keterbacaan kode | ★★☆☆☆ | ★★☆☆☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | **★★★★★** |
| Modularitas | ✗ | ✗ | ✗ | ✗ | ✗ | **✓** |

---

## 🚀 Cara Menjalankan

Semua versi **tidak membutuhkan instalasi, bundler, atau dependensi** — cukup HTML5 Canvas, CSS3, dan Vanilla JavaScript.

### Opsi 1 — Buka langsung (paling cepat)

Klik ganda salah satu berkas `.html`, atau buka lewat browser:

```bash
xdg-open labirin-quest-tkj-grok.html      # Linux
open labirin-quest-tkj-grok.html          # macOS
start labirin-quest-tkj-grok.html         # Windows
```

### Opsi 2 — Local server (disarankan untuk `versi-gemini/`)

```bash
cd versi-gemini

# Python 3
python3 -m http.server 8080

# atau Node.js
npx serve .
```

Lalu buka `http://localhost:8080`.

> Audio memakai **Web Audio API** dan hanya berbunyi setelah interaksi pertama (klik/tombol), sesuai kebijakan autoplay browser. File `qwen` dan `metaai` memuat Google Fonts secara opsional; game tetap berjalan tanpa koneksi internet.

### 🎮 Kontrol

- **Keyboard:** `W` `A` `S` `D` atau tombol panah `↑` `←` `↓` `→`
- **Mobile:** D-Pad virtual di layar
- **Tujuan:** baca soal, bergerak ke ruang (A/B/C/D) yang berisi jawaban benar **sebelum monster menangkapmu**

---

## 🧠 Prompt Asli

Bagian ini adalah **brief sumber** yang menjadi dasar seluruh berkas di folder ini (diarsipkan dari `prompts.txt`):

```text
buatkan game web labirin quest dengan ketentuan sebagai berikut:
- materinya tentang dasar-dasar tkj.
- untuk setiap pertanyaan akan muncul pemilihan opsi dalam bentuk semacam labirin yang memiliki area tempat opsi jawaban.
- setiap soal memiliki 4 opsi jawaban.
- user mesti bergerak ke area yang jadi jawabannya sebelum ketemu sama monster.
- kalo jawabannya sesuai, area itu ditutup dari akses terhadap monster agar aman dan ada suara berhasil serta tanda centang dengan efek kembang api, dilanjutkan dengan menampilkan pertanyaan berikutnya.
- kalo jawabannya tidak sesuai tampilkan efek bom dan tanda x dan user bisa melanjutkan memilih di area lainnya yang belum dipilih dan tetap berusaha menghindari monster. setiap monster bergerak random.
- kalo bisa ada musik latar instrumen saja.
```

### ✅ Checklist Pemenuhan Requirement

| Requirement | Status di semua versi |
|---|---|
| Materi dasar-dasar TKJ | ✅ |
| Opsi jawaban berbentuk area dalam labirin | ✅ (4 ruang di sudut labirin) |
| 4 opsi jawaban per soal | ✅ |
| Pemain harus bergerak ke area jawaban | ✅ |
| Monster bergerak acak | ✅ |
| Jawaban benar → ruang disegel dari monster | ✅ |
| Jawaban benar → suara berhasil + centang + kembang api | ✅ |
| Lanjut ke soal berikutnya | ✅ |
| Jawaban salah → efek bom + tanda ✗ | ✅ |
| Jawaban salah → bisa lanjut memilih area lain | ✅ (tidak langsung gugur) |
| Musik latar instrumen saja | ✅ (sintesis Web Audio API, tanpa vokal) |

---

## 🔧 Pengembangan Lanjutan

Untuk mengembangkan tanpa mengubah file lain, gunakan `versi-gemini/` sebagai basis:

```bash
cd versi-gemini
python3 -m http.server 8080
```

Titik modifikasi yang paling sering dipakai:

- `js/questions.js` → menambah/mengubah soal dan penjelasan (struktur: `question`, `options[4]`, `answer`, `explanation`, `category`)
- `js/maze.js` → tata letak labirin, penempatan ruang A–D, dan logika gerbang penyegelan
- `js/entities.js` → perilaku monster (kecepatan, frekuensi acak) dan karakter pemain
- `js/audio.js` → melodi BGM dan efek suara
- `js/particles.js` → kembang api, ledakan bom, dan efek visual lainnya
- `js/game.js` → alur game, skor, nyawa, transisi soal, dan HUD

---

## 📄 Lisensi & Credit

- Materi soal: disusun berdasarkan kurikulum **Dasar-Dasar Teknik Komputer dan Jaringan (TKJ/SMK)**.
- Kode dan visual: hasil generasi AI (ChatGPT, Claude, Grok, Meta AI, Qwen, Gemini) dari prompt di atas.
- Tanpa dependensi eksternal — seluruh aset (musik & efek suara) dibangkitkan saat runtime melalui **Web Audio API**.
