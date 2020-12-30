<template>
  <table class="mb-3 w-100 text-center">
    <tr>
      <td title="Total points">{{ formatNumber(stats.clout) }}</td>
      <td>
        <nuxt-link v-if="isProfilePage" to="/profile/followers" no-prefetch>{{ numFollowers }}</nuxt-link>
        <span v-else>{{ numFollowers }}</span>
      </td>
      <td>
        <nuxt-link v-if="isProfilePage" to="/profile/following" no-prefetch>{{ numFollowing }}</nuxt-link>
        <span v-else>{{ numFollowing }}</span>
      </td>
    </tr>

    <tr>
      <td title="Total points"><small>clout</small></td>
      <td>
        <nuxt-link v-if="isProfilePage" to="/profile/followers" no-prefetch><small>followers</small></nuxt-link>
        <small v-else>followers</small>
      </td>
      <td>
        <nuxt-link v-if="isProfilePage" to="/profile/following" no-prefetch><small>following</small></nuxt-link>
        <small v-else>following</small>
      </td>
    </tr>
  </table>
</template>

<script>
import formatNumberMixin from '~/mixins/formatNumberMixin'

export default {
  name: 'UserStats',
  mixins: [formatNumberMixin],
  props: {
    stats: {
      type: Object,
      required: true
    }
  },
  computed: {
    isProfilePage() {
      return this.$route.path.startsWith("/profile")
    },
    numFollowers() {
      return this.formatNumber(this.stats.num_followers)
    },
    numFollowing() {
      return this.formatNumber(this.stats.num_following)
    }
  }
}
</script>

<style scoped>
table {
  table-layout: fixed;
}
a {
  color: lightgray;
}
</style>