import jwt from 'jsonwebtoken'

const getCurrentTime = () => new Date().getTime()

function accessTokenAboutToExpire(context) {
  // Gets expiry time of access token in seconds
  const { exp } = jwt.decode(context.$auth.getToken('local').slice(7)) // Slice to remove "Bearer "
  // Returns true if access token is 10 seconds from expiring
  return getCurrentTime() + 10000 > exp * 1000 // Convert exp to milliseconds
}

function refreshTokenAboutToExpire(context) {
  // Gets expiry time of refresh token in seconds
  const { exp } = jwt.decode(context.$auth.getRefreshToken('local'))
  // Returns true if refresh token is 10 seconds from expiring
  return getCurrentTime() + 10000 > exp * 1000 // Convert exp to milliseconds
}

function refresh(context, config, resolve, reject) {
  context.$axios.post("/api/token/refresh/", {refresh: context.$auth.getRefreshToken('local')})
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
      if (!context.$auth.loggedIn || ["/api/token/refresh/", "/api/token/", "/api/register", "/api/auth/logout"].includes(config.url)) {
        resolve(config)
      } else {
        if (accessTokenAboutToExpire(context)) {
          if (refreshTokenAboutToExpire(context)) {
            reject(new Error("refresh_token_about_to_expire"))
          } else {
            // Else, get new access token
            refresh(context, config, resolve, reject)
          }
        } else {
          resolve(config)
        }
      }
    })
  })

  context.$axios.onError(err => {
    return new Promise((resolve, reject) => {
      if (err.response && err.response.data && err.response.data.code === "user_not_found") {
        // Logout if user not found (e.g. if token incorrect)
        alert(err.response.data.detail)
        context.$auth.logout()
        reject(err)
      } else if (err.response && err.response.data && err.response.data.code === "token_not_valid"
                && err.response.data.messages && err.response.data.messages[0].token_type === "access") {
        // Refresh when access token invalid
        // Will happen when opening new tab (invalid access token used to get user info)
        refresh(context, err.response.config, resolve, reject)
      } else {
        // If refresh token isn't valid or refresh failed
        if (err.message === "refresh_token_about_to_expire"
            || (err.response && err.response.data && err.response.data.code === "token_not_valid")) {
          alert("Session expired. Please log in again.")
          context.$auth.logout()
          // If logged out when navigating to '/', then memes will not load
        }
        reject(err)
      }
    })
      .then(() => Promise.resolve()) // Resolve and reject both work
  })
}
