<template>
  <div class="form-group mb-5">
    <div class="custom-control custom-switch mb-3">
      <input v-model="showNsfw" type="checkbox" id="nsfw" class="custom-control-input">
      <label class="custom-control-label" for="nsfw">Show NSFW content</label>
    </div>
    <button @click="changeNsfwFilter"
      :disabled="formNotChanged"
      :class="{'not-allowed': formNotChanged}"
      class="btn btn-primary btn-sm"
    >
      <font-awesome-icon v-if="saving" :icon="['fas', 'circle-notch']" spin />
      <template v-else>Save</template>
    </button>
  </div>
</template>

<script>
export default {
  name: 'NsfwForm',
  props: {
    currentShowNsfw: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      showNsfw: this.currentShowNsfw,
      saving: false,
    }
  },
  computed: {
    formNotChanged() {
      return this.showNsfw === this.currentShowNsfw
    }
  },
  methods: {
    changeNsfwFilter() {
      if (this.showNsfw !== this.currentShowNsfw) {
        this.saving = true
        const data = new FormData()
        data.set("field", "nsfw")
        data.set("show_nsfw", this.showNsfw)

        this.$axios.post("/api/settings", data)
          .then(() => {
            this.$emit("nsfw-changed-event", this.showNsfw)
            this.successToast("Preference has been saved")
          })
          .catch(this.displayError)
          .finally(() => this.saving = false)
      }
    }
  }
}
</script>
