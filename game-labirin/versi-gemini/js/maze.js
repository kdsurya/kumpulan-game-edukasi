/**
 * Maze Layout & Management System
 * Mengatur grid labirin, 4 Room Opsi (A, B, C, D), Gate/Gerbang, dan rendering Canvas.
 */

// Tipe Tile
const TILE = {
  FLOOR: 0,
  WALL: 1,
  ROOM_A: 2,
  ROOM_B: 3,
  ROOM_C: 4,
  ROOM_D: 5,
  GATE_A: 10,
  GATE_B: 11,
  GATE_C: 12,
  GATE_D: 13
};

// Room Metadata
const ROOM_INFO = {
  0: { key: 'A', name: 'Opsi A', color: '#00e5ff', bg: 'rgba(0, 229, 255, 0.15)', gateId: 10 },
  1: { key: 'B', name: 'Opsi B', color: '#00e676', bg: 'rgba(0, 230, 118, 0.15)', gateId: 11 },
  2: { key: 'C', name: 'Opsi C', color: '#ffb300', bg: 'rgba(255, 179, 0, 0.15)', gateId: 12 },
  3: { key: 'D', name: 'Opsi D', color: '#e040fb', bg: 'rgba(224, 64, 251, 0.15)', gateId: 13 }
};

class Maze {
  constructor(cols = 25, rows = 19, tileSize = 36) {
    this.cols = cols;
    this.rows = rows;
    this.tileSize = tileSize;
    this.grid = [];
    this.gateStates = {
      0: 'OPEN', // 'OPEN', 'LOCKED_SAFE', 'BOMBED_DISABLED'
      1: 'OPEN',
      2: 'OPEN',
      3: 'OPEN'
    };

    // Koordinat pusat masing-masing room untuk teks & efek
    this.roomCenters = {
      0: { x: 3, y: 3 },    // Room A
      1: { x: 21, y: 3 },   // Room B
      2: { x: 3, y: 15 },   // Room C
      3: { x: 21, y: 15 }   // Room D
    };

    // Koordinat pintu gerbang
    this.gateCoords = {
      0: [{ x: 5, y: 3 }],
      1: [{ x: 19, y: 3 }],
      2: [{ x: 5, y: 15 }],
      3: [{ x: 19, y: 15 }]
    };

    // Player spawn awal
    this.playerSpawn = { x: 12, y: 9 };

    // Monster spawns (berada di persimpangan koridor)
    this.monsterSpawns = [
      { x: 8, y: 4 },
      { x: 16, y: 4 },
      { x: 8, y: 14 },
      { x: 16, y: 14 }
    ];

    this.pulseAnim = 0;
    this.buildMap();
  }

