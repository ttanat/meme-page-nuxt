import Cookies from 'js-cookie'

export const mutations = {
  SET_AUTH_USER (state, user) {
    state.user = JSON.parse(user)
    state.loggedIn = true
  },
  set_user_moderating (state, { page, add }) {
    /* 
      page: {"name": "Some page name", "dname": "Some page display name", "private": boolean}
      add: boolean
    */
    const new_arr = state.user.moderating
    add ? new_arr.push(page) : new_arr.splice(new_arr.indexOf(page), 1)
    state.user = { ...state.user, moderating: new_arr }
  },
  set_user_subscriptions (state, { page, add }) {
    add ? state.user.subscriptions.push(page) : state.user.subscriptions.splice(state.user.subscriptions.indexOf(page), 1)
  },
  LOGOUT_USER (state) {
    Cookies.remove("user")
  }
}

export const actions = {
  set_user_cookie ({ state }) {
    Cookies.set("user", JSON.stringify(state.user))
  },
  async SET_AUTH_USER_MODERATING ({ commit, dispatch }, payload) {
    // console.log()
    await commit("set_user_moderating", payload)
    dispatch("set_user_cookie")
  },
  async SET_AUTH_USER_SUBSCRIPTIONS ({ commit, dispatch }, payload) {
    await commit("set_user_moderating", payload)
    dispatch("set_user_cookie")
  },
}
