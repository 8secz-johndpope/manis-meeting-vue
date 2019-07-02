const state = {
  username: '',
  password: '',
  authorization: false,
  profile: null,
  room: '',
  initiativeSignOut: false,
  remember: false,
  histories: []
}

const mutations = {
  CLEAR_USER_STORE (state) {
    if (!state.remember) {
      state.username = ''
      state.password = ''
      state.histories = []
    }
    state.profile = null
    state.room = ''
    state.authorization = false
    // state.initiativeSignOut = false
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
  },
  SET_SIGN_OUT_TYPE (state, type) {
    state.initiativeSignOut = type
  },
  SET_REMEMBER_ME (state, remember) {
    state.remember = remember
  },
  SET_AUTHORIZATION (state, auth) {
    state.authorization = auth
  },
  PUSH_INTO_HISTORY (state, room) {
    state.histories.push(room)
  }
}

const actions = {
  storeUser ({commit}, userSetting) {
    commit('STORE_USERNAME', userSetting.username)
    commit('STORE_PASSWORD', userSetting.password)
    commit('SET_USER_ROOM', userSetting.room)
    commit('SET_USER_PROFILE', userSetting.profile)
    if (userSetting.rememberMe !== undefined) {
      console.log('-------store-remember-me-status: ', userSetting.rememberMe)
      commit('SET_REMEMBER_ME', (userSetting.rememberMe))
    }
  },
  clearUser ({commit}) {
    commit('CLEAR_USER_STORE')
    commit('SET_AUTHORIZATION', false)
  },
  isInitiativeSignOut ({commit}, type) {
    commit('SET_SIGN_OUT_TYPE', type)
  },
  updateRememberMe ({commit}, remember) {
    commit('SET_REMEMBER_ME', remember)
  },
  commitHistory ({commit}, room) {
    commit('PUSH_INTO_HISTORY', room)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
