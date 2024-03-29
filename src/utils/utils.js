const Manis = window.Manis
/**
 * @TODO
 * @BeforePublish
 * replace this defined before publish to repository
 * @type {null}
 */
// const Shell = null
const Shell = require('electron').shell

export default {
  /**
   * String lib name
   */
  name: 'utils',

  noErr: '000000',
  unknownError: '500500',

  /**
   * open url in default browser
   * @param url
   * @returns {boolean}
   */
  openUrlInBrowser: function (url) {
    if (Shell) {
      return Shell.openExternal(url)
    }
  },

  /**
   * is empty object
   * @param obj
   * @returns {boolean}
   */
  isEmptyObject: function (obj) {
    for (var key in obj) {
      return false// 返回false，不为空对象
    }
    return true// 返回true，为空对象
  },

  /**
   * cut str into array
   * @param str
   * @param n
   * @returns {Array}
   */
  strCut2Arr: function (str, n) {
    var arr = []
    var len = Math.ceil(str.length / n)
    for (var i = 0; i < len; i++) {
      if (str.length >= n) {
        var strCut = str.substring(0, n)
        arr.push(strCut)
        str = str.substring(n)
      } else {
        arr.push(str)
      }
    }
    return arr
  },

  /**
   * is own empty
   * @param obj
   * @returns {boolean}
   */
  isOwnEmpty: function (obj) {
    for (var name in obj) {
      if (obj.hasOwnProperty(name)) {
        return false// 返回false，不为空对象
      }
    }
    return true// 返回true，为空对象
  },

  /**
   * check fetch status
   * @param response
   * @returns {*}
   */
  checkStatus: function (response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  },

  /**
   * parse json
   * @param response
   * @returns {*}
   */
  parseJSON: function (response) {
    return response.json()
  },

  /**
   * generate constraints
   * @param withAudio
   * @param withVideo
   * @param audioIn
   * @param videoIn
   * @param videoResolution
   * @returns {{audio: *, video: *}}
   */
  generateConstraints: function (withAudio, withVideo, audioIn, videoIn, videoResolution) {
    var constraints = {
      audio: withAudio ? {} : false,
      video: withVideo ? {} : false
    }
    if (withAudio === true) {
      constraints.audio.deviceId = audioIn ? {exact: audioIn} : undefined
    }
    if (withVideo === true) {
      constraints.video.deviceId = videoIn ? {exact: videoIn} : undefined
      let rate = {}
      rate.max = 30
      rate.min = 20
      constraints.video.frameRate = rate
    }
    if (withVideo === true && videoResolution) {
      switch (videoResolution) {
        case '1080':
          constraints.video.width = {exact: 1920}
          constraints.video.height = {exact: 1080}
          break
        case '720':
          constraints.video.width = {exact: 1280}
          constraints.video.height = {exact: 720}
          break
        case '768':
          constraints.video.width = {exact: 1024}
          constraints.video.height = {exact: 768}
          break
        case '540':
          constraints.video.width = {exact: 960}
          constraints.video.height = {exact: 540}
          break
        case '480':
          constraints.video.width = {exact: 640}
          constraints.video.height = {exact: 480}
          break
        case '240':
          constraints.video.width = {exact: 320}
          constraints.video.height = {exact: 240}
          break
        case '180':
          constraints.video.width = {exact: 320}
          constraints.video.height = {exact: 180}
          break
        default:
          constraints.video.width = {exact: 320}
          constraints.video.height = {exact: 180}
          break
      }
    }
    return constraints
  },

  /**
   * attach audio to element
   * @param element
   * @param sinkId
   */
  attachSinkId: function (element, sinkId) {
    if ((typeof element.sinkId !== 'undefined') && element.sinkId !== sinkId) {
      element.setSinkId(sinkId)
        .then(function () {
          console.log('Success, audio output device attached: ' + sinkId)
        })
        .catch(function (error) {
          var errorMessage = error
          if (error.name === 'SecurityError') {
            errorMessage = 'You need to use HTTPS for selecting audio output ' +
              'device: ' + error
          }
          console.error(errorMessage)
        })
    } else {
      if (typeof element.sinkId === 'undefined') {
        console.warn('Browser does not support output device selection.')
      }
    }
  },

  /**
   * handle notification
   * @param {object} _this
   * @param {string} msg
   * @param {string} type
   * @param {string} title
   * @param {object} options
   */
  notification: function (_this, msg, type, title, options) {
    switch (type) {
      case 'success':
        _this.$toast.success(msg, title, options)
        break
      case 'error':
        _this.$toast.destroy()
        _this.$toast.error(msg, title, options)
        break
      default:
        _this.$toast.info(msg, title, options)
        break
    }
    return true
  },

  /**
   * regExp str
   * @param str
   * @param RegExp
   * @returns {boolean}
   */
  strRegExp: function (str, RegExp) {
    if (RegExp.test(str)) {
      return true
    }
    return false
  },

  /**
   * ignore str with special character
   * @param str
   * @returns {boolean}
   */
  specialCharacter: function (str) {
    let regEn = /\[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
    let regCn = /\[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
    if (this.strRegExp(str, regEn) || this.strRegExp(str, regCn)) {
      return true
    }
    return false
  },

  /**
   * get audio input devices
   * @param callBack
   */
  getAudioInputs: function (callBack) {
    let _this = this
    Manis.audioInputDevices(function (devices) {
      // console.log(devices)
      if (devices.errorCode === _this.noErr) {
        // _this.audioInputOptions = devices.response
        // _this.audioInputLevel = 0
        return callBack(devices.response)
      }
    })
  },

  /**
   * get video input devices
   * @param callBack
   */
  getVideoInputs: function (callBack) {
    let _this = this
    Manis.getVideoInputDevices(function (devices) {
      // console.log(devices)
      if (devices.errorCode === _this.noErr) {
        return callBack(devices.response)
      }
    })
  },

  /**
   * get audio output devices
   * @param callBack
   */
  getAudioOutputs: function (callBack) {
    let _this = this
    Manis.audioOutputDevices(function (devices) {
      // console.log(devices)
      if (devices.errorCode === _this.noErr) {
        return callBack(devices.response)
      }
    })
  },

  /**
   * 初始化配置
   * @param server
   * @param reset
   * @param callBack
   * @returns {boolean}
   */
  initServerConfig: function (server, callBack, reset) {
    if (window.serverPath && !reset) {
      if (callBack) {
        callBack('server is already set')
      }
      return true
    }
    Manis.initial({
      server: server,
      domain: server,
      type: 'conference',
      clientCode: '0402'
    }, res => {
      console.log(res)
      if (callBack) {
        callBack(res)
      }
    })
  },

  /**
   * sign in api and mss
   * @param {string} username
   * @param {string} password
   * @param {function} successCb
   * @param {function} errCb
   */
  autoLogin: function (username, password, successCb, errCb) {
    if (this.mssConnected()) {
      return true
    }
    Manis.signIn(
      username,
      password,
      '',
      res => {
        console.log(res)
        if (successCb) {
          successCb()
        }
      },
      err => {
        // console.error(err)
        if (errCb) {
          errCb(err)
        }
      },
      true
    )
  },

  /**
   * check is mss connected
   * @returns {boolean}
   */
  mssConnected: function () {
    if (window.connection && window.connection._ws.readyState === 1) {
      // connected
      return true
    }
    return false
  },

  /**
   * log out
   * @returns {boolean}
   */
  logOut: function () {
    if (this.mssConnected()) {
      Manis.signOut(res => {
        console.log(res)
      })
    }
    return true
  },

  /**
   * get login user profile
   * @param _this
   * @param finalCb
   * @returns {boolean}
   */
  getUserProfile: function (_this, finalCb) {
    if (!window.config.mUserId) {
      finalCb({error: 'user is not login'})
      return false
    }
    let profilePath = '/clientApi/users/'
    let host = _this.$store.state.serverSetting.serverAddr
    if (!host) {
      finalCb({error: 'server not set'})
      return false
    }
    let url = 'https://' + host + profilePath + window.config.mUserId.toUpperCase()
    _this.$http.get(url)
      .then(res => {
        finalCb(res)
      })
      .catch(err => {
        console.error(err)
        finalCb(err)
      })
  },

  /**
   * reset config
   * @returns {any}
   */
  resetConfig: function () {
    return JSON.parse('{"channelLastN":-1,"adaptiveLastN":false,"adaptiveSimulcast":false,"openSctp":true,"enableFirefoxHacks":false,"nat":"stun:124.202.164.3","focuser":null,"enableSimulcast":false,"focusUserJid":"focus@60.206.107.181","audioBandwidth":64,"videoBandwidth":1024,"enableRtpStats":true,"role":"NONE","nickname":null,"chromeExtensionUrl":"static/dist/Manis-Meetings-Chrome-Extension_v0.0.9.crx","chromeExtensionId":"lmmbdcmikgbfpgegokhgedahimdimcnh","desktopSharing":"ext","gw":null,"withModerator":false}')
  },

  /**
   * participant into room
   * @param room
   * @param pass
   * @param succ
   * @param err
   * @param stream
   * @returns {*}
   */
  participantIntoRoom: function (room, pass, succ, err, stream) {
    return Manis.joinConference(room, pass, succ, err, false, stream)
  },

  /**
   * join as anonymous
   * @param room
   * @param pass
   * @param nickname
   * @param succ
   * @param err
   * @param stream
   * @returns {*}
   */
  anonymousAttend: function (room, pass, nickname, succ, err, stream) {
    return Manis.joinByAnonymous(room, nickname, pass, false, succ, err, stream)
  },

  /**
   * handle someone attend to the room
   * @param callBack
   */
  onParticipate: function (callBack) {
    let _this = this
    if (_this.onVideoAttendEnv) {
      _this.onVideoAttendEnv = null
    }
    _this.onVideoAttendEnv = Manis.onJoinConference(function (videoRes) {
      if (videoRes.errorCode === _this.noErr) {
        callBack({
          type: 'video',
          data: videoRes.response
        })
      }
    })
    if (_this.onAudioAttendEnv) {
      _this.onAudioAttendEnv = null
    }
    _this.onAudioAttendEnv = Manis.participantAudioConnected(function (audioRes) {
      if (audioRes.errorCode === _this.noErr) {
        callBack({
          type: 'audio',
          data: audioRes.response
        })
      }
    })
  },

  /**
   * I am leave
   * @param callBack
   */
  leaveRoom: function (callBack) {
    let _this = this
    Manis.leaveConference(function (res) {
      console.log(res)
      if (res.errorCode === _this.noErr) {
        callBack(res)
      }
    })
  },

  /**
   * handle update local stream ssrc
   * @param callBack
   */
  onLocalSSRCUpdate: function (callBack) {
    let _this = this
    if (_this.localSSRCEnv) {
      _this.localSSRCEnv = null
    }
    _this.localSSRCEnv = Manis.updateLocalStreamSSRC((res) => {
      if (res.errorCode === _this.noErr) {
        console.log('local stream ssrc update to : ', res)
        callBack({
          endpoint: res.response.resource,
          ssrc: res.response.ssrc
        })
      }
    })
  },

  /**
   * handle someone left
   * @param callBack
   */
  onSomeoneLeft: function (callBack) {
    let _this = this
    if (_this.hendleLeaveEnv) {
      _this.hendleLeaveEnv = null
    }
    _this.hendleLeaveEnv = Manis.onLeaveConference(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res.response)
      }
    })
  },

  /**
   * handle source remove env
   * @param callBack
   */
  onSourceRemove: function (callBack) {
    let _this = this
    if (_this.hendleSourceRemoveEnv) {
      _this.hendleSourceRemoveEnv = null
    }
    _this.hendleSourceRemoveEnv = Manis.onStreamSourceRemoved(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res.response)
      }
    })
  },

  /**
   * register sort event listener
   * @param callBack
   */
  onSort: function (callBack) {
    let _this = this
    if (_this.showSortEnv) {
      _this.showSortEnv = null
    }
    _this.showSortEnv = Manis.onParticipantsSortChange(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res.response)
      }
    })
  },

  /**
   * get participant by endpoint and ssrc
   * @param resources
   * @param endpoint
   * @param ssrc
   * @returns {*}
   */
  getRightParticipant: function (resources, endpoint, ssrc) {
    let rightParticipant = resources.filter(function (item) {
      let ssrcRight = (item.stream.ssrc === ssrc) || false
      let endpointRight = (item.info.resource === endpoint) || false
      if (ssrcRight && endpointRight) {
        return item
      }
    })
    if (rightParticipant.length) {
      return rightParticipant[0]
    }
    return false
  },

  /**
   * remove participant by endpoint
   * @param sources
   * @param endpoint
   * @returns {*}
   */
  removeByEndpoint: function (sources, endpoint) {
    console.log('handle source remove from: ', sources, endpoint)
    for (let i = 0; i < sources.length; i++) {
      let obj = sources[i]
      if (obj && obj.info.resource === endpoint) {
        sources.splice(i, 1)
      }
    }
    return sources
  },

  /**
   * remove source by ssrc
   * @param sources
   * @param ssrc
   * @returns {*}
   */
  removeBySSRC: function (sources, ssrc) {
    console.log('handle source remove from: ', sources, JSON.stringify(sources), ' by ssrc: ', ssrc)
    for (let i = 0; i < sources.length; i++) {
      let obj = sources[i]
      if (obj && obj.stream.ssrc === ssrc) {
        sources.splice(i, 1)
      }
    }
    return sources
  },

  /**
   * update stream SSRC
   * @param obj
   * @param ssrc
   * @returns {*}
   */
  updateSSRC: function (obj, ssrc) {
    if (obj && obj.stream) {
      obj.stream.ssrc = ssrc
    }
    return obj
  },

  /**
   * update participant status
   * @param obj
   * @param val
   * @returns {*}
   */
  updateStatus: function (obj, val) {
    // console.log('will update participant status : ', obj, ' ----> ', val)
    if (obj) {
      if (val.nickname) {
        obj.info.nickname = val.nickname
        obj.is_phone = (val.nickname.indexOf('sip:68') === 0) || (val.nickname.indexOf('sip:69') === 0)
      }
      if (val.audio_muted !== undefined) {
        obj.audio_muted = val.audio_muted
      }
      if (val.is_moderator !== undefined) {
        obj.is_moderator = val.is_moderator
      }
      if (val.video_muted !== undefined) {
        obj.video_muted = val.video_muted
      }
      if (val.media_sources !== undefined) {
        obj.media_sources = val.media_sources
      }
      if (val.status !== undefined) {
        obj.status = val.status
      }
    }
    return obj
  },

  /**
   * update participant data
   * @param sources
   * @param endpoint
   * @param key
   * @param val
   * @returns {*}
   */
  updateParticipant: function (sources, endpoint, key, val) {
    let _this = this
    // console.log('will update ', endpoint, ':', key, ' to ', val, ' in ', sources)
    for (let i = 0; i < sources.length; i++) {
      let p = sources[i]
      if (p && p.info.resource === endpoint) {
        switch (key) {
          case 'ssrc':
            p = _this.updateSSRC(p, val)
            break
          case 'status':
            p = _this.updateStatus(p, val)
            break
        }
        sources.splice(i, 1, p)
      }
    }
    return sources
  },

  /**
   * handle participant status update
   * @param callBack
   */
  onStatus: function (callBack) {
    let _this = this
    if (_this.statusEnv) {
      _this.statusEnv = null
    }
    _this.statusEnv = Manis.onParticipantStatusUpdate(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res.response)
      }
    })
  },

  /**
   * send text msg
   * @param msg
   * @param receiver
   * @param callBack
   */
  sendTextMsg: function (msg, receiver, callBack) {
    let _this = this
    Manis.sendTextMessage(msg, receiver, function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res.response)
      }
    }, function (err) {
      console.error(err)
    })
  },

  /**
   * handle text msg
   * @param callBack
   */
  onTextMsg: function (callBack) {
    let _this = this
    if (_this.textEnv) {
      _this.textEnv = null
    }
    _this.textEnv = Manis.onTextMessage(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res.response)
      }
    })
  },

  /**
   * change audio input device
   * @param device
   * @param callBack
   */
  changeAudioInput: function (device, callBack) {
    let _this = this
    Manis.audioInputChange(device, function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      } else {
        console.error(res)
      }
    })
  },

  /**
   * change video input device
   * @param device
   * @param callBack
   */
  changeVideoInput: function (device, callBack) {
    let _this = this
    Manis.changeVideoInputDevice(device, function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res.response)
      } else {
        console.error(res)
      }
    })
  },

  /**
   * switch audio
   * @param status
   * @param callBack
   */
  changeAudioSwitch: function (status, callBack) {
    let _this = this
    Manis.audioToggleMute(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res.response)
      }
    }, function (err) {
      console.error('handle switch audio mute status failed: ', err)
    }, status)
  },

  /**
   * switch video
   * @param status
   * @param callBack
   */
  changeVideoSwitch: function (status, callBack) {
    let _this = this
    Manis.videoToggleMute(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res.response)
      }
    }, function (err) {
      console.error('handle switch video mute status failed: ', err)
    }, status)
  },

  /**
   * get room members
   * @param callBack
   */
  getParticipateMembers: function (callBack) {
    let _this = this
    Manis.memberList(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res.response)
      }
    })
  },

  /**
   * handle system error
   * @param callBack
   */
  handleSystemError: function (callBack) {
    let _this = this
    Manis.systemError(function (res) {
      if (res.errorCode === _this.unknownError) {
        callBack(res)
      }
    })
  },

  /**
   * attach stream
   * @param element
   * @param stream
   * @returns {boolean}
   */
  attachStream: function (element, stream) {
    if (element && stream && stream.id) {
      console.log('Will attach: ', stream, ' to element: ', element)
      element.autoplay = true
      element.srcObject = stream
    }
    return true
  },

  /**
   * replace local stream
   * @param streams
   * @param endpoint
   * @param stream
   * @returns {*}
   */
  replaceLocalStream: function (streams, endpoint, stream) {
    for (let i = 0; i < streams.length; i++) {
      let streamObject = streams[i]
      if (streamObject.info.resource === endpoint) {
        streamObject.stream = stream
        streams.splice(i, 1, streamObject)
      }
    }
    return streams
  },

  /**
   * get room type by room number
   * @param num
   * @returns {string}
   */
  getRoomType: function (num) {
    var language = window.localStorage.getItem('defaultLanguage') || 'zh'
    var roomNumber = num ? num.toString() : ''
    var typeStr = (language === 'zh') ? '即时会议' : 'Instant meeting'
    if (roomNumber.length >= 5) {
      var typeNum = roomNumber.substr(4, 1)
      switch (typeNum) {
        case '0':
          typeStr = (language === 'zh') ? '一次性会议' : 'One-off meeting'
          break
        case '1':
          typeStr = (language === 'zh') ? '周期会议' : 'Periodic Meeting'
          break
        case '2':
          typeStr = (language === 'zh') ? '即时会议' : 'Instant meeting'
          break
        case '3':
          typeStr = (language === 'zh') ? '固定会议' : 'Static meeting'
          break
      }
    }
    return typeStr
  },

  /**
   * get role
   * @param tag
   * @returns {string}
   */
  getRole: function (tag) {
    var language = window.localStorage.getItem('defaultLanguage') || 'zh'
    let str = (language === 'zh') ? '普通参会者' : 'Participant'
    if (tag) {
      str = (language === 'zh') ? '主持人' : 'Moderator'
    }
    return str
  },

  /**
   * grant moderator to someone
   * @param endpoint
   * @param callBack
   */
  grantModerator: function (endpoint, callBack) {
    let _this = this
    Manis.grantAdmin(endpoint, function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      }
    }, function (err) {
      console.error(err)
    })
  },

  /**
   * handle grant moderator
   * @param callBack
   */
  onGrantModerator: function (callBack) {
    let _this = this
    if (_this.onGrantAdminEnv) {
      _this.onGrantAdminEnv = null
    }
    _this.onGrantAdminEnv = Manis.onGrantAdmin(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      }
    })
  },

  /**
   * handle remove my admin right
   * @param callBack
   */
  onRemoveModerator: function (callBack) {
    let _this = this
    if (_this.onRemoveAdminEnv) {
      _this.onRemoveAdminEnv = null
    }
    _this.onRemoveAdminEnv = Manis.onRemoveAdmin(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      }
    })
  },

  /**
   * handle eject from room
   * @param callBack
   */
  onEject: function (callBack) {
    let _this = this
    if (_this.onEjectEnv) {
      _this.onEjectEnv = null
    }
    _this.onEjectEnv = Manis.onEject(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      }
    })
  },

  /**
   * eject someone
   * @param endpoint
   * @param callBack
   */
  ejectSomeone: function (endpoint, callBack) {
    let _this = this
    Manis.eject(endpoint, function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      }
    }, function (err) {
      console.error(err)
    })
  },

  /**
   * set someone audio status
   * @param endpoint
   * @param muteStatus
   * @param callBack
   */
  switchSomeoneAudioStatus: function (endpoint, muteStatus, callBack) {
    let _this = this
    Manis.setSomeoneAudioMute(endpoint, muteStatus, function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      }
    }, function (err) {
      console.error(err)
    })
  },

  /**
   * handle audio status be set
   * @param callBack
   */
  handleAudioStatusBeSet: function (callBack) {
    let _this = this
    if (_this.onAudioBeSetEnv) {
      _this.onAudioBeSetEnv = null
    }
    _this.onAudioBeSetEnv = Manis.onAudioMuteBeSet(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      }
    })
  },

  /**
   * set someone video status
   * @param endpoint
   * @param muteStatus
   * @param callBack
   */
  switchSomeoneVideoStatus: function (endpoint, muteStatus, callBack) {
    let _this = this
    Manis.setSomeoneVideoMute(endpoint, muteStatus, function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      }
    }, function (err) {
      console.error(err)
    })
  },

  /**
   * handle video status be set
   * @param callBack
   */
  handleVideoStatusBeSet: function (callBack) {
    let _this = this
    if (_this.onVideoBeSetEnv) {
      _this.onVideoBeSetEnv = null
    }
    _this.onVideoBeSetEnv = Manis.onVideoMuteBeSet(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      }
    })
  },

  /**
   * fetch admin right
   * @param password
   * @param successCb
   * @param failedCb
   */
  fetchAdminRight: function (password, successCb, failedCb) {
    let _this = this
    Manis.fetchAdmin(password, function (res) {
      if (res.errorCode === _this.noErr) {
        successCb(res)
      }
    }, function (err) {
      failedCb(err)
    })
  },

  /**
   * fetch right phone number
   * @param num
   * @param successCb
   * @param errorCb
   */
  fetchRightPhoneNum: function (num, successCb, errorCb) {
    let _this = this
    Manis.getRrightPhoneNumber(num, function (res) {
      if (res.errorCode === _this.noErr) {
        successCb(res)
      }
    }, function (err) {
      errorCb(err)
    })
  },

  /**
   * send client call
   * @param number
   * @param successCb
   * @param errorCb
   */
  sendClientCall: function (number, successCb, errorCb) {
    let _this = this
    Manis.callSip(number, function (res) {
      if (res.errorCode === _this.noErr) {
        successCb(res)
      }
    }, function (err) {
      errorCb(err)
    })
  },

  /**
   * cancel client call
   * @param number
   * @param callBack
   */
  cancelClientCall: function (number, callBack) {
    let _this = this
    Manis.cancelSipCall(number, function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      }
    }, function (err) {
      console.error(err)
    })
  },

  /**
   * start share screen
   * @param stream
   * @param callBack
   */
  startShareScreen: function (stream, callBack) {
    let _this = this
    if (!stream.oninactive) {
      stream.oninactive = function (e) {
        if (_this.shareWindowCloseEnv) {
          window.dispatchEvent(_this.shareWindowCloseEnv)
        }
      }
    }
    Manis.addSecondStreamToConnection(stream, function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      }
    })
  },

  /**
   *
   * @param callBack
   */
  onShareWindowClosed: function (callBack) {
    let _this = this
    if (!_this.shareWindowCloseEnv) {
      _this.shareWindowCloseEnv = new Event('shareWindowClosed')
      window.addEventListener('shareWindowClosed', function (e) {
        callBack(e)
      })
    }
  },

  /**
   * stop share screen
   * @param callBack
   */
  stopShareScreen: function (callBack) {
    let _this = this
    Manis.removeScreenSourceFromConnection(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      }
    })
  },

  /**
   * update recorder source config
   * @param apiServer
   * @param config
   * @param callBack
   */
  updateRecorderSource: function (apiServer, config, callBack) {
    let _this = this
    let url = 'https://' + apiServer +
      '/clientApi/conference/resources/' +
      '?roomNumber=' + config.r +
      '&userJid=' + window.connection.jid
    window.fetch(url, {
      headers: {
        'userJid': (window.connection ? (window.connection.jid || '') : ''),
        'token': (window.config ? (window.config.token || '') : '')
      }
    })
      .then(_this.checkStatus)
      .then(_this.parseJSON)
      .then(result => {
        if (result.mcode === 200) {
          window.config.record = result.obj.record
        }
        callBack(window.config.record)
      }).catch((failed) => {
        console.error(failed)
        callBack(window.config.record)
      })
  },

  /**
   * start record
   * @param apiServer
   * @param config
   * @param recordConfig
   * @param callBack
   */
  startRecord: function (apiServer, config, recordConfig, callBack) {
    let _this = this
    _this.recordRule = 'recording'
    let url = 'https://' + apiServer + '/clientApi/record/call/' +
      config.mUserId + '/' + config.r +
      '?sip=' + config.r + '&record=' + recordConfig +
      '&userId=' + config.mUserId + '&rule=' + _this.recordRule +
      '&roomPassword=' + (config.roomPassword || '') +
      '&userJid=' + window.connection.jid
    window.fetch(url, {
      headers: {
        'userJid': (window.connection ? (window.connection.jid || '') : ''),
        'token': (window.config ? (window.config.token || '') : '')
      }
    })
      .then(_this.checkStatus)
      .then(_this.parseJSON)
      .then((success) => {
        callBack(success)
      }).catch((error) => {
        console.error(error)
      })
  },

  /**
   * stop record
   * @param apiServer
   * @param config
   * @param recorder
   * @param callBack
   */
  stopRecord: function (apiServer, config, recorder, callBack) {
    let _this = this
    let url = 'https://' + apiServer +
      '/clientApi/record/close/' + config.mUserId + '/' + config.r +
      '?sip=' + config.r + '&recordJid=' + recorder +
      '&userJid=' + window.connection.jid
    window.fetch(url, {
      headers: {
        'userJid': (window.connection ? (window.connection.jid || '') : ''),
        'token': (window.config ? (window.config.token || '') : '')
      }
    })
      .then(_this.checkStatus)
      .then(_this.parseJSON)
      .then((success) => {
        console.log('handle stop recorder response: ', success)
        callBack(success)
      }).catch((error) => {
        console.error(error)
      })
  },

  /**
   * handle record status change
   * @param callBack
   */
  onRecordStatusChange: function (callBack) {
    let _this = this
    if (_this.recordStatusChangeEnv) {
      _this.recordStatusChangeEnv = null
    }
    _this.recordStatusChangeEnv = Manis.onRecordStatusChanged(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res.response)
      }
    })
  },

  /**
   * change main display block
   * @param jid
   * @param sharing
   * @param callBack
   */
  changeMainDisplay: function (jid, sharing, callBack) {
    let _this = this
    Manis.changeMainDisplayBlock(jid, sharing, function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      }
    })
  },

  /**
   * set display mode
   * @param mode
   * @param callBack
   */
  setDisplayMode: function (mode, callBack) {
    let _this = this
    Manis.changeDisplayMode(mode, function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      } else {
        console.error(res)
      }
    })
  },

  /**
   * sent display sort request
   * @param sortStr
   * @param callBack
   */
  sendSortRequest: function (sortStr, callBack) {
    let _this = this
    Manis.selectParticipantsDisplay(sortStr, function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      } else {
        console.error(res)
      }
    })
  },

  /**
   * send drawing msg
   * @param action
   * @param data
   * @param receiver
   * @param callBack
   */
  sendDrawingMsg: function (action, data, receiver, callBack) {
    let _this = this
    if (!window.connection) {
      console.log('not connect yes, ignore drawing')
      return false
    }
    if (!receiver && window.connection.emuc.myroomjid) {
      // send to room
      receiver = window.connection.emuc.myroomjid
    }
    Manis.sendAnnotation(action, data, receiver, function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      } else {
        console.error(res)
      }
    })
  },

  /**
   * handle muc user change
   * @param callBack
   */
  onMucUserChange: function (callBack) {
    let _this = this
    if (_this.mucUserChangeEnv) {
      _this.mucUserChangeEnv = null
    }
    _this.mucUserChangeEnv = Manis.onMucParticipantsChange(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res.response)
      }
    })
  },

  /**
   * handle annotation
   * @param callBack
   */
  onGetDelayDrawing: function (callBack) {
    let _this = this
    if (_this.delayDrawingMsgEnv) {
      _this.delayDrawingMsgEnv = null
    }
    _this.delayDrawingMsgEnv = Manis.onAnnotationGetInit(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res.response)
      }
    })
  },

  /**
   * handle delay drawing path msg
   * @param callBack
   */
  onDrawingMsg: function (callBack) {
    let _this = this
    if (_this.drawingMsgEnv) {
      _this.drawingMsgEnv = null
    }
    _this.drawingMsgEnv = Manis.onAnnotation(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      }
    })
  },

  /**
   * request delay drawing msg
   * @param receiver
   * @param callBack
   */
  requestDelayDrawing: function (receiver, callBack) {
    let _this = this
    Manis.responseAnnotation(receiver, function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      }
    })
  },

  /**
   * format conference type and status
   * @param conference
   * @returns {string}
   */
  formatConferenceStatus: function (conference) {
    var language = window.localStorage.getItem('defaultLanguage') || 'zh'
    if (conference.type === 'CTF1') {
      if (conference.status === 'MSD0') {
        return (language === 'zh') ? ' 进行中' : 'In progress'
      }
      return (language === 'zh') ? ' 固定会议' : 'Static Conference'
    }
    var state = conference.status
    var statusStr = (language === 'zh') ? ' 已结束' : 'Ended'
    switch (state) {
      case 'MSD0':
        statusStr = (language === 'zh') ? ' 进行中' : 'In progress'
        break
      case 'MSA0':
        statusStr = (language === 'zh') ? ' 预约成功' : 'Reservation successful'
        break
      default:
        statusStr = (language === 'zh') ? ' 已结束' : 'Ended'
    }
    return statusStr
  },

  /**
   * format data time
   * @param date
   * @param fmt
   * @returns {*}
   */
  doFormatDate: function (date, fmt) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str))
      }
    }
    return fmt
  },

  /**
   * format timestamp
   * @param timestamp
   * @returns {*}
   */
  formatTimestamp: function (timestamp) {
    var newDate = new Date()
    newDate.setTime(timestamp)
    let timeStamp = this.doFormatDate(newDate, 'yyyy-MM-dd hh:mm')
    return timeStamp
  },

  /**
   * format repeat type
   * @param type
   * @returns {string}
   */
  repeatType: function (type) {
    var language = window.localStorage.getItem('defaultLanguage') || 'zh'
    var str = (language === 'zh') ? '每天重复' : 'Repeat everyday'
    switch (type) {
      case 1:
        str = (language === 'zh') ? '每周重复' : 'Repeat every week'
        break
      case 2:
        str = (language === 'zh') ? '每月重复' : 'Repeat on a monthly basis'
        break
      default:
        str = (language === 'zh') ? '每天重复' : 'Repeat everyday'
    }
    return str
  },

  /**
   * pad left zero
   * @param str
   * @returns {string}
   */
  padLeftZero: function (str) {
    return ('00' + str).substr(str.length)
  },

  /**
   * format nickname
   * @param str
   * @param maxLength
   * @param appendStr
   * @returns {string}
   */
  formatNickname: function (str, maxLength, appendStr) {
    if (!str) {
      return ''
    }
    if (str.indexOf('sip:68') > -1 || str.indexOf('sip:69') > -1) {
      str = str.replace('sip:68', 'tel:')
      str = str.replace('sip:69', 'tel:')
    }
    maxLength = maxLength > 0 ? maxLength : 9
    appendStr = appendStr || (str.length > maxLength ? '...' : '')
    var returnStr = str.toString().substring(0, maxLength) + appendStr
    return returnStr
  },

  /**
   * find operator from participants
   * @param participants
   * @returns {*}
   */
  findOperator: function (participants) {
    var operator = null
    for (var i = 0; i < participants.length; i++) {
      var participant = participants[i]
      if (participant.owner === 'CRUO') {
        operator = participant
      }
    }
    return operator ? operator.userName : '无'
  },

  /**
   * calculate conference duration
   * @param seconds
   * @returns {number}
   */
  calculateDuration: function (seconds) {
    let minutes = parseInt(seconds) / 60
    return Math.floor(minutes)
  },

  /**
   * format conference type
   * @param conference
   * @returns {string}
   */
  formatConferenceType: function (conference) {
    var language = window.localStorage.getItem('defaultLanguage') || 'zh'
    if (conference.type === 'CTF1') {
      return language === 'zh' ? '固定会议' : 'Static meeting'
    }
    if (conference.cycle === 1) {
      var endTime = this.formatTimestamp(conference.cycleEndDay)
      var repeatStr = this.repeatType(conference.cycleDmy)
      var returnStr = (language === 'zh') ? (endTime + ' 前' + repeatStr) : (repeatStr + 'Before' + endTime)
      return returnStr
    } else {
      return language === 'zh' ? '一次性会议' : 'One-off meeting'
    }
  },

  /**
   * get my private room information
   * @param apiServer
   * @param config
   * @param callBack
   */
  getPrivateRoom: function (apiServer, config, callBack) {
    let _this = this
    let userId = (config && config.mUserId !== undefined) ? (config.mUserId.toUpperCase()) : ''
    if (!userId) {
      return false
    }
    let url = 'https://' + apiServer +
      '/clientApi/users/' + userId
    window.fetch(url, {
      headers: {
        'userJid': (window.connection ? (window.connection.jid || '') : ''),
        'token': (window.config ? (window.config.token || '') : '')
      }
    })
      .then(_this.checkStatus)
      .then(_this.parseJSON)
      .then(result => {
        if (result.mcode === 200) {
          callBack(result)
        }
      }).catch((failed) => {
        console.error(failed)
        callBack(failed)
      })
  },

  /**
   * set all room audio mute switch
   * @param status
   * @param callBack
   */
  switchAllAudioMute: function (status, callBack) {
    let _this = this
    Manis.setRoomAudioMute(status, function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      } else {
        console.error(res)
      }
    })
  },

  /**
   * refresh verify image
   * @param apiServer
   * @param config
   * @param callBack
   */
  refreshVerifyImage: function (apiServer, config, callBack) {
    let _this = this
    let url = 'https://' + apiServer +
      '/clientApi/verifyCode?domain=' + apiServer +
      '&ticket=' + config.ticket
    window.fetch(url, {
      // headers: {
      // 'userJid': (window.connection ? (window.connection.jid || '') : ''),
      // 'token': (window.config ? (window.config.token || '') : '')
      // }
    })
      .then(_this.checkStatus)
      .then(_this.parseJSON)
      .then(result => {
        if (result.mcode === 200) {
          callBack(result)
        }
      }).catch((failed) => {
        console.error(failed)
      })
  },

  /**
   * api sign in admin server
   * @param {string} server
   * @param {object} params
   * @param {function} successCb
   * @param {function} errorCb
   */
  apiSignIn: function (server, params, successCb, errorCb) {
    let _this = this
    let url = 'https://' + server + '/clientApi/loginClient'
    let data = new FormData()
    data.append('username', params.username)
    data.append('password', encodeURI(Manis.encryptString(params.password)))
    data.append('domain', server)
    data.append('remark', window.navigator.userAgent)
    data.append('ticket', window.config.ticket)
    data.append('verifyCode', params.verifyCode)
    data.append('clientType', params.clientCode)
    data.append('language', 'zh')
    console.log('will send post request with data ', data)
    window.fetch(url, {
      method: 'POST',
      // headers: {
      // 'userJid': (window.connection ? (window.connection.jid || '') : ''),
      // 'token': (window.config ? (window.config.token || '') : '')
      // },
      body: data
    }).then(_this.checkStatus)
      .then(_this.parseJSON)
      .then(res => {
        successCb(res)
      }).catch(err => {
        errorCb(err)
      })
  },

  /**
   * sign in message server
   * @param {string} nickname
   * @param {function} successCb
   * @param {function} errorCb
   */
  mssSingIn: function (nickname, successCb, errorCb) {
    let _this = this
    if (_this.mssConnected()) {
      // console.warn('--------mssConnected--------')
      successCb()
      return true
    }
    Manis.signInMessageServer(
      nickname,
      res => {
        if (res.errorCode === _this.noErr) {
          successCb(res)
        } else {
          errorCb(res)
        }
      },
      err => {
        errorCb(err)
      }
    )
  },

  /**
   * change resolution
   * @param {string} resolution
   * @param {function} callBack
   */
  changeResolution: function (resolution, callBack) {
    let _this = this
    Manis.changeResolution(
      resolution.toString(),
      res => {
        if (res.errorCode === _this.noErr) {
          callBack(res.response)
        } else {
          console.error(res)
        }
      }
    )
  },

  /**
   * set video bandwith with resolution
   * @param {string} resolution
   * @param {function} callBack
   */
  changeVideoBandwidth: function (resolution, callBack) {
    let _this = this
    try {
      Manis.setVideoBandwidth(
        resolution,
        res => {
          if (res.errorCode === _this.noErr) {
            callBack(res)
          } else {
            console.error(res)
          }
        }
      )
    } catch (error) {
      console.error(error)
    }
  },

  /**
   * sensitive words check
   * @param {string} words
   * @param {function} callBack
   */
  sensitiveWordsCheck: function (words, callBack) {
    let _this = this
    Manis.sensitiveCheck(
      words,
      res => {
        if (res.errorCode === _this.noErr) {
          callBack(true)
        } else {
          callBack(false)
        }
      }
    )
  },

  /**
   * check left guy is moderator
   * @param resources
   * @param endpoint
   * @param callBack
   */
  isModeratorLeft: function (resources, endpoint, callBack) {
    for (let i = 0; i < resources.length; i++) {
      let item = resources[i]
      if (item && item.info && item.info.resource === endpoint) {
        if (item.is_moderator) {
          callBack(true)
          return false
        }
      }
    }
  },

  /**
   * clear before signed user
   * @param _this
   */
  clearSignInUserInfo: function (_this) {
    if (!_this || !_this.$store || !_this.$router) {
      // console.warn('------_thisIsNotRightAtClearSignInUserInfo------', _this)
      return false
    }
    if (_this.signInForm) {
      _this.signInForm.username = ''
      _this.signInForm.password = ''
      _this.signInForm.rememberMe = false
    }
    _this.$store.dispatch('userSetting/updateRememberMe', false)
    _this.$store.dispatch('userSetting/clearUser')
    _this.$router.push({ name: 'v2-login' })
  },

  /**
   * add stream into connection
   * @param stream
   * @param callBack
   */
  addStreamIntoConnection: function (stream, callBack) {
    let _this = this
    Manis.addSecondStreamToConnection(stream, function (res) {
      if (res.errorCode === _this.noErr) {
        if (callBack && typeof callBack === 'function') {
          callBack(res)
        }
      } else {
        // console.error('-----failedToAddStreamIntoConnection----', res)
      }
    })
  },

  /**
   * get my friends
   * @param apiServer
   * @param callBack
   * @param userId
   * @param keywords
   */
  getContacts: function (apiServer, callBack, userId, keywords) {
    let _this = this
    let url = 'https://' + apiServer +
      '/clientApi/friends/' + window.config.mUserId
    window.fetch(url, {
      headers: {
        'userJid': (window.connection ? (window.connection.jid || '') : ''),
        'token': (window.config ? (window.config.token || '') : '')
      }
    })
      .then(_this.checkStatus)
      .then(_this.parseJSON)
      .then(result => {
        if (result.mcode === 200) {
          return callBack(result.obj)
        }
        console.warn('fetch my friends failed: ', result)
      }).catch((failed) => {
        console.error(failed)
      })
  },

  /**
   * search for available friends
   * @param apiServer
   * @param callBack
   * @param keywords
   */
  searchAvailableFriends: function (apiServer, callBack, keywords) {
    let _this = this
    let url = 'https://' + apiServer +
      '/clientApi/selectFriends/' + window.config.mUserId
    if (keywords) {
      url += '?search=' + keywords
    }
    window.fetch(url, {
      headers: {
        'userJid': (window.connection ? (window.connection.jid || '') : ''),
        'token': (window.config ? (window.config.token || '') : '')
      }
    })
      .then(_this.checkStatus)
      .then(_this.parseJSON)
      .then(result => {
        if (result.mcode === 200) {
          return callBack(result.obj)
        }
        console.warn('fetch my friends failed: ', result)
      }).catch((failed) => {
        console.error(failed)
      })
  },

  /**
   * add or update friend
   * @param apiServer
   * @param friendId
   * @param nickname
   * @param callBack
   */
  saveFriend: function (apiServer, friendId, nickname, callBack) {
    let _this = this
    let url = 'https://' + apiServer +
      '/clientApi/friends/' + window.config.mUserId + '/' + friendId
    window.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'userJid': (window.connection ? (window.connection.jid || '') : ''),
        'token': (window.config ? (window.config.token || '') : '')
      },
      body: JSON.stringify({
        nickname: nickname
      })
    })
      .then(_this.checkStatus)
      .then(_this.parseJSON)
      .then(result => {
        if (result.mcode === 200) {
          return callBack(result)
        }
        console.warn('add friend failed: ', result)
      }).catch((failed) => {
        console.error(failed)
      })
  },

  /**
   * delete friend
   * @param apiServer
   * @param friendId
   * @param callBack
   */
  deleteFriend: function (apiServer, friendId, callBack) {
    let _this = this
    let url = 'https://' + apiServer +
      '/clientApi/friends/' + window.config.mUserId + '/' + friendId
    window.fetch(url, {
      method: 'DELETE',
      headers: {
        'userJid': (window.connection ? (window.connection.jid || '') : ''),
        'token': (window.config ? (window.config.token || '') : '')
      }
    })
      .then(_this.checkStatus)
      .then(_this.parseJSON)
      .then(result => {
        if (result.mcode === 200) {
          return callBack(result)
        }
        console.warn('add friend failed: ', result)
      }).catch((failed) => {
        console.error(failed)
      })
  },

  /**
   * send invite to some one
   * @param receiver
   * @param room
   * @param pass
   * @param type
   * @param callBack
   */
  sendInvite: function (receiver, room, pass, type, callBack) {
    let _this = this
    Manis.ringUp(
      receiver,
      room,
      pass,
      success => {
        if (success.errorCode === _this.noErr) {
          return callBack(success)
        }
        console.warn('send invite failed: ', success)
      },
      error => {
        console.error('send invite in error: ', error)
      },
      type
    )
  },

  /**
   * handle invite
   * @param callBack
   */
  onInvite: function (callBack) {
    let _this = this
    if (_this.inviteEnv) {
      _this.inviteEnv = null
    }
    _this.inviteEnv = Manis.onRingUp(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res.response)
      }
    })
  },

  /**
   * response invite
   * @param room
   * @param action
   * @param inviter
   * @param callBack
   * @param isCancel
   */
  responseInvite: function (room, action, inviter, callBack, isCancel) {
    let _this = this
    Manis.responseRingUp(
      room,
      '',
      (action === 'accept'),
      inviter,
      res => {
        if (res.errorCode === _this.noErr) {
          _this.broadcastInviteBeMake()
          return callBack(res)
        }
        console.error(res)
      },
      isCancel
    )
  },

  /**
   * broadcast invite has been make
   */
  broadcastInviteBeMake: function () {
    let _this = this
    Manis.sendRingCallProcessed(res => {
      if (res.errorCode === _this.noErr) {
        return console.log(res)
      }
      return console.error(res)
    })
  },

  /**
   * handle invite be make by other, hide ring toast
   * @param callBack
   */
  handleInviteBeMake: function (callBack) {
    let _this = this
    if (_this.inviteBeMakeEnv) {
      _this.inviteBeMakeEnv = null
    }
    _this.inviteBeMakeEnv = Manis.onRingCallProcessed(function (res) {
      if (res.errorCode === _this.noErr) {
        if (window.incomingCall) {
          window.incomingCall = false
        }
        callBack(res)
      }
    })
  },

  /**
   * handle invite response
   * @param callBack
   */
  onInviteResponse: function (callBack) {
    let _this = this
    if (_this.inviteResponseEnv) {
      _this.inviteResponseEnv = null
    }
    _this.inviteResponseEnv = Manis.onRingUpResponse(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res.response)
      }
    })
  },

  /**
   * notice accepter room is ready
   * @param inviteAccepter
   * @param room
   * @param pass
   * @param callBack
   */
  noticeRoomReady: function (inviteAccepter, room, pass, callBack) {
    let _this = this
    Manis.sendRoomComplete(
      inviteAccepter,
      room,
      pass,
      res => {
        if (res.errorCode === _this.noErr) {
          return callBack(res)
        }
        return console.error(res)
      }
    )
  },

  /**
   * handle room ready event
   * @param callBack
   */
  onRoomReadyNotice: function (callBack) {
    let _this = this
    if (_this.roomReadyEnv) {
      _this.roomReadyEnv = null
    }
    _this.roomReadyEnv = Manis.onRoomComplete(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res.response)
      }
    })
  },

  /**
   * handle user sign in other places
   * @param callBack
   */
  onSignInSomewhereElse: function (callBack) {
    let _this = this
    if (_this.signInSomewhereElseEnv) {
      _this.signInSomewhereElseEnv = null
    }
    _this.signInSomewhereElseEnv = Manis.onEjectByOtherLogin(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res)
      }
    })
  },

  /**
   * ignore special characters
   * @param str
   * @returns {boolean}
   */
  ignoreSpecialCharacter: function (str) {
    let regEn = /[`~!@#$%^&*()_+<>?:"{},./;'[\]]/im
    let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
    if (regEn.test(str) || regCn.test(str)) {
      return false
    }
    return true
  },

  /**
   * search user by username or email
   * @param apiServer
   * @param queryStr
   * @param callBack
   */
  searchUsers: function (apiServer, queryStr, callBack) {
    let _this = this
    let url = 'https://' + apiServer +
      '/clientApi/participants/' +
      window.manisConfg.mUserId + '?search=' + queryStr
    window.fetch(url, {
      headers: {
        'userJid': (window.connection ? (window.connection.jid || '') : ''),
        'token': (window.config ? (window.config.token || '') : '')
      }
    })
      .then(_this.checkStatus)
      .then(_this.parseJSON)
      .then(result => {
        callBack(result)
      }).catch((failed) => {
        console.error(failed)
      })
  },

  /**
   * submit reservation
   * @param apiServer
   * @param data
   * @param callBack
   */
  submitReservation: function (apiServer, data, callBack) {
    let _this = this
    let url = 'https://' + apiServer +
      '/clientApi/conferences/' +
      window.manisConfg.mUserId.toUpperCase()
    window.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'userJid': (window.connection ? (window.connection.jid || '') : ''),
        'token': (window.config ? (window.config.token || '') : '')
      },
      body: data
    })
      .then(_this.checkStatus)
      .then(_this.parseJSON)
      .then(result => {
        callBack(result)
      }).catch((failed) => {
        console.error(failed)
      })
  },

  /**
   * handle moderator exist status change
   * @param callBack
   */
  onModeratorExistChange: function (callBack) {
    let _this = this
    if (_this.moderatorExistEnv) {
      _this.moderatorExistEnv = null
    }
    _this.moderatorExistEnv = Manis.onWithModeratorChanged(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res.response)
      }
    })
  },

  /**
   * 会议倒计时通知
   * @param callBack
   */
  onRoomWillCountDwon: function (callBack) {
    let _this = this
    if (_this.willCountDownEnv) {
      _this.willCountDownEnv = null
    }
    _this.willCountDownEnv = Manis.onRoomCountdown(function (res) {
      if (res.errorCode === _this.noErr) {
        callBack(res.response)
      }
    })
  },

  /**
   *  会议延时
   * @param minutes
   * @param callBack
   */
  delayRoom: function (minutes, callBack) {
    let _this = this
    Manis.delayRoom(minutes, function (res) {
      if (res.errorCode === _this.noErr) {
        return callBack(res)
      }
      console.error('delay room failed ', res)
    })
  },

  /**
   * send call request to admin
   * @param _server
   * @param _room
   * @param _pwd
   * @param _num
   * @param _type
   * @param _client
   * @param _nickname
   * @param _cb
   */
  doClientCall: function (_server, _room, _pwd, _num, _type, _client, _nickname, _cb) {
    let _this = this
    let url = 'https://' + _server +
      '/clientApi/conference/call?' +
      'type=' + _type +
      '&callType=' + _client +
      '&number=' + _num +
      '&roomNumber=' + _room +
      '&roomPwd=' + _pwd +
      '&nickname=' + _nickname
    window.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'userJid': (window.connection ? (window.connection.jid || '') : ''),
        'token': (window.config ? (window.config.token || '') : '')
      }
    })
      .then(_this.checkStatus)
      .then(_this.parseJSON)
      .then(result => {
        _cb(result)
      }).catch((failed) => {
        console.error(failed)
      })
  },

  /**
   * DTMF
   * @param _server
   * @param _item
   * @param _code
   * @param _cb
   * @returns {boolean}
   */
  sendDTMF: function (_server, _item, _code, _cb) {
    if (!_item.jid || _item.jid.indexOf('gateway') < 0) {
      console.warn('DTMF item is not gateway, ignore : ', _item)
      return false
    }
    let _this = this
    let params = 'gatewayJid=' + _item.jid +
      '&pin=' + (_code === '#' ? window.encodeURIComponent(_code) : _code)

    let url = 'https://' + _server +
      '/clientApi/conference/call/pin?' + params
    window.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'userJid': (window.connection ? (window.connection.jid || '') : ''),
        'token': (window.config ? (window.config.token || '') : '')
      }
    })
      .then(_this.checkStatus)
      .then(_this.parseJSON)
      .then(result => {
        _cb(result)
      }).catch((failed) => {
        console.error(failed)
      })
  }

}
