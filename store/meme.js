export const state = () => ({
  data: {}
})

export const getters = {
  meme: state => {
    return state.data
  },
  username: state => {
    return state.data.username
  },
  points: state => {
    return state.data.points
  },
  pageName: state => {
    return state.data.page.name
  },
  numComments: state => {
    return state.data.num_comments
  }
}

export const mutations = {
  setData(state, data) {
    data.hasPage = !!data.page
    if (!data.page) {
      data.page = {name: "", dname: "", image: "", description: ""}
    }
    state.data = data
  },
  destroyData(state) {
    state.data = {}
  },
  setPoints(state, points) {
    state.data.points = points
  },
  incrementCommentCount(state) {
    state.data.num_comments++
  }
}
