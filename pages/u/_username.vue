<script>
export default {
  middleware({ $auth, params, redirect }) {
    if ($auth.loggedIn && $auth.user.username === params.username) {
      return redirect(301, '/profile')
    }
    return redirect(301, `/user/${params.username}`)
  }
}
</script>
