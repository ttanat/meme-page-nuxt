<template>
  <button
    @click="$emit('remove-event', username)"
    type="button"
    class="list-group-item list-group-item-action"
  >
    {{ username }}
  </button>
</template>

<script>
export default {
  name: 'AddMod',
  props: {
    username: {
      type: String,
      required: true
    }
  }
}
</script>
