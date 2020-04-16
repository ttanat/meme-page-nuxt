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
import { mapMutations } from 'vuex'
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
    // ...mapMutations(["setToken", "setAuth", "userLogin", "resetUser"]),
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
            try {
              $("#loginModal").modal("hide")
              document.body.classList.remove("modal-open")
              document.querySelector(".modal-backdrop.show").remove()
            } catch {}
            this.$auth.setUser(r.data.user)
            Cookies.set("user", r.data.user)
            this.$auth.setRefreshToken("local", r.data.refresh)
            // this.$router.push("/feed")
          })
          .catch(res => alert(res.response.status === 401 ? "Username or password incorrect" : "Unexpected error occurred. Please try again"))
          .finally(() => this.loading = false)

        // const data = new FormData()
        // data.set("username", this.username)
        // data.set("password", this.password)

        // axios.post("http://127.0.0.1:8000/api/token/", data)
        //   .then(res => {
        //     this.loading = false
        //     // Save token in state
        //     const token = res.data
        //     this.setToken(token)
        //     this.setAuth(true)
        //     // Get and save username and image URL from token data
        //     const user_obj = jwt.decode(token.access)
        //     this.userLogin({username: user_obj.username, image: user_obj.image})
        //     $("#loginModal").modal("hide") // jquery
        //   })
        //   .catch(err => {
        //     this.loading = false
        //     this.resetUser()
        //     alert(err)
        //   })
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
