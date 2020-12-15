import Vue from 'vue'

Vue.mixin({
  methods: {
    errorToast(message, duration=2000) {
      if (message.length > 80) {
        console.log(message)
      } else {
        this.$toast.error(message, {
          position: 'top-center',
          duration
        })
      }
    }
  }
})
