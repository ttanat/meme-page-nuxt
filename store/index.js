export const state = () => ({
  currentPage: "", // Display next to search bar
  nightMode: false,
  showOverlay: false, // For meme view
  justRegistered: false, // For preventing some api calls when user just registered (notifications, profile memes)
  uploadingMeme: false, // For when meme is uploading (show loading icon, etc.)
})

export const getters = {
  uploadingMeme (state) {
    return state.uploadingMeme
  }
}

export const mutations = {
  setCurrentPage (state, name) {
    state.currentPage = name
  },
  toggleNightMode(state) {
    state.nightMode = !state.nightMode
  },
  setShowOverlay (state, show) {
    state.showOverlay = show
    document.querySelector("body").style.overflow = show ? "hidden" : ""
  },
  setJustRegistered(state, bool=true) {
    state.justRegistered = bool
  },
  setUploadingMeme (state, uploading=false) {
    state.uploadingMeme = uploading
  }
}
