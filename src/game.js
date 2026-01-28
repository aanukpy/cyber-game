import Phaser from 'phaser';

import BootScene from './scenes/BootScene';
import IntroScene from './scenes/IntroScene';
import ScenarioScene from './scenes/ScenarioScene';
import FeedbackScene from './scenes/FeedbackScene';
import QuizScene from './scenes/QuizScene';
import EndScene from './scenes/EndScene';

import './style.css';

export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#020617',

  // ✅ CRITICAL: Set initial size
  width: window.innerWidth,
  height: window.innerHeight,

  resolution: window.devicePixelRatio || 1,

  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: true
  },

  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  scene: [
    BootScene,
    IntroScene,
    ScenarioScene,
    FeedbackScene,
    QuizScene,
    EndScene
  ]
};
