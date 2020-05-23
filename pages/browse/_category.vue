<template>
  <ScrollView />
</template>

<script>
import ScrollView from '~/components/ScrollView'

export default {
  scrollToTop: true,
  components: {
    ScrollView
  },
  head() {
    const category = this.$route.params.category
    const title = category === "tv-shows" ? "TV Shows"
                : ["nba", "nfl"].includes(category) ? category.toUpperCase()
                : `${category[0].toUpperCase()}${category.slice(1)}`
    this.$store.commit("setCurrentPage", title)
    return {
      title: `${title} - Meme Page`
    }
  }
}
</script>
