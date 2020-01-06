import getters from './getters'

const state = {
  isLogin: false,
  score: 0,
  token: ''
}

export default {
  state,
  actions: require('./actions').default,
  getters,
  mutations: require('./mutations').default
}
