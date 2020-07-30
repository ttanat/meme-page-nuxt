export const state = () => ({
  data: {}
})

export const getters = {
  pageName: state => {
    return state.data.pname || ""
  }
}

export const mutations = {
  setData(state, data) {
    state.data = data
  },
  destroyData(state) {
    state.data = {}
  }
}
