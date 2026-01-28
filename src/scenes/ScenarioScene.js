import Phaser from 'phaser';
import data from '../data/scenarios.json';

const UI_CONFIG = {
  COLORS: {
    BG_LIGHT: 0xE8F5E9,
    WHITE: 0xFFFFFF,
    // Email Skin
    EMAIL_HEADER: 0xF8F9FA,
    EMAIL_BORDER: 0xDADCE0,
    TEXT_DARK: '#202124',
    TEXT_GREY: '#5F6368',
    // Telegram Skin (Enhanced)
    TELE_BLUE: 0x517DA2,      // Official Telegram Blue
    TELE_BG: 0x8EAFCE,        // Soft Blue-Grey Chat BG
    TELE_BUBBLE: 0xFFFFFF,    // White incoming bubble
    TELE_TEXT: '#000000',
    TELE_TIME: '#A8A8A8',     // Grey for timestamps
    // Dating App Skin
    SPARK_GRADIENT_TOP: 0xFD297B,
    SPARK_GRADIENT_BOTTOM: 0xFF5864,
    SPARK_NAME: '#212121',
    SPARK_BIO: '#424242'
  },
  FONTS: { MAIN: 'Inter, system-ui, -apple-system, sans-serif' }
};

export default class ScenarioScene extends Phaser.Scene {
  constructor() { super('ScenarioScene'); }
create({ level = 1, index = 0, score = 0 }) {
    const { width, height } = this.scale;
    const scenarios = data[`level${level}`] || [];
    const scenario = scenarios[index];

    if (!scenario) {
      this.scene.start('IntroScene');
      return;
    }

    this.add.rectangle(width / 2, height / 2, width, height, UI_CONFIG.COLORS.BG_LIGHT);

    const cardX = width * 0.06;
    const cardY = height * 0.16;
    const cardW = width * 0.52;
    const cardH = height * 0.68;

    // --- RENDER UI TYPE ---
    if (scenario.type === 'email') {
      this.createRealisticEmailUI(cardX, cardY, cardW, cardH, scenario);
    } else if (scenario.type === 'telegram') {
      this.createTelegramUI(cardX, cardY, cardW, cardH, scenario);
    } else if (scenario.type === 'dating') {
      this.createDatingUI(cardX, cardY, cardW, cardH, scenario);
    }

    // 2. PASSING score to the Action Panel
    this.createActionPanel(width * 0.78, height, scenario, level, index, score);
  }

  // --- 📧 EMAIL UI ---
  createRealisticEmailUI(x, y, w, h, scenario) {
    const container = this.add.container(x, y);
    const g = this.add.graphics();

    g.fillStyle(0x000000, 0.08).fillRoundedRect(6, 6, w, h, 16);
    g.fillStyle(UI_CONFIG.COLORS.WHITE, 1).lineStyle(1, UI_CONFIG.COLORS.EMAIL_BORDER, 1);
    g.fillRoundedRect(0, 0, w, h, 16).strokeRoundedRect(0, 0, w, h, 16);

    g.fillStyle(UI_CONFIG.COLORS.EMAIL_HEADER, 1);
    g.fillRoundedRect(0, 0, w, 55, { tl: 16, tr: 16, bl: 0, br: 0 });
    const tools = this.add.text(25, 18, "←  📥  🗑️  ✉️  ⋮", { fontSize: '18px', color: '#5F6368' });

    const subject = this.add.text(30, 85, scenario.subject, {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '26px', color: UI_CONFIG.COLORS.TEXT_DARK, fontWeight: '600', wordWrap: { width: w - 60 }
    });

    const avatar = this.add.graphics().fillStyle(0x43A047, 1).fillCircle(50, 160, 22);
    const initial = this.add.text(50, 160, scenario.sender[0].toUpperCase(), { fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }).setOrigin(0.5);
    
    const parts = scenario.sender.split('<');
    const senderName = this.add.text(85, 142, parts[0].trim(), { fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '16px', fontWeight: '700', color: UI_CONFIG.COLORS.TEXT_DARK });
    const emailStr = parts[1] ? `<${parts[1]}` : '';
    const senderEmail = this.add.text(85, 162, emailStr, { fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '13px', color: UI_CONFIG.COLORS.TEXT_GREY });

    const content = this.add.text(30, 230, scenario.context, {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '22px', color: '#3C4043', wordWrap: { width: w - 70 }, lineSpacing: 10
    });

    container.add([g, tools, subject, avatar, initial, senderName, senderEmail, content]);
    this.animateIn(container, y);
  }

