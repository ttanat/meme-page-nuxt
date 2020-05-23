<template>
  <div style="padding-right: 20px;">
    <button @click="vote('l')" :class="{green: isLiked}" class="btn btn-sm lower-btn thumbs like">
      <font-awesome-icon :icon="[isLiked ? 'fas' : 'far', 'thumbs-up']" />
    </button>
    <span class="text-muted" :title="points > 999 ? points.toLocaleString() : ''">{{ formatNumber(points) }} point{{ points === 1 ? "" : "s" }}</span>
    <button @click="vote('d')" :class="{red: isDisliked}" class="btn btn-sm lower-btn thumbs dislike ml-3">
      <font-awesome-icon :icon="[isDisliked ? 'fas' : 'far', 'thumbs-down']" />
    </button>
  </div>
</template>

<script>
import formatNumberMixin from '~/mixins/formatNumberMixin'
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
  mixins: [formatNumberMixin, voteMixin],
  mounted() {
    if (this.$auth.loggedIn) {
      this.$axios.get(`/api/likes/m/?u=${this.$route.params.uuid}`)
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
    async vote(v) {
      await this.sendVote(this.meme, v, "m")
      this.meme.points = this.points
    }
  }
}
</script>
