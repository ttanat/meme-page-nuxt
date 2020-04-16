<template>
  <table class="mb-3 w-100 text-center">
    <tr>
      <td title="Total points">{{ clout }}</td>
      <td class="pointer" id="follower-count">{{ followers }}</td>
      <td class="pointer">{{ following }}</td>
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
  data() {
    return {
      clout: 0,
      followers: 0,
      following: 0
    }
  },
  mounted() {
    const is_profile_page = $route.path.startsWith("profile")
    this.$axios.get(`/api/pstats/?${is_profile_page ? "p=1" : `u=${USER_PAGE}`}`)
      .then(res => {
        this.clout = res.data.clout
        this.followers = res.data.num_followers
        this.following = res.data.num_following
      })
      .catch(console.log)
  },
}
</script>

<style>

</style>