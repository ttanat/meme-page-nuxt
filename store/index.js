import Cookies from 'js-cookie'

export const state = () => ({
  current_page: "Memes", // Display next to search bar
  memes: [] // Save here to reduce number of API requests, e.g. when going to meme_view
})

export const getters = {
  getMeme (state, uuid) {
    return state.memes.find(m => m.uuid === uuid)
  }
}

export const mutations = {
  setCurrentPage (state, name) {
    state.current_page = name
  },
  addMeme (state, payload) {
    state.memes.push(payload)
  }
}

export const actions = {
  nuxtClientInit({ commit }) {
    const user = Cookies.get("user")
    if (user) commit('auth/SET_AUTH_USER', user)
  }
}
