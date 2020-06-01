<template>
  <div id="comment-section">
    <h6>Comments ({{ numComments }})</h6>
    <CommentItems
      :num-comments="numComments"
      @increment-comment-count-event="$emit('increment-comment-count-event')"
    />
  </div>
</template>

<script>
import CommentItems from './CommentItems'

export default {
  name: 'CommentSection',
  components: {
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
#comment-section {
  padding-bottom: 50px;
}
h6 {
  border-bottom: 1px solid lightgrey;
  padding-bottom: 5px;
}
</style>