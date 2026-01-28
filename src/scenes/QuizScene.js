import Phaser from 'phaser';

const UI_CONFIG = {
  COLORS: {
    BG_LIGHT: 0xE8F5E9,
    BG_RAYS: 0xDBE9D8,
    PRIMARY_GREEN: 0x1B5E20,
    BLUE_BTN: 0x1D4ED8,
    WHITE: 0xFFFFFF,
    TEXT_SUB: '#374151',
    GOLD: 0xF59E0B,     // Trophy color
    SUCCESS: 0x10B981,  // Green
    WARNING: 0xDC2626,  // Red
    NEUTRAL: 0xF59E0B   // Orange
  },
  FONTS: { MAIN: 'Inter, system-ui, -apple-system, sans-serif' }
};

export default class QuizScene extends Phaser.Scene {
  constructor() { super('QuizScene'); }

  create({ level, score = 0, total = 2 }) {
    const { width, height } = this.scale;

    // Logic for dynamic feedback
    const isPerfect = score === total;
    const isPoor = score === 0;
    const isMixed = !isPerfect && !isPoor;

    /* ---------------- 1. BACKGROUND ---------------- */
    this.add.rectangle(width / 2, height / 2, width, height, UI_CONFIG.COLORS.BG_LIGHT);
    
    const rays = this.add.container(width / 2, height / 2);
    const rayColor = isPoor ? 0xFFCDD2 : UI_CONFIG.COLORS.BG_RAYS; // Red rays if poor score
    for (let i = 0; i < 12; i++) {
      const ray = this.add.graphics().fillStyle(rayColor, 0.5);
      ray.beginPath().moveTo(0, 0).lineTo(-180, height).lineTo(180, height).closePath().fillPath();
      ray.setAngle(i * 30);
      rays.add(ray);
    }
    this.tweens.add({ targets: rays, angle: 360, duration: 180000, repeat: -1 });

    // Only show confetti if they got at least one right
    if (!isPoor) this.createConfetti(width, height);

    /* ---------------- 2. ACHIEVEMENT HUB ---------------- */
    const leftX = width * 0.35;
    const achievementContainer = this.add.container(leftX, height * 0.5);

    // Change icon and badge color based on score
    let trophyEmoji = isPerfect ? '🏆' : (isMixed ? '🥈' : '⚠️');
    let borderColor = isPerfect ? UI_CONFIG.COLORS.GOLD : (isMixed ? 0x94A3B8 : UI_CONFIG.COLORS.WARNING);

    const badge = this.add.graphics();
    badge.fillStyle(UI_CONFIG.COLORS.WHITE, 1).lineStyle(4, borderColor, 1);
    badge.fillRoundedRect(-120, -140, 240, 280, 40).strokeRoundedRect(-120, -140, 240, 280, 40);

    const trophyIcon = this.add.text(0, -30, trophyEmoji, { fontSize: '110px' }).setOrigin(0.5);
    
    const scoreDisplay = this.add.text(0, 85, `${score} / ${total} CORRECT`, {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '22px', fontWeight: '900', color: '#1B5E20'
    }).setOrigin(0.5);

    achievementContainer.add([badge, trophyIcon, scoreDisplay]);

    /* ---------------- 3. DYNAMIC CONTENT ---------------- */
    const rightX = width * 0.72;
    const infoContainer = this.add.container(rightX, height * 0.5);

    // Set text content based on performance
    let badgeText, titleText, descText;
    if (isPerfect) {
      badgeText = "MISSION ACCOMPLISHED";
      titleText = "Perfect Work,\nDetective!";
      descText = "Your security awareness is flawless. You spotted every trap!";
    } else if (isMixed) {
      badgeText = "LEVEL COMPLETE";
      titleText = "Good Effort,\nDetective!";
      descText = "You caught some scams, but some slipped through. Stay sharp!";
    } else {
      badgeText = "SECURITY BREACH";
      titleText = "Careful,\nDetective!";
      descText = "You fell for the traps this time. Try again!";
    }

    const statusBadge = this.add.text(0, -110, badgeText, {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '14px', fontWeight: '900',
      color: isPoor ? UI_CONFIG.COLORS.WARNING : UI_CONFIG.COLORS.SUCCESS, letterSpacing: 2
    }).setOrigin(0.5);

    const title = this.add.text(0, -40, titleText, {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '52px', fontWeight: '900',
      color: isPoor ? '#991B1B' : UI_CONFIG.COLORS.PRIMARY_GREEN, align: 'center', lineSpacing: -5
    }).setOrigin(0.5);

    const summary = this.add.text(0, 80, descText, {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '20px', color: UI_CONFIG.COLORS.TEXT_SUB,
      align: 'center', wordWrap: { width: 380 }, lineSpacing: 6
    }).setOrigin(0.5);

    /* ---------------- 4. ACTION BUTTON ---------------- */
    const buttonLabel = isPoor ? 'RETRY LEVEL ↺' : 'NEXT MISSION →';
    const nextBtn = this.createPillButton(0, 180, buttonLabel);
    infoContainer.add([statusBadge, title, summary, nextBtn]);

    nextBtn.on('pointerdown', () => {
      if (isPoor) {
        // Retry current level
        this.scene.start('ScenarioScene', { level, index: 0 });
      } else {
        this.handleNext(level);
      }
    });
  }

  // --- Helpers ---
  createConfetti(width, height) {
    const colors = [0x10B981, 0x6366F1, 0xF59E0B];
    colors.forEach(color => {
      this.add.particles(0, 0, 'flare', {
        x: { min: 0, max: width }, y: -10,
        lifespan: 3000, speedY: { min: 100, max: 300 },
        scale: { start: 0.1, end: 0 }, tint: color, frequency: 150
      });
    });
  }

  createPillButton(x, y, label) {
    const container = this.add.container(x, y);
    const w = 300, h = 65;
    const bg = this.add.graphics().fillStyle(UI_CONFIG.COLORS.BLUE_BTN, 1).fillRoundedRect(-w/2, -h/2, w, h, 32);
    const txt = this.add.text(0, 0, label, { fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '18px', fontWeight: '800', color: '#ffffff' }).setOrigin(0.5);
    container.add([bg, txt]).setSize(w, h).setInteractive({ useHandCursor: true });
    return container;
  }

  handleNext(level) {
    this.cameras.main.fadeOut(500, 255, 255, 255);
    this.time.delayedCall(500, () => {
      const nextLevel = level + 1;
      if (nextLevel <= 3) {
        this.scene.start('ScenarioScene', { level: nextLevel, index: 0 });
      } else {
        this.scene.start('EndScene');
      }
    });
  }
}