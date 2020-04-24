<script>
export default {
  layout: 'ScrollView',
  middleware: 'custom-auth',
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
