<template>
  <div>
    <FollowListItem
      v-for="user in users"
      :key="user.username"
      :user="user"
      @remove-follower-event="removeFollower"
    />
    <div v-if="loading" class="spinner"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
    <span v-if="noUsers">None</span>
  </div>
</template>

<script>
import FollowListItem from './FollowListItem'
import infiniteScrollMixin from '~/mixins/infiniteScrollMixin'

export default {
  name: 'FollowListItems',
  components: {
    FollowListItem
  },
  mixins: [infiniteScrollMixin],
  data() {
    return {
      next: `/api${this.$route.path}`,
      loading: false,
      users: []
    }
  },
  computed: {
    noUsers() {
      return !this.users.length && !this.loading
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
            this.users.push(...data.results)
            this.next = data.next
          })
          .catch(console.log)
          .finally(() => this.loading = false)
      }
    },
    removeFollower(username) {
      this.users = this.users.filter(user => user.username !== username)
    }
  }
}
</script>

<style scoped>
.spinner {
  font-size: large;
}
</style>
