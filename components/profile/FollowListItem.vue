<template>
  <div class="top px-1 py-2">
    <nuxt-link :to="'/user/'+user.username">
      <span>
        <img v-if="user.image" :src="user.image" class="rounded-circle" height="20" width="20">
        <font-awesome-icon v-else :icon="['fas', 'user']" fixed-width />
      </span>
      &nbsp;{{ user.username }}
    </nuxt-link>
    <small
      v-if="pathname === '/profile/followers'"
      @click="removeFollower"
      class="text-muted pointer"
      title="Remove follower"
    >
      remove
    </small>
    <FollowButton
      v-else-if="pathname === '/profile/following'"
      :is-following="true"
      :small="true"
      class="float-right"
    />
  </div>
</template>

<script>
import FollowButton from '~/components/profile/FollowButton'

export default {
  name: 'FollowListItem',
  components: {
    FollowButton
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    pathname() {
      return this.$route.path
    }
  },
  methods: {
    removeFollower() {
      if (confirm(`Are you sure you want to remove ${this.user.username} as a follower?`)) {
        this.$axios.put(`/api/remove_follower/${this.user.username}`)
          .then(() => this.$emit("remove-follower-event", this.user.username))
          .catch(console.log)
      }
    }
  }
}
</script>

<style scoped>
.top {
  font-size: 14px;
  border-bottom: 1px solid #555;
  position: relative;
}
a {
  color: lightgray;
}
span {
  display: inline-block;
  width: 20px;
  text-align: center;
}
small {
  position: absolute;
  right: .25rem;
  bottom: .6rem;
}
</style>
