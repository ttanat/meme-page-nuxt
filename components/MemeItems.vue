<template>
  <div>
    <MemeItem
      v-for="meme in memes"
      :key="meme.uuid"
      :meme="meme"
      :muted="muted"
      @new-meme-event="observeNewMeme"
      @toggle-sound-event="toggleSound"
      @set-points-event="setPoints"
    />
    <div v-show="loading" class="loading"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
    <div v-if="noMemes" style="margin-top: 30px;text-align: center;">
      <template v-if="$route.path === '/search'">No results matching query.<br><br>Return <a href="/">home</a></template>
      <template v-else-if="$route.path === '/feed'">No new posts.<br><br>Subscribe to more pages or follow other users for more posts!</template>
      <template v-else>No memes here :(<br><br>Return <a href="/">home</a></template>
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
    setPoints(meme, new_points) {
      const i = this.$children.findIndex(c => c === meme)
      if (i > -1) this.$children[i].points = new_points
    },
    loadMore() {
      // if (this.next === null || (this.$route.path.startsWith("/page/") && (!SHOW || !PAGE_NUM_POSTS))
      //     || (!["/", "/all", "/feed", "/search"].includes(this.$route.path) && !this.$route.path.match(/^\/page\/[a-zA-Z0-9_]+$/)
      //     && !this.$route.path.match(/^\/browse\/[a-zA-Z0-9_]+$|^\/browse\/tv-shows$/))) return false;
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
            if (this.next === "" && !this.$children.length) this.noMemes = true
            if (this.scrollRoot) this.scrollObserver.unobserve(this.scrollRoot)
            this.scrollObserver = this.scrollRoot = this.next = null
          }
        })
        .catch(console.log)
        .finally(() => this.loading = false)
    },
    getURL() {
        return this.next || (this.$route.path === "/search" ? `/api/memes/?p=search&q=${encodeURIComponent(new URL(window.location.href).searchParams.get("q").slice(0, 64))}`
              : this.$route.path.startsWith("/page/") && AUTH && PRIVATE && SHOW ? `/api/memes/pv/?n=${encodeURIComponent(PAGE_NAME)}`
              : `/api/memes/?p=${encodeURIComponent(this.$route.path.slice(1))}`)
    },
    loadLikes(uuids) {
      if (this.$auth.loggedIn && uuids.length) {
        this.$axios.get(`/api/likes/m/?${uuids.slice(0, 20).map(uuid => `u=${uuid}`).join("&")}`)
          .then(res => {
            for (let vote of res.data) {
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
