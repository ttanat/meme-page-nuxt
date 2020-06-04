export const state = () => ({
  currentPage: "", // Display next to search bar
  nightMode: false,
  showOverlay: false
})

export const getters = {}

export const mutations = {
  setCurrentPage (state, name) {
    state.currentPage = name
  },
  toggleNightMode(state) {
    state.nightMode = !state.nightMode
  },
  setShowOverlay (state, show) {
    state.showOverlay = show
  }
}
