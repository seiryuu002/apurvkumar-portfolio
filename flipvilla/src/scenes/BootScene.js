import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    // preload assets here later
  }

  create() {
    this.scene.start('MenuScene')
  }
}