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
      </div>
    </div>
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
  props: {
    moderators: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      numSelected: 0
    }
  },
  methods: {
    removeMods() {
      const selected = this.$children.filter(c => c.selected).map(c => c.username)
      if (!confirm(`Are you sure you want to remove ${selected.length > 1 ? "these moderators" : selected[0]}`)) return false
      this.$emit("remove-mods-event", selected, "current")
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
small {
  color: royalblue;
}
</style>
