<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div id="left" class="col-lg-2 col-xl-2">
          <LeftSidebar />
        </div>
        <div id="mid" class="col-sm-8 col-lg-7 col-xl-6">
          <button @click="clickMe">click me</button>
          <button @click="addPage">add page</button>
          <button @click="removePage">remove page</button>
          <MemeItems />
        </div>
        <div id="right" class="col-sm-4 col-lg-3 col-xl-3">
          <div style="position: sticky;position: -webkit-sticky;top: 4rem;">
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
import MemeItems from '~/components/MemeItems'
import { mapActions } from 'vuex'

export default {
  components: {
    LeftSidebar,
    MemeItems
  },
  head() {
    return {
      title: "Meme Page",
      meta: [
        {hid: "description", name: "description", content: "Post your dankest memes here!"},
        {hid: "description", name: "keywords", content: "Meme,Memes,Funny,Posts"}
      ]
    }
  },
  methods: {
    clickMe() {
      this.$toasted.show('Error: Network Error', {
        position: 'bottom-center',
        duration: 2000,
        keepOnHover: true,
        action : {
          text : 'X',
          class: 'red',
          onClick : (e, toastObject) => {
            toastObject.goAway(0)
          }
        }
      })
    },
    addPage() {
      this.SET_AUTH_USER_MODERATING({page: {name: "new_page", dname: "New Page", private: false}, add: true})
    },
    removePage() {
      this.SET_AUTH_USER_MODERATING({page: {name: "new_page", dname: "New Page", private: false}, add: false})
    },
    ...mapActions("auth", ["SET_AUTH_USER_MODERATING"])
  }
}
</script>

<style scoped>
@media (max-width: 575.98px) {
  #mid {
    padding: 0 !important;
  }
}
</style>
