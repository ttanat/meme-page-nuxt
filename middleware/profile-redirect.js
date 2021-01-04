export default function({ $auth, params, redirect }) {
  if ($auth.loggedIn && $auth.user.username === params.username) {
    return redirect(301, '/profile')
  }
}
