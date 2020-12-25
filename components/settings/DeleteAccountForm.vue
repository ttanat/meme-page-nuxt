<template>
  <div class="form-group mb-5">
    <label for="delPassword">Delete account</label>
    <input v-model="confirmPassword" type="password" class="form-control form-control-sm mb-3" id="delPassword" placeholder="Confirm password">
    <button
      @click="deleteAccount"
      :disabled="!confirmPassword.length || loading"
      :class="{'not-allowed': !confirmPassword.length}"
      class="btn btn-danger btn-sm"
    >
      <font-awesome-icon v-if="loading" :icon="['fas', 'circle-notch']" spin />
      <template v-else>Delete account</template>
    </button>
  </div>
</template>

<script>
export default {
  name: 'DeleteAccountForm',
  data() {
    return {
      confirmPassword: "",
      loading: false
    }
  },
  methods: {
    deleteAccount() {
      if (!this.confirmPassword) {//.length < 6) {
        this.errorToast("Password incorrect")
      } else {
        if (confirm("Are you sure you want to delete your account?")) {
          this.loading = true
          const data = new FormData()
          data.set("password", this.confirmPassword)
          this.$axios.post("/api/delete/user", data)
            .then(async () => {
              await this.$auth.logout() // Using await here just to be sure that tokens are cleared before going to other pages
              this.$toast.info("Your account has now been deleted. Goodbye :(", {position: 'top-center', duration: 2000})
              this.$router.push('/')
            })
            .catch(err => err.response.data ? this.errorToast(err.response.data) : console.log(err))
            .finally(() => this.loading = false)
        }
      }
    }
  }
}
</script>
