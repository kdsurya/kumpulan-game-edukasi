/**
 * Entities System: Player & Monster
 * - Player: Karakter teknisi cyber dengan kontrol smooth & sliding collision.
 * - Monster: Bug/Virus/Malware yang bergerak random di koridor dan menghindari safe zone.
 */

class Player {
  constructor(x, y, tileSize = 36) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.radius = 12; // Radius collision
    this.speed = 150; // Pixels per second
    this.vx = 0;
    this.vy = 0;
    this.facing = 'right'; // 'up', 'down', 'left', 'right'

    // Status
    this.lives = 3;
    this.maxLives = 3;
    this.invulnerableTime = 0; // Detik kebal setelah kena hit
    this.animTime = 0;
    this.isMoving = false;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.invulnerableTime = 0;
  }

  takeDamage() {
    if (this.invulnerableTime > 0) return false;
    this.lives--;
    this.invulnerableTime = 2.0; // 2 detik kebal
    if (window.soundSystem) {
      window.soundSystem.playHit();
    }
    return true;
  }

  update(dt, maze, input) {
    this.animTime += dt;
    if (this.invulnerableTime > 0) {
      this.invulnerableTime -= dt;
    }

    // Input direction
    let dirX = 0;
    let dirY = 0;

    if (input.up) dirY -= 1;
    if (input.down) dirY += 1;
    if (input.left) dirX -= 1;
    if (input.right) dirX += 1;

    // Normalisasi diagonal
    if (dirX !== 0 && dirY !== 0) {
      dirX *= 0.7071;
      dirY *= 0.7071;
    }

    this.isMoving = (dirX !== 0 || dirY !== 0);

    if (this.isMoving) {
      if (Math.abs(dirX) > Math.abs(dirY)) {
        this.facing = dirX > 0 ? 'right' : 'left';
      } else {
        this.facing = dirY > 0 ? 'down' : 'up';
      }
    }

    const moveStepX = dirX * this.speed * dt;
    const moveStepY = dirY * this.speed * dt;

    // Sliding collision terpisah di sumbu X dan Y
    if (moveStepX !== 0) {
      const nextX = this.x + moveStepX;
      if (!this.checkCollision(nextX, this.y, maze)) {
        this.x = nextX;
      }
    }

    if (moveStepY !== 0) {
      const nextY = this.y + moveStepY;
      if (!this.checkCollision(this.x, nextY, maze)) {
        this.y = nextY;
      }
    }
  }

  checkCollision(targetX, targetY, maze) {
    const ts = this.tileSize;
    const r = this.radius;

    // Periksa tile sekitar posisi target
    const minGridX = Math.floor((targetX - r) / ts);
    const maxGridX = Math.floor((targetX + r) / ts);
    const minGridY = Math.floor((targetY - r) / ts);
    const maxGridY = Math.floor((targetY + r) / ts);

    for (let gy = minGridY; gy <= maxGridY; gy++) {
      for (let gx = minGridX; gx <= maxGridX; gx++) {
        // Jika tile tidak dapat dilewati pemain
        if (!maze.isPassable(gx, gy, false)) {
          // Hitung jarak ke AABB tile
          const tileLeft = gx * ts;
          const tileTop = gy * ts;
          const tileRight = tileLeft + ts;
          const tileBottom = tileTop + ts;

          // Titik terdekat pada kotak tile ke lingkaran pemain
          const closestX = Math.max(tileLeft, Math.min(targetX, tileRight));
          const closestY = Math.max(tileTop, Math.min(targetY, tileBottom));

          const distX = targetX - closestX;
          const distY = targetY - closestY;
          const distSq = distX * distX + distY * distY;

          if (distSq < r * r) {
            return true; // Terjadi tabrakan
          }
        }
      }
    }
    return false;
  }

  getGridPos() {
    return {
      x: Math.floor(this.x / this.tileSize),
      y: Math.floor(this.y / this.tileSize)
    };
  }

  render(ctx) {
    // Efek berkedip saat kebal
    if (this.invulnerableTime > 0) {
      if (Math.floor(this.animTime * 15) % 2 === 0) {
        return; // Skip render frame untuk efek blink
      }
    }

    ctx.save();
    ctx.translate(this.x, this.y);

    // 1. Bayangan Karakter
    ctx.beginPath();
    ctx.ellipse(0, this.radius + 1, this.radius * 0.9, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();

    // 2. Shield Bubble Aura jika invulnerable
    if (this.invulnerableTime > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 6, 0, Math.PI * 2);
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(0, 229, 255, 0.2)';
      ctx.fill();
      ctx.stroke();
    }

    // 3. Badan Karakter (Cyber Operative / Teknisi TKJ)
    // Helm/Tubuh Luar
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#1e3a8a'; // Deep blue TKJ uniform
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Visor Neon Glowing
    ctx.fillStyle = '#38bdf8';
    let visorX = 0;
    let visorY = 0;
    let visorW = 12;
    let visorH = 6;

    if (this.facing === 'right') {
      visorX = 3;
      visorY = -2;
      visorW = 8;
    } else if (this.facing === 'left') {
      visorX = -11;
      visorY = -2;
      visorW = 8;
    } else if (this.facing === 'up') {
      visorX = -6;
      visorY = -8;
      visorW = 12;
      visorH = 5;
    } else {
      visorX = -6;
      visorY = 2;
      visorW = 12;
      visorH = 6;
    }

    ctx.beginPath();
    ctx.roundRect(visorX, visorY, visorW, visorH, 2);
    ctx.fill();

    // Backpack / LAN Cable spool di punggung
    ctx.fillStyle = '#f59e0b';
    if (this.facing === 'left') {
      ctx.fillRect(8, -4, 4, 8);
    } else if (this.facing === 'right') {
      ctx.fillRect(-12, -4, 4, 8);
    } else if (this.facing === 'down') {
      ctx.fillRect(-5, -13, 10, 3);
    }

    ctx.restore();
  }
}

