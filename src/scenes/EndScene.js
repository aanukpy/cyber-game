import Phaser from 'phaser';

const UI_CONFIG = {
  COLORS: {
    BG_LIGHT: 0xF0F4F8,
    BG_RAYS: 0xD1D5DB, 
    PRIMARY_NAVY: 0x1E293B,
    SUCCESS_EMERALD: 0x10B981,
    WHITE: 0xFFFFFF,
    TEXT_MAIN: '#1E293B',
    TEXT_SUB: '#475569',
  },
  FONTS: { MAIN: 'Inter, system-ui, -apple-system, sans-serif' }
};

export default class EndScene extends Phaser.Scene {
  constructor() {
    super('EndScene');
  }

  create() {
    const { width, height } = this.scale;

    // 1. Background
    this.add.rectangle(width / 2, height / 2, width, height, UI_CONFIG.COLORS.BG_LIGHT);
    
    const rays = this.add.container(width / 2, height / 2);
    for (let i = 0; i < 12; i++) {
      const ray = this.add.graphics().fillStyle(UI_CONFIG.COLORS.BG_RAYS, 0.2);
      ray.beginPath().moveTo(0, 0).lineTo(-200, height).lineTo(200, height).closePath().fillPath();
      ray.setAngle(i * 30);
      rays.add(ray);
    }
    this.tweens.add({ targets: rays, angle: 360, duration: 250000, repeat: -1 });

    // 2. Main Card
    const card = this.add.container(width / 2, height / 2);
    
    const body = this.add.graphics();
    body.fillStyle(0x000000, 0.1).fillRoundedRect(-345, -245, 700, 500, 40); // Shadow
    body.fillStyle(UI_CONFIG.COLORS.WHITE, 1).lineStyle(2, 0xE2E8F0, 1);
    body.fillRoundedRect(-350, -250, 700, 500, 40).strokeRoundedRect(-350, -250, 700, 500, 40);

    // Green accent bar
    body.fillStyle(UI_CONFIG.COLORS.SUCCESS_EMERALD, 1);
    body.fillRoundedRect(-350, -250, 700, 12, { tl: 40, tr: 40, bl: 0, br: 0 });

    // 3. Content
    const badge = this.add.text(0, -140, '🎊', { fontSize: '90px' }).setOrigin(0.5);
    
    const title = this.add.text(0, -30, 'CONGRATULATIONS!', {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '42px', fontWeight: '900', color: '#10B981', letterSpacing: 2
    }).setOrigin(0.5);

    const subtitle = this.add.text(0, 20, "You've completed all levels successfully.", {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '18px', fontWeight: '600', color: UI_CONFIG.COLORS.TEXT_SUB
    }).setOrigin(0.5);

    const divider = this.add.graphics().lineStyle(1, 0xE2E8F0, 1).lineBetween(-200, 65, 200, 65);

    // Awareness Checklist
    const msg = [
      "🛡️ Stay Vigilant: Double-check every link.",
      "🔐 Stay Secure: Use multi-factor authentication.",
      "🤔 Stay Alert: Trust your instincts online."
    ];

    const messageBox = this.add.text(0, 150, msg.join('\n\n'), {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '19px', fontWeight: '700',
      color: UI_CONFIG.COLORS.TEXT_MAIN, align: 'center', lineSpacing: 5
    }).setOrigin(0.5);

    card.add([body, badge, title, subtitle, divider, messageBox]);

    // 4. Restart Button
    const restartBtn = this.createPillButton(width / 2, height * 0.88, 'RESTART GAME');
    restartBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 255, 255, 255);
      this.time.delayedCall(500, () => this.scene.start('IntroScene'));
    });

    // Entrance Animation
    card.setAlpha(0).setY(height / 2 + 50);
    this.tweens.add({ targets: card, alpha: 1, y: height / 2, duration: 800, ease: 'Cubic.easeOut' });
  }

  createPillButton(x, y, label) {
    const container = this.add.container(x, y);
    const bg = this.add.graphics().fillStyle(UI_CONFIG.COLORS.PRIMARY_NAVY, 1).fillRoundedRect(-140, -30, 280, 60, 30);
    const txt = this.add.text(0, 0, label, {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '15px', fontWeight: '800', color: '#ffffff', letterSpacing: 1
    }).setOrigin(0.5);
    container.add([bg, txt]).setSize(280, 60).setInteractive({ useHandCursor: true });
    
    container.on('pointerover', () => this.tweens.add({ targets: container, scale: 1.05, duration: 100 }));
    container.on('pointerout', () => this.tweens.add({ targets: container, scale: 1, duration: 100 }));
    return container;
  }
}