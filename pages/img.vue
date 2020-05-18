<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-9 col-sm-12" id="left-col">
        <a href="/" id="back">Back to meme page</a><br>
        <video v-if="isVid" :src="url" controls id="meme"></video>
        <img v-else :src="url" id="meme">
        <img src="~/assets/banner_light.png" id="adm">
        <img src="~/assets/banner_dark.png" id="adm2">
      </div>
      <div class="col-md-3" id="right-col">
        <h3 style="margin: 1rem;">Meme Page</h3>
        <span style="margin: 1rem;">Drag and drop item to save</span>
        <img src="~/assets/banner_light.png" id="ad">
        <img src="~/assets/banner_dark.png" id="ad2">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'plain',
  async asyncData({ $axios, route }) {
    const { data } = await $axios.get(`/api/full_res${route.fullPath.slice(route.fullPath.indexOf("?"))}`)
    return { url: data.url, isVid: data.isVid || false }
  },
  head() {
    return {
      title: "Full resolution"
    }
  }
}
</script>

<style>
#back {
  text-decoration: none;
  color: unset;
  margin-left: 5px;
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