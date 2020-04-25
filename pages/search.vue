<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div id="left" class="col-lg-2 col-xl-2">
          <LeftSidebar />
        </div>
        <div id="mid" class="col-sm-8 col-lg-7 col-xl-6">
          <ListItems />
        </div>
        <div id="right" class="col-sm-4 col-lg-3 col-xl-3">
          <div class="right-fixed">
            <img class="ad" src="~/assets/got_ad.png" alt="Advertisement">
            <img class="ad" src="~/assets/ad.png" alt="Advertisement">
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import LeftSidebar from '~/components/LeftSidebar'
import ListItems from '~/components/ListItems'

export default {
  components: {
    LeftSidebar,
    ListItems
  },
  layout({ query }) {
    return "@^".includes(query.q[0]) ? 'default' : 'ScrollView'
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

<style scoped>
.right-fixed {
  position: sticky;
  position: -webkit-sticky;
  top: 4rem;
}
</style>
