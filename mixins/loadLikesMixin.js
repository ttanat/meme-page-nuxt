export default {
  methods: {
    async loadLikes(uuids, type) {
      /*
        uuids: uuids of memes or comments
        type: "m" for meme or "c" for comment or "r" for reply
      */
      if (!this.$auth.loggedIn || !uuids.length) return false 
      if (!["m", "c", "r"].includes(type)) return false

      try {
        const search = uuids.slice(0, 20).map(uuid => `u=${uuid}`).join("&")
        const url = `/api/likes/${type === "r" ? "c" : type}/?${search}`

        const { data } = await this.$axios.get(url)
        for (const vote of data) {
          const obj = this.$children.find(child => {
            const uuid = type === "m" ? child.meme.uuid
                        : type === "c" ? child.comment.uuid
                        : type === "r" ? child.reply.uuid
                        : null
            return uuid === vote.uuid
          })
          if (obj) {
            obj.isLiked = vote.point === 1
            obj.isDisliked = vote.point === -1
          }
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}