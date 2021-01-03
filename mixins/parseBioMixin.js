export default {
  data() {
    return {
      escapeChars: Object.freeze({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
      })
    }
  },
  methods: {
    parseBio(bio) {
      // Make links clickable
      // Bug: Method called every time user presses a key
      // Bug: Split causes undefined values in array
      if (!bio) return ""
      const chunks = bio.split(/(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*))|(@[a-zA-Z0-9_]+)|(#[a-zA-Z][a-zA-Z0-9_]*)/)

      return chunks.reduce((total, currentValue) => {
        if (!currentValue) return total
        let newVal
        if (currentValue.match(/(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*))/)) {
          newVal = `<a href="${currentValue}" target="_blank">${currentValue}</a>`
        } else if (currentValue.match(/@[a-zA-Z0-9_]+/)) {
          newVal = `<a href="/user/${currentValue.slice(1)}" target="_blank">${currentValue}</a>`
        } else if (currentValue.match(/#[a-zA-Z][a-zA-Z0-9_]*/)) {
          newVal = `<a href="/search?q=%23${currentValue.slice(1)}" target="_blank">${currentValue}</a>`
        } else {
          newVal = currentValue.replace(/[&<>"'`=\/]/g, char => this.escapeChars[char])
        }
        return total + newVal
      }, "")
    }
  }
}
