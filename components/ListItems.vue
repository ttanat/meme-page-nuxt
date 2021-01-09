<template>
  <div>
    <ListItem v-show="!$fetchState.pending" v-for="(result, i) in results" :key="i" :result="result" />
    <div v-show="loading || $fetchState.pending" class="loading"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
    <div v-if="noResults && !$fetchState.pending" style="margin-top: 30px;text-align: center;">No results matching query.<br><br>Return <nuxt-link to="/">home</nuxt-link></div>
  </div>
</template>

<script>
import ListItem from './ListItem'
import infiniteScrollMixin from '~/mixins/infiniteScrollMixin'

export default {
  name: 'ListItems',
  components: {
    ListItem
  },
  mixins: [infiniteScrollMixin],
  data() {
    return {
      results: [],
      loading: false,
      next: null,
      noResults: false,
    }
  },
  computed: {
    query() {
      return this.$route.query.q
    }
  },
  watch: {
    query: "$fetch",
    "results.length": function(length) {
      const searchMemes = !"@^".includes(this.query.trim()[0])
      const numAdsToShow = searchMemes ? (length > 2 ? 3 : length > 1 ? 2 : length > 0 ? 1 : 0) : (length > 4 ? 1 : 0)
      this.$emit("change-num-ads", numAdsToShow)
    }
  },
  async fetch() {
    this.noResults = false // Reset showing noResults message (for watch)
    const { data } = await this.$axios.get(`/api/search/${this.query[0] === "@" ? "users" : "pages"}/?search=${encodeURIComponent(this.query.slice(1, 64))}`)
    this.results = data.results
    this.next = data.next
    if (!this.results.length) {
      this.noResults = true
      this.scrollObserver = this.scrollRoot = null
    }
  },
  methods: {
    loadMore() {
      if (this.next === null || !"@^".includes(this.query.trim()[0])) return false
      this.loading = true

      this.$axios.get(this.next)
        .then(({ data }) => {
          if (data.results.length) {
            this.results.push(...data.results)
            this.next = data.next
          } else {
            if (this.scrollRoot) this.scrollObserver.unobserve(this.scrollRoot)
            this.scrollObserver = this.scrollRoot = this.next = null
          }
        })
        .catch(console.log)
        .finally(() => this.loading = false)
    }
  }
}
</script>