  // --- 💬 TELEGRAM UI ---
  createTelegramUI(x, y, w, h, scenario) {
    const container = this.add.container(x, y);
    const g = this.add.graphics();

    // 1. Wallpaper Background (Simulating the classic TG pattern)
    g.fillStyle(UI_CONFIG.COLORS.TELE_BG, 1).fillRoundedRect(0, 0, w, h, 24);
    
    // 2. App Header
    g.fillStyle(UI_CONFIG.COLORS.TELE_BLUE, 1).fillRoundedRect(0, 0, w, 70, { tl: 24, tr: 24, bl: 0, br: 0 });
    const backBtn = this.add.text(20, 35, "←", { fontSize: '24px', fontWeight: 'bold' }).setOrigin(0, 0.5);
    const title = this.add.text(75, 25, scenario.sender, { 
        fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '20px', fontWeight: '700', color: '#FFFFFF' 
    });
    const status = this.add.text(75, 48, "last seen recently", { 
        fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '13px', color: '#B2D1E5' 
    });

    // 3. Sender Avatar (Circle)
    g.fillStyle(0x51ed73, 1).fillCircle(45, 35, 20);
    const initial = this.add.text(45, 35, scenario.sender[0], { 
        fontSize: '18px', fontWeight: 'bold', color: '#FFF' 
    }).setOrigin(0.5);

    // 4. Message Bubble
    const bubbleX = 70;
    const bubbleY = 110;
    const bubbleW = w * 0.75;
    const bubbleH = 180;

    // Bubble Shadow
    g.fillStyle(0x000000, 0.1).fillRoundedRect(bubbleX + 2, bubbleY + 2, bubbleW, bubbleH, 18);
    // Bubble Body
    g.fillStyle(UI_CONFIG.COLORS.TELE_BUBBLE, 1).fillRoundedRect(bubbleX, bubbleY, bubbleW, bubbleH, 18);
    // The "Tail"
    g.beginPath().moveTo(bubbleX, bubbleY + 15).lineTo(bubbleX - 10, bubbleY + 5).lineTo(bubbleX, bubbleY + 5).fillPath();

    // 5. Message Text
    const msg = this.add.text(bubbleX + 20, bubbleY + 18, scenario.context, {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '19px', color: UI_CONFIG.COLORS.TELE_TEXT, 
      wordWrap: { width: bubbleW - 40 }, lineSpacing: 6
    });

    // 6. Timestamp & Seen (Inside bubble bottom-right)
    const time = this.add.text(bubbleX + bubbleW - 75, bubbleY + bubbleH - 25, "12:45 PM", {
        fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '12px', color: UI_CONFIG.COLORS.TELE_TIME
    });
    const seen = this.add.text(bubbleX + bubbleW - 20, bubbleY + bubbleH - 25, "✓✓", {
        fontSize: '12px', color: '#40A7E3'
    }).setOrigin(1, 0);

    container.add([g, backBtn, title, status, initial, msg, time, seen]);
    this.animateIn(container, y);
  }
  // --- 🔥 DATING APP UI ---
  // --- 🔥 UPDATED DATING APP UI ---
  createDatingUI(x, y, w, h, scenario) {
    const container = this.add.container(x, y);
    const g = this.add.graphics();

    // 1. Phone Body & Screen
    g.fillStyle(0x121212, 1).fillRoundedRect(0, 0, w, h, 36); 
    g.fillStyle(UI_CONFIG.COLORS.WHITE, 1).fillRoundedRect(8, 8, w - 16, h - 16, 28);

    // 2. Spark Header
    g.fillGradientStyle(UI_CONFIG.COLORS.SPARK_GRADIENT_TOP, UI_CONFIG.COLORS.SPARK_GRADIENT_TOP, 
                        UI_CONFIG.COLORS.SPARK_GRADIENT_BOTTOM, UI_CONFIG.COLORS.SPARK_GRADIENT_BOTTOM, 1);
    g.fillRoundedRect(8, 8, w - 16, 60, { tl: 28, tr: 28, bl: 0, br: 0 });

    const appName = this.add.text(w/2, 38, "spark", {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '26px', fontWeight: '900', color: '#FFF'
    }).setOrigin(0.5);

    // 3. PROFILE IMAGE AREA
    // Instead of a grey box, we'll create a stylized "AI Portrait" placeholder
    const imgAreaY = 85;
    const imgAreaH = 300;
    
    // Background for the photo
    g.fillStyle(0x333333, 1).fillRoundedRect(25, imgAreaY, w - 50, imgAreaH, 20);
    
    // Stylized "User Silhouette" or AI-vibe Glow
    const avatarGlow = this.add.graphics();
    avatarGlow.fillGradientStyle(0x6366F1, 0x6366F1, 0xA855F7, 0xA855F7, 0.5);
    avatarGlow.fillCircle(w/2, imgAreaY + (imgAreaH/2), 80);

    const userIcon = this.add.text(w/2, imgAreaY + (imgAreaH/2), '👤', { 
        fontSize: '120px' 
    }).setOrigin(0.5).setAlpha(0.7);

    // 4. Verification Badge (Classic dating app "Blue Check")
    const verifiedCircle = this.add.graphics().fillStyle(0x1D9BF0, 1).fillCircle(w - 60, imgAreaY + 30, 15);
    const verifiedCheck = this.add.text(w - 60, imgAreaY + 30, '✓', { 
        fontSize: '16px', fontWeight: 'bold', color: '#FFF' 
    }).setOrigin(0.5);

    // 5. Bio Info
    const nameText = this.add.text(35, imgAreaY + imgAreaH + 15, `${scenario.sender}, 24`, {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '28px', fontWeight: '900', color: UI_CONFIG.COLORS.SPARK_NAME
    });

    const bioText = this.add.text(35, imgAreaY + imgAreaH + 55, scenario.context, {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '18px', color: UI_CONFIG.COLORS.SPARK_BIO,
      wordWrap: { width: w - 70 }, lineSpacing: 4
    });

    // 6. Action Buttons (Bottom)
    const btnSize = 60;
    const btnY = h - 60;

    // Cross Circle
    g.lineStyle(2, 0xFD297B, 1).strokeCircle(w * 0.35, btnY, btnSize/2);
    const cross = this.add.text(w * 0.35, btnY, "✖", { fontSize: '24px', color: '#FD297B' }).setOrigin(0.5);

    // Heart Circle
    g.lineStyle(2, 0x2ECC71, 1).strokeCircle(w * 0.65, btnY, btnSize/2);
    const heart = this.add.text(w * 0.65, btnY, "♥", { fontSize: '24px', color: '#2ECC71' }).setOrigin(0.5);

    container.add([g, appName, avatarGlow, userIcon, verifiedCircle, verifiedCheck, nameText, bioText, cross, heart]);
    this.animateIn(container, y);
  }
  // --- SHARED HELPERS ---
  createActionPanel(rightX, height, scenario, level, index, score) {
    this.add.text(rightX, height * 0.18, "CHOOSE YOUR ACTION", {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '26px', fontWeight: '900', color: '#14532D'
    }).setOrigin(0.5);

    const btnIcons = ['🚫', '🔍', '💬', '🛡️'];
    scenario.choices.forEach((choice, i) => {
      const btnY = (height * 0.35) + (i * 110);
      // 4. Pass score to the button
      this.createChoiceButton(rightX, btnY, choice, btnIcons[i], scenario, level, index, score);
    });
  }

