<template>
  <main class="px-3 px-md-4 px-xl-5">
    <!-- Back button -->
    <div>
      <nuxt-link :to="'/page/'+$route.params.name" class="btn btn-secondary btn-sm mb-4" no-prefetch>
        Back
      </nuxt-link>
    </div>
    <h5>Moderators</h5>
    <CurrentMods />
    <!-- Spinner and load more button -->
    <div v-if="loading" id="spinner" class="mt-3"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
    <div v-else-if="next"><small class="pointer" @click="loadMore">Load more</small></div>
  </main>
</template>

<script>
import CurrentMods from '~/components/page_mods/CurrentMods'

export default {
  middleware: 'custom-auth',
  components: {
    CurrentMods
  },
  data() {
    return {
      
    }
  },
  created() {
    // this.loadMore()
  },
  methods: {
    async loadMore() {
      if (this.next === null) return false
      this.loading = true
      try {
        const { data } = await this.$axios.get(this.next)
        this.moderators.push(...data.results)
        if (data.next) {
          const url = new URL(this.next)
          url.searchParams.set("page", data.next)
          this.next = url.href
        } else {
          this.next = null
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
a:not(.btn) {
  color: royalblue;
  font-size: 15px;
}
#spinner {
  font-size: large;
}
small {
  color: royalblue;
}
</style>
