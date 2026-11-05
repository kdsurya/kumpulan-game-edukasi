/**
 * Particle System & Visual Effects Engine
 * Mengelola:
 * 1. Kembang Api (Fireworks) saat jawaban Benar
 * 2. Ledakan Bom (Explosion + Screen Shake) saat jawaban Salah
 * 3. Tanda Centang Besar (✓) & Silang Merah (✗)
 * 4. Efek Percikan Aura & Laser Barikade
 */

class Particle {
  constructor(x, y, vx, vy, color, size, life, shape = 'circle', gravity = 0.05, drag = 0.98) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.maxLife = life;
    this.life = life;
    this.shape = shape;
    this.gravity = gravity;
    this.drag = drag;
    this.alpha = 1;
    this.rotation = Math.random() * Math.PI * 2;
    this.vRot = (Math.random() - 0.5) * 0.2;
  }

  update(dt) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= this.drag;
    this.vy *= this.drag;
    this.rotation += this.vRot;
    this.life -= dt;
    this.alpha = Math.max(0, this.life / this.maxLife);
    return this.life > 0;
  }

  render(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.shape === 'spark') {
      ctx.fillRect(-this.size * 1.5, -this.size * 0.5, this.size * 3, this.size);
    } else if (this.shape === 'star') {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * this.size, -Math.sin((18 + i * 72) * Math.PI / 180) * this.size);
        ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (this.size / 2), -Math.sin((54 + i * 72) * Math.PI / 180) * (this.size / 2));
      }
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.shakeDuration = 0;
    this.shakeIntensity = 0;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;

    // Overlay visual badges (Centang / Silang)
    this.overlays = [];
  }

  shake(intensity = 10, duration = 0.4) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
  }

  update(dt) {
    // 1. Update Shake
    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
      const factor = this.shakeDuration / 0.4;
      this.shakeOffsetX = (Math.random() - 0.5) * 2 * this.shakeIntensity * factor;
      this.shakeOffsetY = (Math.random() - 0.5) * 2 * this.shakeIntensity * factor;
      if (this.shakeDuration <= 0) {
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
      }
    }

    // 2. Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (!this.particles[i].update(dt)) {
        this.particles.splice(i, 1);
      }
    }

    // 3. Update Overlays
    for (let i = this.overlays.length - 1; i >= 0; i--) {
      const ov = this.overlays[i];
      ov.elapsed += dt;
      if (ov.elapsed >= ov.duration) {
        this.overlays.splice(i, 1);
      }
    }
  }

  render(ctx) {
    // Render Particles
    for (const p of this.particles) {
      p.render(ctx);
    }

    // Render Overlays (Centang atau Silang Besar)
    for (const ov of this.overlays) {
      this.renderOverlay(ctx, ov);
    }
  }

  renderOverlay(ctx, ov) {
    const progress = Math.min(1, ov.elapsed / 0.2); // 0.2s pop-in
    const scale = ov.isExit
      ? Math.max(0, 1 - (ov.elapsed - (ov.duration - 0.3)) / 0.3)
      : Math.min(1.2, progress * 1.2);
    const alpha = ov.elapsed > (ov.duration - 0.3)
      ? Math.max(0, (ov.duration - ov.elapsed) / 0.3)
      : 1;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(ov.x, ov.y);
    ctx.scale(scale, scale);

    if (ov.type === 'CHECK') {
      // Glow Ring
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 230, 118, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#00ff80';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Centang
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✓', 0, -2);

      // Teks Benar
      ctx.font = 'bold 16px "Segoe UI", sans-serif';
      ctx.fillStyle = '#00ff80';
      ctx.fillText('BENAR!', 0, 44);
    } else if (ov.type === 'CROSS') {
      // Red Glow Ring
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Silang
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 52px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✗', 0, -2);

      // Teks Salah
      ctx.font = 'bold 16px "Segoe UI", sans-serif';
      ctx.fillStyle = '#ff6b6b';
      ctx.fillText('SALAH!', 0, 44);
    }

    ctx.restore();
  }

  /**
   * Efek Ledakan Bom (Saat Jawaban Salah)
   */
  createExplosion(x, y) {
    this.shake(14, 0.45);

    // Shockwave Ring Particles
    const colors = ['#ff0033', '#ff5500', '#ffaa00', '#ffffff', '#555555'];
    const count = 75;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const speed = 2.5 + Math.random() * 6.5;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 3 + Math.random() * 6;
      const life = 0.5 + Math.random() * 0.5;

      this.particles.push(new Particle(x, y, vx, vy, color, size, life, 'circle', 0.08, 0.94));
    }

    // Smoke embers
    for (let i = 0; i < 25; i++) {
      const vx = (Math.random() - 0.5) * 3;
      const vy = -1 - Math.random() * 3;
      const size = 8 + Math.random() * 10;
      this.particles.push(new Particle(x, y, vx, vy, 'rgba(100, 100, 100, 0.7)', size, 0.8, 'circle', -0.02, 0.96));
    }

    // Tampilkan Silang Merah (✗)
    this.overlays.push({
      x,
      y,
      type: 'CROSS',
      elapsed: 0,
      duration: 1.6
    });
  }

  /**
   * Efek Kembang Api (Saat Jawaban Benar)
   */
  createFireworks(centerX, centerY) {
    // Tampilkan Centang Hijau (✓)
    this.overlays.push({
      x: centerX,
      y: centerY,
      type: 'CHECK',
      elapsed: 0,
      duration: 2.4
    });

    // Buat beberapa ledakan kembang api berturut-turut di sekitar area
    const burstPositions = [
      { x: centerX, y: centerY },
      { x: centerX - 60, y: centerY - 50 },
      { x: centerX + 60, y: centerY - 45 },
      { x: centerX - 30, y: centerY + 50 },
      { x: centerX + 40, y: centerY + 40 }
    ];

    const fireworkPalettes = [
      ['#00ffcc', '#00e5ff', '#80d8ff', '#ffffff'],
      ['#00e676', '#69f0ae', '#b9f6ca', '#ffffff'],
      ['#ffd600', '#ffff00', '#ffea00', '#ffffff'],
      ['#ff4081', '#f50057', '#ff80ab', '#ffffff'],
      ['#7c4dff', '#b388ff', '#ede7f6', '#ffffff']
    ];

    burstPositions.forEach((pos, idx) => {
      setTimeout(() => {
        if (window.soundSystem) {
          window.soundSystem.playFirework();
        }
        this.burstFirework(pos.x, pos.y, fireworkPalettes[idx % fireworkPalettes.length]);
      }, idx * 180);
    });
  }

  burstFirework(x, y, palette) {
    const count = 55;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const speed = 2.0 + Math.random() * 5.0;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const color = palette[Math.floor(Math.random() * palette.length)];
      const size = 2.5 + Math.random() * 3.5;
      const life = 0.7 + Math.random() * 0.6;
      const shape = Math.random() > 0.4 ? 'spark' : 'circle';

      this.particles.push(new Particle(x, y, vx, vy, color, size, life, shape, 0.05, 0.96));
    }
  }

  /**
   * Efek Percikan Barikade Pintu Menutup
   */
  createDoorLockSpark(x, y) {
    for (let i = 0; i < 20; i++) {
      const vx = (Math.random() - 0.5) * 4;
      const vy = (Math.random() - 0.5) * 4;
      this.particles.push(new Particle(x, y, vx, vy, '#00ff80', 3, 0.4, 'spark', 0.02, 0.95));
    }
  }

  clear() {
    this.particles = [];
    this.overlays = [];
    this.shakeDuration = 0;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
  }
}

window.ParticleSystem = ParticleSystem;
