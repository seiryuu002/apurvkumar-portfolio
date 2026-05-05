import Phaser from 'phaser'
import { SaveSystem } from '../systems/SaveSystem.js'
import { PALETTE } from '../data/palette.js'

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  create() {
    const g = this.add.graphics()

    // Sky
    g.fillStyle(PALETTE.sky)
    g.fillRect(0, 0, 800, 300)

    // Ground
    g.fillStyle(PALETTE.ground)
    g.fillRect(0, 300, 800, 300)

    // Mountains
    g.fillStyle(PALETTE.mountain)
    g.fillTriangle(0, 300, 200, 120, 400, 300)
    g.fillStyle(0x16405c)
    g.fillTriangle(200, 300, 450, 90, 700, 300)

    // Villa
    g.fillStyle(PALETTE.villa)
    g.fillRect(280, 170, 240, 130)
    g.fillStyle(PALETTE.roof)
    g.fillTriangle(260, 170, 400, 110, 540, 170)

    // Title
    this.add.text(400, 80, 'FLIPVILLA', {
      fontSize: '48px',
      fill: '#ffd700',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    this.add.text(400, 140, 'Episode 1: The Villa Awaits', {
      fontSize: '16px',
      fill: '#aaddff',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5)

    // Play button
    const playBtn = this.add.text(400, 390, 'ENTER THE VILLA', {
      fontSize: '22px',
      fill: '#ffffff',
      backgroundColor: '#c84020',
      padding: { x: 28, y: 14 },
      fontFamily: 'sans-serif'
    }).setOrigin(0.5).setInteractive()

    playBtn.on('pointerover', () => playBtn.setStyle({ fill: '#ffd700' }))
    playBtn.on('pointerout', () => playBtn.setStyle({ fill: '#ffffff' }))
    playBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('SocialScene')
      })
    })

    // Continue button if save exists
    if (SaveSystem.exists()) {
      const contBtn = this.add.text(400, 460, 'Continue', {
        fontSize: '15px',
        fill: '#aaaaaa',
        fontFamily: 'sans-serif'
      }).setOrigin(0.5).setInteractive()

      contBtn.on('pointerover', () => contBtn.setStyle({ fill: '#ffffff' }))
      contBtn.on('pointerout', () => contBtn.setStyle({ fill: '#aaaaaa' }))
      contBtn.on('pointerdown', () => {
        const save = SaveSystem.load()
        this.scene.start('SocialScene', { saved: save })
      })
    }

    this.cameras.main.fadeIn(600, 0, 0, 0)
  }
}