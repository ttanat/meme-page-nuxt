<template>
  <div class="form-group mb-5">
    <div class="custom-control custom-switch mb-3">
      <input v-model="filter" type="checkbox" id="nsfw" class="custom-control-input">
      <label class="custom-control-label" for="nsfw">Filter NSFW content</label>
    </div>
    <button @click="changeNsfwFilter"
      :disabled="formNotChanged"
      :class="{'not-allowed': formNotChanged}"
      class="btn btn-primary btn-sm"
    >
      <font-awesome-icon v-if="savingFilter" :icon="['fas', 'circle-notch']" spin />
      <template v-else>Save</template>
    </button>
  </div>
</template>

<script>
export default {
  name: 'NsfwForm',
  props: {
    currentFilter: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      filter: this.currentFilter,
      savingFilter: false,
    }
  },
  computed: {
    formNotChanged() {
      return this.filter === this.currentFilter
    }
  },
  methods: {
    changeNsfwFilter() {
      if (this.filter !== this.currentFilter) {
        this.savingFilter = true
        const data = new FormData()
        data.set("field", "nsfw")
        data.set("filter", this.filter)

        this.$axios.post("/api/settings", data)
          .then(() => {
            this.$emit("nsfw-changed-event", this.filter)
            this.successToast("Preference has been saved")
          })
          .catch(this.displayError)
          .finally(() => this.savingFilter = false)
      }
    }
  }
}
</script>
