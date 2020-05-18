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
      @context-menu-event="closeAllContextMenus"
    />
    <div v-show="loading || $fetchState.pending" class="loading"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
    <div v-if="noMemes" class="no-memes">
      <template v-if="pathname === '/search'">No results matching query.<br><br>Return <nuxt-link to="/">home</nuxt-link></template>
      <template v-else-if="pathname === '/feed'">No new posts.<br><br>Subscribe to more pages or follow other users for more posts!</template>
      <template v-else>No memes here :(<br><br>Return <nuxt-link to="/">home</nuxt-link></template>
    </div>
  </div>
</template>

<script>
import MemeItem from './MemeItem'
import infiniteScrollMixin from '~/mixins/infiniteScrollMixin'
import lazyLoad from '~/assets/lazyLoad'

export default {
  name: 'MemeItems',
  props: {
    pageConfig: {
      type: Object,
      required: false
    }
  },
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
      next: null,
      loading: false,
      lazyMemeObserver: new IntersectionObserver(lazyLoad, {rootMargin: "300px 0px"}),
      autoplayObserver: null,
      noMemes: false
    }
  },
  computed: {
    pathname() {
      return this.$route.path
    }
  },
  watch: {
    "$route.params": "$fetch", // Duplicate request bug caused by this line
    "$route.query.q": "$fetch"
  },
  async fetch() {
    /*
      Duplicate request bug fixed
      Index wasn't using ScrollView layout, but other routes were
      Switched index to ScrollView layout
    */
    if (!this.canLoadMore()) return false
    this.noMemes = false
    const { data } = await this.$axios.get(this.getNewURL(), {progress: false})
    const { results } = data
    this.memes = results
    this.$nextTick(() => {if (results.length) {
      const l_uuids = results.map(r => r.uuid)
      if (this.$auth.loggedIn && l_uuids.length) this.loadLikes(l_uuids)
      this.next = data.next
    } else {
      this.noMemes = true
      this.scrollObserver = this.scrollRoot = null
    }})
  },
  mounted() {
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
    setPoints(uuid, new_points_val) {
      const i = this.memes.findIndex(meme => meme.uuid === uuid)
      this.memes.splice(i, 1, {...this.memes[i], points: new_points_val})
    },
    canLoadMore(check_next=false) {
      if (check_next && this.next === null) return false
      if ((this.pathname.startsWith("/page/") && (!this.pageConfig.show || !this.pageConfig.num_posts))
          || (!["/", "/all", "/feed", "/search"].includes(this.pathname) && !this.pathname.match(/^\/page\/[a-zA-Z0-9_]+$/)
          && !this.pathname.match(/^\/browse\/[a-zA-Z0-9_]+$|^\/browse\/tv-shows$/))) return false
      return true
    },
    loadMore() {
      if (!this.canLoadMore(true)) return false
      this.loading = true

      this.$axios.get(this.next, {progress: false})
        .then(res => res.data)
        .then(data => {
          const { results } = data
          if (results.length) {
            const l_uuids = []
            for (let r of results) {
              if (!this.memes.find(m => m.uuid === r.uuid)) {
                this.memes.push(r)
                l_uuids.push(r.uuid)
              }
            }
            if (this.$auth.loggedIn && l_uuids.length) this.loadLikes(l_uuids)
            this.next = data.next
          } else {
            if (this.scrollRoot) this.scrollObserver.unobserve(this.scrollRoot)
            this.scrollObserver = this.scrollRoot = this.next = null
          }
        })
        .catch(console.log)
        .finally(() => this.loading = false)
    },
    getNewURL() {
      return this.pathname === "/search" ? `/api/memes/?p=search&q=${encodeURIComponent(new URL(window.location.href).searchParams.get("q").slice(0, 64))}`
            : this.pathname.startsWith("/page/") && this.$auth.loggedIn && this.pageConfig.private && this.pageConfig.show ? `/api/memes/pv/?n=${encodeURIComponent(this.$route.params.name)}`
            : `/api/memes/?p=${encodeURIComponent(this.pathname.slice(1))}`
    },
    loadLikes(uuids) {
      if (this.$auth.loggedIn && uuids.length) {
        this.$axios.get(`/api/likes/m/?${uuids.slice(0, 20).map(uuid => `u=${uuid}`).join("&")}`, {progress: false})
          .then(res => {
            for (let vote of res.data) {
              const meme = this.$children.find(c => c.meme.uuid === vote["uuid"])
              if (meme) {
                meme.isLiked = vote["point"] === 1
                meme.isDisliked = vote["point"] === -1
              }
            }
          })
          .catch(console.log)
      }
    },
    pauseAll() {
      this.$children.forEach(c => {
        if (c.isVideo) c.togglePlayback(false)
      })
    },
    closeAllContextMenus() {
      this.$children.forEach(c => {
        c.$refs.menu.close()
      })
    }
  },
  destroyed() {
    window.removeEventListener("blur", this.pauseAll)
  }
}
</script>

<style scoped>

</style>
