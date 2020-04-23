import jwt from 'jsonwebtoken'

export default function (context) {
  context.$axios.onRequest(config => {
    return new Promise((resolve, reject) => {
      if (context.$auth.loggedIn && !["/api/token/refresh/", "/api/token/", "/api/auth/logout"].includes(config.url)) {
        // Check if access token about to expire (10 seconds before)
        if (new Date().getTime() + 10000 > jwt.decode(context.$auth.getToken('local').slice(7)).exp * 1000) { // If access token about to expire, get new one
          // Check if refresh token about to expire (10 seconds before)
          if (new Date().getTime() + 10000 > jwt.decode(context.$auth.getRefreshToken('local')).exp * 1000) { // If refresh token about to expire, log out
            alert("Session expired. Please log in again.")
            context.$auth.logout()
            reject(new Error("Session expired. Please log in again."))
          } else { // If refresh token not about to expire, get new access token
            context.$axios.post("/api/token/refresh/", {refresh: context.$auth.getRefreshToken('local')}, {progress: false})
              .then(res => context.$auth.setUserToken(res.data.access)) // Set new access token
              .then(() => config.headers.Authorization = context.$auth.getToken('local')) // Set new access token of current axios request
              .then(() => {console.log('resolve');resolve(config)})
              .catch(err => {console.log('reject')
                context.$auth.logout()
                reject(err)
              })
          }
        } else {
          resolve(config)
        }
      } else {
        resolve(config)
      }
    })
  })
}