  buildMap() {
    // 0: Floor, 1: Wall
    // Inisialisasi grid penuh wall atau floor
    const W = this.cols;
    const H = this.rows;
    this.grid = Array.from({ length: H }, () => Array(W).fill(TILE.FLOOR));

    // 1. Dinding batas luar
    for (let x = 0; x < W; x++) {
      this.grid[0][x] = TILE.WALL;
      this.grid[H - 1][x] = TILE.WALL;
    }
    for (let y = 0; y < H; y++) {
      this.grid[y][0] = TILE.WALL;
      this.grid[y][W - 1] = TILE.WALL;
    }

    // 2. Ruang Opsi A (Kiri Atas: x 1..5, y 1..5)
    for (let y = 1; y <= 5; y++) {
      for (let x = 1; x <= 5; x++) {
        if (x === 5 || y === 5) {
          this.grid[y][x] = TILE.WALL;
        } else {
          this.grid[y][x] = TILE.ROOM_A;
        }
      }
    }
    this.grid[3][5] = TILE.GATE_A; // Pintu gerbang A menghadap koridor tengah

    // 3. Ruang Opsi B (Kanan Atas: x 19..23, y 1..5)
    for (let y = 1; y <= 5; y++) {
      for (let x = 19; x <= 23; x++) {
        if (x === 19 || y === 5) {
          this.grid[y][x] = TILE.WALL;
        } else {
          this.grid[y][x] = TILE.ROOM_B;
        }
      }
    }
    this.grid[3][19] = TILE.GATE_B; // Pintu gerbang B menghadap koridor tengah

    // 4. Ruang Opsi C (Kiri Bawah: x 1..5, y 13..17)
    for (let y = 13; y <= 17; y++) {
      for (let x = 1; x <= 5; x++) {
        if (x === 5 || y === 13) {
          this.grid[y][x] = TILE.WALL;
        } else {
          this.grid[y][x] = TILE.ROOM_C;
        }
      }
    }
    this.grid[15][5] = TILE.GATE_C; // Pintu gerbang C

    // 5. Ruang Opsi D (Kanan Bawah: x 19..23, y 13..17)
    for (let y = 13; y <= 17; y++) {
      for (let x = 19; x <= 23; x++) {
        if (x === 19 || y === 13) {
          this.grid[y][x] = TILE.WALL;
        } else {
          this.grid[y][x] = TILE.ROOM_D;
        }
      }
    }
    this.grid[15][19] = TILE.GATE_D; // Pintu gerbang D

    // 6. Rintangan Labirin (Symmetrical Cyber Conduits)
    // Dinding labirin internal yang membentuk koridor dan rute memutar yang seru
    const internalWalls = [
      // Pilar dan sekat horizontal atas & bawah
      [2, 8, 1, 4],   // y=2, x=8..11
      [2, 13, 1, 4],  // y=2, x=13..16
      [16, 8, 1, 4],  // y=16, x=8..11
      [16, 13, 1, 4], // y=16, x=13..16

      // Sekat vertikal dekat ruang opsi
      [6, 3, 3, 1],   // x=3, y=6..8
      [10, 3, 3, 1],  // x=3, y=10..12
      [6, 21, 3, 1],  // x=21, y=6..8
      [10, 21, 3, 1], // x=21, y=10..12

      // Koridor tengah atas & bawah
      [4, 7, 3, 1],   // x=7, y=4..6
      [4, 17, 3, 1],  // x=17, y=4..6
      [12, 7, 3, 1],  // x=7, y=12..14
      [12, 17, 3, 1], // x=17, y=12..14

      // Blok tengah di sekitar hub player
      [6, 9, 1, 7],   // y=6, x=9..15
      [12, 9, 1, 7],  // y=12, x=9..15
      [8, 7, 3, 1],   // x=7, y=8..10
      [8, 17, 3, 1],  // x=17, y=8..10

      // Pilar penambah tantangan di koridor vertikal
      [9, 10, 1, 1],
      [9, 14, 1, 1]
    ];

    internalWalls.forEach(([startY, startX, h, w]) => {
      for (let y = startY; y < startY + h; y++) {
        for (let x = startX; x < startX + w; x++) {
          if (y >= 0 && y < H && x >= 0 && x < W) {
            // Pastikan tidak menimpa gate atau room
            if (this.grid[y][x] === TILE.FLOOR) {
              this.grid[y][x] = TILE.WALL;
            }
          }
        }
      }
    });
  }

  resetGates() {
    this.gateStates = {
      0: 'OPEN',
      1: 'OPEN',
      2: 'OPEN',
      3: 'OPEN'
    };
  }

  setGateState(roomIndex, state) {
    this.gateStates[roomIndex] = state;
  }

  isPassable(gridX, gridY, isMonster = false) {
    if (gridX < 0 || gridX >= this.cols || gridY < 0 || gridY >= this.rows) {
      return false;
    }
    const tile = this.grid[gridY][gridX];

    // Dinding tidak bisa dilewati siapapun
    if (tile === TILE.WALL) return false;

    // Gerbang A
    if (tile === TILE.GATE_A) {
      const state = this.gateStates[0];
      if (state === 'LOCKED_SAFE') return false; // Terkunci rapat
      if (isMonster) return false; // Monster berpatroli di koridor labirin
      return true;
    }
    // Gerbang B
    if (tile === TILE.GATE_B) {
      const state = this.gateStates[1];
      if (state === 'LOCKED_SAFE') return false;
      if (isMonster) return false;
      return true;
    }
    // Gerbang C
    if (tile === TILE.GATE_C) {
      const state = this.gateStates[2];
      if (state === 'LOCKED_SAFE') return false;
      if (isMonster) return false;
      return true;
    }
    // Gerbang D
    if (tile === TILE.GATE_D) {
      const state = this.gateStates[3];
      if (state === 'LOCKED_SAFE') return false;
      if (isMonster) return false;
      return true;
    }

    // Monster berpatroli di koridor labirin, tidak berkemah di dalam ruang opsi jawaban
    if (isMonster && tile >= TILE.ROOM_A && tile <= TILE.ROOM_D) {
      return false;
    }

    return true;
  }

