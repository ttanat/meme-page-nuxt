<template>
  <main>
    <div class="container-fluid mb-5">
      <div class="row justify-content-center">
        <ProfileSideBar />
        <div class="col-md-8 col-xl-9">
          <h5>Following</h5>
          <FollowListItem v-for="i in fakeUsers" :key="i" :username="i" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import ProfileSideBar from '~/components/profile/ProfileSideBar'
import FollowListItem from '~/components/profile/FollowListItem'
import profileAsyncDataMixin from '~/mixins/profileAsyncDataMixin'

export default {
  middleware: 'custom-auth',
  components: {
    ProfileSideBar,
    FollowListItem
  },
  mixins: [profileAsyncDataMixin],
  head() {
    this.$store.commit("setCurrentPage", "Following")
    return {
      title: `${this.$auth.user.username} - Following`
    }
  },
  data() {
    return {
      fakeUsers: ['max', 'jane', 'allison', 'moseby', 'kevin', 'daniel', 'bob', 'sarah', 'michael', 'sean', 'patricia', 'logan', 'todd', 'karen', 'jesus', 'eustice', 'tamir']
    }
  }
}
</script>

<style scoped>
@media (min-width: 576px) {
  .container-fluid {
    padding-left: 5%;
    padding-right: 5%;
  }
}
</style>
