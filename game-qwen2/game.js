// game.js
// Logika permainan tarik tambang sederhana untuk 5 pertanyaan pengenalan jaringan (SMK Kelas 10)

const questions = [
  {
    q: "Apa kepanjangan dari LAN?",
    choices: ["Large Area Network","Local Area Network","Long Access Network","Low Area Network"],
    answer: 1
  },
  {
    q: "Perangkat yang berfungsi menghubungkan beberapa jaringan disebut...",
    choices: ["Switch","Router","Modem","Repeater"],
    answer: 1
  },
  {
    q: "Alamat IP biasanya ditulis dalam empat angka dipisah titik, format ini disebut...",
    choices: ["Hexadecimal","Dotted Decimal","Binary Group","Slash Notation"],
    answer: 1
  },
  {
    q: "Protokol yang digunakan untuk menerjemahkan nama domain menjadi alamat IP adalah...",
    choices: ["HTTP","DNS","FTP","SMTP"],
    answer: 1
  },
  {
    q: "Perangkat yang menghubungkan perangkat dalam satu jaringan lokal (LAN) adalah...",
    choices: ["Router","Switch","Firewall","Hub"],
    answer: 1
  }
];

const total = questions.length;
let current = 0;
let correctCount = 0;

// Visual rope: we represent position as an offset (%) from center. 0 = center, negative = shift ke kiri (siswa), positive = shift ke kanan (komputer)
let ropePos = 0;
const step = 18; // percent shift per jawaban (sesuaikan visual)

const el = {
  current: document.getElementById('current'),
  total: document.getElementById('total'),
  question: document.getElementById('question'),
  options: document.getElementById('options'),
  rope: document.getElementById('rope'),
  message: document.getElementById('message'),
  nextBtn: document.getElementById('nextBtn'),
  restartBtn: document.getElementById('restartBtn')
};

el.total.textContent = total;

function renderQuestion(){
  el.current.textContent = current+1;
  const item = questions[current];
  el.question.textContent = item.q;
  el.options.innerHTML = '';
  item.choices.forEach((c, idx) => {
    const b = document.createElement('button');
    b.className = 'option-btn';
    b.textContent = c;
    b.onclick = () => selectAnswer(idx);
    el.options.appendChild(b);
  });
  el.message.textContent = '';
  el.nextBtn.disabled = true;
}

function selectAnswer(idx){
  const item = questions[current];
  const buttons = [...el.options.children];
  // disable all
  buttons.forEach(btn => btn.classList.add('disabled'));
  const correct = idx === item.answer;
  if(correct){
    correctCount++;
    moveRope(-step); // kalo benar, geser ke kiri (siswa)
    buttons[idx].classList.add('correct');
    el.message.textContent = 'Benar! Tali bergerak ke kiri untuk siswa.';
  } else {
    moveRope(step); // kalo salah, geser ke kanan (komputer)
    buttons[idx].classList.add('wrong');
    // tandai jawaban benar juga
    const correctBtn = buttons[item.answer];
    if(correctBtn) correctBtn.classList.add('correct');
    el.message.textContent = 'Salah. Tali bergerak ke arah komputer.';
  }
  el.nextBtn.disabled = false;
  // jika ini soal terakhir, ganti tombol next jadi lihat hasil
  if(current === total - 1){
    el.nextBtn.textContent = 'Lihat Hasil';
  } else {
    el.nextBtn.textContent = 'Soal Berikutnya';
  }
}

function moveRope(deltaPercent){
  ropePos += deltaPercent;
  // batasi agar tetap di viewport (antara -step*total ... +step*total)
  const limit = step * total;
  if(ropePos < -limit) ropePos = -limit;
  if(ropePos > limit) ropePos = limit;
  // rope left in percent relative to center (50% +/- value)
  const leftPercent = 50 + ropePos;
  el.rope.style.left = leftPercent + '%';
}

function nextQuestion(){
  // jika sudah di soal terakhir, tampilkan hasil akhir
  if(current === total - 1){
    showResult();
    return;
  }
  current++;
  renderQuestion();
}

function showResult(){
  // Sesuai permintaan: jika semua pertanyaan dijawab benar maka tim kiri (siswa) menang.
  const container = document.createElement('div');
  container.classList.add('result');
  if(correctCount === total){
    container.classList.add('win');
    container.textContent = `Selamat — semua jawaban benar. Tim Siswa menang! (${correctCount}/${total})`;
    // animate rope ke kiri penuh
    ropePos = -step * total;
  } else {
    container.classList.add('lose');
    container.textContent = `Permainan selesai. Tim Komputer menang. Jawaban benar: ${correctCount}/${total}.`;
    // animate rope ke kanan penuh (komputer menang)
    ropePos = step * total;
  }
  el.rope.style.left = (50 + ropePos) + '%';
  el.message.innerHTML = '';
  // tampilkan hasil di bawah info
  const parent = document.getElementById('info');
  // remove previous result kalau ada
  const prev = parent.querySelector('.result');
  if(prev) prev.remove();
  parent.appendChild(container);

  // show restart
  el.restartBtn.style.display = 'inline-block';
  el.nextBtn.disabled = true;
}

function restartGame(){
  current = 0;
  correctCount = 0;
  ropePos = 0;
  el.rope.style.left = '50%';
  el.restartBtn.style.display = 'none';
  el.nextBtn.disabled = true;
  el.nextBtn.textContent = 'Soal Berikutnya';
  renderQuestion();
}

// init
renderQuestion();
