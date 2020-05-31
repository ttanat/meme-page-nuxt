import jwt from 'jsonwebtoken'
import axios from 'axios'

function getCurrentTime() {
  return new Date().getTime()
}

function getAccessTokenExp(context) {
  return jwt.decode(context.$auth.getToken('local').slice(7)).exp * 1000
}

function getRefreshTokenExp(context) {
  return jwt.decode(context.$auth.getRefreshToken('local')).exp * 1000
}

function refresh(context, resolve, reject) {
  const baseUrl = context.$axios.defaults.baseURL
  axios.post(`${baseUrl}/api/token/refresh/`, {refresh: context.$auth.getRefreshToken('local')}, {progress: false})
    .then(res => context.$auth.setUserToken(res.data.access)) // Set new access token
    .then(() => resolve())
    .catch(err => reject(err))
}

export default function(context) {
  return new Promise((resolve, reject) => {
    if (!context.$auth.loggedIn) resolve()

    if (getCurrentTime() + 10000 > getAccessTokenExp(context)) {
      // If refresh token about to expire, log out
      if (getCurrentTime() + 10000 > getRefreshTokenExp(context)) {
        context.$auth.logout()
        reject(new Error("Session expired. Please log in again."))
      } else {
        // Else, get new access token
        refresh(context, resolve, reject)
      }
    } else {
      resolve()
    }
  })
}
