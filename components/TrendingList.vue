<template>
  <ul v-if="tags.length" class="list-group">
    <li class="list-group-item trending-bg"><h5>Trending</h5></li>
    <nuxt-link
      v-for="tag in tags"
      :key="tag"
      :to="'/search?q=%23'+tag"
      class="tag list-group-item list-group-item-action trending-bg"
      no-prefetch
    >
      #{{ tag }}
    </nuxt-link>
  </ul>
  <div v-else></div>
</template>

<script>
export default {
  name: 'TrendingList',
  data() {
    return {
      tags: []
    }
  },
  created() {
    this.$axios.get("/api/trending")
      .then(({ data }) => {
        this.tags.push(...data)
      })
  }
}
</script>

<style scoped>
.list-group {
  /* width: 260px; */
  margin-bottom: 20px;
}
.trending-bg {
  background-color: #333;
}
.tag {
  color: whitesmoke;
}
</style>