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
    username: {
      type: String,
      required: false,
      default: ""
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
        padding: this.small ? "0 2px" : "5px",
        paddingTop: this.small ? "0px" : "2px",
        paddingBottom: this.small ? "0px" : "2px",
        fontSize: this.small ? "12px" : ""
      }
    }
  },
  methods: {
    follow() {
      if (this.checkAuth()) {
        if (this.$auth.user.stats.num_following >= 1000) {
          this.displayError("Cannot follow more than 1000 users")
        } else {
          this.$axios.get(`/api/follow/${this.username || this.$route.params.username}`)
            .then(({ data }) => {
              this.$emit("following-changed-event", data.following)
              this.changeNumFollowing(data.following ? 1 : -1)
            })
            .catch(err => {
              this.displayError(err.response.data.length <= 100 ? err.response.data : err.message)
            })
        }
      }
    },
    changeNumFollowing(change) {
      const new_stats = Object.assign(
        {},
        this.$auth.user.stats,
        {num_following: this.$auth.user.stats.num_following + change}
      )
      this.$setUserField({ stats: new_stats })
    }
  }
}
</script>
