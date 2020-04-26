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
import Cookies from 'js-cookie'

export default {
  name: 'LoginModal',
  data() {
    return {
      login: {
        username: "",
        password: ""
      },
      loading: false
    }
  },
  methods: {
    submit() {
      if (!this.login.username || !this.login.password ||
          this.login.username.length > 32 ||
          !this.login.username.match(/^[a-z0-9_]+$/i)) {
        alert("Username or password incorrect.")
      } else {
        this.loading = true

        this.$auth.loginWith("local", {
          data: this.login
        })
          .then(r => {
            $("#loginModal").modal("hide")
            document.body.classList.remove("modal-open")
            try {
              document.querySelector(".modal-backdrop.show").remove()
            } catch {}
            this.$auth.setRefreshToken("local", r.data.refresh)
          })
          .catch(err => alert(err.response && err.response.status === 401 ? "Username or password incorrect" : "Unexpected error occurred. Please try again"))
          .finally(() => this.loading = false)
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
