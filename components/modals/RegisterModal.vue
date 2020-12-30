<template>
  <div class="modal fade" id="signUpModal" tabindex="-1" role="dialog" aria-labelledby="signUpModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content" style="padding: 10px 25px 20px 25px;">
        <div class="modal-header" style="border-bottom: none;">
          <h5 class="modal-title" id="signUpModalLabel">Sign up and start exploring!</h5>
        </div>
        <form @submit.prevent="submit">
          <div class="modal-body" style="border: none;">
            <input v-model.trim="username" @keyup="checkUsername" :class="[usernameRed ? 'is-invalid' : 'mb-3']" type="text" pattern="^[a-zA-Z0-9_]{1,32}$" class="form-control" placeholder="Username" maxlength="32">
            <small>{{ usernameError }}</small>
            <input v-model.trim="email" @keydown="clearEmailField" :class="[emailRed ? 'is-invalid' : 'mb-3']" type="email" pattern="^\S+@\S+\.[a-zA-Z]+$" class="form-control" placeholder="Email">
            <small>{{ emailError }}</small>
            <input v-model="password1" @keydown="clearPass1Field" :class="[password1Red ? 'is-invalid' : 'mb-3']" type="password" class="form-control" placeholder="Password">
            <small>{{ password1Error }}</small>
            <input v-model="password2" @keydown="clearPass2Field" :class="{'is-invalid': password2Red}" type="password" class="form-control" placeholder="Confirm password">
            <small>{{ password2Error }}</small>
          </div>
          <div class="modal-footer justify-content-center" style="border-top: none;">
            <button class="btn btn-primary" style="width: 90%;"><font-awesome-icon v-if="loading" :icon="['fas', 'circle-notch']" spin /><template v-else>Sign up</template></button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'RegisterModal',
  data() {
    return {
      username: "",
      email: "",
      password1: "",
      password2: "",
      usernameRed: false,
      emailRed: false,
      password1Red: false,
      password2Red: false,
      usernameError: "",
      emailError: "",
      password1Error: "",
      password2Error: "",
      loading: false,
      TAKEN_USERNAMES: []
    }
  },
  methods: {
    checkUsername(e) {
      if (e.key !== "Enter") {
        const invalid = this.username && !this.username.match(/^[a-z0-9_]+$/i)
        this.usernameRed = invalid
        this.usernameError = invalid ? "Letters, numbers, and underscores only." : ""
      }
    },
    clearEmailField() {
      this.emailRed = false
      this.emailError = ""
    },
    clearPass1Field() {
      this.password1Red = false
      this.password1Error = ""
    },
    clearPass2Field() {
      this.password2Red = false
      this.password2Error = ""
    },
    checkForm() {
      if (!this.username) {
        this.usernameRed = true
        this.usernameError = "Username cannot be blank."
      } else if (this.TAKEN_USERNAMES.includes(this.username.toLowerCase())) {
        this.usernameRed = true
        this.usernameError = "Username already taken."
      } else if (this.username.length > 32) {
        this.usernameRed = true
        this.usernameError = "Maximum 32 characters."
      } else if (!this.username.match(/^[a-z0-9_]+$/i)) {
        this.usernameRed = true
        this.usernameError = "Letters, numbers, and underscores only."
      } else if (!this.email) {
        this.emailRed = true
        this.emailError = "Email cannot be blank."
      } else if (!this.email.match(/^\S+@\S+\.[a-zA-Z]+$/)) {
        this.emailRed = true
        this.emailError = "Please enter a valid email address."
      } else if (!this.password1/* .length < 6 */) {
        this.password1Red = true
        this.password1Error = "Password cannot be blank." // "Password must be at least 6 characters."
      } else if (this.password1 !== this.password2) {
        this.password2Red = true
        this.password2Error = "Password does not match."
      } else {
        return true
      }
      return false
    },
    getData() {
      if (this.checkForm()) {
        const data = new FormData()
        data.set("username", this.username)
        data.set("email", this.email)
        data.set("password1", this.password1)
        data.set("password2", this.password2)
        return data
      } else {
        return null
      }
    },
    async submit() {
      this.loading = true
      try {
        const formData = this.getData()
        if (formData) {
          const { data } = await this.$axios.post("/api/register", formData)
          if (data.registered) {
            await this.$store.commit("setJustRegistered", true)
            await this.removeModal()
            await this.$auth.setUserToken(data.access)
            await this.$auth.setRefreshToken("local", data.refresh)
            this.$router.push("/profile")
            setTimeout(() => {this.$store.commit("setJustRegistered", false)}, 5000)
          } else {
            await this.registerError(data, formData.get("username"))
          }
        }
      } catch (err) {
        this.errorToast(err)
      } finally {
        this.loading = false
      }
    },
    removeModal() {
      $("#registerModal").modal("hide")
      document.body.classList.remove("modal-open")
      try {
        document.querySelector(".modal-backdrop.show").remove()
      } catch {}
    },
    registerError(response, submittedUsername) {
      if (response.field) {
        if (response.field === "u") {
          this.usernameRed = true
          this.usernameError = response.message
          if (response.taken) this.TAKEN_USERNAMES.push(submittedUsername.toLowerCase())
        } else if (response.field === "e") {
          this.emailRed = true
          this.emailError = response.message
        } else if (response.field === "p") {
          this.password1Red = true
          this.password1Error = response.message
        } else if (response.field === "p2") {
          this.password2Red = true
          this.password2Error = response.message
        }
      } else {
        this.errorToast(response.message)
      }
    }
  }
}
</script>

<style scoped>
input {
  border: none;
  background-color: inherit;
  color: inherit;
}
small {
  color: #dc3545;
}
</style>
