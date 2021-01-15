<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-9 col-sm-12" id="img-left-col">
        <nuxt-link :to="'/m/'+meme" id="img-back-btn">Back to meme</nuxt-link><br>
        <video v-if="isVideo" :src="url" controls id="img-meme"></video>
        <img v-else :src="url" id="img-meme">
      </div>
      <div class="col-md-3" id="img-right-col">
        <h3 class="m-3"><nuxt-link to="/" id="img-brand">Meme Page</nuxt-link></h3>
        <div class="m-3">Drag and drop image to save</div>
        <a @click="copyLink" href="javascript:void(0);" class="m-3">Copy link</a>
        <adsbygoogle id="ad" ad-format="rectangle" />
      </div>
    </div>
  </div>
</template>

<script>
import copy from 'copy-to-clipboard'
import urlFileExtMixin from '~/mixins/urlFileExtMixin'

export default {
  layout: 'plain',
  mixins: [urlFileExtMixin],
  async asyncData({ $axios, route }) {
    const obj = "m" in route.query ? "m" : "c" in route.query ? "c" : null
    if (!obj) throw "Invalid URL"
    const { data } = await $axios.get(`/api/download/${obj}/${route.query[obj]}`)
    return {
      url: data.url,
      meme: data.meme_uuid || route.query.m
    }
  },
  head() {
    return {
      title: "Full resolution",
      meta: [
        {hid: 'robots', name: 'robots', content: 'noindex, noimageindex'},
      ]
    }
  },
  computed: {
    isVideo() {
      return this.checkUrlIsVideo(this.url)
    },
    imgIsComment() {
      return 'c' in this.$route.query && data.meme
    }
  },
  methods: {
    copyLink() {
      copy(`${window.location.origin}/m/${this.$route.query.m || this.$route.query.c}`)
      this.successToast("Copied")
    }
  }
}
</script>

<style>
#img-back-btn {
  text-decoration: none;
  color: unset;
  margin-left: 5px;
  font-size: 1.2rem;
}
#img-brand {
  color: lightgray !important;
}
#img-left-col {
  left: 0;
  top: 0;
  bottom: 0;
  position: fixed;
  overflow-y: scroll;
  background-color: #252525;
  min-height: 100%;
}
#img-meme {
  max-width: 500px;
  width: auto;
  height: auto;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
}
#img-right-col {
  right: 0;
  top: 0;
  position: fixed;
  height: 100%;
  background-color: #191919;
  min-height: 100%;
}
#ad {
  width: 90%;
  border-radius: .2rem;
  left: 0;
  right: 0;
  bottom: 1.5rem;
  margin: auto;
  position: absolute;
  cursor: pointer;
}
@media (max-width: 767.98px) {
  #img-right-col {
    display: none;
  }
  #img-left-col, #img-meme {
    width: 100%;
    text-align: center;
  }
}
@media (min-width: 768px) {
  #img-meme {
    position: absolute;
    bottom: 0;
  }
}
</style>
