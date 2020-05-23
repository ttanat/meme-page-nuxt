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
    this.$store.commit("setCurrentPage", "All")
    return {
      title: "All Memes - Meme Page"
    }
  }
}
</script>
