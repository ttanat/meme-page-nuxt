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
      @increment-comment-count-event="$emit('increment-comment-count-event')"
    />
    <div v-show="loading" class="loading"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
  </div>
</template>

<script>
import CommentItem from './CommentItem'
import infiniteScrollMixin from '~/mixins/infiniteScrollMixin'
import lazyLoadMixin from '~/mixins/lazyLoadMixin'
import loadLikesMixin from '~/mixins/loadLikesMixin'
import paginationOffsetMixin from '~/mixins/paginationOffsetMixin'

export default {
  name: 'CommentItems',
  components: {
    CommentItem
  },
  mixins: [infiniteScrollMixin, lazyLoadMixin, loadLikesMixin, paginationOffsetMixin],
  props: {
    numComments: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      next: "",
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
      if (this.next === null || !this.numComments) return false
      this.loading = true

      this.$axios.get(this.next || `/api/comments/?u=${this.$route.params.uuid}`)
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
    }
  },
  beforeDestroy() {
    this.$parent.$off("new-comment-posted-event", this.showNewComment)
  }
}
</script>
