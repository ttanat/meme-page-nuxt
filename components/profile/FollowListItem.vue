<template>
  <div class="top px-1 py-2">
    <nuxt-link :to="'/user/'+username">{{ username }}</nuxt-link>
    <small
      v-if="pathname === '/profile/followers'"
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
    username: {
      type: String,
      required: true
    }
  },
  computed: {
    pathname() {
      return this.$route.path
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
small {
  position: absolute;
  right: .25rem;
  bottom: .6rem;
}
</style>
