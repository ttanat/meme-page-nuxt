<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <ModItem
          v-for="username in moderators"
          :key="username"
          :username="username"
          @mod-select-event="numSelected++"
          @mod-unselect-event="numSelected--"
        />
        <div v-if="!moderators.length && !$fetchState.pending">None</div>
      </div>
    </div>
    <!-- Spinner and remove button -->
    <div v-if="$fetchState.pending" id="spinner" class="mt-3"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
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
      moderators: ["max", "jane", "moseby", "kevin", "allison"],
      // moderators: [],
      next: `/api/mods/current/${this.$route.params.name}`,
      numSelected: 0
    }
  },
  async fetch() {
    if (this.next === null) return false
    try {
      const { data } = await this.$axios.get(this.next)
      if (data.length) {
        this.moderators.push(...data)
      } else {
        this.next = null
      }
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    incrementNumSelected() {
      this.numSelected++
    },
    decrementNumSelected() {
      this.numSelected--
    },
    removeMods() {
      const selected = this.$children.filter(c => c.selected).map(c => c.username)
      if (!confirm(`Are you sure you want to remove ${selected.length > 1 ? "these moderators" : selected[0]}`)) return false
      this.moderators = this.moderators.filter(m => m !== username)
      this.numSelected = 0
      this.$toast.info(`${selected.length > 1 ? `${selected.length} moderators` : selected[0]} removed`, {
        position: 'top-center',
        duration: 1500
      })
    },
    removeModsFromEveryone() {

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
