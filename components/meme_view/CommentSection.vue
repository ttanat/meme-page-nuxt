<template>
  <div id="comment-section">
    <h6>Comments ({{ numComments }})</h6>
    <PostComment
      :num-comments="numComments"
      @new-comment-posted-event="newCommentPosted"
      @increment-comment-count-event="incrementCommentCount"
    />
    <CommentItems
      :num-comments="numComments"
      @increment-comment-count-event="incrementCommentCount"
    />
  </div>
</template>

<script>
import PostComment from './PostComment'
import CommentItems from './CommentItems'

export default {
  name: 'CommentSection',
  components: {
    PostComment,
    CommentItems
  },
  props: {
    numComments: {
      type: Number,
      required: true,
      default: 0
    }
  },
  methods: {
    incrementCommentCount() {
      this.$emit('increment-comment-count-event')
    }
  }
}
</script>

<style scoped>
#comment-section {
  padding-bottom: 50px;
}
h6 {
  border-bottom: 1px solid lightgrey;
  padding-bottom: 5px;
}
</style>