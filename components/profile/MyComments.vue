<template>
  <div class="container-fluid">
    <MyComment v-for="comment in comments" :key="comment.uuid" :comment="comment" />
    <div v-if="loading"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
    <div v-if="no_content && !comments.length" class="profile-empty">No comments yet</div>
  </div>
</template>

<script>
import MyComment from './MyComment'
import infiniteScrollMixin from '~/mixins/infiniteScrollMixin'

export default {
  name: 'MyComments',
  components: {
    MyComment
  },
  mixins: [infiniteScrollMixin],
  data() {
    return {
      comments: [],
      next: "/api/profile/comments",
      scrollObserver: null,
      scrollRoot: null,
      loading: false,
      no_content: false
    }
  },
  async mounted() {
    await this.loadMore()
    if (!this.comments.length) this.no_content = true
  },
  methods: {
    loadMore() {
      if (this.next === null) return false
      this.loading = true
      axios.get(this.next)
        .then(res => {
          this.comments.push(...res.data.results)
          this.next = res.data.next
        })
        .catch(console.log)
        .finally(() => this.loading = false)
    }
  }
}
</script>

<style>

</style>