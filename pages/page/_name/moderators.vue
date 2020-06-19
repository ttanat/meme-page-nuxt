<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center">

        <div class="col-md-11 mb-3">
          <h4>
            Moderators
            <nuxt-link
              v-if="!$fetchState.pending"
              :to="'/page/'+$route.params.name"
              class="btn btn-sm btn-secondary float-right d-none d-lg-inline"
              no-prefetch
            >
              Go back
            </nuxt-link>
          </h4>
        </div>

        <SettingsSidebar :admin-view="adminView" />
        <div v-if="$fetchState.pending" class="col-md-9">
          <div class="mb-4 loading">
            <font-awesome-icon :icon="['fas', 'circle-notch']" spin />
          </div>
        </div>
        <div v-else class="col-md-9">
          <template v-if="adminView">
            <h5>Add Moderators</h5>
            <AddMods
              :admin-view="adminView"
              :mods-to-add="modsToAdd"
              :everyone="everyone"
              :pending-and-current="[...pending, ...current]"
              @add-mods-event="addMods"
              @remove-mods-event="removeMods"
              @add-pending-event="addPending"
            />

            <h5>Pending invites</h5>
            <PendingMods
              :admin-view="adminView"
              :pending="pending"
              @add-mods-event="addMods"
              @remove-mods-event="removeMods"
            />
            <div v-if="!pending.length" class="mb-4">None</div>
          </template>

          <h5>Current Moderators</h5>
          <CurrentMods
            :admin-view="adminView"
            :moderators="current"
            @add-mods-event="addMods"
            @remove-mods-event="removeMods"
          />
          <div v-if="!current.length">None</div>
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
  head() {
    this.$store.commit("setCurrentPage", "")
    return {
      title: `${this.$route.params.name} - Moderators`
    }
  },
  data() {
    return {
      modsToAdd: [],
      pending: [],
      current: [],
      adminView: false
    }
  },
  computed: {
    everyone() {
      return [...this.modsToAdd, ...this.pending, ...this.current]
    }
  },
  async fetch() {
    const { data } = await this.$axios.get(`/api/mods/get_mods/${this.$route.params.name}`)
    if (Array.isArray(data)) {
      this.current.push(...data)
    } else if (this.$auth.loggedIn && typeof data === "object" && data !== null) {
      this.pending.push(...data.pending)
      this.current.push(...data.current)
      this.adminView = true
      // this.current.push(...["max", "jane", "moseby", "kevin", "allison"])
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
