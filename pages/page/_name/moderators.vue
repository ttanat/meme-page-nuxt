<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center">

        <div class="col-md-11 mb-3">
          <h4>
            Moderators
            <nuxt-link class="btn btn-sm btn-secondary float-right d-none d-lg-inline" :to="'/page/'+$route.params.name">Go back</nuxt-link>
          </h4>
        </div>

        <SettingsSidebar />
        <div class="col-md-9">
          <h5>Add Moderators</h5>
          <AddMods
            :mods-to-add="modsToAdd"
            :everyone="everyone"
            :pending-and-current="[...pending, ...current]"
            @add-mods-event="addMods"
            @remove-mods-event="removeMods"
            @add-pending-event="addPending"
          />

          <h5>Pending invites</h5>
          <PendingMods
            :pending="pending"
            @add-mods-event="addMods"
            @remove-mods-event="removeMods"
          />
          <div v-if="$fetchState.pending" class="mb-4 spinner">
            <font-awesome-icon :icon="['fas', 'circle-notch']" spin />
          </div>
          <div v-else-if="!$fetchState.pending && !pending.length" class="mb-4">None</div>

          <h5>Current Moderators</h5>
          <CurrentMods
            :moderators="current"
            @add-mods-event="addMods"
            @remove-mods-event="removeMods"
          />
          <div v-if="$fetchState.pending" class="spinner">
            <font-awesome-icon :icon="['fas', 'circle-notch']" spin />
          </div>
          <div v-else-if="!$fetchState.pending && !current.length">None</div>
        </div>

      </div>
    </div>
  </main>
</template>

<script>
import SettingsSidebar from '~/components/page_settings/SettingsSidebar'
import AddMods from '~/components/page_mods/AddMods'
import PendingMods from '~/components/page_mods/PendingMods'
import CurrentMods from '~/components/page_mods/CurrentMods'

export default {
  middleware: 'custom-auth',
  components: {
    SettingsSidebar,
    AddMods,
    PendingMods,
    CurrentMods
  },
  data() {
    return {
      modsToAdd: [],
      pending: [],
      current: []
    }
  },
  computed: {
    everyone() {
      return [...this.modsToAdd, ...this.pending, ...this.current]
    }
  },
  async fetch() {
    const { data } = await this.$axios.get(`/api/mods/get_mods/${this.$route.params.name}`)
    if (this.$auth.loggedIn && typeof data === "object" && data !== null) {
      this.pending.push(...data.pending)
      this.current.push(...data.current)
      // this.current.push(...["max", "jane", "moseby", "kevin", "allison"])
    } else if (Array.isArray(data)) {
      this.current.push(...data)
    }
  },
  methods: {
    addMods(mods_to_add, array) {
      if (!this.everyone.find(mod => mods_to_add.includes(mod))) this[array].push(...mods_to_add)
    },
    removeMods(mods_to_remove, array) {
      this[array] = this[array].filter(mod => !mods_to_remove.includes(mod))
    },
    addPending(mods) {
      this.modsToAdd = []
      this.pending.push(...mods)
    }
  }
}
</script>

<style scoped>
.spinner {
  font-size: large;
}
</style>
