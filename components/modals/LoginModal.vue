<template>
  <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content" style="padding: 10px 25px 20px 25px;width: 450px;">
        <div class="modal-header" style="border-bottom: none;">
          <h5 class="modal-title" id="loginModalLabel">Log in</h5>
        </div>
        <form @submit.prevent="submit">
          <div class="modal-body" style="border: none;">
            <input v-model.trim="login.username" type="text" class="form-control mb-3" name="username" placeholder="Username">
            <input v-model="login.password" type="password" class="form-control" name="password" placeholder="Password">
          </div>
          <div class="modal-footer justify-content-center" style="border-top: none;">
            <button class="btn btn-primary" style="width: 90%;"><font-awesome-icon v-if="loading" :icon="['fas', 'circle-notch']" spin /><template v-else>Log in</template></button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import jwt from 'jsonwebtoken'

export default {
  name: 'LoginModal',
  data() {
    return {
      login: {
        username: "",
        password: ""
      },
      loading: false,
      banned: [],
    }
  },
  methods: {
    submit() {
      if (this.banned.includes(this.login.username.toLowerCase())) {
        this.errorToast("You have been banned")
      } else if (!this.login.username.match(/^[a-z0-9_]{1,32}$/i) || !this.login.password) {
        this.errorToast("Username or password incorrect.")
      } else {
        this.loading = true

        const loginData = new FormData()
        loginData.set("username", this.login.username)
        loginData.set("password", this.login.password)

        this.$axios.post("/api/token/", loginData)
          .then(({ data }) => {
            this.removeModal()
            this.$auth.setUserToken(data.access)
            this.$auth.setRefreshToken("local", data.refresh)
          })
          .catch(err => {
            const status = err.response ? err.response.status : null
            const message = status === 401 ? "Username or password incorrect" : status === 403 ? "You have been banned" : "Unexpected error occurred. Please try again"
            this.errorToast(message)
            if (status === 403) {
              this.banned.push(this.login.username.toLowerCase())
            }
          })
          .finally(() => this.loading = false)
      }
    },
    removeModal() {
      $("#loginModal").modal("hide")
      document.body.classList.remove("modal-open")
      try {
        document.querySelector(".modal-backdrop.show").remove()
      } catch {}
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
