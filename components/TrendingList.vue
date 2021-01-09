<template>
  <ul v-if="Array.isArray(tags) && tags.length" class="list-group">
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
import { mapState } from 'vuex'

export default {
  name: 'TrendingList',
  computed: {
    ...mapState({
      tags: state => state.trendingTags
    })
  },
  created() {
    if (this.tags === null) {
      this.$axios.get("/api/trending")
        .then(({ data }) => {
          this.$store.commit("setTrendingTags", data)
        })
    }
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
.tag:hover {
  background-color: #171717;
}
</style>