<template>
  <div class="form-group mb-5">
    <label for="password">Password</label>
    <input v-model="oldPassword" type="password" class="form-control form-control-sm mb-3" id="password" placeholder="Old password">
    <input v-model="password1" type="password" class="form-control form-control-sm mb-3" placeholder="New password">
    <input v-model="password2" type="password" class="form-control form-control-sm" placeholder="Confirm password">
    <div v-show="!passwordMatch"><small class="text-muted mb-3">Password does not match</small></div>
    <button @click="changePassword" :disabled="!passwordFormValid" :class="{'not-allowed': !passwordFormValid}" class="btn btn-primary btn-sm mt-3">
      <font-awesome-icon v-if="changingPassword" :icon="['fas', 'circle-notch']" spin />
      <template v-else>Change password</template>
    </button>
  </div>
</template>

<script>
export default {
  name: 'PasswordForm',
  data() {
    return {
      oldPassword: "",
      password1: "",
      password2: "",
      changingPassword: false,
    }
  },
  computed: {
    passwordMatch() {
      return this.password1 === this.password2
    },
    passwordFormValid() {
      return this.oldPassword && this.password1 && this.password2 && this.passwordMatch
    }
  },
  methods: {
    changePassword() {
      if (!this.oldPassword/* .length < 6 */) {
        this.errorToast("Password incorrect")
        // this.errorToast("Password incorrect")
      } else if (this.password1 !== this.password2) {
        this.errorToast("Password does not match")
      } else if (!this.password1/* .length < 6 */) {
        this.errorToast("Password cannot be blank")
        // this.errorToast("Password must be at least 6 characters")
      } else {
        this.changingPassword = true
        const data = new FormData()
        data.set("field", "password")
        data.set("old_password", this.oldPassword)
        data.set("password1", this.password1)
        data.set("password2", this.password2)

        this.$axios.post("/api/settings", data)
          .then(() => {
            alert("Password has been changed. Please log back in.")
            this.$auth.logout()
          })
          .catch(err => err.response.data ? this.errorToast(err.response.data) : console.log(err))
          .finally(() => this.changingPassword = false)
      }
    }
  }
}
</script>
