# 🛡️ LABIRIN QUEST TKJ (Teknik Komputer dan Jaringan)

Game edukasi berbasis web interaktif dengan konsep petualangan labirin (*maze quest*) untuk menguji dan memperdalam pemahaman materi **Dasar-Dasar Teknik Komputer dan Jaringan (TKJ)**.

---

## 🎮 Fitur Utama & Mekanisme Permainan

1. **Labirin Dinamis dengan 4 Ruang Opsi Jawaban**:
   - Setiap pertanyaan menampilkan 4 pilihan jawaban yang terhubung ke 4 area ruangan di sudut labirin:
     - **[A] Ruang Cyan** (Pojok Kiri Atas)
     - **[B] Ruang Emerald Green** (Pojok Kanan Atas)
     - **[C] Ruang Amber Gold** (Pojok Kiri Bawah)
     - **[D] Ruang Magenta Purple** (Pojok Kanan Bawah)
   - Teks pertanyaan dan detail lengkap opsi jawaban ditampilkan di HUD bagian atas layar.

2. **Monster Malware / Bug Jaringan**:
   - Monster patroli bergerak secara acak (*random wandering*) di lorong-lorong labirin.
   - Pemain harus jeli mencari rute dan menghindari sergapan monster menuju ruangan jawaban yang dituju.
   - Pemain dibekali dengan **3 Shield/Nyawa** (💙💙💙) disertai efek kebal sesaat (*invulnerability bubble*) dan *knockback* saat terserempet monster.

3. **Mekanisme Jawaban Benar (Safe Zone Barricade)**:
   - Ketika pemain melangkah masuk ke ruangan yang merupakan jawaban benar:
     - 🔒 **Gerbang langsung tersegel rapat** dengan barikade laser pelindung, sehingga monster tidak dapat masuk ke ruangan ini (100% aman).
     - 🎵 **Efek Suara Berhasil**: Jingle kemenangan sintetis bertangga nada ceria.
     - 🎆 **Efek Kembang Api & Centang Hijau (✓)**: Animasi partikel kembang api meletup-letup di layar.
     - 📘 **Penjelasan Materi**: Menampilkan ulasan edukatif tentang konsep materi TKJ tersebut sebelum melangkah ke pertanyaan berikutnya.

4. **Mekanisme Jawaban Salah (Bom & Evaluasi Terbuka)**:
   - Ketika pemain masuk ke ruangan jawaban yang salah:
     - 💥 **Efek Ledakan Bom**: Getaran layar (*screen shake*), kilatan api, asap, dan tanda silang merah (**✗**).
     - 🚪 **Gerbang Tetap Terbuka**: Karakter pemain tidak langsung gugur! Pemain dapat langsung melesat keluar kembali ke lorong labirin untuk memilih opsi lain yang belum dieliminasi sambil terus menghindari monster.

5. **Musik Latar Instrumen Synthwave (BGM)**:
   - Musik instrumental murni bertema cyberpunk / chiptune yang dibuat secara dinamis menggunakan **HTML5 Web Audio API** (tanpa ketergantungan file eksternal yang rawan gagal muat).
   - Dilengkapi tombol kontrol **Mute / Unmute Musik** dan **Efek Suara (SFX)**.

6. **Responsif & Kontrol Ganda**:
   - Keyboard: `W`, `A`, `S`, `D` atau Tombol Panah `▲`, `◄`, `▼`, `►`.
   - Layar Sentuh / Mobile: Tombol D-Pad virtual di layar.

---

## 📚 Cakupan Materi Dasar-Dasar TKJ

Bank soal mencakup 20 soal komprehensif dasar TKJ:
- **Perangkat Keras Jaringan**: Router, Switch Managed vs Unmanaged, Hub, NIC, Access Point.
- **Pengkabelan & Crimping**: Standar T568A vs T568B, Kabel UTP Cat 5e/6, Konektor RJ-45, Straight-Through vs Cross-Over.
- **Model 7 Lapisan OSI**: Physical, Data Link (MAC Address), Network (IP Address), Transport (TCP/UDP), dsb.
- **Pengalamatan IP & Subnetting**: IPv4 Kelas A/B/C, Subnet Mask (/24 default 255.255.255.0), IP Loopback `127.0.0.1`, Default Gateway.
- **Topologi Jaringan**: Star, Bus, Ring, Mesh, Tree, kelebihan dan kekurangannya.
- **Layanan Jaringan & Port**: DNS (port 53), DHCP, HTTP (port 80), HTTPS (port 443), FTP (port 21).
- **Perintah Diagnostik**: `ping` (ICMP), `ipconfig` / `ifconfig` / `ip addr`, `traceroute` / `tracert`.
- **Keamanan Jaringan Dasar**: Firewall, enkripsi jaringan nirkabel WPA2/WPA3.

---

## 🚀 Cara Menjalankan Game

Game ini dibuat murni menggunakan teknologi standar web (**HTML5 Canvas, CSS3, dan Vanilla JavaScript ES6**). Tidak membutuhkan instalasi bundler atau dependensi tambahan!

### Opsi 1: Buka Langsung di Web Browser
Cukup buka berkas `index.html` dengan peramban web modern favorit Anda (Google Chrome, Firefox, Microsoft Edge, Safari, dll.).

### Opsi 2: Menggunakan Local Server (Direkomendasikan)
Jika ingin menjalankan melalui local server:
```bash
# Menggunakan Python 3:
python3 -m http.server 8080

# Atau menggunakan Node.js npx serve:
npx serve .
```
Lalu akses melalui browser di alamat:
`http://localhost:8080`

---

## 📁 Struktur Berkas

```
game-edukasi/
├── index.html           # Struktur antarmuka, HUD soal, canvas, dan modal pop-up
├── css/
│   └── style.css        # Desain cyber neon, animasi, dan layout responsif
├── js/
│   ├── questions.js     # Bank soal TKJ dengan penjelasan edukatif
│   ├── audio.js         # Web Audio API engine (Musik instrumen BGM & SFX)
│   ├── maze.js          # Pemodelan labirin, room A-B-C-D, dan barikade gerbang
│   ├── particles.js     # Efek kembang api, ledakan bom, dan partikel animasi
│   ├── entities.js      # Kontrol avatar pemain & AI monster patroli acak
│   └── game.js          # Siklus game loop, sistem skor, nyawa, dan transisi soal
└── README.md            # Dokumentasi proyek
```
