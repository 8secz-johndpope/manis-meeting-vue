import Utils from '../../utils/utils'

const state = {
  videoStreams: [],
  audioStreams: [],
  showStreams: [],
  textMsg: [],
  audioMute: false,
  videoMute: false,
  isModerator: false,
  recording: false,
  recorder: '',
  mode: '0'
}

const mutations = {
  CLEAR_DATA (state) {
    state.videoStreams = []
    state.audioStreams = []
    state.showStreams = []
    state.textMsg = []
    state.audioMute = false
    state.videoMute = false
    state.isModerator = false
    state.recording = false
    state.recorder = ''
    state.mode = '0'
  },
  SWITCH_AUDIO_MUTE: function (state, status) {
    state.audioMute = status
  },
  SWITCH_VIDEO_MUTE: function (state, status) {
    state.videoMute = status
  },
  SWITCH_IS_MODERATOR: function (state, status) {
    state.isModerator = status
  },
  ADD_TEXT_MSG: function (state, object) {
    state.textMsg.push(object)
  },
  ADD_PARTICIPANT: function (state, source) {
    if (source.type === 'video') {
      state.videoStreams.push(source.data)
      if (!state.showStreams.length) {
        state.showStreams.push(source.data)
      }
    }
    if (source.type === 'audio') {
      state.audioStreams.push(source.data)
    }
  },
  REMOVE_PARTICIPANT: function (state, endpoint) {
    state.showStreams = Utils.removeByEndpoint(state.showStreams, endpoint)
    state.audioStreams = Utils.removeByEndpoint(state.audioStreams, endpoint)
    state.videoStreams = Utils.removeByEndpoint(state.videoStreams, endpoint)
  },
  REMOVE_STREAM: function (state, ssrc) {
    state.showStreams = Utils.removeBySSRC(state.showStreams, ssrc)
    state.audioStreams = Utils.removeBySSRC(state.audioStreams, ssrc)
    state.videoStreams = Utils.removeBySSRC(state.videoStreams, ssrc)
  },
  UPDATE_PARTICIPANT: function (state, data) {
    state.videoStreams = Utils.updateParticipant(state.videoStreams, data.e, data.k, data.v)
    state.showStreams = Utils.updateParticipant(state.showStreams, data.e, data.k, data.v)
  },
  UPDATE_DISPLAY_MODE: function (state, data) {
    state.mode = data.mode
    let displaySort = data.sort
    for (let i = 0; i < displaySort.length; i++) {
      let sortObj = displaySort[i]
      let obj = Utils.getRightParticipant(state.videoStreams, sortObj.endpoint, sortObj.ssrc)
      // console.log('find show participant at : ', i, obj)
      if (!obj) {
        state.showStreams.splice(i, 1, false)
      } else {
        if (state.showStreams[i]) {
          if (obj !== state.showStreams[i] || obj.stream.ssrc !== state.showStreams[i].stream.ssrc) {
            state.showStreams.splice(i, 1, obj)
          }
        } else {
          state.showStreams.splice(i, 1, obj)
        }
      }
    }
    // remove the window which more than balance
    if (state.showStreams.length > displaySort.length > 1) {
      console.warn('------------showWindowsMoreThanOrderDisplay---------------', state.showStreams.length, '>', displaySort.length)
      for (let i = displaySort.length; i < state.showStreams.length; i++) {
        state.showStreams.splice(i, 1)
      }
    }
  },
  REPLACE_LOCAL_STREAM: function (state, data) {
    let streamType = data.type
    let replaceStream = data.stream
    let endpoint = data.endpoint
    if (streamType === 'audio') {
      state.audioStreams = Utils.replaceLocalStream(state.audioStreams, endpoint, replaceStream)
    } else if (streamType === 'video') {
      state.videoStreams = Utils.replaceLocalStream(state.videoStreams, endpoint, replaceStream)
      state.showStreams = Utils.replaceLocalStream(state.showStreams, endpoint, replaceStream)
    }
  },
  UPDATE_RECORDING_STATUS: function (state, status) {
    state.recording = status
  },
  UPDATE_RECORDER: function (state, data) {
    state.recorder = data
  }
}

const actions = {
  updateRecorder ({commit}, data) {
    commit('UPDATE_RECORDER', data)
  },
  updateRecordStatus ({commit}, data) {
    commit('UPDATE_RECORDING_STATUS', data)
  },
  replaceLocalStream ({commit}, data) {
    commit('REPLACE_LOCAL_STREAM', data)
  },
  onJoinRoom ({commit}, data) {
    commit('ADD_PARTICIPANT', data)
  },
  onLeaveRoom ({commit}, endpoint) {
    commit('REMOVE_PARTICIPANT', endpoint)
  },
  onSourceRemoved ({commit}, ssrc) {
    commit('REMOVE_STREAM', ssrc)
  },
  clearData ({commit}) {
    commit('CLEAR_DATA')
  },
  updateData ({commit}, data) {
    commit('UPDATE_PARTICIPANT', data)
  },
  updateDisplaySort ({commit}, data) {
    commit('UPDATE_DISPLAY_MODE', data)
  },
  onTextMsg ({commit}, data) {
    commit('ADD_TEXT_MSG', data)
  },
  updateAudioStatus ({commit}, status) {
    commit('SWITCH_AUDIO_MUTE', status)
  },
  updateVideoStatus ({commit}, status) {
    commit('SWITCH_VIDEO_MUTE', status)
  },
  updateControlStatus ({commit}, status) {
    commit('SWITCH_IS_MODERATOR', status)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
