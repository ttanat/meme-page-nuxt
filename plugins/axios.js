import jwt from 'jsonwebtoken'

function getAccessTokenExp(context) {
  return jwt.decode(context.$auth.getToken('local').slice(7)).exp * 1000
}

function getRefreshTokenExp(context) {
  return jwt.decode(context.$auth.getRefreshToken('local')).exp * 1000
}

function refresh(context, config, resolve, reject) {
  context.$axios.post("/api/token/refresh/", {refresh: context.$auth.getRefreshToken('local')}, {progress: false})
    .then(res => context.$auth.setUserToken(res.data.access)) // Set new access token
    .then(() => config.headers.Authorization = context.$auth.getToken('local')) // Set new access token of current axios request
    .then(() => resolve(config))
    .catch(err => reject(err))
}

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
        if (new Date().getTime() + 10000 > getAccessTokenExp(context)) { 
          // If refresh token about to expire, log out
          if (new Date().getTime() + 10000 > getRefreshTokenExp(context)) {
            context.$auth.logout()
            reject(new Error("Session expired. Please log in again."))
          } else {
            // Else, get new access token
            refresh(context, config, resolve, reject)
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
    return new Promise((resolve, reject) => {
      /*
        Case: Access token is expired and link is opened in new tab
        Default behaviour: Users are automatically logged out
        This promise: Tries to refresh the access token if refresh token not expired
      */ 
      if (err.response && err.response.status === 401 && err.response.config.url !== "/api/token/refresh/" && new Date().getTime() + 10000 < getRefreshTokenExp(context)) {
        refresh(context, err.response.config, resolve, reject)
      } else {
        reject(err)
      }
    })
      .then(() => Promise.resolve())
      .catch(() => {
        // If refresh failed or refresh token isn't valid
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
  })
}
