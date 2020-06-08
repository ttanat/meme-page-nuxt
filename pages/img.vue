<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-9 col-sm-12" id="left-col">
        <nuxt-link :to="'/m/'+meme" id="back">Back to meme</nuxt-link><br>
        <video v-if="isVid" :src="url" controls id="meme"></video>
        <img v-else :src="url" id="meme">
        <img src="~/assets/banner_light.png" id="adm">
        <img src="~/assets/banner_dark.png" id="adm2">
      </div>
      <div class="col-md-3" id="right-col">
        <h3 class="m-3"><nuxt-link to="/">Meme Page</nuxt-link></h3>
        <div class="m-3">Drag and drop item to save</div>
        <a @click="copyLink" href="javascript:void(0);" class="m-3">Copy link</a>
        <img src="~/assets/banner_light.png" id="ad">
        <img src="~/assets/banner_dark.png" id="ad2">
      </div>
    </div>
  </div>
</template>

<script>
import copy from 'copy-to-clipboard'

export default {
  layout: 'plain',
  async asyncData({ $axios, route }) {
    const obj = "m" in route.query ? "m" : "c" in route.query ? "c" : null
    if (!obj) throw "Invalid URL"
    try {
      const { data } = await $axios.get(`/api/full_res/${obj}/${route.query[obj]}`)
      return {
        url: data.url,
        isVid: data.isVid || data.url.endsWith(".mp4") || false,
        meme: data.m_uuid || route.query.m
      }
    } catch(err) {
      throw "404 Not found"
    }
  },
  head() {
    return {
      title: "Full resolution"
    }
  },
  computed: {
    imgIsComment() {
      return 'c' in this.$route.query && data.meme
    }
  },
  methods: {
    copyLink() {
      copy(`${window.location.origin}/m/${this.$route.query.m || this.$route.query.c}`)
      this.$toast.success("Copied", {
        position: 'bottom-center',
        duration: 1000
      })
    }
  }
}
</script>

<style>
#back {
  text-decoration: none;
  color: unset;
  margin-left: 5px;
  font-size: 1.2rem;
}
h3 > a {
  color: lightgray !important;
}
#left-col {
  left: 0;
  top: 0;
  bottom: 0;
  position: fixed;
  overflow-y: scroll;
  background-color: #252525;
  min-height: 100%;
}
#meme {
  max-width: 500px;
  width: auto;
  height: auto;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
}
#right-col {
  right: 0;
  top: 0;
  position: fixed;
  height: 100%;
  background-color: #191919;
  min-height: 100%;
}
#ad, #ad2 {
  width: 90%;
  border-radius: .2rem;
  left: 0;
  right: 0;
  margin: auto;
  position: absolute;
  cursor: pointer;
}
#ad {
  bottom: 10rem;
}
#ad2 {
  bottom: 2rem;
}
#adm, #adm2 {
  width: 95%;
  margin-top: 5px;
  border-radius: .2rem;
}
@media (max-width: 767.98px) {
  #right-col {
    display: none;
  }
  #left-col, #meme {
    width: 100%;
    text-align: center;
  }
}
@media (min-width: 768px) {
  #meme {
    position: absolute;
    bottom: 0;
  }
  #adm, #adm2 {
    display: none;
  }
}
</style>