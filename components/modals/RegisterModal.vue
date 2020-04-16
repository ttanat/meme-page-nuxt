<template>
  <div class="modal fade" id="signUpModal" tabindex="-1" role="dialog" aria-labelledby="signUpModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content" style="padding: 10px 25px 20px 25px;">
        <div class="modal-header" style="border-bottom: none;">
          <h5 class="modal-title" id="signUpModalLabel">Sign up and start exploring!</h5>
        </div>
        <form @submit.prevent="submit">
          <div class="modal-body" style="border: none;">
            <input v-model.trim="username" @keyup="checkUsername" :class="[usernameRed ? 'is-invalid' : 'mb-3']" type="text" pattern="[a-zA-Z0-9_]+" class="form-control" placeholder="Username" maxlength="32">
            <small>{{ usernameError }}</small>
            <input v-model.trim="email" @keydown="clearEmailField" :class="[emailRed ? 'is-invalid' : 'mb-3']" type="email" class="form-control" placeholder="Email">
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
      } else if (!this.password1) {
      // } else if (this.password1.length < 6) {
        this.password1Red = true
        this.password1Error = "Password cannot be blank."
          // this.password1Error = "Password must be at least 6 characters."
      } else if (this.password1 !== this.password2) {
        this.password2Red = true
        this.password2Error = "Password does not match."
      } else {
        return true
      }
      return false
    },
    submit() {
      if (this.checkForm()) {
        this.loading = true
        const data = new FormData()
        data.set("username", this.username)
        data.set("email", this.email)
        data.set("password1", this.password1)
        data.set("password2", this.password2)

        axios.post("/register", data/*, {headers: {"X-CSRFToken": getCookie('csrftoken')}}*/)
          .then(r => r.data)
          .then(res => {
            if (res.success) {
              window.location.replace("/profile")
            } else {
              this.loading = false
              if (res.field) {
                const field = res.field
                if (field === "u") {
                  this.usernameRed = true
                  this.usernameError = res["m"]
                  if (res["t"]) this.TAKEN_USERNAMES.push(data.get("username").toLowerCase())
                } else if (field === "e") {
                  this.emailRed = true
                  this.emailError = res["m"]
                } else if (field === "p") {
                  this.password1Red = true
                  this.password1Error = res["m"]
                } else if (field === "p2") {
                  this.password2Red = true
                  this.password2Error = res["m"]
                }
              } else {
                alert(res["m"])
              }
            }
          })
          .catch(err => {
            this.loading = false
            alert(err)
          })
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
</style>