class Monster {
  constructor(x, y, id = 1, tileSize = 36) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.tileSize = tileSize;
    this.radius = 12;
    this.speed = 95; // Sedikit lebih lambat dari player agar seru
    this.direction = { x: 0, y: 0 };
    this.animTime = Math.random() * 10;

    // Palette warna malware/bug
    this.colorSchemes = [
      { body: '#dc2626', eye: '#fef08a', glow: 'rgba(220, 38, 38, 0.4)', name: 'Trojan Bug' },
      { body: '#9333ea', eye: '#4ade80', glow: 'rgba(147, 51, 234, 0.4)', name: 'Ransomware Worm' },
      { body: '#ea580c', eye: '#38bdf8', glow: 'rgba(234, 88, 12, 0.4)', name: 'DDoS Bot' }
    ];
    this.scheme = this.colorSchemes[(id - 1) % this.colorSchemes.length];

    this.pickInitialDirection();
  }

  pickInitialDirection() {
    const dirs = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];
    this.direction = dirs[Math.floor(Math.random() * dirs.length)];
  }

  update(dt, maze) {
    this.animTime += dt * 5;
    const ts = this.tileSize;

    // Deteksi apakah monster berada di dekat pusat tile saat ini
    const curGridX = Math.floor(this.x / ts);
    const curGridY = Math.floor(this.y / ts);
    const tileCenterX = curGridX * ts + ts / 2;
    const tileCenterY = curGridY * ts + ts / 2;

    const distToCenter = Math.hypot(this.x - tileCenterX, this.y - tileCenterY);

    // Jika dekat dengan pusat tile (dalam rentang 3px), tentukan arah berikutnya
    if (distToCenter <= 3.5) {
      this.evaluateTurn(curGridX, curGridY, maze, tileCenterX, tileCenterY);
    }

    // Gerak sesuai arah saat ini
    const nextX = this.x + this.direction.x * this.speed * dt;
    const nextY = this.y + this.direction.y * this.speed * dt;

    if (!this.checkCollision(nextX, nextY, maze)) {
      this.x = nextX;
      this.y = nextY;
    } else {
      // Jika mentok dinding atau gerbang tertutup, langsung cari arah baru
      this.pickNewRandomDirection(curGridX, curGridY, maze);
    }
  }

  evaluateTurn(gx, gy, maze, centerX, centerY) {
    const allDirs = [
      { x: 0, y: -1 }, // UP
      { x: 0, y: 1 },  // DOWN
      { x: -1, y: 0 }, // LEFT
      { x: 1, y: 0 }   // RIGHT
    ];

    // Cari semua arah yang valid (bukan dinding, bukan pintu aman tertutup)
    const validDirs = allDirs.filter(d => {
      const nextGx = gx + d.x;
      const nextGy = gy + d.y;
      return maze.isPassable(nextGx, nextGy, true);
    });

    if (validDirs.length === 0) return;

    // Periksa apakah arah lurus ke depan masih valid
    const forwardValid = validDirs.some(d => d.x === this.direction.x && d.y === this.direction.y);

    // Di persimpangan: Jika ada opsi belok, ada kemungkinan 45% untuk belok secara random
    const isIntersection = validDirs.length > 2;

    if (!forwardValid || (isIntersection && Math.random() < 0.45)) {
      // Prioritaskan arah yang tidak memutar balik 180 derajat jika memungkinkan
      const nonReverseDirs = validDirs.filter(d => !(d.x === -this.direction.x && d.y === -this.direction.y));
      const pool = nonReverseDirs.length > 0 ? nonReverseDirs : validDirs;
      const chosen = pool[Math.floor(Math.random() * pool.length)];

      this.direction = chosen;
      // Kunci ke tengah garis persimpangan agar mulus
      if (chosen.x !== 0) this.y = centerY;
      if (chosen.y !== 0) this.x = centerX;
    }
  }

  pickNewRandomDirection(gx, gy, maze) {
    const allDirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 }
    ];

    const validDirs = allDirs.filter(d => maze.isPassable(gx + d.x, gy + d.y, true));
    if (validDirs.length > 0) {
      this.direction = validDirs[Math.floor(Math.random() * validDirs.length)];
    }
  }

  checkCollision(targetX, targetY, maze) {
    const ts = this.tileSize;
    const r = this.radius;

    const minGridX = Math.floor((targetX - r) / ts);
    const maxGridX = Math.floor((targetX + r) / ts);
    const minGridY = Math.floor((targetY - r) / ts);
    const maxGridY = Math.floor((targetY + r) / ts);

    for (let gy = minGridY; gy <= maxGridY; gy++) {
      for (let gx = minGridX; gx <= maxGridX; gx++) {
        // Monster tidak boleh lewat dinding atau area yang terkunci aman
        if (!maze.isPassable(gx, gy, true)) {
          const tileLeft = gx * ts;
          const tileTop = gy * ts;
          const tileRight = tileLeft + ts;
          const tileBottom = tileTop + ts;

          const closestX = Math.max(tileLeft, Math.min(targetX, tileRight));
          const closestY = Math.max(tileTop, Math.min(targetY, tileBottom));

          const distX = targetX - closestX;
          const distY = targetY - closestY;
          if (distX * distX + distY * distY < r * r) {
            return true;
          }
        }
      }
    }
    return false;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Animasi denyut / glitch
    const pulse = Math.sin(this.animTime) * 1.5;

    // 1. Glow Aura
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 4 + pulse, 0, Math.PI * 2);
    ctx.fillStyle = this.scheme.glow;
    ctx.fill();

    // 2. Badan Monster (Virus/Bug Spiky Cyber Shape)
    ctx.beginPath();
    const spikes = 8;
    for (let i = 0; i < spikes; i++) {
      const angle = (i / spikes) * Math.PI * 2 + (this.animTime * 0.2);
      const dist = (i % 2 === 0) ? this.radius + 3 + pulse : this.radius - 2;
      const px = Math.cos(angle) * dist;
      const py = Math.sin(angle) * dist;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = this.scheme.body;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 3. Glowing Eyes
    ctx.fillStyle = this.scheme.eye;
    const eyeOffset = 4;
    // Mata Kiri
    ctx.beginPath();
    ctx.arc(-eyeOffset, -2, 3, 0, Math.PI * 2);
    ctx.fill();
    // Mata Kanan
    ctx.beginPath();
    ctx.arc(eyeOffset, -2, 3, 0, Math.PI * 2);
    ctx.fill();

    // Pupil hitam
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-eyeOffset + (this.direction.x * 1), -2 + (this.direction.y * 1), 1.2, 0, Math.PI * 2);
    ctx.arc(eyeOffset + (this.direction.x * 1), -2 + (this.direction.y * 1), 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

window.Player = Player;
window.Monster = Monster;
