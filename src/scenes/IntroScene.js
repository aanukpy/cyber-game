import Phaser from 'phaser';

const UI_CONFIG = {
  COLORS: {
    BG_BASE: 0xF0FDF4,      // Very light mint base
    MESH_1: 0xDCFCE7,       // Soft green blob
    MESH_2: 0xBBF7D0,       // Mid green blob
    PRIMARY_GREEN: 0x166534, // Dark forest green for titles
    BLUE_BTN: 0x1D4ED8,     // Brand blue
    TECH_GREEN: 0x22C55E,    // Vibrant tech green
    WHITE: 0xFFFFFF,
    TEXT_SUB: '#374151'
  },
  FONTS: {
    MAIN: 'Inter, system-ui, -apple-system, sans-serif'
  }
};

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene');
  }

  create() {
    const { width, height } = this.scale;

    /* ---------------- 1. DYNAMIC MESH GRADIENT BG ---------------- */
    this.add.rectangle(width / 2, height / 2, width, height, UI_CONFIG.COLORS.BG_BASE);

    this.blobs = [];
    const colors = [UI_CONFIG.COLORS.MESH_1, UI_CONFIG.COLORS.MESH_2, 0x86EFAC];
    
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const blob = this.add.circle(x, y, Phaser.Math.Between(300, 600), colors[i % colors.length], 0.4);
      blob.setBlendMode(Phaser.BlendModes.MULTIPLY);
      
      this.tweens.add({
        targets: blob,
        x: x + Phaser.Math.Between(-200, 200),
        y: y + Phaser.Math.Between(-200, 200),
        duration: Phaser.Math.Between(10000, 15000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      this.blobs.push(blob);
    }

    /* ---------------- 2. TECH OVERLAY (Data Grid) ---------------- */
    const gridSpacing = 60;
    const techGraphics = this.add.graphics();
    techGraphics.lineStyle(1, UI_CONFIG.COLORS.TECH_GREEN, 0.15);
    
    for (let x = 0; x < width; x += gridSpacing) {
      for (let y = 0; y < height; y += gridSpacing) {
        techGraphics.lineBetween(x - 3, y, x + 3, y);
        techGraphics.lineBetween(x, y - 3, x, y + 3);
      }
    }

    this.createDataParticles(width, height);

    /* ---------------- 3. FLOATING DECORATIONS ---------------- */
    const chat = this.createFloatingChat(width * 0.15, height * 0.4);
    const card = this.createTechCard(width * 0.15, height * 0.75);
    const shield = this.createSecurityShield(width * 0.85, height * 0.3);
    const padlock = this.createGlowPadlock(width * 0.88, height * 0.7);

    /* ---------------- 4. CENTRAL PANEL (Glassmorphism) ---------------- */
    const centerX = width / 2;
    const centerY = height / 2;

    const glass = this.add.graphics();
    glass.fillStyle(0xFFFFFF, 0.7);
    glass.fillRoundedRect(centerX - 400, centerY - 220, 800, 440, 30);
    glass.lineStyle(2, 0xFFFFFF, 0.8);
    glass.strokeRoundedRect(centerX - 400, centerY - 220, 800, 440, 30);

    const title = this.add.text(centerX, centerY - 50, "ONLINE SCAM RISK \n EVALUATION", {
      fontFamily: UI_CONFIG.FONTS.MAIN,
      fontSize: '52px',
      fontWeight: '950',
      color: UI_CONFIG.COLORS.PRIMARY_GREEN,
      align: 'center',
      lineSpacing: -15
    }).setOrigin(0.5);

    const subtext = this.add.text(centerX, centerY + 110, 
      "This activity focuses on identifying common online scam \nscenarios. Review each situation carefully and choose the most appropriate action.", {
      fontFamily: UI_CONFIG.FONTS.MAIN,
      fontSize: '20px',
      color: UI_CONFIG.COLORS.TEXT_SUB,
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5);

    const startBtn = this.createPillButton(centerX, centerY + 220, 'START');

    /* ---------------- 5. ENTRANCE EFFECTS ---------------- */
    [title, subtext, startBtn].forEach((el, i) => {
      el.setAlpha(0).setY(el.y + 20);
      this.tweens.add({
        targets: el,
        alpha: 1,
        y: '-=20',
        delay: 300 + (i * 150),
        duration: 800,
        ease: 'Cubic.easeOut'
      });
    });

    startBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(800, 255, 255, 255);
      this.time.delayedCall(800, () => this.scene.start('ScenarioScene', { level: 1, index: 0 }));
    });
  }

  /* ---------------- HELPERS (FIXED ICON CLIPPING) ---------------- */

  createDataParticles(width, height) {
    for (let i = 0; i < 15; i++) {
      const dot = this.add.rectangle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        4, 4, UI_CONFIG.COLORS.TECH_GREEN, 0.2
      );
      this.tweens.add({
        targets: dot,
        y: '-=100',
        alpha: { start: 0.2, end: 0 },
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 5000)
      });
    }
  }

  createPillButton(x, y, label) {
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(UI_CONFIG.COLORS.BLUE_BTN, 1);
    bg.fillRoundedRect(-170, -35, 340, 70, 35);
    const txt = this.add.text(0, 0, label, {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '20px', fontWeight: '800', color: '#FFFFFF'
    }).setOrigin(0.5);
    container.add([bg, txt]);
    container.setSize(340, 70).setInteractive({ useHandCursor: true });
    container.on('pointerover', () => this.tweens.add({ targets: container, scale: 1.05, duration: 100 }));
    container.on('pointerout', () => this.tweens.add({ targets: container, scale: 1, duration: 100 }));
    return container;
  }

  createSecurityShield(x, y) {
    const container = this.add.container(x, y);
    const circle = this.add.circle(0, 0, 160, UI_CONFIG.COLORS.TECH_GREEN, 0.1);
    // Added padding to prevent top-clipping
    const shield = this.add.text(0, 0, "📧", { 
        fontSize: '200px',
        padding: { top: 15, bottom: 15 } 
    }).setOrigin(0.5);
    container.add([circle, shield]);
    this.addFloatingAnim(container, 4000, -20);
    return container;
  }

  createTechCard(x, y) {
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x065F46, 0x065F46, 0x166534, 0x166534, 1);
    bg.fillRoundedRect(-90, -55, 180, 110, 12);
    const chip = this.add.rectangle(-60, -20, 40, 30, 0xFFFFFF, 0.2);
    container.add([bg, chip]);
    container.setAngle(-10);
    this.addFloatingAnim(container, 3000, 15);
    return container;
  }

  createFloatingChat(x, y) {
    const container = this.add.container(x, y);
    // Added padding to prevent top-clipping
    const chat = this.add.text(0, 0, "💬", { 
        fontSize: '80px',
        padding: { top: 15, bottom: 15 } 
    }).setOrigin(0.5);
    container.add(chat);
    this.addFloatingAnim(container, 3500, -15);
    return container;
  }

  createGlowPadlock(x, y) {
    const container = this.add.container(x, y);
    // Added padding to prevent top-clipping
    const lock = this.add.text(0, 0, "🔒", { 
        fontSize: '60px',
        padding: { top: 15, bottom: 15 } 
    }).setOrigin(0.5);
    container.add(lock);
    this.addFloatingAnim(container, 3800, 10);
    return container;
  }

  addFloatingAnim(target, duration, yOffset) {
    this.tweens.add({
      targets: target,
      y: `+=${yOffset}`,
      duration: duration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
}