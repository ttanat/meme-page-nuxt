<template>
  <button
    @click="subscribe"
    :class="[isSubscribed || isRequested ? 'btn-outline-success' : 'btn-success', 'm-0']"
    class="btn btn-sm"
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
    },
    displayName: {
      type: String,
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
          .then(({ data }) => {
            if (data.subscribed === undefined) { // Page is private and response says if user requested to subscribe
              this.$emit("subscribe-requested-event", data.requested)
              this.btnText = data.requested ? "Requested" : "Subscribe"
            } else { // Response says if user subscribed or unsubscribed
              this.$emit("subscribe-changed-event", data.subscribed)
              this.btnText = data.subscribed ? "Subscribed" : this.isPrivate ? "Request" : "Subscribe"
              this.addOrRemoveSubscription(data.subscribed)
            }
          })
          .catch(this.displayError)
      }
    },
    addOrRemoveSubscription(add) {
      if (add) {
        this.$appendUserFieldArray("subscriptions", {
          name: this.$route.params.name,
          dname: this.displayName,
          private: this.isPrivate
        })
      } else {
        this.$popUserFieldArray("subscriptions", this.$route.params.name)
      }
    }
  }
}
</script>

<style scoped>
button {
  padding: 5px;
  padding-top: 2px;
  padding-bottom: 2px;
}
</style>
