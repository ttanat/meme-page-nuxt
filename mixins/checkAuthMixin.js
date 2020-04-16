export default {
  methods: {
    checkAuth() {
      if (!this.$auth.loggedIn) $("#signUpModal").modal("show")
      return this.$auth.loggedIn
    }
  }
}
