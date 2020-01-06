const mutations = {
  // 得分
  USER_SCORE(state, data) {
    state.score = data
  },
  USER_TOKEN(state, data) {
    state.token = data
  }
}

export default mutations
