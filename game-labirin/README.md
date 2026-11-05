# 🎮 Labirin Quest TKJ — Koleksi Implementasi Game Edukasi

> Game web bergaya *maze quest* untuk belajar **Dasar-Dasar Teknik Komputer dan Jaringan (TKJ)**.
> Seluruh isi folder ini adalah hasil generasi dari **satu prompt spesifikasi yang sama** ke beberapa AI assistant berbeda.

---

### 🎯 Tujuan folder

- **Membandingkan hasil generasi AI** pada brief yang identik: kelengkapan mekanik, kualitas visual, efisiensi kode, dan jumlah bank soal.
- **Menyimpan prompt sumber** supaya bisa dipakai ulang atau dituning pada iterasi berikutnya.
- **Menyediakan basis refactor** (`versi-gemini/`) yang sudah modular dan enak dikembangkan.

### 🧪 Perbandingan Versi

| Berkas | Pembuat | Bank soal | Bentuk | Catatan |
|---|---|---|---|---|
| `labirin-quest-tkj-chatgpt.html` | ChatGPT | 5 | Berkas tunggal | Versi paling ringkas. Format soal ringkas `{q, a, opts, why}`, kode sangat padat, estetika visual paling sederhana dari semua versi. |
| `labirin-quest-tkj-claude.html` | Claude | 20 | Berkas tunggal | Bank soal terbanyak di antara versi berkas tunggal. Mekanik lengkap (segel ruang, kembang api, bom, SFX), kode minified sehingga kurang enak dibaca. |
| `labirin-quest-tkj-grok.html` | Grok | 10 | Berkas tunggal | Struktur kode paling rapi dan berlabel jelas (`{q, options, correct}`), visual paling lengkap, mudah dibaca dan dipelajari. |
| `labirin-quest-tkj-metaai.html` | Meta AI | 10 | Berkas tunggal | Dibangun sebagai **React Artifact**: React + ReactDOM + `htm` sudah di-*bundle* di dalam berkas, jadi tetap bisa dibuka offline tanpa CDN. |
| `labirin-quest-tkj-qwen.html` | Qwen | 10 | Berkas tunggal | Versi paling rapi dari sisi kode vanilla JS, memakai state terstruktur (`G{state, qi, score, lives, ...}`). |
| `versi-gemini/` | Gemini | 21 | **Multi-file** | Versi termodular: logika dipecah ke 6 modul JS terpisah dengan komentar per modul. Bank soal terlengkap (21 soal, 14 kategori) + penjelasan edukatif. Basis pengembangan terbaik. |

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

## 📄 Lisensi & Credit

- Materi soal: disusun berdasarkan kurikulum **Dasar-Dasar Teknik Komputer dan Jaringan (TKJ/SMK)**.
- Kode dan visual: hasil generasi AI (ChatGPT, Claude, Grok, Meta AI, Qwen, Gemini) dari prompt di atas.
- Tanpa dependensi eksternal — seluruh aset (musik & efek suara) dibangkitkan saat runtime melalui **Web Audio API**.
