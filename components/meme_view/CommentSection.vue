<template>
  <div id="comment-section">
    <h6>Comments ({{ numComments }})</h6>
    <PostComment />
    <CommentItems />
  </div>
</template>

<script>
import PostComment from './PostComment'
import CommentItems from './CommentItems'
import { mapGetters } from 'vuex'

export default {
  name: 'CommentSection',
  components: {
    PostComment,
    CommentItems
  },
  computed: {
    ...mapGetters({numComments: "meme/numComments"})
  }
}
</script>

<style scoped>
#comment-section {
  padding-bottom: 50px;
}
h6 {
  color: #ddd;
  border-bottom: 1px solid lightgrey;
  padding-bottom: 5px;
}
</style>