<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center" style="padding-bottom: 25px;">

        <div class="col-lg-2" id="left">
          <div id="left-sidebar">
            <LeftSidebar />
          </div>
        </div>

        <div class="col-md-8 col-lg-6">
          <div class="item pt-0 w-100" :style="{paddingBottom: meme.tags.length ? '10px' : ''}">
            <MemeViewContainer />
          </div>
          <div v-if="meme.num_comments > 3" class="my-3" id="item-mid-ad">
            <img src="~/assets/argos.jpg" style="height: 100px;width: 100%;border-radius: 5px;cursor: pointer;">
          </div>
          <CommentSection />
        </div>

        <div class="col-md-4 col-lg-3 justify-content-center" id="right">
          <PageSidebar v-if="meme.page" :page="meme.page" />
          <div class="right-fixed">
            <img class="ad" src="~/assets/ad.png" alt="Advertisement">
            <img class="ad" src="~/assets/ad_two.png" alt="Advertisement">
          </div>
        </div>

      </div>
    </div>

    <!-- Fullscreen image overlay -->
    <div
      v-if="isImage"
      v-show="$store.state.showOverlay"
      id="overlay"
      @click="$store.commit('setShowOverlay', false)"
      @contextmenu.prevent
    >
      <img
        :srcset="meme.fallback ? meme.url : ''"
        :src="meme.fallback || meme.url"
        draggable="false"
        @contextmenu.prevent
      >
    </div>

    <DeleteModal />
  </main>
</template>

<script>
import LeftSidebar from '~/components/LeftSidebar'
import MemeViewContainer from '~/components/meme_view/MemeViewContainer'
import CommentSection from '~/components/meme_view/CommentSection'
import PageSidebar from '~/components/meme_view/PageSidebar'
import DeleteModal from '~/components/modals/DeleteModal'
import { mapGetters } from 'vuex'
import urlFileExtMixin from '~/mixins/urlFileExtMixin'

export default {
  components: {
    LeftSidebar,
    MemeViewContainer,
    CommentSection,
    PageSidebar,
    DeleteModal
  },
  mixins: [urlFileExtMixin],
  async asyncData({ $axios, store, params }) {
    const { data } = await $axios.get(`/api/m/${params.uuid}`)
    store.commit("meme/setData", data)
    return {}
  },
  computed: {
    ...mapGetters({meme: "meme/meme"}),
    isImage() {
      return this.checkUrlIsImage(this.meme.url)
    }
  },
  head() {
    this.$store.commit("setCurrentPage", "Meme")
    return {
      title: `${this.meme.caption} - Meme Page`,
      meta: [
        {hid: "keywords", name: "keywords", content: `Meme,Memes,Funny,Dank,${this.meme.tags.join(",")}`},
        {hid: "description", name: "description", content: `${this.meme.caption} - Meme Page`},
        {hid: "author", name: "author", content: this.meme.username},
        // Twitter meta tags
        {hid: "twitter:card", name: "twitter:card", content: this.isImage ? "summary_large_image" : "summary"},
        {hid: "twitter:title", name: "twitter:title", content: this.meme.caption},
        {hid: "twitter:description", name: "twitter:description", content: `By ${this.meme.username}${this.isImage ? "" : ". Click to see video."}`},
        {hid: "twitter:image", name: "twitter:image", content: this.isImage ? this.meme.url : this.meme.thumbnail},
        {hid: "twitter:image:alt", name: "twitter:image:alt", content: "Funny image here. Now laugh."},
        // Open graph meta tags
        {hid: "og:url", property: "og:url", content: `${window.location.origin}${window.location.pathname}`},
        {hid: "og:title", property: "og:title", content: this.meme.caption},
        {hid: "og:image", property: "og:image", content: this.isImage ? this.meme.url : this.meme.thumbnail},
        {hid: "og:description", property: "og:description", content: `By ${this.meme.username}${this.isImage ? "" : ". Click to see video."}`},
      ]
    }
  }
}
</script>

<style src="~/assets/comments.css"></style>
<style scoped>
.item {
  background-color: #171717;
  border: 1px solid #444444;
  border-radius: 7px;
}
.right-fixed {
  text-align: center;
}
#overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.9);
  z-index: 2;
}
#overlay img {
  height: 85%;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  cursor: zoom-out;
}
</style>
