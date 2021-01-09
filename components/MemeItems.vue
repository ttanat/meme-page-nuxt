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
      @remove-meme-event="removeMeme"
    />
    <div v-show="loading || $fetchState.pending" class="loading">
      <font-awesome-icon :icon="['fas', 'circle-notch']" spin />
    </div>
    <div v-if="noMemes && !$fetchState.pending" class="no-memes">
      <template v-if="pathname === '/search'">No results matching query.<br><br>Return <nuxt-link to="/">home</nuxt-link></template>
      <template v-else-if="pathname === '/feed'">No new posts.<br><br>Subscribe to more pages or follow other users for more posts!</template>
      <template v-else>No memes here :(<br><br>Return <nuxt-link to="/">home</nuxt-link></template>
    </div>
  </div>
</template>

<script>
import MemeItem from './MemeItem'
import infiniteScrollMixin from '~/mixins/infiniteScrollMixin'
import lazyLoadMixin from '~/mixins/lazyLoadMixin'
import autoplayMixin from '~/mixins/autoplayMixin'

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
  mixins: [infiniteScrollMixin, lazyLoadMixin, autoplayMixin],
  created() {
    window.addEventListener("blur", this.pauseAll)
  },
  data() {
    return {
      memes: [],
      currentUuids: null, // Will be a set (go to fetch)
      muted: true,
      next: null,
      loading: false,
      noMemes: true
    }
  },
  computed: {
    pathname() {
      return this.$route.path
    }
  },
  watch: {
    "$route.query.q": "$fetch",
    "memes.length": function(length) {
      const numAdsToShow = length > 2 ? 3 : length > 1 ? 2 : length > 0 ? 1 : 0
      this.$emit("change-num-ads", numAdsToShow)
    }
  },
  async fetch() {
    if (!this.canLoadMore()) return false
    this.noMemes = false
    const { data: { results, next } } = await this.$axios.get(this.getNewURL())
    this.memes = results
    this.$nextTick(() => {if (results.length) {
      this.next = next
      this.currentUuids = new Set(results.map(r => r.uuid))
    } else {
      this.noMemes = true
      this.scrollObserver = this.scrollRoot = null
    }})
  },
  methods: {
    toggleSound() {
      this.muted = !this.muted
      this.$children.forEach(c => {if (c.isVideo) c.$refs.memeEl.muted = this.muted})
    },
    observeNewMeme(meme, isVideo) {
      this.lazyObjectObserver.observe(meme)
      if (isVideo) this.autoplayObserver.observe(meme)
    },
    setPoints(uuid, new_points_val) {
      this.memes.find(meme => meme.uuid === uuid).points = new_points_val
    },
    canLoadMore(check_next_url=false) {
      // check_next_url is false when called from async fetch at the start
      // ensure that memes are loaded during async fetch even though this.next is null
      if (check_next_url && this.next === null) return false
      if ((this.pathname.startsWith("/p/") && (!this.pageConfig.show || !this.pageConfig.num_posts))
          || (!["/", "/all", "/feed", "/search"].includes(this.pathname) && !this.pathname.match(/^\/p\/[a-zA-Z0-9_]+$/)
          && !this.pathname.match(/^\/browse\/[a-zA-Z0-9_]+$|^\/browse\/tv-shows$/))) return false
      return true
    },
    loadMore() {
      if (!this.canLoadMore(true)) return false
      this.loading = true

      this.$axios.get(this.next)
        .then(({ data: { results, next } }) => {
          if (results.length) {
            const newMemes = []
            for (const r of results) {
              if (!this.currentUuids.has(r.uuid)) {
                newMemes.push(r)
                this.currentUuids.add(r.uuid)
              }
            }
            this.memes.push(...newMemes)
            this.next = next
          } else {
            if (this.scrollRoot) this.scrollObserver.unobserve(this.scrollRoot)
            this.scrollObserver = this.scrollRoot = this.next = null
          }
        })
        .catch(console.log)
        .finally(() => this.loading = false)
    },
    getNewURL() {
      return this.pathname === "/search" ? `/api/memes/?p=search&q=${encodeURIComponent(this.$route.query.q.slice(0, 64))}`
           : this.pathname.startsWith("/p/") && this.$auth.loggedIn && this.pageConfig.private && this.pageConfig.show ? `/api/memes/pv/?n=${encodeURIComponent(this.$route.params.name)}`
           : `/api/memes/?p=${encodeURIComponent(this.pathname.slice(1))}`
    },
    pauseAll() {
      this.$children.forEach(c => {
        if (c.isVideo) c.togglePlayback(false)
      })
    },
    closeAllContextMenus() {
      this.$children.forEach(c => c.$refs.menu.close())
    },
    removeMeme(uuid) {
      this.memes = this.memes.filter(m => m.uuid !== uuid)
    }
  },
  beforeDestroy() {
    window.removeEventListener("blur", this.pauseAll)
  }
}
</script>
