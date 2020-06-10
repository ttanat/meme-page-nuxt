<template>
  <button
    @click="subscribe"
    :class="[isSubscribed || isRequested ? 'btn-outline-success' : 'btn-success', 'm-0']"
    class="btn btn-sm follow-btn"
    :title="isSubscribed ? 'Unsubscribe' : isPrivate ? 'Request to subscribe' : ''"
  >
    {{ btnText }}
  </button>
</template>

<script>
import checkAuthMixin from '~/mixins/checkAuthMixin'

export default {
  name: 'SubscribeButton',
  props: {
    isSubscribed: {
      type: Boolean,
      required: true
    },
    isRequested: {
      type: Boolean,
      required: true
    },
    isPrivate: {
      type: Boolean,
      required: true
    }
  },
  mixins: [checkAuthMixin],
  data() {
    return {
      btnText: this.isSubscribed ? "Subscribed"
                                 : this.isRequested ? "Requested"
                                 : this.isPrivate ? "Request"
                                 : "Subscribe"
    }
  },
  methods: {
    subscribe() {
      if (this.checkAuth()) {
        this.$axios.get(`/api/subscribe/${this.$route.params.name}`)
          .then(res => {
            if (res.data.subscribed === undefined) {
              this.$emit("subscribe-requested-event", res.data.requested)
              this.btnText = res.data.requested ? "Requested" : "Subscribe"
            } else {
              this.$emit("subscribe-changed-event", res.data.subscribed)
              this.btnText = res.data.subscribed ? "Subscribed" : this.isPrivate ? "Request" : "Subscribe"
            }
          })
          .catch(this.displayError)
      }
    }
  }
}
</script>
