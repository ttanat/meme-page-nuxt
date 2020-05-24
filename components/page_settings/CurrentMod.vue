<template>
  <button
    @click="toggleActive"
    type="button"
    :class="{active: isActive}"
    class="list-group-item list-group-item-action"
  >
    {{ username }}
  </button>
</template>

<script>
export default {
  name: 'CurrentMod',
  props: {
    username: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    toggleActive() {
      this.isActive = !this.isActive
      this.$emit("toggle-mod-event")
    }
  }
}
</script>
