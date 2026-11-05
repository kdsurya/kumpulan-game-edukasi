/**
 * Main Game Controller
 * Mengintegrasikan Maze, Entities (Player & Monster), Audio, Partikel, dan UI State.
 */

class TKJMazeQuest {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // Grid labirin
    this.cols = 25;
    this.rows = 19;
    this.tileSize = 36;
    this.canvas.width = this.cols * this.tileSize; // 900
    this.canvas.height = this.rows * this.tileSize; // 684

    // Modul game
    this.maze = new Maze(this.cols, this.rows, this.tileSize);
    this.particles = new ParticleSystem();
    this.player = new Player(0, 0, this.tileSize);
    this.monsters = [];

    // State permainan
    this.state = 'START'; // 'START', 'PLAYING', 'ROUND_SUCCESS', 'GAME_OVER', 'VICTORY'
    this.score = 0;
    this.questionIndex = 0;
    this.questionsList = [];
    this.currentQuestion = null;
    this.currentRoomActive = null;

    // Timer transisi soal
    this.nextQuestionTimer = 0;

    // Input keyboard
    this.input = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    this.lastTime = 0;
    this.setupEventListeners();
    this.setupUI();
    this.initGameSession();
  }

  initGameSession() {
    // Acak urutan soal TKJ agar selalu variatif
    this.questionsList = [...TKJ_QUESTIONS].sort(() => Math.random() - 0.5);
    this.questionIndex = 0;
    this.score = 0;
    this.player.lives = 3;
  }

  startQuestion(index) {
    if (index >= this.questionsList.length) {
      this.triggerVictory();
      return;
    }

    this.questionIndex = index;
    this.currentQuestion = this.questionsList[index];
    this.currentRoomActive = null;
    this.state = 'PLAYING';

    // Reset labirin & gerbang
    this.maze.resetGates();
    this.particles.clear();

    // Spawn player di tengah
    const spawn = this.maze.playerSpawn;
    this.player.reset(
      spawn.x * this.tileSize + this.tileSize / 2,
      spawn.y * this.tileSize + this.tileSize / 2
    );

    // Spawn monster (2 monster pada soal 1-5, 3 monster pada soal 6+)
    this.monsters = [];
    const monsterCount = this.questionIndex >= 5 ? 3 : 2;
    const spawns = [...this.maze.monsterSpawns].sort(() => Math.random() - 0.5);

    for (let i = 0; i < monsterCount; i++) {
      const sp = spawns[i % spawns.length];
      const m = new Monster(
        sp.x * this.tileSize + this.tileSize / 2,
        sp.y * this.tileSize + this.tileSize / 2,
        i + 1,
        this.tileSize
      );
      this.monsters.push(m);
    }

    this.updateHUD();
    this.hideModal();
  }

  updateHUD() {
    if (!this.currentQuestion) return;

    // Update nomor soal dan kategori
    document.getElementById('questionCategory').textContent = this.currentQuestion.category;
    document.getElementById('questionNumber').textContent = `Soal ${this.questionIndex + 1} / ${this.questionsList.length}`;
    document.getElementById('questionText').textContent = this.currentQuestion.question;

    // Update 4 Opsi di HUD atas
    for (let i = 0; i < 4; i++) {
      const optEl = document.getElementById(`hudOption${i}`);
      const statusEl = document.getElementById(`optStatus${i}`);
      const textEl = document.getElementById(`optText${i}`);

      if (optEl && textEl) {
        textEl.textContent = this.currentQuestion.options[i];
        optEl.classList.remove('option-correct', 'option-wrong', 'option-disabled');

        const state = this.maze.gateStates[i];
        if (state === 'LOCKED_SAFE') {
          optEl.classList.add('option-correct');
          if (statusEl) statusEl.textContent = '✓ BENAR (TERKUNCI AMAN)';
        } else if (state === 'BOMBED_DISABLED') {
          optEl.classList.add('option-wrong');
          if (statusEl) statusEl.textContent = '✗ SALAH (TERELIMINASI)';
        } else {
          if (statusEl) statusEl.textContent = 'PILIH DI LABIRIN';
        }
      }
    }

    // Update Nyawa / Shields
    const heartsContainer = document.getElementById('hudHearts');
    if (heartsContainer) {
      let heartsHtml = '';
      for (let i = 0; i < this.player.maxLives; i++) {
        if (i < this.player.lives) {
          heartsHtml += '<span class="heart active">💙</span>';
        } else {
          heartsHtml += '<span class="heart lost">🖤</span>';
        }
      }
      heartsContainer.innerHTML = heartsHtml;
    }

    // Update Skor
    const scoreEl = document.getElementById('hudScore');
    if (scoreEl) {
      scoreEl.textContent = this.score;
    }
  }

  checkRoomEntry() {
    if (this.state !== 'PLAYING') return;

    const gridPos = this.player.getGridPos();
    const roomIdx = this.maze.getRoomAt(gridPos.x, gridPos.y);

    if (roomIdx !== -1) {
      const currentGateState = this.maze.gateStates[roomIdx];

      // Jika area ini belum pernah diuji
      if (currentGateState === 'OPEN') {
        const center = this.maze.roomCenters[roomIdx];
        const pixelCenterX = center.x * this.tileSize + this.tileSize / 2;
        const pixelCenterY = center.y * this.tileSize + this.tileSize / 2;

        if (roomIdx === this.currentQuestion.answer) {
          // --- JAWABAN BENAR! ---
          this.handleCorrectAnswer(roomIdx, pixelCenterX, pixelCenterY);
        } else {
          // --- JAWABAN SALAH! ---
          this.handleWrongAnswer(roomIdx, pixelCenterX, pixelCenterY);
        }
      }
    }
  }

  handleCorrectAnswer(roomIdx, centerX, centerY) {
    this.state = 'ROUND_SUCCESS';

    // 1. Kunci gerbang area ini sehingga monster TIDAK bisa masuk (SAFE ZONE)
    this.maze.setGateState(roomIdx, 'LOCKED_SAFE');

    // 2. Mainkan suara berhasil & pintu terkunci
    if (window.soundSystem) {
      window.soundSystem.playDoorLock();
      setTimeout(() => {
        window.soundSystem.playSuccess();
      }, 150);
    }

    // 3. Efek Kembang Api & Tanda Centang
    this.particles.createFireworks(centerX, centerY);
    this.particles.createDoorLockSpark(
      this.maze.gateCoords[roomIdx][0].x * this.tileSize + this.tileSize / 2,
      this.maze.gateCoords[roomIdx][0].y * this.tileSize + this.tileSize / 2
    );

    // Tambah skor (+100) + bonus sisa nyawa
    const bonus = this.player.lives * 20;
    this.score += 100 + bonus;
    this.updateHUD();

    // Tampilkan modal edukatif setelah kembang api meletup
    setTimeout(() => {
      this.showExplanationModal(true);
    }, 1200);
  }

  handleWrongAnswer(roomIdx, centerX, centerY) {
    // 1. Ledakan Bom & Layar Bergetar
    this.particles.createExplosion(centerX, centerY);

    // 2. Mainkan suara ledakan
    if (window.soundSystem) {
      window.soundSystem.playExplosion();
    }

    // 3. Tandai ruangan tersebut sebagai salah (hangus)
    this.maze.setGateState(roomIdx, 'BOMBED_DISABLED');
    this.updateHUD();

    // User tetap hidup dan bebas berjalan keluar untuk memilih opsi lain yang masih buka!
  }

  checkMonsterCollision() {
    if (this.state !== 'PLAYING') return;

    for (const monster of this.monsters) {
      const dist = Math.hypot(this.player.x - monster.x, this.player.y - monster.y);
      if (dist < (this.player.radius + monster.radius - 2)) {
        const tookDamage = this.player.takeDamage();
        if (tookDamage) {
          this.particles.shake(10, 0.3);

          // Knockback halus menjauhi monster
          const angle = Math.atan2(this.player.y - monster.y, this.player.x - monster.x);
          const pushDist = 18;
          const nextX = this.player.x + Math.cos(angle) * pushDist;
          const nextY = this.player.y + Math.sin(angle) * pushDist;
          if (!this.player.checkCollision(nextX, this.player.y, this.maze)) {
            this.player.x = nextX;
          }
          if (!this.player.checkCollision(this.player.x, nextY, this.maze)) {
            this.player.y = nextY;
          }

          this.updateHUD();

          if (this.player.lives <= 0) {
            this.triggerGameOver();
            return;
          }
        }
      }
    }
  }

  showExplanationModal(isCorrect) {
    const modal = document.getElementById('gameModal');
    const modalHeader = document.getElementById('modalHeader');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalActionBtn = document.getElementById('modalActionBtn');

    modalHeader.className = 'modal-header success';
    modalTitle.innerHTML = '🎉 JAWABAN TEPAT! AREA AMAN DARI MONSTER';

    modalBody.innerHTML = `
      <div class="result-badge success">
        <span class="badge-icon">✓</span>
        <div>
          <div class="badge-title">Opsi [${ROOM_INFO[this.currentQuestion.answer].key}] Benar: ${this.currentQuestion.options[this.currentQuestion.answer]}</div>
          <div class="badge-subtitle">Pintu berhasil disegel dengan barikade laser pelindung.</div>
        </div>
      </div>
      <div class="explanation-box">
        <div class="exp-title">📘 Materi Edukasi TKJ:</div>
        <p class="exp-text">${this.currentQuestion.explanation}</p>
      </div>
    `;

    modalActionBtn.textContent = (this.questionIndex + 1 >= this.questionsList.length)
      ? 'Lihat Hasil Akhir 🏆'
      : 'Lanjut Soal Berikutnya ➔';

    modalActionBtn.onclick = () => {
      this.hideModal();
      this.startQuestion(this.questionIndex + 1);
    };

    modal.classList.add('visible');
  }

  triggerGameOver() {
    this.state = 'GAME_OVER';
    if (window.soundSystem) {
      window.soundSystem.playHit();
    }

    const modal = document.getElementById('gameModal');
    const modalHeader = document.getElementById('modalHeader');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalActionBtn = document.getElementById('modalActionBtn');

    modalHeader.className = 'modal-header danger';
    modalTitle.innerHTML = '💀 SISTEM JEBOL! SHIELD HABIS';

    modalBody.innerHTML = `
      <div class="result-badge danger">
        <span class="badge-icon">✗</span>
        <div>
          <div class="badge-title">Avatar Tertangkap Oleh Bug/Malware Jaringan!</div>
          <div class="badge-subtitle">Skor kamu: <strong>${this.score}</strong> di Soal ke-${this.questionIndex + 1}</div>
        </div>
      </div>
      <div class="explanation-box">
        <div class="exp-title">Kunci Jawaban Soal Ini:</div>
        <p class="exp-text"><strong>[${ROOM_INFO[this.currentQuestion.answer].key}] ${this.currentQuestion.options[this.currentQuestion.answer]}</strong></p>
        <p class="exp-text" style="margin-top: 8px;">${this.currentQuestion.explanation}</p>
      </div>
    `;

    modalActionBtn.textContent = '🔄 Coba Lagi Dari Awal';
    modalActionBtn.onclick = () => {
      this.initGameSession();
      this.startQuestion(0);
    };

    modal.classList.add('visible');
  }

  triggerVictory() {
    this.state = 'VICTORY';
    if (window.soundSystem) {
      window.soundSystem.playSuccess();
    }

    const modal = document.getElementById('gameModal');
    const modalHeader = document.getElementById('modalHeader');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalActionBtn = document.getElementById('modalActionBtn');

    modalHeader.className = 'modal-header victory';
    modalTitle.innerHTML = '🏆 SELAMAT! QUEST TKJ BERHASIL DITUNTASKAN';

    modalBody.innerHTML = `
      <div class="result-badge success">
        <span class="badge-icon">★</span>
        <div>
          <div class="badge-title">Gelar: Master Administrator Jaringan TKJ!</div>
          <div class="badge-subtitle">Kamu berhasil melewati seluruh labirin dan menghalau serangan malware.</div>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-val">${this.score}</div>
          <div class="stat-lbl">Total Skor</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${this.questionsList.length} / ${this.questionsList.length}</div>
          <div class="stat-lbl">Soal Terjawab</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${this.player.lives} / 3</div>
          <div class="stat-lbl">Sisa Shield</div>
        </div>
      </div>
    `;

    modalActionBtn.textContent = '🎮 Main Lagi (Acak Soal)';
    modalActionBtn.onclick = () => {
      this.initGameSession();
      this.startQuestion(0);
    };

    modal.classList.add('visible');
  }

  hideModal() {
    const modal = document.getElementById('gameModal');
    if (modal) modal.classList.remove('visible');
  }

  setupEventListeners() {
    // Keyboard Listener
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        this.input.up = true;
        e.preventDefault();
      }
      if (['ArrowDown', 'KeyS'].includes(e.code)) {
        this.input.down = true;
        e.preventDefault();
      }
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        this.input.left = true;
        e.preventDefault();
      }
      if (['ArrowRight', 'KeyD'].includes(e.code)) {
        this.input.right = true;
        e.preventDefault();
      }

      // Pastikan Audio Context aktif saat tombol pertama ditekan
      if (window.soundSystem) {
        window.soundSystem.ensureContext();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) this.input.up = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.input.down = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.input.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.input.right = false;
    });

    // Touch Virtual D-Pad
    const bindTouchButton = (btnId, dir) => {
      const btn = document.getElementById(btnId);
      if (!btn) return;

      const startHandler = (e) => {
        e.preventDefault();
        this.input[dir] = true;
        if (window.soundSystem) window.soundSystem.ensureContext();
      };
      const endHandler = (e) => {
        e.preventDefault();
        this.input[dir] = false;
      };

      btn.addEventListener('touchstart', startHandler, { passive: false });
      btn.addEventListener('touchend', endHandler, { passive: false });
      btn.addEventListener('mousedown', startHandler);
      btn.addEventListener('mouseup', endHandler);
      btn.addEventListener('mouseleave', endHandler);
    };

    bindTouchButton('dpadUp', 'up');
    bindTouchButton('dpadDown', 'down');
    bindTouchButton('dpadLeft', 'left');
    bindTouchButton('dpadRight', 'right');
  }

  setupUI() {
    // Tombol Mulai di Start Screen
    const btnStart = document.getElementById('btnStartGame');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        document.getElementById('startScreen').style.display = 'none';
        if (window.soundSystem) {
          window.soundSystem.startBGM();
        }
        this.startQuestion(0);
      });
    }

    // Toggle Musik (BGM)
    const btnToggleBGM = document.getElementById('btnToggleBGM');
    if (btnToggleBGM) {
      btnToggleBGM.addEventListener('click', () => {
        if (window.soundSystem) {
          const active = window.soundSystem.toggleBGM();
          btnToggleBGM.innerHTML = active ? '🎵 Musik: ON' : '🔇 Musik: OFF';
          btnToggleBGM.classList.toggle('muted', !active);
        }
      });
    }

    // Toggle SFX
    const btnToggleSFX = document.getElementById('btnToggleSFX');
    if (btnToggleSFX) {
      btnToggleSFX.addEventListener('click', () => {
        if (window.soundSystem) {
          const active = window.soundSystem.toggleSFX();
          btnToggleSFX.innerHTML = active ? '🔊 SFX: ON' : '🔈 SFX: OFF';
          btnToggleSFX.classList.toggle('muted', !active);
        }
      });
    }

    // Tombol Restart
    const btnRestart = document.getElementById('btnRestart');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        if (confirm('Mulai ulang permainan dari soal pertama?')) {
          this.initGameSession();
          this.startQuestion(0);
        }
      });
    }
  }

  start() {
    this.lastTime = performance.now();
    requestAnimationFrame((time) => this.loop(time));
  }

  loop(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    this.update(dt);
    this.render();

    requestAnimationFrame((time) => this.loop(time));
  }

  update(dt) {
    this.particles.update(dt);
    this.maze.update(dt);

    if (this.state === 'PLAYING' || this.state === 'ROUND_SUCCESS') {
      for (const monster of this.monsters) {
        monster.update(dt, this.maze);
      }
    }

    if (this.state === 'PLAYING') {
      this.player.update(dt, this.maze, this.input);
      this.checkRoomEntry();
      this.checkMonsterCollision();
    }
  }

  render() {
    this.ctx.save();

    // Terapkan Screen Shake jika ada ledakan
    this.ctx.translate(this.particles.shakeOffsetX, this.particles.shakeOffsetY);

    // 1. Bersihkan Canvas
    this.ctx.fillStyle = '#050811';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 2. Render Maze & Rooms
    this.maze.render(this.ctx, this.currentQuestion);

    // 3. Render Monsters
    for (const monster of this.monsters) {
      monster.render(this.ctx);
    }

    // 4. Render Player
    this.player.render(this.ctx);

    // 5. Render Partikel & Efek Centang/Silang
    this.particles.render(this.ctx);

    this.ctx.restore();
  }
}

// Inisialisasi saat window dimuat
window.addEventListener('DOMContentLoaded', () => {
  window.game = new TKJMazeQuest();
  window.game.start();
});
