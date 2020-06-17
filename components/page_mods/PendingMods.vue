<template>
  <div class="mb-4">
    <div class="container-fluid">
      <div class="row">
        <ModItem
          v-for="username in pendingMods"
          :key="username"
          :username="username"
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
  data() {
    return {
      pendingMods: []
    }
  },
  async fetch() {
    const { data } = await this.$axios.get(`/api/mods/pending/${this.$route.params.name}`)
    this.pendingMods.push(...data)
    this.$emit("add-mods-event", data)
  }
}
</script>

<style scoped>
#spinner {
  font-size: large;
}
</style>