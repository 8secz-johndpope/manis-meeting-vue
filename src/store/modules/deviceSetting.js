const state = {
  audioIn: '',
  audioOut: '',
  videoIn: '',
  audioInputOptions: [],
  audioOutputOptions: [],
  videoInputOptions: []
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
  },
  STORE_AVAILABLE_DEVICES: function (state, data) {
    switch (data.type) {
      case 'audio-in':
        state.audioInputOptions = data.devices
        break
      case 'video-in':
        state.videoInputOptions = data.devices
        break
      case 'audio-out':
        state.audioOutputOptions = data.devices
        break
    }
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
  },
  availableDevices ({ commit }, data) {
    commit('STORE_AVAILABLE_DEVICES', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
