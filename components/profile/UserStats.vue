<template>
  <table class="mb-3 w-100 text-center">
    <tr>
      <td title="Total points">{{ stats.clout }}</td>
      <td class="pointer" id="follower-count">{{ stats.followers }}</td>
      <td class="pointer">{{ stats.following }}</td>
    </tr>
    <tr>
      <td title="Total points"><small>clout</small></td>
      <td class="pointer"><small>followers</small></td>
      <td class="pointer"><small>following</small></td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'UserStats',
  props: {
    stats: {
      type: Object,
      required: true
    }
  }
  // data() {
  //   return {
  //     clout: 0,
  //     followers: 0,
  //     following: 0
  //   }
  // },
  // mounted() {
  //   this.$axios.get(`/api/profile/stats/?${this.$route.path.startsWith("/profile") ? "p=1" : `u=${this.$route.params.username}`}`)
  //     .then(res => {
  //       this.clout = res.data.clout
  //       this.followers = res.data.num_followers
  //       this.following = res.data.num_following
  //     })
  //     .catch(console.log)
  // },
}
</script>

<style scoped>
table {
  table-layout: fixed;
}
</style>