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
      @click="removeUsersFromList"
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
  props: {
    modsToAdd: {
      type: Array,
      required: true
    },
    everyone: {
      type: Array,
      required: true
    },
    pendingAndCurrent: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      newUser: "",
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
      } else if (this.everyone.length >= 50) {
        err = "Maximum number of moderators reached"
      } else if (this.everyone.includes(val)) {
        err = "Moderator already exists"
      }
      if (err) {
        this.errorToast(err)
      } else {
        this.$emit("add-mods-event", [val], "modsToAdd")
        this.newUser = ""
      }
    },
    removeUsersFromList() {
      const selected = this.$children.filter(c => c.selected).map(c => c.username)
      this.$emit("remove-mods-event", selected, "modsToAdd")
      this.numSelected = 0
    },
    inviteUsers() {
      // Check for duplicates
      const duplicates = this.modsToAdd.filter(username => this.pendingAndCurrent.includes(username))
      if (duplicates.length) {
        this.errorToast(`${duplicates.join(", ")} already exist${duplicates.length > 1 ? "" : "s"}`)
        return false
      }

      if (this.modsToAdd.length) {
        const data = new FormData()
        for (const username of this.modsToAdd) {
          data.append("new_mods", username)
        }
        this.$axios.post(`/api/mods/invite/${this.$route.params.name}`, data)
          .then(res => this.$emit("add-pending-event", res.data))
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