  getRoomAt(gridX, gridY) {
    if (gridX < 0 || gridX >= this.cols || gridY < 0 || gridY >= this.rows) return -1;
    const tile = this.grid[gridY][gridX];
    if (tile === TILE.ROOM_A) return 0;
    if (tile === TILE.ROOM_B) return 1;
    if (tile === TILE.ROOM_C) return 2;
    if (tile === TILE.ROOM_D) return 3;
    return -1;
  }

  update(dt) {
    this.pulseAnim += dt * 3;
  }

  render(ctx, currentQuestion) {
    const ts = this.tileSize;

    // 1. Render Dasar Grid (Lantai, Dinding, Ruangan)
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const tile = this.grid[y][x];
        const px = x * ts;
        const py = y * ts;

        if (tile === TILE.WALL) {
          // Cyber Wall
          ctx.fillStyle = '#0b1329';
          ctx.fillRect(px, py, ts, ts);

          ctx.strokeStyle = '#1d3557';
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 0.5, py + 0.5, ts - 1, ts - 1);

          // Grid pattern / circuit line on wall
          ctx.fillStyle = '#162b4d';
          ctx.fillRect(px + 4, py + 4, ts - 8, ts - 8);
        } else if (tile >= TILE.ROOM_A && tile <= TILE.ROOM_D) {
          const roomIdx = tile - TILE.ROOM_A;
          const info = ROOM_INFO[roomIdx];
          const state = this.gateStates[roomIdx];

          // Ruangan Opsi
          if (state === 'BOMBED_DISABLED') {
            ctx.fillStyle = 'rgba(60, 20, 20, 0.45)';
          } else if (state === 'LOCKED_SAFE') {
            ctx.fillStyle = 'rgba(0, 230, 118, 0.28)';
          } else {
            ctx.fillStyle = info.bg;
          }
          ctx.fillRect(px, py, ts, ts);

          // Grid dot
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.fillRect(px + ts / 2 - 1, py + ts / 2 - 1, 2, 2);
        } else {
          // Corridor Floor (Jalur Labirin)
          ctx.fillStyle = '#080d1a';
          ctx.fillRect(px, py, ts, ts);

          // Cyber dots on floor
          ctx.fillStyle = 'rgba(0, 180, 255, 0.08)';
          ctx.fillRect(px + ts / 2 - 1, py + ts / 2 - 1, 2, 2);
        }

