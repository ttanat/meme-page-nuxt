import Vue from 'vue'

Vue.mixin({
  methods: {
    errorToast(message, duration=1500) {
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
