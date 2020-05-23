<template>
  <ScrollView :searchListView="'@^'.includes(this.$route.query.q[0])" />
</template>

<script>
import ScrollView from '~/components/ScrollView'

export default {
  scrollToTop: true,
  components: {
    ScrollView
  },
  head() {
    this.$store.commit("setCurrentPage", "Search")
    return {
      title: `${this.$route.query.q} - Meme Page Search`,
      meta: [
        {hid: "description", name: "keywords", content: `Meme,Memes,Funny,Dank,${this.$route.query.q.split(' ').join(',')}`}
      ]
    }
  }
}
</script>
