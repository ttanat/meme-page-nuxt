export default function({ $auth, route, redirect }) {
  // Redirect if not logged in
  if (!$auth.loggedIn) {
    return redirect(`/p/${route.params.name}`)
  } else {
    const page = $auth.user.moderating.find(p => p.name === route.params.name)
    // Redirect if not moderating this page or page is not private and accessing requests
    if (!page || (!page.private && route.path.endsWith("/requests"))) {
      return redirect(`/p/${route.params.name}`)
    }
  }
}
