export const state = () => ({
  reportObject: "", // meme, comment, user, or page
  objectUid: "", // uuid for meme or comment, username, page name
})

export const getters = {
  reportObject: state => state.reportObject,
  objectUid: state => state.objectUid
}

export const mutations = {
  setNewReport(state, payload) {
    state.reportObject = payload.reportObject
    state.objectUid = payload.objectUid
    $("#reportModal").modal("show")
  },
  clearReport(state) {
    state.reportObject = ""
    state.objectUid = ""
  }
}
