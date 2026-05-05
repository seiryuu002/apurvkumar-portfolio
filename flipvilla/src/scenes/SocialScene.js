import Phaser from 'phaser'
import { NPCS } from '../data/npcs.js'
import { PALETTE } from '../data/palette.js'
import { RelationshipSystem } from '../systems/RelationshipSystem.js'
import { SaveSystem } from '../systems/SaveSystem.js'

export default class SocialScene extends Phaser.Scene {
  constructor() {
    super('SocialScene')
  }

  create(data) {
    this.rel = new RelationshipSystem(NPCS)
    this.timeLeft = 180
    this.dialogueOpen = false

    // If continuing from save, restore scores
    if (data?.saved?.relationships) {
      Object.entries(data.saved.relationships).forEach(([id, score]) => {
        this.rel.scores[id] = score
      })
    }

    this.drawBackground()
    this.createNPCs()
    this.createHUD()
    this.createTimer()

    this.cameras.main.fadeIn(600, 0, 0, 0)
  }

  drawBackground() {
    const g = this.add.graphics()
    g.fillStyle(PALETTE.sky)
    g.fillRect(0, 0, 800, 250)
    g.fillStyle(PALETTE.skyLight)
    g.fillRect(0, 200, 800, 60)
    g.fillStyle(PALETTE.ground)
    g.fillRect(0, 250, 800, 350)
    g.fillStyle(PALETTE.shadow)
    g.fillRect(0, 380, 800, 220)
    g.fillStyle(PALETTE.mountain)
    g.fillTriangle(0, 250, 200, 100, 400, 250)
    g.fillStyle(0x16405c)
    g.fillTriangle(200, 250, 450, 80, 700, 250)
    g.fillStyle(PALETTE.villa)
    g.fillRect(280, 160, 240, 140)
    g.fillStyle(PALETTE.roof)
    g.fillTriangle(260, 160, 400, 100, 540, 160)
    g.fillStyle(0xc4c4a0)
    g.fillRect(370, 240, 60, 60)

    this.add.text(400, 20, 'Social Phase — Talk to everyone!', {
      fontSize: '14px', fill: '#aaddff', fontFamily: 'sans-serif'
    }).setOrigin(0.5)
  }

  createNPCs() {
    this.affinityBars = {}

    NPCS.forEach(npc => {
      const g = this.add.graphics()
      g.fillStyle(npc.color)
      g.fillCircle(npc.x, npc.y, 28)
      g.lineStyle(2, 0xffffff, 0.5)
      g.strokeCircle(npc.x, npc.y, 28)

      this.add.text(npc.x, npc.y + 44, npc.name, {
        fontSize: '13px', fill: '#ffffff', fontFamily: 'sans-serif'
      }).setOrigin(0.5)

      // Affinity bar background
      this.add.rectangle(npc.x, npc.y - 46, 50, 6, 0x333333).setDepth(4)

      // Affinity bar fill
      const bar = this.add.rectangle(npc.x - 25, npc.y - 46, 50, 6, 0xff6b8a)
        .setOrigin(0, 0.5).setDepth(5)
      this.affinityBars[npc.id] = bar

      // Click zone
      const zone = this.add.zone(npc.x, npc.y, 56, 56).setInteractive()
      zone.on('pointerdown', () => {
        if (!this.dialogueOpen) this.openDialogue(npc)
      })
      zone.on('pointerover', () => { g.setAlpha(0.8) })
      zone.on('pointerout', () => { g.setAlpha(1) })
    })

    this.updateAffinityBars()
  }

  createHUD() {
    // Timer background
    this.add.rectangle(720, 30, 140, 36, 0x000000, 0.5)
      .setDepth(10)

    this.timerText = this.add.text(720, 30, '3:00', {
      fontSize: '20px', fill: '#ffd700', fontFamily: 'sans-serif'
    }).setOrigin(0.5).setDepth(11)

    this.add.text(30, 30, 'Flipvilla — Ep.1', {
      fontSize: '13px', fill: '#aaaaaa', fontFamily: 'sans-serif'
    }).setOrigin(0, 0.5).setDepth(10)
  }

  createTimer() {
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.dialogueOpen) return
        this.timeLeft--
        const m = Math.floor(this.timeLeft / 60)
        const s = this.timeLeft % 60
        this.timerText.setText(`${m}:${s.toString().padStart(2, '0')}`)

        if (this.timeLeft <= 30) this.timerText.setStyle({ fill: '#ff4444' })
        if (this.timeLeft <= 0) this.startChallenge()
      }
    })
  }

  openDialogue(npc) {
    this.dialogueOpen = true

    const line = Phaser.Utils.Array.GetRandom(npc.dialogues.greet)

    // Panel
    const panel = this.add.rectangle(400, 510, 760, 160, 0x0d0d1a, 0.93).setDepth(20)
    const nameText = this.add.text(50, 450, npc.name, {
      fontSize: '15px', fill: '#ffd700', fontFamily: 'sans-serif', fontStyle: 'bold'
    }).setDepth(21)
    const dlgText = this.add.text(50, 475, line, {
      fontSize: '13px', fill: '#ffffff', fontFamily: 'sans-serif',
      wordWrap: { width: 700 }
    }).setDepth(21)

    const choices = [
      { label: 'Flirt back',   delta: +15, mood: 'like'    },
      { label: 'Play it cool', delta: +5,  mood: 'like'    },
      { label: 'Ignore them',  delta: -10, mood: 'dislike' }
    ]

    const btns = choices.map((c, i) => {
      const btn = this.add.text(55 + i * 245, 530, c.label, {
        fontSize: '13px', fill: '#a0e0ff', fontFamily: 'sans-serif',
        backgroundColor: '#1a2a3a', padding: { x: 12, y: 7 }
      }).setDepth(21).setInteractive()

      btn.on('pointerover', () => btn.setStyle({ fill: '#ffd700' }))
      btn.on('pointerout', () => btn.setStyle({ fill: '#a0e0ff' }))
      btn.on('pointerdown', () => {
        this.applyChoice(npc, c)
        ;[panel, nameText, dlgText, ...btns].forEach(o => o.destroy())
        this.dialogueOpen = false
      })
      return btn
    })
  }

  applyChoice(npc, choice) {
    this.rel.adjust(npc.id, choice.delta)
    this.updateAffinityBars()

    const responseLine = Phaser.Utils.Array.GetRandom(npc.dialogues[choice.mood])
    const resp = this.add.text(npc.x, npc.y - 60, responseLine, {
      fontSize: '12px', fill: '#ffffff', fontFamily: 'sans-serif',
      backgroundColor: '#222222', padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(15)

    this.tweens.add({
      targets: resp,
      alpha: 0, y: npc.y - 90,
      duration: 1600,
      onComplete: () => resp.destroy()
    })

    SaveSystem.save({ relationships: this.rel.getAll(), phase: 'social' })
  }

  updateAffinityBars() {
    NPCS.forEach(npc => {
      const bar = this.affinityBars[npc.id]
      const score = this.rel.scores[npc.id]
      bar.setDisplaySize((score / 100) * 50, 6)
      const color = score > 60 ? 0x4ecb71 : score > 35 ? 0xf0c070 : 0xe84545
      bar.setFillStyle(color)
    })
  }

  startChallenge() {
    SaveSystem.save({ relationships: this.rel.getAll(), phase: 'challenge' })
    this.cameras.main.fadeOut(400, 0, 0, 0)
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('ChallengeScene', { relationships: this.rel.getAll() })
    })
  }
}