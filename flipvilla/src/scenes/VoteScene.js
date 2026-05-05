import Phaser from 'phaser'
import { NPCS } from '../data/npcs.js'

export default class VoteScene extends Phaser.Scene {
  constructor() {
    super('VoteScene')
  }

  create(data) {
    this.relationships = data.relationships
    this.immuneId = data.immuneId

    const g = this.add.graphics()
    g.fillStyle(0x0d0d1a)
    g.fillRect(0, 0, 800, 600)
    g.fillStyle(0x1a0a0a)
    g.fillRect(0, 0, 800, 100)

    this.add.text(400, 50, 'THE DUMPING GROUND', {
      fontSize: '26px', fill: '#ffd700',
      fontFamily: 'sans-serif', fontStyle: 'bold'
    }).setOrigin(0.5)

    this.add.text(400, 88, 'The villa has spoken...', {
      fontSize: '14px', fill: '#888888', fontFamily: 'sans-serif'
    }).setOrigin(0.5)

    if (this.immuneId === 'player') {
      this.add.text(400, 130, 'You have immunity this round', {
        fontSize: '14px', fill: '#4ecb71', fontFamily: 'sans-serif'
      }).setOrigin(0.5)
    }

    const votes = this.calculateVotes()
    this.revealVotes(votes)

    this.cameras.main.fadeIn(600, 0, 0, 0)
  }

  calculateVotes() {
    const votes = {}

    NPCS.forEach(npc => {
      if (npc.id === this.immuneId) return
      const score = this.relationships[npc.id] ?? 50

      if (Math.random() < (1 - score / 100)) {
        votes['player'] = (votes['player'] || 0) + 1
      } else {
        const target = NPCS
          .filter(n => n.id !== npc.id && n.id !== this.immuneId)
          .sort((a, b) => (this.relationships[a.id] || 50) - (this.relationships[b.id] || 50))[0]
        if (target) votes[target.id] = (votes[target.id] || 0) + 1
      }
    })

    // Kabir wildcard — always adds a surprise
    if (Math.random() < 0.3) {
      const randomTarget = NPCS[Math.floor(Math.random() * NPCS.length)]
      votes[randomTarget.id] = (votes[randomTarget.id] || 0) + 1
    }

    return votes
  }

  revealVotes(votes) {
    NPCS.forEach((npc, i) => {
      this.time.delayedCall(900 * (i + 1), () => {
        const v = votes[npc.id] || 0
        const immune = npc.id === this.immuneId
        this.add.text(200, 170 + i * 60, `${npc.name}`, {
          fontSize: '16px',
          fill: immune ? '#ffd700' : '#ffffff',
          fontFamily: 'sans-serif'
        })
        this.add.text(420, 170 + i * 60,
          immune ? 'IMMUNE' : `${v} vote${v !== 1 ? 's' : ''}`, {
          fontSize: '16px',
          fill: immune ? '#ffd700' : v > 0 ? '#ff6b6b' : '#4ecb71',
          fontFamily: 'sans-serif'
        })
      })
    })

    // Player votes
    this.time.delayedCall(900 * (NPCS.length + 1), () => {
      const pv = votes['player'] || 0
      this.add.text(200, 170 + NPCS.length * 60, 'You', {
        fontSize: '16px', fill: '#aaddff', fontFamily: 'sans-serif'
      })
      this.add.text(420, 170 + NPCS.length * 60,
        this.immuneId === 'player' ? 'IMMUNE' : `${pv} vote${pv !== 1 ? 's' : ''}`, {
        fontSize: '16px',
        fill: this.immuneId === 'player' ? '#ffd700' : pv > 0 ? '#ff6b6b' : '#4ecb71',
        fontFamily: 'sans-serif'
      })
    })

    // Elimination reveal
    const eliminated = Object.entries(votes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'nobody'

    this.time.delayedCall(900 * (NPCS.length + 3), () => {
      this.cameras.main.shake(300, 0.01)
      this.cameras.main.flash(800, 220, 40, 40)

      const name = eliminated === 'player' ? 'YOU ARE' : `${eliminated.toUpperCase()} IS`
      this.add.text(400, 490, `${name} DUMPED FROM THE VILLA!`, {
        fontSize: '20px',
        fill: eliminated === 'player' ? '#e84545' : '#4ecb71',
        fontFamily: 'sans-serif',
        fontStyle: 'bold',
        wordWrap: { width: 700 }
      }).setOrigin(0.5)

      this.time.delayedCall(3000, () => {
        this.cameras.main.fadeOut(400, 0, 0, 0)
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('EndScene', {
            relationships: this.relationships,
            survived: eliminated !== 'player',
            eliminatedName: eliminated
          })
        })
      })
    })
  }
}