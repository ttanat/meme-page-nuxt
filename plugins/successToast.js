import Vue from 'vue'

Vue.mixin({
  methods: {
    successToast(message, duration=1500) {
      this.$toast.success(message, {
        position: 'top-center',
        duration
      })
    }
  }
})
