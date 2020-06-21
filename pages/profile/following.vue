<template>
  <main>
    <div class="container-fluid mb-5">
      <div class="row justify-content-center">
        <ProfileSideBar />
        <div class="col-md-8 col-xl-9">
          <h5>Following</h5>
          <FollowListItem v-for="user in following" :key="user" :user="user" />
          <div v-if="loading" class="spinner"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
          <span v-if="noFollowing">None</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import ProfileSideBar from '~/components/profile/ProfileSideBar'
import FollowListItem from '~/components/profile/FollowListItem'
import profileAsyncDataMixin from '~/mixins/profileAsyncDataMixin'
import infiniteScrollMixin from '~/mixins/infiniteScrollMixin'

export default {
  middleware: 'custom-auth',
  components: {
    ProfileSideBar,
    FollowListItem
  },
  mixins: [profileAsyncDataMixin, infiniteScrollMixin],
  head() {
    this.$store.commit("setCurrentPage", "Following")
    return {
      title: `${this.$auth.user.username} - Following`
    }
  },
  data() {
    return {
      next: "/api/profile/following/",
      loading: false,
      following: []
    }
  },
  computed: {
    noFollowing() {
      return !this.following.length && !this.loading
    }
  },
  created() {
    this.loadMore()
  },
  methods: {
    loadMore() {
      if (this.next) {
        this.loading = true
        this.$axios.get(this.next)
          .then(({ data }) => {
            this.following.push(...data.results)
            this.next = data.next
          })
          .catch(console.log)
          .finally(() => this.loading = false)
      }
    }
  }
}
</script>

<style scoped>
.spinner {
  font-size: large;
}
@media (min-width: 576px) {
  .container-fluid {
    padding-left: 5%;
    padding-right: 5%;
  }
}
</style>
