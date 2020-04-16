<template>
  <div>
    <MemeItem
      v-for="meme in memes"
      :key="meme.uuid"
      :meme="meme"
      :muted="muted"
      @new-meme-event="observeNewMeme"
      @toggle-sound-event="toggleSound"
    />
    <div v-show="loading" class="loading"><i class="fas fa-circle-notch fa-spin"></i></div>
    <div v-if="noMemes" style="margin-top: 30px;text-align: center;">
      <template v-if="true">No results matching query.<br><br>Return <a href="/">home</a></template>
      <template v-if="true">No new posts.<br><br>Subscribe to more pages or follow other users for more posts!</template>
    </div>
  </div>
</template>

<script>
import MemeItem from './MemeItem'
import infiniteScrollMixin from '~/mixins/infiniteScrollMixin'
import lazyLoad from '~/assets/lazyLoad'

export default {
  name: 'MemeItems',
  components: {
    MemeItem
  },
  mixins: [infiniteScrollMixin],
  created() {
    window.addEventListener("blur", this.pauseAll)
  },
  data() {
    return {
      memes: [],
      muted: true,
      scrollObserver: null,
      scrollRoot: null,
      next: "",
      loading: false,
      lazyMemeObserver: new IntersectionObserver(lazyLoad, {rootMargin: "300px 0px"}),
      autoplayObserver: null,
      noMemes: false,
    }
  },
  mounted() {
    this.loadMore() // Initial load
    this.autoplayObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const i = this.$children.findIndex(child => child.$refs.memeEl === entry.target)
        if (i > -1) this.$children[i].togglePlayback(entry.intersectionRatio > 0.9)
      })
    }, {threshold: [0.1, 0.9]})
  },
  methods: {
    toggleSound() {
      this.muted = !this.muted
      this.$children.forEach(c => {if (c.isVideo) c.$refs.memeEl.muted = this.muted})
    },
    observeNewMeme(meme, isVideo) {
      this.lazyMemeObserver.observe(meme)
      if (isVideo) this.autoplayObserver.observe(meme)
    },
    loadMore() {
      // if (this.next === null || (window.location.pathname.startsWith("/page/") && (!SHOW || !PAGE_NUM_POSTS))
      //     || (!["/", "/all", "/feed", "/search"].includes(window.location.pathname) && !window.location.pathname.match(/^\/page\/[a-zA-Z0-9_]+$/)
      //     && !window.location.pathname.match(/^\/browse\/[a-zA-Z0-9_]+$|^\/browse\/tv-shows$/))) return false;
      this.loading = true

      this.$axios.get(this.getURL())
        .then(res => res.data)
        .then(response => {
          const results = response["results"]
          const l_uuids = []
          if (results.length) {
            for (let r of results) {
              if (this.memes.findIndex(meme => meme.uuid === r.uuid) === -1) {
                this.memes.push(r)
                l_uuids.push(r.uuid)
              }
            }
            if (response["auth"] && this.$auth.loggedIn && l_uuids.length) this.loadLikes(l_uuids)
            this.next = response["next"]
          } else {
            if (this.next === "" && !this.$children.length) {
              const returnHome = 'Return <a href="/">home</a>'
              const inside = window.location.pathname === "/search" ? `No results matching query.<br><br>${returnHome}` : window.location.pathname === "/feed" ? 'No new posts.<br><br>Subscribe to more pages or follow other users for more posts!' : `No memes here :(<br><br>${returnHome}`
              this.$el.innerHTML = `<div style="margin-top: 30px;text-align: center;">${inside}</div>`
            }
            if (this.scrollRoot) this.scrollObserver.unobserve(this.scrollRoot)
            this.scrollObserver = this.scrollRoot = this.next = null
          }
        })
        .catch(console.log)
        .finally(() => this.loading = false)
    },
    getURL() {
        return this.next || (window.location.pathname === "/search" ? `/api/memes/?p=search&q=${encodeURIComponent(new URL(window.location.href).searchParams.get("q").slice(0, 64))}`
              : window.location.pathname.startsWith("/page/") && AUTH && PRIVATE && SHOW ? `/api/memes/pv/?n=${encodeURIComponent(PAGE_NAME)}`
              : `/api/memes/?p=${encodeURIComponent(window.location.pathname.slice(1))}`)
    },
    loadLikes(uuids) {
      if (this.$auth.loggedIn && uuids.length) {
        this.$axios.get(`/api/likes/m/?${uuids.slice(0, 20).map(uuid => `u=${uuid}`).join("&")}`)
          .then(res => {
            for (vote of res.data) {
              const i = this.$children.findIndex(c => c.meme.uuid === vote["uuid"])
              this.$children[i].isLiked = vote["point"] === 1
              this.$children[i].isDisliked = vote["point"] === -1
            }
          })
          .catch(console.log)
      }
    },
    pauseAll() {
      this.$children.forEach(c => {
        if (c.isVideo) c.togglePlayback(false)
      })
    }
  },
  destroyed() {
    window.removeEventListener("blur", this.pauseAll)
  }
}
</script>

<style scoped>
.loading {
  text-align: center;
  font-size: x-large;
  padding: 20px;
}
</style>
