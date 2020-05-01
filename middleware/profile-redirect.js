export default async function({ $auth, params, redirect }) {
  if ($auth.loggedIn && $auth.user.username === params.username) {
    redirect('/profile')
  }
}
