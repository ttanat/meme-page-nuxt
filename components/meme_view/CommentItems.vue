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
    />
    <div v-show="loading" class="loading"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
  </div>
</template>

<script>
import CommentItem from './CommentItem'
import infiniteScrollMixin from '~/mixins/infiniteScrollMixin'
import lazyLoadMixin from '~/mixins/lazyLoadMixin'
import loadLikesMixin from '~/mixins/loadLikesMixin'

export default {
  name: 'CommentItems',
  components: {
    CommentItem
  },
  mixins: [infiniteScrollMixin, lazyLoadMixin, loadLikesMixin],
  props: {
    numComments: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      scrollObserver: null,
      scrollRoot: null,
      next: "",
      loading: false
    }
  },
  created() {
    this.loadMore()
  },
  methods: {
    observeNewComment(comment) {
      this.lazyObjectObserver.observe(comment)
    },
    setPoints(uuid, new_points_val) {
      this.comments.find(comment => comment.uuid === uuid).points = new_points_val
    },
    loadMore() {
      if (this.next === null) return false
      this.loading = true

      this.$axios.get(this.next || `/api/comments/?u=${this.$route.params.uuid}`, {progress: false})
        .then(res => res.data)
        .then(data => {
          const l_uuids = []
          let offset = 0
          for (const r of data.results) {
            if (!this.comments.find(c => c.uuid === r.uuid)) {
              this.comments.push(r)
              l_uuids.push(r.uuid)
            } else {
              offset++
            }
          }
          if (this.$auth.loggedIn && l_uuids.length) this.loadLikes(l_uuids, "c")
          this.next = data.next
          if (offset) {
            const url = new URL(this.next)
            const old_offset = url.searchParams.get("offset")
            url.searchParams.set("offset", offset + (parseInt(old_offset) || 0))
            this.next = url.href
          }
        })
        .catch(console.log)
        .finally(() => this.loading = false)
    },
    getComment(uuid) {
      const i = this.comments.findIndex(c => c.uuid === uuid)
      return this.comments[i]
    },
    commentEdited(uuid, val) {
      const comment = this.getComment(uuid)
      comment.content = val
      comment.edited = true
    },
    commentDeleted(uuid) {
      const comment = this.getComment(uuid)
      // num_comments_span.textContent -= (1 + this.comments[i].num_replies)
      // this.comments.splice(i, 1)
      comment.content = comment.image = null
    }
  }
}
</script>
