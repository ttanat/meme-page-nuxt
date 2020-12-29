<template>
  <div class="container-fluid" :class="[!no_content && comments.length ? 'px-3' : 'px-0']">
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
      loading: false,
      no_content: false
    }
  },
  mounted() {
    this.loadMore()
  },
  methods: {
    loadMore() {
      if (this.next === null) return false
      this.loading = true
      this.$axios.get(this.next)
        .then(res => {
          this.comments.push(...res.data.results)
          this.next = res.data.next
        })
        .catch(console.log)
        .finally(() => {
          this.loading = false
          if (!this.comments.length) this.no_content = true
        })
    }
  }
}
</script>

<style scoped>
.profile-empty {
  text-align: center;
  padding: 100px;
  background-color: #090909;
  border-radius: 10px;
  margin-bottom: 10px;
  width: 100%;
}
</style>
