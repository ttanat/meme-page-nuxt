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
            <MemeViewContainer :meme="meme" @set-points-event="setPoints" />
          </div>
          <div v-if="meme.num_comments > 3" class="my-3" id="item-mid-ad">
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

          <div class="right-fixed">
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

export default {
  components: {
    LeftSidebar,
    MemeViewContainer,
    CommentSection,
    DeleteModal
  },
  async asyncData({ $axios, params }) {
    const { data } = await $axios.get(`/api/m/${params.uuid}`)
    return { meme: data }
  },
  head() {
    return {
      title: `${this.meme.caption ? `${this.meme.caption} - ` : ''}Meme Page`,
      meta: [
        {hid: "description", name: "description", content: this.meme.caption},
        {hid: "keywords", name: "keywords", content: `Meme,${this.meme.tags.map(t => t.slice(1)).join(",")}`}
      ]
    }
  },
  methods: {
    setPoints(uuid, new_points_val) {
      this.meme.points = new_points_val
    },
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
.right-fixed {
  text-align: center;
  top: 4rem;
  position: sticky;
  position: -webkit-sticky;
}
</style>
