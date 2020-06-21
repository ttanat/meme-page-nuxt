<template>
  <button
    @click="follow"
    :class="[isFollowing ? 'btn-outline-success' : 'btn-success', small ? '' : 'm-1']"
    class="btn btn-sm"
    :title="isFollowing ? 'Unfollow' : ''"
    :style="buttonStyle"
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
    },
    small: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mixins: [checkAuthMixin],
  computed: {
    buttonStyle() {
      return {
        padding: this.small ? "0 2px 0 2px" : "5px",
        paddingTop: this.small ? "0px" : "2px",
        paddingBottom: this.small ? "0px" : "2px",
        fontSize: this.small ? "12px" : ""
      }
    }
  },
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
