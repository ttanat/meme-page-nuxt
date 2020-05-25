<template>
  <div class="form-group mb-5">
    <label for="delPassword">Delete account</label>
    <input v-model="confirmPassword" type="password" class="form-control form-control-sm mb-3" id="delPassword" placeholder="Confirm password">
    <button
      @click="deleteAccount"
      :disabled="!confirmPassword.length"
      :class="{'not-allowed': !confirmPassword.length}"
      class="btn btn-danger btn-sm"
    >
      Delete account
    </button>
  </div>
</template>

<script>
export default {
  name: 'DeleteAccountForm',
  data() {
    return {
      confirmPassword: ""
    }
  },
  methods: {
    deleteAccount() {
      if (!this.confirmPassword) {//.length < 6) {
        this.errorToast("Password incorrect")
      } else {
        if (confirm("Are you sure you want to delete your account?")) {
          this.$axios.delete("/api/settings?f=account")
            .then(() => {
              this.$toast.info("Your account has now been deleted. Goodbye :(", {position: 'top-center', duration: 2000})
              this.$router.push('/')
            })
            .catch(err => err.response.data ? this.errorToast(err.response.data) : console.log(err))
        }
      }
    }
  }
}
</script>
