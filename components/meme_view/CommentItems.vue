<template>
  <div>
    <CommentItem
      v-for="comment in comments"
      :key="comment.uuid"
      :comment="comment"
      @new-comment-loaded-event="observeNewComment"
      @comment-edited-event="commentEdited"
      @comment-deleted-event="commentDeleted"
      @set-points-event="setPoints"
      @increment-num-replies-event="incrementNumReplies"
    />
    <div v-show="loading" class="loading"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
  </div>
</template>

<script>
import CommentItem from './CommentItem'
import infiniteScrollMixin from '~/mixins/infiniteScrollMixin'
import lazyLoadMixin from '~/mixins/lazyLoadMixin'
import paginationOffsetMixin from '~/mixins/paginationOffsetMixin'

export default {
  name: 'CommentItems',
  components: {
    CommentItem
  },
  mixins: [infiniteScrollMixin, lazyLoadMixin, paginationOffsetMixin],
  data() {
    return {
      firstComment: !this.$store.getters["meme/numComments"], // True if 0 comments (prevent loadMore() if user posts first comment)
      comments: [],
      currentUuids: new Set(),
      next: `/api/comments/?u=${this.$route.params.uuid}`,
      loading: false
    }
  },
  created() {
    this.loadMore()
    if (this.$auth.loggedIn) {
      this.$parent.$on("new-comment-posted-event", this.showNewComment)
    }
  },
  methods: {
    showNewComment(new_comment_obj) {
      this.comments.unshift(new_comment_obj)
    },
    observeNewComment(comment) {
      this.lazyObjectObserver.observe(comment)
    },
    setPoints(uuid, new_points_val) {
      this.comments.find(comment => comment.uuid === uuid).points = new_points_val
    },
    loadMore() {
      if (this.next === null || this.firstComment || !this.$store.getters["meme/numComments"]) return false
      this.loading = true

      this.$axios.get(this.next)
        .then(({ data: { results, next } }) => {
          let offset = 0
          const newComments = []
          for (const r of results) {
            if (!this.currentUuids.has(r.uuid)) {
              newComments.push(r)
              this.currentUuids.add(r.uuid)
            } else {
              offset++
            }
          }
          this.comments.push(...newComments)
          this.next = next
          if (offset) this.increaseOffset(offset)
        })
        .catch(console.log)
        .finally(() => this.loading = false)
    },
    getComment(uuid) {
      return this.comments.find(c => c.uuid === uuid)
    },
    commentEdited(uuid, val) {
      const comment = this.getComment(uuid)
      comment.content = val
      comment.edited = true
    },
    commentDeleted(uuid) {
      const comment = this.getComment(uuid)
      comment.content = comment.image = null
    },
    incrementNumReplies(uuid) {
      // Increment num_replies for comment
      this.comments.find(comment => comment.uuid === uuid).num_replies++
      // Increment number of comments at top of comment section
      this.$store.commit("meme/incrementCommentCount")
    }
  },
  beforeDestroy() {
    this.$parent.$off("new-comment-posted-event", this.showNewComment)
  }
}
</script>
