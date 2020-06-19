<template>
  <div>
    <input
      v-model.trim="searchUser"
      class="form-control form-control-sm mb-3"
      placeholder="Search"
      maxlength="32"
    >
    <div class="container-fluid">
      <div class="row">
        <ModItem
          v-for="username in moderators"
          v-show="username.match(new RegExp(searchUser, 'i'))"
          :key="username"
          :admin-view="adminView"
          :username="username"
          @mod-select-event="numSelected++"
          @mod-unselect-event="numSelected--"
        />
      </div>
    </div>
    <button
      v-if="numSelected && adminView"
      @click="removeMods"
      :disabled="removing"
      :class="{'not-allowed': removing}"
      class="btn btn-sm btn-danger"
    >
      <font-awesome-icon v-if="removing" :icon="['fas', 'circle-notch']" spin />
      <template v-else>Remove</template>
    </button>
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
    adminView: {
      type: Boolean,
      required: true
    },
    moderators: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      searchUser: "",
      numSelected: 0,
      removing: false
    }
  },
  methods: {
    removeMods() {
      const selected = this.$children.filter(c => c.selected).map(c => c.username)
      if (!selected.length) return false
      if (confirm(`Are you sure you want to remove ${selected.length > 1 ? "these moderators" : selected[0]}?`)) {
        this.removing = true
        const query_params_string = selected.map(s => `username=${s}`).join('&')
        this.$axios.delete(`/api/mods/current/${this.$route.params.name}?${query_params_string}`)
          .then(res => {
            if (res.status === 204) {
              this.$emit("remove-mods-event", selected, "current")
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

<style scoped>
input {
  width: 50%;
}
a:not(.btn) {
  color: royalblue;
  font-size: 15px;
}
small {
  color: royalblue;
}
@media (max-width: 767.98px) {
  input {
    width: 100%;
  }
}
</style>
