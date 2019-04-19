const state = {
  serverAddr: '',
  nickname: 'nickname_' + Math.round(Math.random() * 10000)
}

const mutations = {
  CLEAR_SERVER_ADDR (state) {
    state.serverAddr = ''
  },
  SET_SERVER_ADDR: function (state, addr) {
    state.serverAddr = addr
  },
  RESET_NICKNAME (state) {
    state.nickname = 'nickname_' + Math.round(Math.random() * 100)
  },
  SET_DEFAULT_NICKNAME (state, nick) {
    state.nickname = nick
  }
}

const actions = {
  setServer ({ commit }, addr) {
    // do something async
    commit('SET_SERVER_ADDR', addr)
  },
  setNickname ({ commit }, nick) {
    // do something async
    commit('SET_DEFAULT_NICKNAME', nick)
  },
  clearSetting ({ commit }) {
    // do something async
    commit('CLEAR_SERVER_ADDR')
    commit('RESET_NICKNAME')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
