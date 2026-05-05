export class RelationshipSystem {
  constructor(npcs) {
    this.scores = {}
    this.betrayed = {}
    npcs.forEach(n => {
      this.scores[n.id] = n.affinity
      this.betrayed[n.id] = false
    })
  }

  adjust(npcId, delta) {
    this.scores[npcId] = Math.min(100, Math.max(0,
      this.scores[npcId] + delta
    ))
  }

  betray(npcId) {
    this.betrayed[npcId] = true
    this.adjust(npcId, -25)
  }

  getStatus(npcId) {
    const s = this.scores[npcId]
    if (s >= 75) return 'connected'
    if (s >= 40) return 'neutral'
    return 'rival'
  }

  getAll() {
    return { ...this.scores }
  }
}