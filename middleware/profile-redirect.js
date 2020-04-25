export default async function({ $auth, params, redirect }) {
  if ($auth && $auth.user.username === params.username) {
    redirect('/profile')
  }
}
