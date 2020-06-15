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
      if (!context.$auth.loggedIn || ["/api/token/refresh/", "/api/token/", "/api/register", "/api/auth/logout"].includes(config.url)) {
        resolve(config)
      } else {
        if (accessTokenAboutToExpire(context)) {
          if (refreshTokenAboutToExpire(context)) {
            reject(new Error("Session expired. Please log in again."))
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
      if (err.response && err.response.status === 401
        && err.response.config.url !== "/api/token/refresh/"
        && context.$auth.getRefreshToken('local')
        && !refreshTokenAboutToExpire(context)) {
        /*
          Case: Access token is expired and link is opened in new tab
          Default behaviour: Users are automatically logged out
          This 'if' clause refreshes the access token if the refresh token is not expired
        */
        refresh(context, err.response.config, resolve, reject)
      } else {
        // If refresh failed or refresh token isn't valid
        if (err.message === "Session expired. Please log in again."
            || (err.response && err.response.status === 401
                && !["/api/token/", "/api/register"].includes(err.response.config.url))) {
          // If token refresh failed or not authenticated, logout
          // Or if 401 response not from logging in
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
