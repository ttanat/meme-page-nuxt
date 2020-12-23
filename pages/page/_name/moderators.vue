<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center">

        <div class="col-md-11 mb-3">
          <h4>
            Moderators
            <nuxt-link
              v-if="!isModerating && !$fetchState.pending"
              :to="'/page/'+$route.params.name"
              class="btn btn-sm btn-secondary float-right d-none d-lg-inline"
              no-prefetch
            >
              Go back
            </nuxt-link>
          </h4>
        </div>

        <SettingsSidebar v-if="isModerating" :admin-view="adminView" />
        <div v-if="$fetchState.pending" class="col-md-9">
          <div class="mb-4 loading">
            <font-awesome-icon :icon="['fas', 'circle-notch']" spin />
          </div>
        </div>
        <div v-else :class="[isModerating ? 'col-md-9' : 'col-md-11']">
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

          <h5 v-if="isModerating">Current Moderators</h5>
          <CurrentMods
            :admin-view="adminView"
            :moderators="current"
            @add-mods-event="addMods"
            @remove-mods-event="removeMods"
          />
          <div v-if="!current.length">None</div>

          <button
            v-if="isModerating && !adminView"
            @click="stopModerating"
            class="btn btn-sm btn-danger"
          >
            Stop moderating
          </button>
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
      adminView: false,
      pagePrivate: false
    }
  },
  computed: {
    everyone() {
      return [...this.modsToAdd, ...this.pending, ...this.current]
    },
    isModerating() {
      return this.$auth.loggedIn && !!this.$auth.user.moderating.find(p => p.name === this.$route.params.name)
    }
  },
  async fetch() {
    const { data } = await this.$axios.get(`/api/mods/get_mods/${this.$route.params.name}`)
    if (this.$auth.loggedIn && data.admin) {
      this.pending.push(...data.pending)
      this.adminView = true
      // this.current.push(...["max", "jane", "moseby", "kevin", "allison"])
    }
    this.current.push(...data.current)
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
    },
    stopModerating() {
      if (confirm(`Are you sure you want to stop being a moderator of ${this.$route.params.name}?`)) {
        this.$axios.delete(`/api/mods/leave/${this.$route.params.name}`)
          .then(() => {
            this.$popUserFieldArray("moderating", this.$route.params.name)
            this.current = this.current.filter(user => user !== this.$auth.user.username)
          })
          .catch(() => this.errorToast("Unexpected error occurred. Please try again later."))
      }
    }
  }
}
</script>
