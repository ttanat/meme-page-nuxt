<template>
  <div style="padding-right: 20px;">
    <button @click="vote('l')" :class="{green: isLiked}" class="btn btn-sm lower-btn thumbs like">
      <font-awesome-icon :icon="[isLiked ? 'fas' : 'far', 'thumbs-up']" />
    </button>
    <span class="text-muted">{{ points }} point{{ points === 1 ? "" : "s" }}</span>
    <button @click="vote('d')" :class="{red: isDisliked}" class="btn btn-sm lower-btn thumbs dislike ml-3">
      <font-awesome-icon :icon="[isDisliked ? 'fas' : 'far', 'thumbs-down']" />
    </button>
  </div>
</template>

<script>
import voteMixin from '~/mixins/voteMixin'

export default {
  name: 'VoteButtons',
  props: {
    points: {
      type: Number,
      required: true,
      default: 0
    }
  },
  mixins: [voteMixin],
  mounted() {
    if (this.$auth.loggedIn) {
      this.$axios.get(`http://127.0.0.1:8000/api/likes/m/?u=${this.$route.params.uuid}`)
        .then(res => {
          if (res.data.length) {
            this.isLiked = res["data"][0]["point"] === 1;
            this.isDisliked = res["data"][0]["point"] === -1;
          }
        })
        .catch(console.log)
    }
  },
  data() {
    return {
      isLiked: false,
      isDisliked: false,
      meme: {
        points: this.points,
        uuid: this.$route.params.uuid
      }
    }
  },
  methods: {
    vote(v) {
      this.sendVote(this.meme, v, "m")
    }
  }
}
</script>

<style>

</style>