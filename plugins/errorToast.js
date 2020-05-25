import Vue from 'vue'

Vue.mixin({
  methods: {
    errorToast(message, position='top-center', duration=1500) {
      this.$toast.error(message, {
        position,
        duration
      })
    }
  }
})
