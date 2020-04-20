<template>
  <button
    @click="follow"
    :class="[isFollowing ? 'btn-outline-success' : 'btn-success']"
    class="btn btn-sm follow-btn m-1"
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
        this.$axios.get(`/${this.action}?${this.isUserPage ? `u=${this.$route.params.username}` : `p=${this.$route.params.name}`}`, {headers: {"X-Requested-With": "XMLHttpRequest"}})
          .then(res => this.isUserPage ? res.data.following : res.data.subscribed)
          .then(f => this.$emit("following-changed-event", f))
          .catch(err => display_error(err))
      }
    }
  }
}
</script>
