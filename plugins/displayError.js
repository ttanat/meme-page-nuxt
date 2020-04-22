import Vue from 'vue'

Vue.mixin({
  methods: {
    displayError(message, duration=2000) {
      this.$toasted.show(message, {
        position: 'bottom-center',
        duration,
        keepOnHover: true,
        action : {
          text : 'X',
          class: 'red',
          onClick : (toastObject) => {
            toastObject.goAway(0)
          }
        }
      })
    }
  }
})
