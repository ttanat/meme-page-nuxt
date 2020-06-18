<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <ModItem
          v-for="username in pending"
          :key="username"
          :username="username"
          @mod-select-event="numSelected++"
          @mod-unselect-event="numSelected--"
        />
      </div>
    </div>
    <button
      v-if="numSelected"
      @click="removePending"
      :disabled="removing"
      :class="{'not-allowed': removing}"
      class="btn btn-sm btn-danger mb-4"
    >
      <font-awesome-icon v-if="removing" :icon="['fas', 'circle-notch']" spin />
      <template v-else>Remove</template>
    </button>
  </div>
</template>

<script>
import ModItem from './ModItem'

export default {
  name: 'PendingMods',
  components: {
    ModItem
  },
  props: {
    pending: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      numSelected: 0,
      removing: false
    }
  },
  methods: {
    removePending() {
      const selected = this.$children.filter(c => c.selected).map(c => c.username)
      if (!selected.length) return false
      if (confirm(`Are you sure you want to remove ${selected.length > 1 ? "these invites" : "this invite"}?`)) {
        this.removing = true
        const query_params_string = selected.map(s => `username=${s}`).join('&')
        this.$axios.delete(`/api/mods/pending/${this.$route.params.name}?${query_params_string}`)
          .then(res => {
            if (res.status === 204) {
              this.$emit("remove-mods-event", selected, "pending")
              this.numSelected = 0
              this.$toast.info(`${selected.length > 1 ? `${selected.length} moderators` : selected[0]} removed`, {
                position: 'top-center',
                duration: 1500
              })
            }
          })
          .catch(console.log)
          .finally(() => this.removing = false)
      }
    }
  }
}
</script>
