<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <ProfileSideBar />
        <div class="col-md-8 col-xl-9">
          <h5>Uploads</h5>
          <TileItems />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import ProfileSideBar from '~/components/profile/ProfileSideBar'
import TileItems from '~/components/profile/TileItems'
import profileAsyncDataMixin from '~/mixins/profileAsyncDataMixin'

export default {
  middleware: 'custom-auth',
  components: {
    ProfileSideBar,
    TileItems
  },
  mixins: [profileAsyncDataMixin],
  head() {
    this.$store.commit("setCurrentPage", "Profile")
    return {
      title: `${this.$auth.user.username} - Meme Page`
    }
  }
}
</script>

<style scoped>
h5 {
  padding-left: 5px;
}
@media (min-width: 575.98px) {
  .container-fluid {
    padding-left: 5%;
    padding-right: 5%;
  }
}
</style>
