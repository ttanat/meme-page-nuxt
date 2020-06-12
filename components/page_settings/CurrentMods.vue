<template>
  <div>
    <label>Moderators</label>
    <ul class="list-group mb-3">
      <button type="button" class="list-group-item list-group-item-action" disabled>{{ $auth.user.username }} (admin)</button>
      <CurrentMod v-for="mod in mods" :username="mod" :key="mod" @toggle-mod-event="checkCanClickRemove" />
    </ul>
    <button
      ref="removeModBtn"
      @click="removeMods"
      :class="{'not-allowed': !canClickRemove}"
      :disabled="!canClickRemove"
      class="btn btn-sm btn-danger mb-4 d-block"
    >
      Remove
    </button>
  </div>
</template>

<script>
import CurrentMod from './CurrentMod'

export default {
  name: 'CurrentMods',
  components: {
    CurrentMod
  },
  props: {
    mods: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      canClickRemove: false
    }
  },
  methods: {
    removeMods() {
      const to_remove = this.$children.filter(m => m.isActive).map(m => m.username)

      if (to_remove.length && confirm(`Are you sure you want to remove ${to_remove.length > 1 ? "these moderators" : to_remove[0]}?`)) {
        this.$axios.delete(`/api/page/${this.$route.params.name}/settings?d=mods&${to_remove.map(m => `u=${m}`).join("&")}`)
          .then(async res => {
            await this.$emit("remove-mods-event", to_remove)
            this.checkCanClickRemove()
            this.$toast.info(`${to_remove.length > 1 ? "Moderators" : to_remove[0]} removed`, {
              position: 'top-center',
              duration: 1500
            })
          })
          .catch(this.displayError)
      }
    },
    checkCanClickRemove() {
      this.canClickRemove = this.mods.length && this.$children.filter(c => c.isActive).length
    }
  }
}
</script>
