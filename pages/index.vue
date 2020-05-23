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
    this.$store.commit("setCurrentPage", "Dank Memes")
    return {
      title: "Meme Page"
    }
  }
}
</script>
