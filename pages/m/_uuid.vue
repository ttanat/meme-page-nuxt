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
          <div class="item pt-0 w-100" :style="{paddingBottom: tags.length ? '10px' : ''}">
            <MemeViewContainer :meme="meme" :tags="tags" />
          </div>
          <div v-if="meme.num_comments > 3" class="mt-3 mb-3" id="item-mid-ad">
            <img src="~/assets/argos.jpg" style="height: 100px;width: 100%;border-radius: 5px;cursor: pointer;">
          </div>
          <CommentSection :num-comments="meme.num_comments" @new-comment-posted-event="incrementCommentCount" />
        </div>

        <div class="col-md-4 col-lg-3" id="right" style="text-align: center;">
          <img class="ad" src="~/assets/got_ad.png" alt="Advertisement">
          <div style="padding: 10px;margin-bottom: 20px;">
            <img src="~/assets/google_play.png" style="width: 70%;overflow: hidden;">
            <img src="~/assets/app_store.png" style="width: 64%;overflow: hidden;border: solid 1px grey;border-radius: 10px;">
          </div>

          <div style="text-align: center;top: 4em;position: sticky;position: -webkit-sticky;">
            <img class="ad" src="~/assets/ad.png" alt="Advertisement">
            <img class="ad" src="~/assets/ad_two.png" alt="Advertisement">
          </div>
        </div>

      </div>
    </div>

    <div v-if="meme.content_type.includes('image/')" id="overlay" onclick="overlayOff()" @contextmenu.prevent><img :src="meme.url"></div>
    <input id="copy_text" style="display: none;">
    <DeleteModal />
  </main>
</template>

<script>
import LeftSidebar from '~/components/LeftSidebar'
import MemeViewContainer from '~/components/meme_view/MemeViewContainer'
import CommentSection from '~/components/meme_view/CommentSection'
import DeleteModal from '~/components/modals/DeleteModal'
import { mapMutations } from 'vuex'
import axios from 'axios'

export default {
  components: {
    LeftSidebar,
    MemeViewContainer,
    CommentSection,
    DeleteModal
  },
  data() {
    return {
      // meme: {username: "", pname: "", pdname: "", uuid: "", caption: "", content_type: "", url: "", points: 0, num_comments: 0, dp_url: ""},
      tags: []
    }
  },
  async asyncData({ params }) {
    const { data } = await axios.get(`http://127.0.0.1:8000/api/memes/?u=${params.uuid}`)
    return { meme: data.results[0] }
  },
  // created() {
  //   const m = this.$store.state.memes.find(m => m.uuid === this.$route.params.uuid)
  //   if (m) {
  //     this.meme = m
  //   } else {
  //     axios.get(`http://127.0.0.1:8000/api/memes/?u=${this.$route.params.uuid}`)
  //       .then(r => r.data.results[0])
  //       .then(data => {
  //         this.meme = data
  //         this.addMeme(data)
  //       })
  //   }
  // },
  head() {
    return {
      title: `${this.meme.caption ? `${this.meme.caption} - ` : ''}Meme Page`,
      meta: [
        {hid: "description", name: "description", content: this.meme.caption},
        {hid: "description", name: "keywords", content: this.tags.map(t => t.slice(1)).join(",")}
      ]
    }
  },
  methods: {
    ...mapMutations(["addMeme"]),
    incrementCommentCount() {
      this.meme.num_comments++
    }
  }
}
</script>

<style scoped>
.item {
  background-color: #171717;
  border: 1px solid #444444;
  border-radius: 5px;
}
</style>
