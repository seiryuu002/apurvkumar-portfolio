import Phaser from 'phaser'
import { NPCS } from '../data/npcs.js'
import { SaveSystem } from '../systems/SaveSystem.js'

export default class EndScene extends Phaser.Scene {
  constructor() {
    super('EndScene')
  }

  create(data) {
    const { relationships, survived, eliminatedName } = data

    const g = this.add.graphics()
    g.fillStyle(0x0d0d1a)
    g.fillRect(0, 0, 800, 600)
    g.fillStyle(survived ? 0x0a2a0a : 0x2a0a0a)
    g.fillRect(0, 0, 800, 120)

    this.add.text(400, 55, survived ? 'You survived the villa!' : 'Dumped from the villa!', {
      fontSize: '28px',
      fill: survived ? '#4ecb71' : '#e84545',
      fontFamily: 'sans-serif', fontStyle: 'bold'
    }).setOrigin(0.5)

    this.add.text(400, 100, survived
      ? 'Your connections kept you safe.'
      : 'Your rivals outvoted you.',
      { fontSize: '14px', fill: '#aaaaaa', fontFamily: 'sans-serif' }
    ).setOrigin(0.5)

    // Relationship summary
    this.add.text(400, 150, 'Your connections:', {
      fontSize: '16px', fill: '#ffd700', fontFamily: 'sans-serif'
    }).setOrigin(0.5)

    NPCS.forEach((npc, i) => {
      const score = relationships[npc.id] || 50
      const status = score >= 75 ? 'Connected' : score >= 40 ? 'Neutral' : 'Rival'
      const statusColor = score >= 75 ? '#4ecb71' : score >= 40 ? '#f0c070' : '#e84545'
      const y = 190 + i * 50

      this.add.text(160, y, npc.name, {
        fontSize: '14px', fill: '#ffffff', fontFamily: 'sans-serif'
      })

      // Bar background
      this.add.rectangle(370, y + 7, 200, 10, 0x333333).setOrigin(0, 0.5)
      // Bar fill
      this.add.rectangle(370, y + 7, score * 2, 10, npc.color).setOrigin(0, 0.5)

      this.add.text(580, y, `${score} — ${status}`, {
        fontSize: '13px', fill: statusColor, fontFamily: 'sans-serif'
      })
    })

    // Play again button
    const playAgain = this.add.text(400, 520, 'Play Again', {
      fontSize: '20px', fill: '#ffffff',
      backgroundColor: '#1a4a7a',
      padding: { x: 28, y: 14 },
      fontFamily: 'sans-serif'
    }).setOrigin(0.5).setInteractive()

    playAgain.on('pointerover', () => playAgain.setStyle({ fill: '#ffd700' }))
    playAgain.on('pointerout', () => playAgain.setStyle({ fill: '#ffffff' }))
    playAgain.on('pointerdown', () => {
      SaveSystem.clear()
      this.cameras.main.fadeOut(400, 0, 0, 0)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MenuScene')
      })
    })

    this.cameras.main.fadeIn(600, 0, 0, 0)
  }
}