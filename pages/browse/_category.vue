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
    return {
      title: `${category === "tv-shows" ? "TV Shows" : `${category[0].toUpperCase()}${category.slice(1)}`} - Meme Page`,
      meta: [
        {hid: "description", name: "description", content: "Post your dankest memes here!"},
        {hid: "description", name: "keywords", content: "Meme,Memes,Funny,Posts"}
      ]
    }
  }
}
</script>
