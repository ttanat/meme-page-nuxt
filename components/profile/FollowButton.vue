<template>
  <button
    @click="follow"
    :class="[isFollowing ? 'btn-outline-success' : 'btn-success', 'm-1']"
    class="btn btn-sm follow-btn"
    :title="isFollowing ? 'Unfollow' : ''"
  >
    {{ isFollowing ? "Following" : "Follow" }}
  </button>
</template>

<script>
import checkAuthMixin from '~/mixins/checkAuthMixin'

export default {
  name: 'FollowButton',
  props: {
    isFollowing: {
      type: Boolean,
      required: true
    }
  },
  mixins: [checkAuthMixin],
  methods: {
    follow() {
      if (this.checkAuth()) {
        this.$axios.get(`/api/follow/${this.$route.params.username}`)
          .then(res => this.$emit("following-changed-event", res.data.following))
          .catch(this.displayError)
      }
    }
  }
}
</script>
