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
    return {
      title: "Feed - Meme Page",
      meta: [
        {hid: "description", name: "description", content: "Post your dankest memes here!"},
        {hid: "description", name: "keywords", content: "Meme,Memes,Funny,Posts,Feed"}
      ]
    }
  }
}
</script>
