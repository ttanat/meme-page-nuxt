import Vue from 'vue'

Vue.mixin({
  methods: {
    successToast(message, position='top-center', duration=1500) {
      this.$toast.success(message, {
        position,
        duration
      })
    }
  }
})
