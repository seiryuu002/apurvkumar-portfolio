import Phaser from 'phaser'

export default class ChallengeScene extends Phaser.Scene {
  constructor() {
    super('ChallengeScene')
  }

  create(data) {
    this.relationships = data.relationships
    this.score = 0
    this.timeLeft = 10
    this.active = false

    const g = this.add.graphics()
    g.fillStyle(0x1a1a2e)
    g.fillRect(0, 0, 800, 600)
    g.fillStyle(0x2d6a8f)
    g.fillRect(0, 0, 800, 200)
    g.fillStyle(0xe8c97a)
    g.fillRect(0, 400, 800, 200)

    this.add.text(400, 60, 'VILLA CHALLENGE', {
      fontSize: '28px', fill: '#ffd700',
      fontFamily: 'sans-serif', fontStyle: 'bold'
    }).setOrigin(0.5)

    this.add.text(400, 110, 'Tap as fast as you can!', {
      fontSize: '16px', fill: '#aaddff', fontFamily: 'sans-serif'
    }).setOrigin(0.5)

    this.scoreText = this.add.text(400, 190, '0', {
      fontSize: '72px', fill: '#ffffff', fontFamily: 'sans-serif', fontStyle: 'bold'
    }).setOrigin(0.5)

    this.timerText = this.add.text(400, 270, '10', {
      fontSize: '24px', fill: '#aaaaaa', fontFamily: 'sans-serif'
    }).setOrigin(0.5)

    this.statusText = this.add.text(400, 310, 'Get ready...', {
      fontSize: '15px', fill: '#ffffff', fontFamily: 'sans-serif'
    }).setOrigin(0.5)

    // Tap button
    const btnBg = this.add.rectangle(400, 430, 220, 90, 0xd85a30).setInteractive()
    const btnText = this.add.text(400, 430, 'TAP!', {
      fontSize: '32px', fill: '#ffffff',
      fontFamily: 'sans-serif', fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(1)

    btnBg.on('pointerdown', () => {
      if (!this.active) return
      this.score++
      this.scoreText.setText(this.score)
      // Pulse animation
      this.tweens.add({
        targets: btnBg,
        scaleX: 0.93, scaleY: 0.93,
        duration: 60,
        yoyo: true
      })
    })

    btnBg.on('pointerover', () => btnBg.setFillStyle(0xf06030))
    btnBg.on('pointerout', () => btnBg.setFillStyle(0xd85a30))

    // Countdown 3..2..1
    let countdown = 3
    const countText = this.add.text(400, 300, `${countdown}`, {
      fontSize: '80px', fill: '#ffd700', fontFamily: 'sans-serif', fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(5)

    const countTimer = this.time.addEvent({
      delay: 1000,
      repeat: 2,
      callback: () => {
        countdown--
        if (countdown > 0) {
          countText.setText(`${countdown}`)
        } else {
          countText.destroy()
          this.statusText.setText('GO!')
          this.active = true
          this.startGameTimer()
        }
      }
    })

    this.cameras.main.fadeIn(600, 0, 0, 0)
  }

  startGameTimer() {
    this.time.addEvent({
      delay: 1000,
      repeat: 9,
      callback: () => {
        this.timeLeft--
        this.timerText.setText(`${this.timeLeft}`)
        if (this.timeLeft <= 3) this.timerText.setStyle({ fill: '#ff4444' })
        if (this.timeLeft <= 0) this.endChallenge()
      }
    })
  }

  endChallenge() {
    this.active = false

    const npcScores = {
      priya: Phaser.Math.Between(15, 30),
      arjun: Phaser.Math.Between(22, 38),
      meera: Phaser.Math.Between(12, 26),
      kabir: Phaser.Math.Between(18, 35)
    }

    const topNpc = Object.entries(npcScores).sort((a, b) => b[1] - a[1])[0]
    const playerWon = this.score > topNpc[1]
    const immuneId = playerWon ? 'player' : topNpc[0]

    this.statusText.setText(playerWon ? 'You won immunity!' : `${topNpc[0]} wins immunity!`)
    this.statusText.setStyle({ fill: playerWon ? '#4ecb71' : '#ff6b6b', fontSize: '20px' })

    this.cameras.main.flash(600, playerWon ? 60 : 220, playerWon ? 200 : 40, playerWon ? 60 : 40)

    this.time.delayedCall(2500, () => {
      this.cameras.main.fadeOut(400, 0, 0, 0)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('VoteScene', {
          relationships: this.relationships,
          immuneId,
          playerScore: this.score
        })
      })
    })
  }
}