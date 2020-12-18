<template>
  <button v-if="!showSocial" @click="toggleSocial" class="btn btn-sm lower-btn">
    <font-awesome-icon :icon="['fas', 'share']" />&ensp;Share
  </button>

  <div v-else>
    <a :href="redditUrl" target="_blank">
      <font-awesome-icon :icon="['fab', 'reddit-alien']" title="Reddit" class="ml-1 mr-3 sb" style="color: #FF4500;" />
    </a>
    <a :href="twitterUrl" target="_blank">
      <font-awesome-icon :icon="['fab', 'twitter']" title="Twitter" class="mr-3 sb" style="color: #1DA1F2;" />
    </a>
    <a :href="facebookUrl" target="_blank">
      <font-awesome-icon :icon="['fab', 'facebook']" title="Facebook" class="sb" style="color: rgb(34, 122, 239);" />
    </a>
    <button @click="toggleSocial" class="btn btn-sm lower-btn xb">x</button>
  </div>
</template>

<script>
export default {
  name: 'SocialButtons',
  props: {
    meme: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showSocial: false
    }
  },
  computed: {
    getUrl() {
      return encodeURIComponent(`${window.location.origin}/m/${this.meme.uuid}`)
    },
    redditUrl() {
      return `https://www.reddit.com/submit?url=${this.getUrl}`
    },
    twitterUrl() {
      const title = encodeURIComponent(this.meme.caption)
      const hashtags = this.meme.tags ? this.meme.tags.join(",") : null
      const url = `https://twitter.com/intent/tweet?text=${title}&url=${this.getUrl}`
      return hashtags ? `${url}&hashtags=${hashtags}` : url
    },
    facebookUrl() {
      return `https://www.facebook.com/sharer/sharer.php?u=${this.getUrl}`
    },
  },
  methods: {
    toggleSocial() {
      this.showSocial = !this.showSocial
    }
  }
}
</script>

<style scoped>
.sb {
  margin-top: 7px;
  font-size: 17px;
}
.xb {
  margin-top: -5px;
  font-size: 15px
}
</style>
