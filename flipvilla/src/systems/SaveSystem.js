const KEY = 'flipvilla_ep1'

export const SaveSystem = {
  save(data) {
    localStorage.setItem(KEY, JSON.stringify({
      ...data,
      savedAt: Date.now()
    }))
  },

  load() {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  },

  clear() {
    localStorage.removeItem(KEY)
  },

  exists() {
    return !!localStorage.getItem(KEY)
  }
}