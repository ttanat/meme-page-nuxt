<template>
  <div>
    <label>Add moderators</label>
    <input v-model="newModUsername" @keyup.enter="addMod" type="text" class="form-control form-control-sm mb-4" maxlength="32">
    <ul class="list-group mb-1">
      <button v-if="!newMods.length" type="button" class="list-group-item list-group-item-action" disabled>None</button>
      <AddMod v-for="mod in newMods" :username="mod" :key="mod" @remove-event="removeNewMod" />
    </ul>
    <small class="text-muted d-block mb-3">Click to remove</small>
    <button ref="sendBtn" :disabled="!newMods.length" :style="{cursor: newMods.length ? '' : 'not-allowed'}" class="btn btn-sm btn-primary mr-4">Send</button>
    <small>Invites will be sent to users</small>
  </div>
</template>

<script>
import AddMod from './AddMod'

export default {
  name: 'AddMods',
  components: {
    AddMod
  },
  data() {
    return {
      newMods: [],
      newModUsername: ""
    }
  },
  methods: {
    addMod() {
      const val = this.newModUsername
      let err
      if (!val.match(/^[a-z0-9_]+$/i) || val.length > 32) {
        err = "Please enter a valid username"
      } else if (this.newMods.length >= 20) {
        err = "Maximum number of moderators reached"
      } else if (this.newMods.includes(val)) {
        err = "Moderator already exists"
      }
      if (err) {
        this.errorToast(err)
      } else {
        this.newMods.push(val)
        this.newModUsername = ""
      }
    },
    removeNewMod(username) {
      const i = this.newMods.findIndex(m => m === username)
      this.newMods.splice(i, 1)
    }
  }
}
</script>
