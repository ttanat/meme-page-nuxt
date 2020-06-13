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
              this.addOrRemovePage(data.subscribed)
            }
          })
          .catch(this.displayError)
      }
    },
    addOrRemovePage(add) {
      /*
        Adds or removes page from $auth.user.subscriptions
      */
      const current_page = {
        name: this.$route.params.name,
        dname: this.displayName,
        private: this.isPrivate
      }
      const new_subscriptions = []
      if (add) {
        // Populate array with subscriptions from auth user
        new_subscriptions.push(...this.$auth.user.subscriptions.map(page => {
          return Object.fromEntries(Object.entries(page))
        }))
        // Add current page to array
        new_subscriptions.push(current_page)
      } else {
        // Populate array with subscriptions from auth user but exclude current page
        new_subscriptions.push(...this.$auth.user.subscriptions.filter(page => {
          return page.name !== current_page.name
        }))
      }
      // Set new subscriptions for user
      this.$auth.setUser(Object.assign({}, this.$auth.user, {subscriptions: new_subscriptions}))
    }
  }
}
</script>
