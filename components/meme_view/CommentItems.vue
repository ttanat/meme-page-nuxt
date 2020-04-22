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
import lazyLoad from '~/assets/lazyLoad'
import formatDate from '~/assets/formatDate'
import axios from 'axios'

export default {
  name: 'CommentItems',
  components: {
    CommentItem
  },
  mixins: [infiniteScrollMixin],
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
      loading: false,
      lazyCommentObserver: new IntersectionObserver(lazyLoad)
    }
  },
  created() {
    this.loadMore()
  },
  methods: {
    observeNewComment(comment) {
      this.lazyCommentObserver.observe(comment)
    },
    setPoints(uuid, new_points_val) {
      this.comments = this.comments.map(comment => comment.uuid === uuid ? {...comment, points: new_points_val} : comment)
    },
    loadMore() {
      if (this.next === null) return false
      this.loading = true

      this.$axios.get(this.next || `/api/comments/?u=${this.$route.params.uuid}`, {progress: false})
        .then(res => res.data)
        .then(response => {
          const l_uuids = []
          let offset = 0
          for (let r of response.results) {
            if (this.comments.findIndex(c => c.uuid === r.uuid) === -1) {
              this.comments.push(r)
              l_uuids.push(r.uuid)
            } else {
              offset++
            }
          }
          if (this.$auth.loggedIn && l_uuids.length) this.loadLikes(l_uuids)
          this.next = response["next"]
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
    loadLikes(uuids) {
      if (this.$auth.loggedIn && uuids.length) {
        this.$axios.get(`/api/likes/c/?${uuids.slice(0, 20).map(uuid => `u=${uuid}`).join("&")}`, {progress: false})
          .then(res => {
            for (let vote of res.data) {
              const meme = this.$children.find(c => c.comment.uuid === vote["uuid"])
              meme.isLiked = vote["point"] === 1
              meme.isDisliked = vote["point"] === -1
            }
          })
          .catch(console.log)
      }
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

<style>
.loading {
  text-align: center;
  font-size: xx-large;
}
</style>