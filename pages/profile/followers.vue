<template>
  <main>
    <div class="container-fluid mb-5">
      <div class="row justify-content-center">
        <ProfileSideBar />
        <div class="col-md-8 col-xl-9">
          <h5>Followers</h5>
          <FollowListItems v-if="$auth.user.stats.num_followers" />
          <span v-else>None</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import ProfileSideBar from '~/components/profile/ProfileSideBar'
import FollowListItems from '~/components/profile/FollowListItems'

export default {
  middleware: 'custom-auth',
  components: {
    ProfileSideBar,
    FollowListItems
  },
  head() {
    this.$store.commit("setCurrentPage", "Followers")
    return {
      title: `${this.$auth.user.username} - Followers`,
      meta: [
        {hid: 'robots', name: 'robots', content: 'noindex'},
      ]
    }
  }
}
</script>

<style scoped>
@media (min-width: 575.98px) {
  .container-fluid {
    padding-left: 5%;
    padding-right: 5%;
  }
}
</style>
