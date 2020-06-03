<template>
  <button
    @click="follow"
    :class="[isFollowing ? 'btn-outline-success' : 'btn-success', isUserPage ? 'm-1' : 'm-0']"
    class="btn btn-sm follow-btn"
    :title="btnTitle"
    >
      {{ btnText }}
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
  data() {
    return {
      isUserPage: this.$route.path.startsWith("/user/")
    }
  },
  computed: {
    action() {
      return this.isUserPage ? "follow" : "subscribe"
    },
    btnText() {
      return this.isUserPage ? `Follow${this.isFollowing ? "ing" : ""}` : `Subscribe${this.isFollowing ? "d" : ""}`
    },
    btnTitle() {
      return this.isFollowing ? `Un${this.action}` : ""
    }
  },
  methods: {
    follow() {
      if (this.checkAuth()) {
        this.$axios.get(`/api/${this.action}/${this.isUserPage ? this.$route.params.username : this.$route.params.name}`)
          .then(res => this.isUserPage ? res.data.following : res.data.subscribed)
          .then(f => this.$emit("following-changed-event", f))
          .catch(this.displayError)
      }
    }
  }
}
</script>
