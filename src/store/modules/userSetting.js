const state = {
  username: '',
  password: '',
  authorization: false,
  profile: null,
  room: ''
}

const mutations = {
  CLEAR_USER_STORE (state) {
    state.username = ''
    state.password = ''
    state.profile = null
    state.room = ''
    state.authorization = false
  },
  STORE_USERNAME: function (state, username) {
    state.username = username
  },
  STORE_PASSWORD (state, password) {
    state.password = password
  },
  SET_USER_PROFILE (state, profile) {
    state.profile = profile
    state.authorization = true
  },
  SET_USER_ROOM (state, room) {
    state.room = room
  }
}

const actions = {
  storeUser ({commit}, userSetting) {
    commit('STORE_USERNAME', userSetting.username)
    commit('STORE_PASSWORD', userSetting.password)
    commit('SET_USER_ROOM', userSetting.room)
    commit('SET_USER_PROFILE', userSetting.profile)
  },
  clearUser ({commit}) {
    commit('CLEAR_USER_STORE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
