const state = {
  audioIn: '',
  audioOut: '',
  videoIn: ''
}

const mutations = {
  CLEAR_DEVICE (state) {
    state.audioIn = ''
    state.audioOut = ''
    state.videoIn = ''
  },
  SET_AUDIO_INPUT: function (state, device) {
    state.audioIn = device
  },
  SET_AUDIO_OUTPUT: function (state, device) {
    state.audioOut = device
  },
  SET_VIDEO_INPUT: function (state, device) {
    state.videoIn = device
  }
}

const actions = {
  setAudioIn ({ commit }, device) {
    commit('SET_AUDIO_INPUT', device)
  },
  setAudioOut ({ commit }, device) {
    commit('SET_AUDIO_OUTPUT', device)
  },
  setVideoIn ({ commit }, device) {
    commit('SET_VIDEO_INPUT', device)
  },
  clearDevice ({ commit }) {
    commit('CLEAR_DEVICE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
