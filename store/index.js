export const state = () => ({
  currentPage: "", // Display next to search bar
  showOverlay: false
})

export const getters = {}

export const mutations = {
  setCurrentPage (state, name) {
    state.current_page = name
  },
  setShowOverlay(state, show) {
    state.showOverlay = show
  }
}
