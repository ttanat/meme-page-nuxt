<template>
  <div class="form-group mb-5">
    <label for="email">Email address</label>
    <input
      v-model.trim="email"
      type="email"
      class="form-control form-control-sm mb-3"
      id="email"
      placeholder="Email address"
    >
    <button
      @click="changeEmail"
      :disabled="!canChangeEmail"
      :class="{'not-allowed': !canChangeEmail}"
      class="btn btn-primary btn-sm mr-2"
    >
      <font-awesome-icon v-if="changingEmail" :icon="['fas', 'circle-notch']" spin />
      <template v-else>Change email</template>
    </button>
    <button
      @click="deleteEmail"
      :disabled="!canDeleteEmail"
      :class="{'not-allowed': !canDeleteEmail}"
      class="btn btn-danger btn-sm"
    >
      <font-awesome-icon v-if="deletingEmail" :icon="['fas', 'circle-notch']" spin />
      <template v-else>Delete email</template>
    </button>
  </div>
</template>

<script>
export default {
  name: 'EmailForm',
  props: {
    currentEmail: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    return {
      email: this.currentEmail,
      changingEmail: false,
      deletingEmail: false
    }
  },
  computed: {
    canChangeEmail() {
      return this.email && this.email !== this.currentEmail
    },
    canDeleteEmail() {
      return !!this.currentEmail
    }
  },
  methods: {
    changeEmail() {
      if (this.email !== this.currentEmail) {
        if (this.email.match(/^\S+@\S+\.[a-zA-Z]+$/)) {
          this.changingEmail = true
          const data = new FormData()
          data.set("field", "email")
          data.set("email", this.email)

          this.$axios.post("/api/settings", data)
            .then(() => {
              this.successToast("Email changed")
              this.$emit("email-changed-event", data.get("email"))
            })
            .catch(err => err.response.data ? this.errorToast(err.response.data) : console.log(err))
            .finally(() => this.changingEmail = false)
        } else {
          this.errorToast("Please enter a valid email address")
        }
      }
    },
    deleteEmail() {
      if (confirm("Are you sure you want to remove your email from this account?")) {
        this.deletingEmail = true
        this.$axios.delete("/api/settings?f=email")
          .then(r => {
            if (r.status === 204) {
              this.email = ""
              this.$toast.info("Email has been removed", {position: 'top-center', duration: 1500})
            }
          })
          .catch(this.displayError)
          .finally(() => this.deletingEmail = false)
      }
    }
  }
}
</script>