  // 5. UPDATED to receive score
  createChoiceButton(x, y, choice, icon, scenario, level, index, score) {
    const w = 400; const h = 85;
    const container = this.add.container(x, y);

    const shadow = this.add.graphics().fillStyle(0x000000, 0.05).fillRoundedRect(-w/2 + 4, -h/2 + 4, w, h, 20);
    const bg = this.add.graphics().fillStyle(0xFFFFFF, 1).lineStyle(2, 0xE2E8F0, 1).fillRoundedRect(-w/2, -h/2, w, h, 20).strokeRoundedRect(-w/2, -h/2, w, h, 20);
    const ico = this.add.text(-(w/2) + 42.5, 2, icon, { fontSize: '32px' }).setOrigin(0.5);
    const txt = this.add.text(-(w/2) + 85, 0, choice.text, {
      fontFamily: UI_CONFIG.FONTS.MAIN, fontSize: '17px', fontWeight: '700', color: '#334155', wordWrap: { width: w - 110 }
    }).setOrigin(0, 0.5);

    container.add([shadow, bg, ico, txt]);
    container.setSize(w, h).setInteractive({ useHandCursor: true });

    container.on('pointerdown', () => {
      this.tweens.add({
        targets: container,
        scale: 0.96,
        duration: 100,
        onComplete: () => {
          this.cameras.main.fadeOut(300, 255, 255, 255);
          this.time.delayedCall(300, () => {
            // 6. PASSING SCORE TO FEEDBACK SCENE
            this.scene.start('FeedbackScene', {
              scenario,
              level,
              index,
              outcome: choice.outcome,
              score: score 
            });
          });
        }
      });
    });

    container.on('pointerover', () => container.setScale(1.02));
    container.on('pointerout', () => container.setScale(1));
  }
  animateIn(container, targetY) {
    container.setAlpha(0).setY(targetY + 40);
    this.tweens.add({ targets: container, alpha: 1, y: targetY, duration: 600, ease: 'Cubic.easeOut' });
  }
}


