<template>
  <div id="comments">
    <h6>Comments ({{ numComments }})</h6>
    <PostComment :num-comments="numComments" @new-comment-event="$emit('new-comment-posted-event')" />
    <CommentItems :num-comments="numComments" />
  </div>
</template>

<script>
import PostComment from './PostComment'
import CommentItems from './CommentItems'

export default {
  name: 'CommentSection',
  components: {
    PostComment,
    CommentItems,
  },
  props: {
    numComments: {
      type: Number,
      required: true,
      default: 0
    }
  }
}
</script>

<style scoped>
#comments {
  padding-bottom: 50px;
}
h6 {
  border-bottom: 1px solid lightgrey;
  padding-bottom: 5px;
}
</style>