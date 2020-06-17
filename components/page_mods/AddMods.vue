<template>
  <div class="mb-4">
    <input
      v-model.trim="newUser"
      @keyup.enter="addUserToList"
      class="form-control form-control-sm mb-3"
      placeholder="Username"
      maxlength="32"
    >
    <div class="container-fluid">
      <div class="row">
        <ModItem
          v-for="username in modsToAdd"
          :key="username"
          :username="username"
          @mod-select-event="numSelected++"
          @mod-unselect-event="numSelected--"
        />
      </div>
    </div>
    <button
      v-if="modsToAdd.length"
      @click="inviteUsers"
      class="btn btn-sm btn-primary mr-2"
    >
      {{ modsToAdd.length > 1 ? `Send ${modsToAdd.length} invites` : "Send invite" }}
    </button>
    <button
      v-if="numSelected"
      @click="removeUserFromList"
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
    addUserToList() {
      const val = this.newUser
      let err
      if (val === this.$auth.user.username) {
        err = "Cannot add yourself"
      } else if (!val.match(/^[a-z0-9_]+$/i) || val.length > 32) {
        err = "Please enter a valid username"
      } else if (this.modsToAdd.length >= 20) {
        err = "Maximum number of moderators reached"
      } else if (this.modsToAdd.includes(val)) {
        err = "Moderator already exists"
      }
      if (err) {
        this.errorToast(err)
      } else {
        this.modsToAdd.push(val)
        this.newUser = ""
      }
    },
    removeUserFromList() {
      const selected = this.$children.filter(c => c.selected).map(c => c.username)
      this.modsToAdd = this.modsToAdd.filter(username => !selected.includes(username))
      this.numSelected = 0
    },
    inviteUsers() {
      if (this.modsToAdd.length) {
        const data = new FormData()
        for (const username of this.modsToAdd) {
          data.append("new_mods", username)
        }
        this.$axios.post(`/api/mods/invite/${this.$route.params.name}`, data)
          .then(() => {/* Add to pending */})
          .catch(err => err.response ? this.errorToast(err.response.data) : console.log(err))
      }
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
