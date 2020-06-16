<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <ModItem
          v-for="mod in moderators"
          :key="mod.username"
          :mod="mod"
          @mod-select-event="numSelected++"
          @mod-unselect-event="numSelected--"
        />
      </div>
    </div>
    <!-- Spinner and load more button -->
    <div v-if="loading" id="spinner" class="mt-3"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
    <div v-else-if="next"><small class="pointer" @click="loadMore">Load more</small></div>
    <button v-if="numSelected" @click="removeMods" class="btn btn-sm btn-danger mt-3">Remove</button>
  </div>
</template>

<script>
import ModItem from '~/components/page_mods/ModItem'

export default {
  name: 'CurrentMods',
  components: {
    ModItem
  },
  data() {
    return {
      // moderators: [{username: "max"}, {username: "jane"}, {username: "moseby"}, {username: "kevin"}, {username: "allison"}],
      moderators: [],
      next: `${this.$axios.defaults.baseURL}/api/moderators/${this.$route.params.name}?page=1`,
      loading: false,
      numSelected: 0
    }
  },
  created() {
    this.loadMore()
  },
  methods: {
    async loadMore() {
      if (this.next === null) return false
      this.loading = true
      try {
        const { data } = await this.$axios.get(this.next)
        this.moderators.push(...data.results)
        if (data.lid) {
          const url = new URL(this.next)
          url.searchParams.set("lid", data.lid)
          this.next = url.href
        } else {
          this.next = null
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    incrementNumSelected() {
      this.numSelected++
    },
    decrementNumSelected() {
      this.numSelected--
    },
    removeMods() {
      const selected = this.$children.filter(c => c.selected).map(c => c.mod.username)
      if (!confirm(`Are you sure you want to remove ${selected.length > 1 ? "these moderators" : selected[0]}`)) return false
      this.moderators = this.moderators.filter(m => !selected.includes(m.username))
      this.numSelected = 0
      this.$toast.info(`${selected.length > 1 ? `${selected.length} moderators` : selected[0]} removed`, {
        position: 'top-center',
        duration: 1500
      })
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
