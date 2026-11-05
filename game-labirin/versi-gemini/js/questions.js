/**
 * Bank Soal Dasar-Dasar Teknik Komputer dan Jaringan (TKJ)
 * Setiap soal memiliki:
 * - question: Pertanyaan
 * - options: 4 Opsi jawaban [A, B, C, D]
 * - answer: Index jawaban benar (0=A, 1=B, 2=C, 3=D)
 * - explanation: Penjelasan edukatif yang ditampilkan saat berhasil dijawab
 * - category: Kategori materi TKJ
 */

const TKJ_QUESTIONS = [
  {
    id: 1,
    category: "Perangkat Jaringan",
    question: "Perangkat jaringan yang berfungsi menghubungkan dua atau lebih jaringan yang berbeda network/subnet adalah...",
    options: [
      "Router",
      "Switch",
      "Hub",
      "Repeater"
    ],
    answer: 0, // A
    explanation: "Router bekerja pada Layer 3 (Network) dan berfungsi untuk merutekan paket data antar jaringan yang memiliki segmen/subnet IP berbeda."
  },
  {
    id: 2,
    category: "Pengkabelan (Crimping)",
    question: "Kabel UTP standar T568B diawali dengan urutan dua pin pertama berwarna...",
    options: [
      "Putih Hijau - Hijau",
      "Putih Oranye - Oranye",
      "Putih Biru - Biru",
      "Putih Cokelat - Cokelat"
    ],
    answer: 1, // B
    explanation: "Standar T568B diawali dengan Putih Oranye, Oranye, disusul Putih Hijau, Biru, Putih Biru, Hijau, Putih Cokelat, Cokelat."
  },
  {
    id: 3,
    category: "Protokol Jaringan",
    question: "Protokol yang bertugas memberikan alamat IP secara otomatis ke perangkat client adalah...",
    options: [
      "DNS (Domain Name System)",
      "FTP (File Transfer Protocol)",
      "DHCP (Dynamic Host Configuration Protocol)",
      "SMTP (Simple Mail Transfer Protocol)"
    ],
    answer: 2, // C
    explanation: "DHCP (Dynamic Host Configuration Protocol) bertugas meminjamkan dan mengonfigurasi IP address, subnet mask, dan gateway secara otomatis ke host client."
  },
  {
    id: 4,
    category: "Pengalamatan IP",
    question: "Manakah di bawah ini yang merupakan alamat IP Loopback (Localhost) pada IPv4?",
    options: [
      "192.168.1.1",
      "10.0.0.1",
      "169.254.0.1",
      "127.0.0.1"
    ],
    answer: 3, // D
    explanation: "Alamat IP 127.0.0.1 dialokasikan khusus sebagai IP Loopback (localhost) untuk menguji stack protokol TCP/IP internal pada komputer itu sendiri."
  },
  {
    id: 5,
    category: "Model OSI",
    question: "Pada model 7 OSI Layer, lapisan (layer) yang bertugas mengatur pengalamatan fisik (MAC Address) adalah...",
    options: [
      "Data Link Layer (Layer 2)",
      "Network Layer (Layer 3)",
      "Transport Layer (Layer 4)",
      "Physical Layer (Layer 1)"
    ],
    answer: 0, // A
    explanation: "Data Link Layer (Layer 2) bertanggung jawab atas transfer data antar node pada segmen yang sama dan menangani pengalamatan fisik (MAC Address)."
  },
  {
    id: 6,
    category: "Topologi Jaringan",
    question: "Topologi jaringan yang menghubungkan setiap node ke satu perangkat konsentrator pusat (Switch/Hub) disebut...",
    options: [
      "Topologi Bus",
      "Topologi Star",
      "Topologi Ring",
      "Topologi Mesh"
    ],
    answer: 1, // B
    explanation: "Topologi Star menghubungkan semua kabel dari workstation ke satu titik konsentrator pusat seperti Switch atau Hub. Jika satu kabel putus, node lain tidak terganggu."
  },
  {
    id: 7,
    category: "Perintah Jaringan",
    question: "Perintah Command Prompt (CMD) yang digunakan untuk menguji konektivitas antar komputer dengan protokol ICMP adalah...",
    options: [
      "ipconfig",
      "tracert",
      "ping",
      "netstat"
    ],
    answer: 2, // C
    explanation: "Perintah 'ping' mengirimkan paket ICMP Echo Request ke host tujuan untuk mengecek apakah host tersebut aktif dan mengukur latency bolak-balik."
  },
  {
    id: 8,
    category: "Konektor & Media Transmisi",
    question: "Konektor standar yang digunakan untuk memasang kabel UTP ke kartu jaringan (NIC / LAN Card) adalah...",
    options: [
      "RJ-11",
      "BNC",
      "ST / SC",
      "RJ-45"
    ],
    answer: 3, // D
    explanation: "Konektor RJ-45 memiliki 8 pin tembaga yang dirancang pas untuk 8 kabel pilin di dalam kabel UTP/STP pada jaringan komputer ethernet."
  },
  {
    id: 9,
    category: "Protokol & Port",
    question: "Layanan penjelajah web yang aman (HTTPS) secara default bekerja pada nomor port...",
    options: [
      "443",
      "80",
      "21",
      "53"
    ],
    answer: 0, // A
    explanation: "HTTPS (Hypertext Transfer Protocol Secure) berjalan pada port 443 dengan enkripsi TLS/SSL, sedangkan HTTP biasa berjalan pada port 80."
  },
  {
    id: 10,
    category: "Pengalamatan IP",
    question: "Subnet mask default untuk jaringan IPv4 Kelas C adalah...",
    options: [
      "255.0.0.0",
      "255.255.255.0",
      "255.255.0.0",
      "255.255.255.255"
    ],
    answer: 1, // B
    explanation: "IPv4 Kelas C menggunakan prefiks /24 dengan Subnet Mask default 255.255.255.0, menyediakan hingga 254 alamat host yang dapat digunakan."
  },
  {
    id: 11,
    category: "Protokol Jaringan",
    question: "Layanan yang berfungsi menerjemahkan nama domain (seperti www.google.com) menjadi alamat IP adalah...",
    options: [
      "DHCP",
      "FTP",
      "DNS",
      "SNMP"
    ],
    answer: 2, // C
    explanation: "DNS (Domain Name System) berperan seperti buku telepon internet yang memetakan nama domain ramah manusia ke alamat IP numerik mesin."
  },
  {
    id: 12,
    category: "Model OSI",
    question: "Protokol TCP dan UDP beroperasi pada lapisan OSI layer ke berapa?",
    options: [
      "Layer 2 - Data Link",
      "Layer 3 - Network",
      "Layer 5 - Session",
      "Layer 4 - Transport"
    ],
    answer: 3, // D
    explanation: "Layer 4 (Transport Layer) mengelola transfer data ujung-ke-ujung (end-to-end), kontrol aliran, dan deteksi error, di mana TCP dan UDP berada."
  },
  {
    id: 13,
    category: "Perangkat Jaringan",
    question: "Perangkat jaringan Layer 2 yang dapat mempelajari dan mengingat MAC address tabel port untuk meneruskan data secara spesifik adalah...",
    options: [
      "Switch",
      "Hub",
      "Modem",
      "Repeater"
    ],
    answer: 0, // A
    explanation: "Switch bekerja cerdas dengan tabel MAC address sehingga paket unicast hanya dikirim ke port tujuan yang bersangkutan, tidak seperti Hub yang membroadcast ke semua port."
  },
  {
    id: 14,
    category: "Pengkabelan",
    question: "Kabel yang digunakan untuk menghubungkan dua perangkat yang sejenis (misalnya PC langsung ke PC tanpa switch) secara langsung adalah...",
    options: [
      "Straight-Through Cable",
      "Cross-Over Cable",
      "Rollover Cable",
      "Coaxial Cable"
    ],
    answer: 1, // B
    explanation: "Kabel Cross-Over digunakan untuk menghubungkan dua perangkat sejenis (PC ke PC, Switch ke Switch) dengan membalik pin kirim (TX) dan terima (RX) di kedua ujungnya."
  },
  {
    id: 15,
    category: "Perintah Jaringan",
    question: "Perintah pada sistem operasi Linux yang digunakan untuk melihat konfigurasi antarmuka jaringan adalah...",
    options: [
      "ipconfig",
      "tracert",
      "ifconfig atau ip addr",
      "cls"
    ],
    answer: 2, // C
    explanation: "Pada sistem operasi Linux/Unix, perintah 'ifconfig' atau 'ip addr' digunakan untuk melihat dan mengatur IP address serta status interface jaringan."
  },
  {
    id: 16,
    category: "Jangkauan Jaringan",
    question: "Jaringan komputer yang mencakup area geografis luas antarkota, antarnegara, bahkan antorbenua disebut...",
    options: [
      "PAN (Personal Area Network)",
      "LAN (Local Area Network)",
      "MAN (Metropolitan Area Network)",
      "WAN (Wide Area Network)"
    ],
    answer: 3, // D
    explanation: "WAN (Wide Area Network) adalah jaringan komputer berskala luas yang melintasi batas geografis kota, negara, hingga benua menggunakan infrastruktur telekomunikasi."
  },
  {
    id: 17,
    category: "Media Transmisi",
    question: "Media transmisi jaringan yang menggunakan sinyal cahaya melalui serat kaca atau plastik murni dan kebal terhadap interferensi elektromagnetik adalah...",
    options: [
      "Fiber Optic",
      "UTP Cat 6",
      "Coaxial",
      "STP"
    ],
    answer: 0, // A
    explanation: "Kabel Fiber Optic mentransmisikan data dalam bentuk pulsa cahaya melalui serat kaca, memberikan kecepatan sangat tinggi, jarak jauh, dan kebal induksi magnetik/listrik."
  },
  {
    id: 18,
    category: "Keamanan Jaringan",
    question: "Sistem pengaman yang mengawasi dan mengontrol lalu lintas jaringan masuk dan keluar berdasarkan aturan keamanan yang telah ditetapkan disebut...",
    options: [
      "Antivirus",
      "Firewall",
      "Proxy Cache",
      "Switching"
    ],
    answer: 1, // B
    explanation: "Firewall bertindak sebagai benteng pertahanan penyaring paket data jaringan, mencegah akses tanpa izin dan potensi serangan cyber ke dalam jaringan lokal."
  },
  {
    id: 19,
    category: "Perangkat Keras",
    question: "Alat penguji yang digunakan oleh teknisi TKJ untuk memastikan seluruh 8 kawat kabel UTP terpasang dan tersambung dengan benar ke konektor RJ-45 adalah...",
    options: [
      "Tang Crimping",
      "Punch Down Tool",
      "LAN Tester / Cable Tester",
      "Multimeter"
    ],
    answer: 2, // C
    explanation: "LAN Tester (Cable Tester) dilengkapi 8 lampu LED indikator untuk mengecek kelurusan, konektivitas, dan kontinuitas 8 pin kabel UTP yang telah dipress."
  },
  {
    id: 20,
    category: "Alamat Fisik",
    question: "Berapa bit panjang dari sebuah MAC Address (Physical Address) pada kartu jaringan?",
    options: [
      "32 bit",
      "64 bit",
      "128 bit",
      "48 bit"
    ],
    answer: 3, // D
    explanation: "MAC Address memiliki panjang 48 bit (6 oktet heksadesimal, misal 00:1A:2B:3C:4D:5E), unik di dunia dan diprogram langsung oleh pabrik pembuat chip NIC."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TKJ_QUESTIONS };
}
