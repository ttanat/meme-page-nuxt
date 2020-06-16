<template>
  <div class="mb-4">
    <div class="container-fluid">
      <div class="row">
        <ModItem
          v-for="mod in pendingMods"
          :key="mod.username"
          :mod="mod"
          @mod-select-event="numSelected++"
          @mod-unselect-event="numSelected--"
        />
        <div v-if="!$fetchState.pending && !pendingMods.length">None</div>
      </div>
    </div>
    <div v-if="$fetchState.pending" id="spinner" class="mt-3">
      <font-awesome-icon :icon="['fas', 'circle-notch']" spin />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PendingMods',
  async fetch() {
    const { data } = await this.$axios.get(`/api/mods/admin/${this.$route.params.name}`)
    this.pendingMods = []
  }
}
</script>

<style scoped>
#spinner {
  font-size: large;
}
</style>