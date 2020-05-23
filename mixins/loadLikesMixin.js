export default {
  methods: {
    loadLikes(uuids, type) {
      /*
        uuids: uuids of memes or comments
        type: "m" for meme or "c" for comment or "r" for reply
      */
      if (this.$auth.loggedIn && uuids.length) {
        if (!["m", "c", "r"].includes(type)) return false
        this.$axios.get(`/api/likes/${type === "r" ? "c" : type}/?${uuids.slice(0, 20).map(uuid => `u=${uuid}`).join("&")}`, {progress: false})
          .then(res => {
            for (const vote of res.data) {
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
          })
          .catch(console.log)
      }
    }
  }
}