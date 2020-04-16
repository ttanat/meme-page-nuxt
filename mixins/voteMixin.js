export default {
  methods: {
    sendVote(item, v, t, hide=false) {
      /*
        item: this.meme or this.comment or this.reply depending on component calling this method
        v: "l" or "d", stands for vote
        t: type, "m" or "c", for "meme" and "comment", "comment" also includes reply due to how database is implemented
        hide: use for comments - some comments or hide points
      */
      if (this.$auth.loggedIn) {
        const old_state = [this.isLiked, this.isDisliked, item.points]
        var btn
        if (v === "l") {
          this.isLiked = !this.isLiked
          if (this.isLiked && this.isDisliked) this.isDisliked = false
          if (!hide) this.$emit("set-points-event", item, item.points + this.isLiked && old_state[1] ? 2 : this.isLiked ? 1 : -1)
          btn = this.isLiked
        } else if (v === "d") {
          this.isDisliked = !this.isDisliked
          if (this.isLiked && this.isDisliked) this.isLiked = false
          if (!hide) this.$emit("set-points-event", item, item.points - (this.isDisliked && old_state[0] ? 2 : this.isDisliked ? 1 : -1))
          btn = this.isDisliked
        }

        this.$axios({
          method: btn ? "PUT" : "DELETE",
          url: "/like",
          headers: {"X-CSRFToken": this.getCookie('csrftoken'), "X-Requested-With": "XMLHttpRequest"},
          params: {u: item.uuid, t, v}
        })
          .catch(err => {
            this.$toasted.show(err, {
              position: 'bottom-center',
              duration: 2000,
              keepOnHover: true,
              action : {
                text : 'X',
                class: 'red',
                onClick : (toastObject) => {
                  toastObject.goAway(0)
                }
              }
            })
            this.isLiked = old_state[0]
            this.isDisliked = old_state[1]
            if (!hide) this.$emit("set-points-event", item, old_state[2])
          })
      } else {
        $("#signUpModal").modal("show")
      }
    }
  }
}