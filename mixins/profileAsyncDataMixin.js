export default {
  async asyncData({ $axios, $auth }) {
    if ($auth.user.bio === undefined || $auth.user.stats === undefined) {
      const { data } = await $axios.get("/api/profile")
      $auth.user.bio = data.bio
      $auth.user.stats = {
        clout: data.clout,
        num_followers: data.num_followers,
        num_following: data.num_following
      }
    }
    return {}
  }
}
