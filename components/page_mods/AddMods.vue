<template>
  <div class="mb-4">
    <input
      v-model.trim="newUser"
      @keyup.enter="addNewUser"
      class="form-control form-control-sm mb-3"
      placeholder="Username"
      maxlength="32"
    >
    <div class="container-fluid">
      <div class="row">
        <ModItem
          v-for="mod in modsToAdd"
          :key="mod.username"
          :mod="mod"
          @mod-select-event="numSelected++"
          @mod-unselect-event="numSelected--"
        />
      </div>
    </div>
    <button
      v-if="modsToAdd.length"
      class="btn btn-sm btn-primary mr-2"
    >
      {{ modsToAdd.length > 1 ? `Send ${modsToAdd.length} invites` : "Send invite" }}
    </button>
    <button
      v-if="numSelected"
      @click="removeNewUsers"
      class="btn btn-sm btn-danger"
    >
      Remove
    </button>
  </div>
</template>

<script>
import ModItem from '~/components/page_mods/ModItem'

export default {
  name: 'AddMods',
  components: {
    ModItem
  },
  data() {
    return {
      newUser: "",
      modsToAdd: [],
      numSelected: 0
    }
  },
  methods: {
    addNewUser() {
      const val = this.newUser
      let err
      if (val === this.$auth.user.username) {
        err = "Cannot add yourself"
      } else if (!val.match(/^[a-z0-9_]+$/i) || val.length > 32) {
        err = "Please enter a valid username"
      } else if (this.modsToAdd.length >= 20) {
        err = "Maximum number of moderators reached"
      } else if (this.modsToAdd.find(user => user.username === val)) {
        err = "Moderator already exists"
      }
      if (err) {
        this.errorToast(err)
      } else {
        this.modsToAdd.push({username: val, image: null})
        this.newUser = ""
      }
    },
    removeNewUsers() {
      const selected = this.$children.filter(c => c.selected).map(c => c.mod.username)
      this.modsToAdd = this.modsToAdd.filter(m => !selected.includes(m.username))
      this.numSelected = 0
    }
  }
}
</script>

<style scoped>
input {
  width: 50%;
}
@media (max-width: 767.98px) {
  input {
    width: 100%;
  }
}
</style>
