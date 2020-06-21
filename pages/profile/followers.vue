<template>
  <main>
    <div class="container-fluid mb-5">
      <div class="row justify-content-center">
        <ProfileSideBar />
        <div class="col-md-8 col-xl-9">
          <h5>Followers</h5>
          <FollowListItem
            v-for="follower in followers"
            :key="follower.username"
            :user="follower"
            @remove-follower-event="removeFollower"
          />
          <div v-if="loading" class="spinner"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
          <span v-if="noFollowers">None</span>
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
import paginationOffsetMixin from '~/mixins/paginationOffsetMixin'

export default {
  middleware: 'custom-auth',
  components: {
    ProfileSideBar,
    FollowListItem
  },
  mixins: [profileAsyncDataMixin, infiniteScrollMixin, paginationOffsetMixin],
  head() {
    this.$store.commit("setCurrentPage", "Followers")
    return {
      title: `${this.$auth.user.username} - Followers`
    }
  },
  data() {
    return {
      next: "/api/profile/followers/",
      loading: false,
      followers: []
    }
  },
  computed: {
    noFollowers() {
      return !this.followers.length && !this.loading
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
            this.followers.push(...data.results)
            this.next = data.next
          })
          .catch(console.log)
          .finally(() => this.loading = false)
      }
    },
    removeFollower(username) {
      this.followers = this.followers.filter(user => user.username !== username)
      this.increaseOffset()
    }
  }
}
</script>

<style scoped>
.spinner {
  font-size: large;
}
@media (min-width: 575.98px) {
  .container-fluid {
    padding-left: 5%;
    padding-right: 5%;
  }
}
</style>
