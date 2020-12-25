<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <ProfileSideBar
          :banned="banned||deleted"
          :sidebar-data="sidebarData"
          @following-changed-event="changeIsFollowing"
        />
        <div class="col-md-8 col-xl-9">
          <TileItems :banned="banned" :deleted="deleted" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import ProfileSideBar from '~/components/profile/ProfileSideBar'
import TileItems from '~/components/profile/TileItems'

export default {
  middleware: 'profile-redirect',
  components: {
    ProfileSideBar,
    TileItems
  },
  head() {
    this.$store.commit("setCurrentPage", this.$route.params.username)
    return {
      title: this.$route.params.username
    }
  },
  async asyncData({ $axios, route }) {
    const { data } = await $axios.get(`/api/user/${route.params.username}`)
    return {
      sidebarData: data.banned || data.deleted ? {} : {
        bio: data.bio,
        stats: {
          clout: data.clout,
          num_followers: data.num_followers,
          num_following: data.num_following
        },
        image: data.image,
        isFollowing: data.is_following,
        userPages: data.moderating
      },
      banned: !!data.banned,
      deleted: !!data.deleted
    }
  },
  methods: {
    changeIsFollowing(is_following) {
      this.sidebarData.isFollowing = is_following
      this.sidebarData.stats.num_followers += is_following ? 1 : -1
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
