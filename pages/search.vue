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
    return {
      title: `${this.$route.query.q} - Meme Page Search`,
      meta: [
        {hid: "description", name: "description", content: "Post your dankest memes here!"},
        {hid: "description", name: "keywords", content: "Meme,Memes,Funny,Posts,Search"}
      ]
    }
  }
}
</script>
