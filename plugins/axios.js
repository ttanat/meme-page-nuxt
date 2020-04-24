import jwt from 'jsonwebtoken'

/*
  Check if access token about to expire before each axios request
  If access token about to expire, check if refresh token about to expire
  If refresh token about to expire, log user out and throw error
  Otherwise, get new access token and continue with request
*/
export default function (context) {
  context.$axios.onRequest(config => {
    return new Promise((resolve, reject) => {
      if (context.$auth.loggedIn && !["/api/token/refresh/", "/api/token/", "/api/auth/logout"].includes(config.url)) {
        // If access token about to expire...
        if (new Date().getTime() + 10000 > jwt.decode(context.$auth.getToken('local').slice(7)).exp * 1000) { 
          // If refresh token about to expire, log out
          if (new Date().getTime() + 10000 > jwt.decode(context.$auth.getRefreshToken('local')).exp * 1000) {
            context.$auth.logout()
            reject(new Error("Session expired. Please log in again."))
          } else {
            // Else, get new access token
            context.$axios.post("/api/token/refresh/", {refresh: context.$auth.getRefreshToken('local')}, {progress: false})
              .then(res => context.$auth.setUserToken(res.data.access)) // Set new access token
              .then(() => config.headers.Authorization = context.$auth.getToken('local')) // Set new access token of current axios request
              .then(() => resolve(config))
              .catch(err => reject(err))
          }
        } else {
          resolve(config)
        }
      } else {
        resolve(config)
      }
    })
  })

  context.$axios.onError(err => {
    if (err.response && err.response.config.url === "/api/token/" && err.response.status === 401) {
      // If login failed, do nothing
    } else if (err.message === "Session expired. Please log in again." || err.response.status === 401) {
      // If token refresh failed or not authenticated, logout
      alert("Session expired. Please log in again.")
      context.$auth.logout()
      // If logged out when navigating to '/', then memes will not load
    }
    Promise.reject(err)
  })
}
