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
    return {
      title: "Meme Page",
      meta: [
        {hid: "description", name: "description", content: "A place for the dankest memes and funniest content. Run your own meme page for your friends, or join existing communities and discover much more!"},
        {hid: "keywords", name: "keywords", content: "Meme,Memes,Funny,Posts"}
      ]
    }
  }
}
</script>