        // Render Gerbang (Gate Tiles)
        if (tile >= TILE.GATE_A && tile <= TILE.GATE_D) {
          const gateIdx = tile - TILE.GATE_A;
          const state = this.gateStates[gateIdx];
          this.renderGateTile(ctx, px, py, ts, gateIdx, state);
        }
      }
    }

    // 2. Render Room Signs & Labels (A, B, C, D)
    for (let i = 0; i < 4; i++) {
      this.renderRoomBanner(ctx, i, currentQuestion);
    }
  }

  renderGateTile(ctx, px, py, ts, gateIdx, state) {
    const info = ROOM_INFO[gateIdx];

    if (state === 'LOCKED_SAFE') {
      // Barikade Laser Hijau Terkunci Rapat
      ctx.fillStyle = 'rgba(0, 230, 118, 0.35)';
      ctx.fillRect(px, py, ts, ts);

      // Sinar laser berdenyut
      const laserGlow = (Math.sin(this.pulseAnim * 2) + 1) * 0.5;
      ctx.strokeStyle = `rgba(0, 255, 128, ${0.7 + laserGlow * 0.3})`;
      ctx.lineWidth = 4;
      ctx.strokeRect(px + 3, py + 3, ts - 6, ts - 6);

      // Icon Gembok / Barikade Safe
      ctx.fillStyle = '#00ff80';
      ctx.font = 'bold 14px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔒', px + ts / 2, py + ts / 2);
    } else if (state === 'BOMBED_DISABLED') {
      // Area hangus terbakar
      ctx.fillStyle = 'rgba(255, 20, 20, 0.2)';
      ctx.fillRect(px, py, ts, ts);

      ctx.strokeStyle = '#d90429';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(px + 2, py + 2, ts - 4, ts - 4);
      ctx.setLineDash([]);

      ctx.fillStyle = '#ef233c';
      ctx.font = 'bold 14px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✕', px + ts / 2, py + ts / 2);
    } else {
      // Gate OPEN (Portal Berdenyut Siap Dimasuki)
      const pulse = (Math.sin(this.pulseAnim) + 1) * 0.5;
      ctx.fillStyle = `rgba(${gateIdx === 0 ? '0,229,255' : gateIdx === 1 ? '0,230,118' : gateIdx === 2 ? '255,179,0' : '224,64,251'}, ${0.15 + pulse * 0.15})`;
      ctx.fillRect(px, py, ts, ts);

      ctx.strokeStyle = info.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(px + 4, py + 4, ts - 8, ts - 8);
      ctx.setLineDash([]);
    }
  }

  renderRoomBanner(ctx, roomIdx, currentQuestion) {
    const center = this.roomCenters[roomIdx];
    const info = ROOM_INFO[roomIdx];
    const state = this.gateStates[roomIdx];
    const ts = this.tileSize;

    const cx = center.x * ts + ts / 2;
    const cy = center.y * ts + ts / 2;

    // Lingkaran atau badge label di tengah ruangan
    ctx.save();

    if (state === 'LOCKED_SAFE') {
      // Safe Shield Ring
      ctx.beginPath();
      ctx.arc(cx, cy - 8, 26, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 230, 118, 0.3)';
      ctx.fill();
      ctx.strokeStyle = '#00e676';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Big Checkmark
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✓', cx, cy - 8);

      ctx.font = 'bold 11px "Segoe UI", sans-serif';
      ctx.fillStyle = '#00ff80';
      ctx.fillText('AMAN (BENAR)', cx, cy + 24);
    } else if (state === 'BOMBED_DISABLED') {
      // Red X
      ctx.beginPath();
      ctx.arc(cx, cy - 8, 24, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(220, 38, 38, 0.35)';
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#ff4d4d';
      ctx.font = 'bold 26px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✗', cx, cy - 8);

      ctx.font = 'bold 10px "Segoe UI", sans-serif';
      ctx.fillStyle = '#f87171';
      ctx.fillText('SALAH (BOM)', cx, cy + 22);
    } else {
      // Normal Room State
      const glow = (Math.sin(this.pulseAnim + roomIdx) + 1) * 0.5;

      // Glow badge
      ctx.beginPath();
      ctx.arc(cx, cy - 8, 22, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(10, 20, 35, 0.85)';
      ctx.fill();
      ctx.strokeStyle = info.color;
      ctx.lineWidth = 2 + glow;
      ctx.stroke();

      // Big Letter A, B, C, D
      ctx.fillStyle = info.color;
      ctx.font = 'bold 22px "Consolas", "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`[${info.key}]`, cx, cy - 8);

      // Option preview text (singkat di bawah badge)
      if (currentQuestion && currentQuestion.options[roomIdx]) {
        let optText = currentQuestion.options[roomIdx];
        if (optText.length > 14) {
          optText = optText.substring(0, 12) + '..';
        }
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '10px "Segoe UI", sans-serif';
        ctx.fillText(optText, cx, cy + 22);
      }
    }

    ctx.restore();
  }
}

window.Maze = Maze;
window.TILE = TILE;
window.ROOM_INFO = ROOM_INFO;
