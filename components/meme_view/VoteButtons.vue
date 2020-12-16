<template>
  <div style="padding-right: 10px;">
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
import { mapGetters } from 'vuex'

export default {
  name: 'VoteButtons',
  props: {
    voteOnLoad: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      isLiked: this.voteOnLoad === 1,
      isDisliked: this.voteOnLoad === -1
    }
  },
  computed: {
    ...mapGetters({points: "meme/points"}),
    meme() {
      // This object exists only to use in voteMixin
      return {
        points: this.points,
        uuid: this.$route.params.uuid
      }
    }
  },
  mixins: [formatNumberMixin, voteMixin],
  methods: {
    async vote(v) {
      // New points value is emitted to parent component from within mixin
      await this.sendVote(this.meme, v, "m")
      this.meme.points = this.points
    }
  }
}
</script>
