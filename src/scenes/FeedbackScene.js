import Phaser from 'phaser';

const UI_CONFIG = {
  COLORS: {
    BG_LIGHT: 0xE8F5E9,
    BG_RAYS: 0xDBE9D8,
    PRIMARY_GREEN: 0x1B5E20,
    BLUE_BTN: 0x1D4ED8,
    WHITE: 0xFFFFFF,
    TEXT_MAIN: '#1B5E20',
    TEXT_SUB: '#374151',
    SAFE: 0x10B981,
    RISKY: 0xEF4444,
  },
  FONTS: { MAIN: 'Inter, system-ui, -apple-system, sans-serif' }
};

export default class FeedbackScene extends Phaser.Scene {
  constructor() {
    super('FeedbackScene');
  }

  // Added 'score' to the incoming data object
  create({ scenario, level, index, outcome, score = 0 }) {
    const { width, height } = this.scale;
    const isSafe = outcome === 'safe';

    // Calculate New Score: if the choice was safe, increment the score
    const currentScore = isSafe ? score + 1 : score;
    const totalInLevel = scenario.totalInLevel || 2;

    const statusColor = isSafe ? UI_CONFIG.COLORS.SAFE : UI_CONFIG.COLORS.RISKY;

    /* ---------------- 1. BACKGROUND & RAYS ---------------- */
    this.add.rectangle(width / 2, height / 2, width, height, UI_CONFIG.COLORS.BG_LIGHT);
    const rays = this.add.container(width / 2, height / 2);
    for (let i = 0; i < 12; i++) {
      const ray = this.add.graphics().fillStyle(UI_CONFIG.COLORS.BG_RAYS, 0.4);
      ray.beginPath().moveTo(0, 0).lineTo(-150, height).lineTo(150, height).closePath().fillPath();
      ray.setAngle(i * 30);
      rays.add(ray);
    }
    this.tweens.add({ targets: rays, angle: 360, duration: 200000, repeat: -1 });

    /* ---------------- 2. REPORT CARD ---------------- */
    const cardContainer = this.add.container(width / 2, height / 2);
    const shadow = this.add.graphics().fillStyle(0x000000, 0.05).fillRoundedRect(-305, -195, 610, 400, 32);
    const body = this.add.graphics().fillStyle(UI_CONFIG.COLORS.WHITE, 1).lineStyle(6, statusColor, 1);
    body.fillRoundedRect(-300, -200, 600, 400, 32).strokeRoundedRect(-300, -200, 600, 400, 32);

    /* ---------------- 3. STATUS BADGE ---------------- */
    const badgeBg = this.add.graphics().fillStyle(statusColor, 1).fillRoundedRect(-130, -22, 260, 44, 22);
    const statusText = this.add.text(0, 0, isSafe ? 'ANALYSIS COMPLETE' : 'THREAT DETECTED', {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '14px', fontWeight: '900', color: '#ffffff', letterSpacing: 1.5
    }).setOrigin(0.5);
    const badge = this.add.container(0, -200, [badgeBg, statusText]);

    /* ---------------- 4. CONTENT ---------------- */
    const icon = this.add.text(0, -90, isSafe ? '🛡️' : '🚨', { fontSize: '100px' }).setOrigin(0.5);
    const title = this.add.text(0, 10, isSafe ? 'Assessment: Secure' : 'Assessment: Risk Found', {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '34px', fontWeight: '900', color: statusColor
    }).setOrigin(0.5);

    const explanation = this.add.text(0, 100, scenario.explanation, {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '19px', color: UI_CONFIG.COLORS.TEXT_SUB,
      align: 'center', wordWrap: { width: 500 }, lineSpacing: 8
    }).setOrigin(0.5);

    this.createProgressDots(cardContainer, index, totalInLevel);

    cardContainer.add([shadow, body, badge, icon, title, explanation]);

    /* ---------------- 5. ACTION BUTTON ---------------- */
    const isLastScenario = (index + 1) >= totalInLevel;
    const btnLabel = isLastScenario ? 'VIEW FINAL RESULTS →' : 'NEXT SCENARIO →';

    const nextBtn = this.createPillButton(width / 2, height * 0.88, btnLabel);

    nextBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 255, 255, 255);
      this.time.delayedCall(500, () => {
        if (!isLastScenario) {
          // Go to next scenario in the SAME level, passing the currentScore
          this.scene.start('ScenarioScene', {
            level,
            index: index + 1,
            score: currentScore
          });
        } else {
          // Go to the QuizScene, passing the final level results
          this.scene.start('QuizScene', {
            level,
            score: currentScore,
            total: totalInLevel
          });
        }
      });
    });

    // Animations
    cardContainer.setAlpha(0).setScale(0.9);
    this.tweens.add({ targets: cardContainer, alpha: 1, scale: 1, duration: 600, ease: 'Back.easeOut' });
    this.tweens.add({ targets: icon, y: '-=10', duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  createProgressDots(container, currentIndex, total) {
    const dotGroup = this.add.container(0, 170);
    const spacing = 30;
    const startX = -((total - 1) * spacing) / 2;

    for (let i = 0; i < total; i++) {
      const dot = this.add.circle(
        startX + i * spacing,
        0,
        6,
        i === currentIndex ? UI_CONFIG.COLORS.PRIMARY_GREEN : 0xCBD5E1
      );
      dotGroup.add(dot);
    }
    container.add(dotGroup);
  }

  createPillButton(x, y, label) {
    const container = this.add.container(x, y);
    const bg = this.add.graphics().fillStyle(UI_CONFIG.COLORS.BLUE_BTN, 1).fillRoundedRect(-140, -30, 280, 60, 30);
    const txt = this.add.text(0, 0, label, {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '18px', fontWeight: '800', color: '#ffffff'
    }).setOrigin(0.5);
    container.add([bg, txt]).setSize(280, 60).setInteractive({ useHandCursor: true });

    container.on('pointerover', () => this.tweens.add({ targets: container, scale: 1.05, duration: 100 }));
    container.on('pointerout', () => this.tweens.add({ targets: container, scale: 1, duration: 100 }));

    return container;
  }
}