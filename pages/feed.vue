<template>
  <ScrollView />
</template>

<script>
import ScrollView from '~/components/ScrollView'

export default {
  middleware: 'custom-auth',
  scrollToTop: true,
  components: {
    ScrollView
  },
  head() {
    this.$store.commit("setCurrentPage", "Feed")
    return {
      title: "Feed - Meme Page",
      meta: [
        {hid: 'robots', name: 'robots', content: 'noindex'},
      ]
    }
  }
}
</script>
