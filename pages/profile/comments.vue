<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <ProfileSideBar />
        <div class="col-md-8 col-xl-9">
          <h5>Comments</h5>
          <MyComments />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import ProfileSideBar from '~/components/profile/ProfileSideBar'
import MyComments from '~/components/profile/MyComments'
import profileAsyncDataMixin from '~/mixins/profileAsyncDataMixin'

export default {
  middleware: 'custom-auth',
  components: {
    ProfileSideBar,
    MyComments
  },
  mixins: [profileAsyncDataMixin],
  head() {
    this.$store.commit("setCurrentPage", "Comments")
    return {
      title: `${this.$auth.user.username} - Comments`,
      meta: [
        {hid: 'robots', name: 'robots', content: 'noindex, noimageindex'},
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
