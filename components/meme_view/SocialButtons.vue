<template>
  <button v-if="!showSocial" @click="toggleSocial" class="btn btn-sm lower-btn">
    <font-awesome-icon :icon="['fas', 'share-alt']" />&ensp;Share
  </button>

  <div v-else class="row">
    <div class="mt-1 mr-3">
      <a href="https://twitter.com/intent/tweet" class="twitter-share-button" data-dnt="true" data-show-count="false">Tweet</a>
      <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    </div>
    <div style="margin-bottom: 6px;">
      <div id="fb-root"></div>
      <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v9.0" nonce="OcTk9x0b"></script>
      <div class="fb-share-button" :data-href="urlWithoutParams" data-layout="button" data-size="small"><a target="_blank" :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlWithoutParams)}&amp;src=sdkpreparse`" class="fb-xfbml-parse-ignore">Share</a></div>
    </div>
    <button @click="toggleSocial" class="btn btn-sm lower-btn" style="margin-top: -2px;">X</button>
  </div>
</template>

<script>
export default {
  name: 'SocialButtons',
  data() {
    return {
      showSocial: false
    }
  },
  computed: {
    urlWithoutParams() {
      return `${window.location.origin}${window.location.pathname}`
    }
  },
  methods: {
    toggleSocial() {
      this.showSocial = !this.showSocial
      this.$emit("change-mr", this.showSocial ? 4 : 2)
    }
  }
}
</script>
