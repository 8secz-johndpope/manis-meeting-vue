<template>
  <div class="wrapper">
    <el-container>
      <div class="main-container">
        <el-container :class="['top-control-container', {'show': (showAdminRight || showMembers || showTextMsg || showDeviceSetting)}]">
          <top-controls
            :screenShareStatus="screenSharing"
            :drawingStatus="drawingDialogVisible"
            :showAdminRight="showAdminRight"
            :showMembers="showMembers"
            :showTextMsg="showTextMsg"
            :showDeviceSetting="showDeviceSetting"
            :unreadMsg="unreadMsg"
            :audioTakeover="audioTakeover"
            :videoTakeover="videoTakeover"
            v-on:leaveRoom="leaveRoom"
            v-on:switchRoomMembers="switchRoomMembers"
            v-on:switchTextMsg="switchTextMsg"
            v-on:switchDeviceSetting="switchDeviceSetting"
            v-on:switchAdminRightManage="switchAdminRightManage"
            v-on:closeSideBar="closeSideBar"
            v-on:switchScreenShare="switchScreenShare"
            v-on:stopShareScreen="stopShareScreen"
            v-on:setLocalAudioMuteStatus="setLocalAudioStatus"
            v-on:setLocalVideoMuteStatus="setLocalVideoStatus"
          ></top-controls>
        </el-container>
        <el-container class="surround-container" v-show="displayMode === '0'">
          <surround-mode
            :localVideo="localStream"
            :screenSharing="screenSharing"
            v-on:hideAsideContainer="hideAsideContainer"
          ></surround-mode>
        </el-container>
        <el-container class="spread-container"  v-show="displayMode === '5'">
          <spread-mode
            :localVideo="localStream"
            :screenSharing="screenSharing"
            v-on:hideAsideContainer="hideAsideContainer"
          ></spread-mode>
        </el-container>
        <el-container class="room-password-container">
          <room-password
            :dialogVisible="roomPassDialogVisible"
            v-on:roomPasswordConfirm="passwordConfirm"
          ></room-password>
        </el-container>
        <el-aside :class="['aside-container hidden', {'show': (showMembers||showTextMsg||showDeviceSetting||showAdminRight)}]">
          <room-members
            :class="['hidden', {'show': showMembers}]"
            :members="members"
            :nickname="nickname"
            :screenSharing="screenSharing"
            :isModerator="isModerator"
          ></room-members>
          <text-chat :class="['hidden', {'show': showTextMsg}]" ref="text-chat"></text-chat>
          <device-setting :class="['hidden', {'show': showDeviceSetting}]"></device-setting>
          <admin-right
            :screenShareStatus="screenSharing"
            :class="['hidden', {'show': showAdminRight}]"
            v-on:switchDrawingBoard="switchDrawingBoard"
          ></admin-right>
        </el-aside>
        <audio-page></audio-page>
        <el-container>
          <el-dialog
            title="请选择需要分享的窗口"
            :visible.sync="captureDialogVisible"
            :modal="false"
            width="320px"
            :show-close="true"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            center>
            <desktop-capture
              v-show="captureDialogVisible"
              :getSource="captureDialogVisible"
              v-on:startShareScreen="startShareScreen"
            ></desktop-capture>
          </el-dialog>
        </el-container>
        <el-container class="drawing-board-container">
          <el-dialog
            title="画图板"
            top="0px"
            width="100%"
            custom-class="drawing-board-dialog"
            :modal="false"
            :show-close="false"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :visible.sync="drawingDialogVisible">
            <drawing-board
              v-if="drawingDialogVisible"
              :opened="drawingDialogVisible"
              v-on:switchDrawingBoard="switchDrawingBoard"
            ></drawing-board>
          </el-dialog>
        </el-container>
        <el-container class="annotation-container">
          <annotation ref="annotationComponent"></annotation>
        </el-container>
      </div>
    </el-container>
  </div>
</template>

<script>
import Utils from '../../utils/utils'
import TopControls from './TopControls'
import RoomPassword from './RoomPassword'
import SurroundMode from './SurroundMode'
import SpreadMode from './SpreadMode'
import RoomMembers from './RoomMembers'
import TextChat from './TextChat'
import DeviceSetting from './DeviceSetting'
import AdminRight from './AdminRight'
import AudioPage from './AudioPage'
import DesktopCapture from '../ShareApps/DesktopCapturer'
import DrawingBoard from '../ShareApps/DrawingBrand'
import Annotation from '../ShareApps/Annotation'

export default {
  name: 'meeting-index-page',
  components: {
    TopControls,
    RoomPassword,
    SurroundMode,
    SpreadMode,
    RoomMembers,
    TextChat,
    DeviceSetting,
    AdminRight,
    AudioPage,
    DesktopCapture,
    DrawingBoard,
    Annotation
  },
  data: function () {
    return {
      nickname: '',
      localStream: null,
      audioIn: null,
      videoIn: null,
      audioTakeover: false,
      videoTakeover: false,
      loader: null,
      loadingFullPage: true,
      roomPass: '',
      roomPassDialogVisible: false,
      showMembers: false,
      showTextMsg: false,
      showDeviceSetting: false,
      showAdminRight: false,
      members: [],
      captureDialogVisible: false,
      drawingDialogVisible: false,
      screenSharing: false,
      unreadMsg: false,
      recorders: {}
    }
  },
  methods: {
    hideAsideContainer: function () {
      this.showMembers = false
      this.showDeviceSetting = false
      this.showAdminRight = false
      this.showTextMsg = false
    },
    switchDrawingBoard: function (status) {
      this.drawingDialogVisible = status
      this.hideAsideContainer()
    },
    stopShareScreen: function () {
      let _this = this
      Utils.stopShareScreen(function (res) {
        console.log('handle stop share screen: ', res)
        _this.screenSharing = false
      })
    },

    startShareScreen: function () {
      this.screenSharing = true
      this.captureDialogVisible = !this.captureDialogVisible
    },

    switchScreenShare: function () {
      this.captureDialogVisible = !this.captureDialogVisible
    },

    switchRoomMembers: function (members) {
      this.members = members
      this.showTextMsg = false
      this.showDeviceSetting = false
      this.showAdminRight = false
      this.showMembers = true
    },

    switchTextMsg: function () {
      this.showMembers = false
      this.showDeviceSetting = false
      this.showAdminRight = false
      this.showTextMsg = true
      this.unreadMsg = false
    },

    switchDeviceSetting: function () {
      this.showTextMsg = false
      this.showMembers = false
      this.showAdminRight = false
      this.showDeviceSetting = true
    },

    switchAdminRightManage: function () {
      this.showTextMsg = false
      this.showMembers = false
      this.showDeviceSetting = false
      this.showAdminRight = true
    },

    closeSideBar: function () {
      this.showTextMsg = false
      this.showMembers = false
      this.showDeviceSetting = false
      this.showAdminRight = false
    },

    passwordConfirm: function (pass) {
      this.roomPassDialogVisible = false
      this.roomPass = pass
      console.log('room password input : ', this.roomPass)
      this.participantRoom()
    },

    onCancel: function () {
      console.log('User cancelled the loader.')
    },

    getStoreDevice: function () {
      let audioIn = this.$store.state.deviceSetting.audioIn
      let videoIn = this.$store.state.deviceSetting.videoIn
      this.audioIn = audioIn || 'default'
      this.videoIn = videoIn || 'default'
    },

    clearLocalStream: function () {
      let _this = this
      if (_this.localStream) {
        _this.localStream.getTracks().forEach(function (track) {
          track.stop()
        })
      }
    },

    participantRoom: function () {
      let _this = this
      let roomNumber = _this.$route.params.roomNumber || ''
      if (!roomNumber) {
        return _this.$router.push({name: 'v2-participate'})
      }
      let participateMode = _this.$route.params.mode || 'anonymous'
      let passCode = _this.roomPass || _this.$route.params.code
      _this.roomPass = passCode
      if (participateMode === 'anonymous') {
        // join as anonymous
        _this.anonymousParticipant(roomNumber)
      } else {
        _this.doParticipant(roomNumber)
      }
    },

    getLocalStream: function (audioInput, videoInput, resolution) {
      let _this = this
      _this.clearLocalStream()
      if (!videoInput) {
        return
      }
      let videoResolution = resolution || '1080'
      let constraints = Utils.generateConstraints((audioInput !== undefined), (videoInput !== undefined), audioInput, videoInput, videoResolution)
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
          try {
            _this.localStream = stream
            // let previewVideo = document.querySelector('#local-video')
            // if (previewVideo) {
            //   previewVideo.srcObject = stream
            // }
            console.log('got local media stream success with constraints: ', constraints)
            _this.participantRoom()
          } catch (e) {
            console.error(e)
          }
        }).catch(function (error) {
          if (error.name === 'DevicesNotFoundError' || error.constructor.name === 'DevicesNotFoundError') {
            Utils.notification(_this, '没有找到可用的视频输入设备', 'error')
          } else if (error.name === 'OverconstrainedError' || error.constructor.name === 'OverconstrainedError') {
            if (constraints.video) {
              console.log('over constrained error, try lower ', constraints.video)
              if (constraints.video.height.exact > 180) {
                let resolution = '180'
                switch (constraints.video.height.exact) {
                  case 1080:
                    resolution = '720'
                    break
                  case 720:
                    resolution = '768'
                    break
                  case 768:
                    resolution = '540'
                    break
                  case 540:
                    resolution = '480'
                    break
                  case 480:
                    resolution = '240'
                    break
                  default:
                    resolution = '180'
                    break
                }
                _this.getLocalStream(audioInput, videoInput, resolution)
              } else {
                Utils.notification(_this, '获取本地视频失败,未能成功接入本地视频', 'error')
              }
            }
          } else {
            Utils.notification(_this, '获取本地视频失败,请检查设备是否可用', 'error')
          }
        })
    },

    anonymousParticipant: function (room) {
      let _this = this
      let nickname = _this.$store.state.serverSetting.nickname
      _this.nickname = nickname
      console.log('will anonymous participant room:  ', room, nickname)
      _this.loadingShow()
      Utils.anonymousAttend(
        room,
        _this.roomPass,
        nickname,
        res => {
          _this.loadingHide()
          console.log(res)
          try {
            if (res.errorCode === '000000') {
              let isModerator = res.response.is_moderator || false
              _this.$store.dispatch('conferenceRoom/updateControlStatus', isModerator)
            }
            _this.handleParticipate({type: 'video', data: res.response})
            _this.registerEnvHandler()
          } catch (e) {
            console.error('XXXXXXXXXXXXXXXXXXXX', e)
          }
        },
        err => {
          // console.error(err)
          _this.loadingHide()
          if (err.errorCode === '300300') {
            // room password require
            Utils.notification(_this, '请输入正确的房间口令', 'error')
            _this.roomPassDialogVisible = true
          } else if (err.errorCode === '300204') {
            // connect lost, redirect to login page
            Utils.notification(_this, '服务连接已断开,请稍后重试', 'error')
            _this.clearLocalStream()
            _this.$router.push({name: 'v2-login'})
          } else {
            console.log(err)
            let msg = _this.getAttendFailedReason(err)
            Utils.notification(_this, msg, 'error')
            _this.clearLocalStream()
            _this.$router.push({name: 'v2-participate'})
          }
        },
        _this.localStream
      )
    },

    doParticipant: function (room) {
      console.log('will do participant room:  ', room)
      let _this = this
      _this.loadingShow()
      Utils.participantRoom(
        room,
        _this.roomPass,
        res => {
          _this.loadingHide()
          console.log(res)
          if (res.errorCode === '000000') {
            let isModerator = res.response.is_moderator || false
            _this.nickname = res.response.info.nickname || ''
            _this.$store.dispatch('conferenceRoom/updateControlStatus', isModerator)
          }
          _this.handleParticipate({type: 'video', data: res.response})
          _this.registerEnvHandler()
        },
        err => {
          // console.error(err)
          _this.loadingHide()
          if (err.errorCode === '300300') {
            // room password require
            Utils.notification(_this, '房间口令错误', 'error')
            _this.roomPassDialogVisible = true
          } else if (err.errorCode === '300204') {
            // connect lost, redirect to login page
            Utils.notification(_this, '服务连接已断开,请稍后重试', 'error')
            _this.clearLocalStream()
            _this.$router.push({name: 'v2-login'})
          } else {
            console.log(err)
            let msg = _this.getAttendFailedReason(err)
            Utils.notification(_this, msg, 'error')
            _this.clearLocalStream()
            _this.$router.push({name: 'v2-participate'})
          }
        },
        _this.localStream
      )
    },

    getAttendFailedReason: function (res) {
      let msg
      switch (res.errorCode) {
        case '300302':
          msg = '会议室房间已经锁定'
          break
        case '300305':
          msg = '会议尚未开始,请在会议开始前15分钟内入场'
          break
        default:
          msg = '房间不存在或进入房间失败'
      }
      return msg
    },

    setLocalAudioStatus: function (status, cb) {
      let _this = this
      Utils.changeAudioSwitch(status, function (res) {
        console.log('handle switch audio mute res', res)
        _this.$store.dispatch('conferenceRoom/updateAudioStatus', res)
        if (cb && typeof (cb) === 'function') {
          cb(res)
        }
      })
    },

    setLocalVideoStatus: function (status, cb) {
      let _this = this
      Utils.changeVideoSwitch(status, function (res) {
        console.log('handle switch video mute res', res)
        _this.$store.dispatch('conferenceRoom/updateVideoStatus', res)
        if (cb && typeof (cb) === 'function') {
          cb(res)
        }
      })
    },

    initMediaDeviceStatus: function () {
      let _this = this
      let audioMute = _this.$route.params.audio_muted || false
      let videoMute = _this.$route.params.video_muted || false
      if (!window.config.withAudio || audioMute) {
        _this.setLocalAudioStatus(!window.config.withAudio || audioMute, function () {
          _this.audioTakeover = !window.config.withAudio
        })
      }
      if (!window.config.withVideo || videoMute) {
        _this.setLocalVideoStatus(!window.config.withVideo || videoMute, function () {
          _this.videoTakeover = !window.config.withVideo
        })
      }
    },

    registerEnvHandler: function () {
      let _this = this
      _this.initMediaDeviceStatus()
      Utils.onParticipate(_this.handleParticipate)
      Utils.onLocalSSRCUpdate(_this.updateLocalSSRC)
      Utils.onSomeoneLeft(_this.handleSomeoneLeft)
      Utils.onSourceRemove(_this.handleSourceRemoved)
      Utils.onSort(_this.handleSortShow)
      Utils.onStatus(_this.handleStats)
      Utils.onTextMsg(_this.handleTextMsg)
      Utils.onGrantModerator(_this.handleGrantAdmin)
      Utils.onEject(_this.handleEject)
      Utils.handleAudioStatusBeSet(_this.handleAudioStatusBeenSet)
      Utils.handleVideoStatusBeSet(_this.handleVideoStatusBeenSet)
      Utils.onRecordStatusChange(_this.handleRecordStatusChange)
      Utils.onRemoveModerator(_this.handleRemoveModerator)
      let attendRoomNum = _this.$route.params.roomNumber || ''
      if (attendRoomNum) {
        _this.$store.dispatch('userSetting/commitHistory', {
          value: attendRoomNum,
          label: attendRoomNum
        })
      }
    },

    handleRemoveModerator: function (res) {
      let _this = this
      _this.$store.dispatch('conferenceRoom/updateControlStatus', false)
    },

    handleSourceRemoved: function (res) {
      console.log('handle resource removed: ', res)
      this.$store.dispatch('conferenceRoom/onSourceRemoved', res.ssrc)
    },

    handleRecordStatusChange: function (res) {
      let _this = this
      console.log('handle record status change: ', res)
      if (res.resource) {
        if (res.status) {
          _this.recorders[res.resource] = res.status
          _this.$store.dispatch('conferenceRoom/updateRecorder', res.resource)
        } else {
          delete _this.recorders[res.resource]
        }
      }
      if (Utils.isOwnEmpty(_this.recorders)) {
        // no recorder
        _this.$store.dispatch('conferenceRoom/updateRecordStatus', false)
      } else {
        // with recorder
        _this.$store.dispatch('conferenceRoom/updateRecordStatus', true)
      }
    },

    handleVideoStatusBeenSet: function (res) {
      console.log('handle video status be set: ', res)
      this.videoTakeover = res.response
      this.$store.dispatch('conferenceRoom/updateVideoStatus', res.response)
    },

    handleAudioStatusBeenSet: function (res) {
      console.log('handle audio status be set: ', res)
      this.audioTakeover = res.response
      this.$store.dispatch('conferenceRoom/updateAudioStatus', res.response)
    },

    handleEject: function (res) {
      console.log('handle eject from room', res)
      Utils.notification(this, '您被管理员移出了房间', 'error')
      this.leaveRoom()
      this.$router.push({name: 'v2-participate'})
    },

    handleGrantAdmin: function (res) {
      console.log('handle grant admin: ', res)
      this.$store.dispatch('conferenceRoom/updateControlStatus', true)
      Utils.notification(this, '您被指定为会议主持人')
    },

    handleTextMsg: function (res) {
      console.log('handle text msg: ', res)
      if (!this.showTextMsg) {
        this.unreadMsg = true
      }
      this.$store.dispatch('conferenceRoom/onTextMsg', res)
      this.$refs['text-chat'].scrollToEnd()
    },

    handleStats: function (res) {
      // console.log('handle participant status update: ', res)
      this.$store.dispatch('conferenceRoom/updateData', {
        e: res.resource,
        k: 'status',
        v: res
      })
      this.hideCallDialog(res.nickname)
    },

    handleSortShow: function (res) {
      let _this = this
      console.log('handle sort from focus:', res)
      // window.setTimeout(function () {
      _this.$store.dispatch('conferenceRoom/updateDisplaySort', res)
      _this.autoSetVideoResolution()
      // }, 2000)
    },

    handleSomeoneLeft: function (res) {
      console.log('handle some one left: ', res)
      this.checkLeftGuy(res.resource)
      this.$store.dispatch('conferenceRoom/onLeaveRoom', res.resource)
      this.$refs.annotationComponent.checkLeftIsPainter(res.resource)
    },

    checkLeftGuy: function (endpoint) {
      let _this = this
      Utils.isModeratorLeft(_this.videoParticipants, endpoint, res => {
        if (res) Utils.notification(_this, '主持人离开了房间,会议室将在5分钟后关闭', 'error')
      })
    },

    updateLocalSSRC: function (obj) {
      this.$store.dispatch('conferenceRoom/updateData', {
        e: obj.endpoint,
        k: 'ssrc',
        v: obj.ssrc
      })
    },

    handleParticipate: function (res) {
      console.log('handle new participant attend: ', res, res.data.info.nickname)
      if (res && res.data.stream) {
        // store resource
        this.$store.dispatch('conferenceRoom/onJoinRoom', res)
      }
      if (res.data.info && res.data.info.nickname) {
        this.hideCallDialog(res.data.info.nickname)
      }
    },

    hideCallDialog: function (nickname) {
      if (!nickname || nickname.indexOf('sip') < 0) {
        return false
      }
      let _this = this
      // let element = '.iziToast'
      let element = ''
      if (nickname.indexOf('sip') > -1) {
        let str = nickname.replace('sip:68', '').replace('sip:69', '').replace('sip:', '')
        element = '#question_' + str
      }
      if (element && document.querySelector(element)) {
        _this.$toast.hide(element)
      }
    },

    loadingShow: function () {
      let _this = this
      _this.loadingHide()
      let loader = _this.$loading.show({
        // Optional parameters
        // container: _this.loadingFullPage ? null : _this.$refs.loadingContainer,
        // canCancel: true,
        canCancel: false,
        backgroundColor: '#000',
        width: 128,
        height: 128,
        opacity: 0.6,
        color: '#69D360',
        loader: 'spinner',
        onCancel: _this.onCancel
      })
      _this.loader = loader
      // simulate AJAX
      setTimeout(() => {
        _this.loadingHide()
      }, 1000 * 20)
    },

    loadingHide: function () {
      if (this.loader) {
        this.loader.hide()
        this.loader = null
      }
    },

    leaveRoom: function () {
      let _this = this
      Utils.leaveRoom(res => {
        console.log('handel leave room res: ', res)
      })
      _this.clearLocalStream()
      _this.$store.dispatch('conferenceRoom/clearData')
      _this.removeCallProgress()
      return _this.$router.push({name: 'v2-participate'})
    },

    removeCallProgress: function () {
      let questions = document.querySelectorAll('.iziToast')
      if (questions.length) {
        for (let i = 0; i < questions.length; i++) {
          let item = questions[i]
          let itemId = item.getAttribute('id')
          if (itemId.indexOf('question_') > -1) {
            item.classList.add('hidden')
          }
        }
      }
    },

    autoSetVideoResolution: function () {
      let _this = this
      if (_this.displayMode === '0') {
        // surround mode, main block set resolution to config.resolution, others set resolution to 180
        let mainParticipant = _this.$store.state.conferenceRoom.showStreams[0] || null
        if (mainParticipant) {
          if ((mainParticipant.info && mainParticipant.info.jid === window.connection.jid) || (window.participants && window.participants.length <= 2)) {
            // set resolution with config.resolution
            _this.changeLocalVideoResolution(window.config.resolution)
          } else {
            // set resolution to 180
            _this.changeLocalVideoResolution('180')
          }
        }
      } else {
        // spread mode, caculate resolution with participants count in room
        let videoCount = _this.showVideos.length || 1
        let targetResolution = '180'
        if (videoCount >= 6) {
          targetResolution = '180'
        } else if (videoCount >= 3) {
          targetResolution = '540'
        } else {
          targetResolution = '720'
        }
        _this.changeLocalVideoResolution(targetResolution)
      }
    },

    changeLocalVideoResolution: function (resolution) {
      let _this = this
      Utils.changeResolution(resolution, res => {
        // console.log('----------BBBBBBBBBB----------', res)
        _this.setVideoBandwidth(res.resolution) // sdk ignore this function yet
      })
    },

    setVideoBandwidth: function (resolution) {
      Utils.changeVideoBandwidth(resolution, res => {
        // console.log('----------CCCCCCCCCCC----------', res)
      })
    }

  },
  computed: {
    isModerator () {
      return this.$store.state.conferenceRoom.isModerator
    },
    displayMode () {
      return this.$store.state.conferenceRoom.mode
    },
    showVideos () {
      return this.$store.state.conferenceRoom.showStreams
    },
    videoParticipants () {
      return this.$store.state.conferenceRoom.videoStreams
    }
  },
  mounted: function () {
    this.getStoreDevice()
    this.getLocalStream(this.audioIn, this.videoIn)
  },
  beforeDestroy: function () {
    this.leaveRoom()
  }
}
</script>

<style scoped>
  div.main-container {
    position: fixed;
    padding: 0px !important;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    z-index: 0;
  }

  .main-container .top-control-container {
    display: none;
  }

  .main-container .top-control-container.show {
    display: block;
  }

  .main-container:hover .top-control-container {
    display: block;
  }

  .aside-container {
    position: absolute;
    right: 0px;
    width: 320px !important;
    background: rgba(0, 0, 0, 0.6) none repeat scroll !important;
    height: 100%;
    z-index: 2;
    padding-top: 64px;
    /* background: -webkit-gradient(
      linear,
      10% 10%,
      100% 100%,
      color-stop(0.24, rgb(62, 68, 89)),
      color-stop(0.74, rgb(99, 100, 109)),
      color-stop(1, rgb(137, 135, 136))
    ); */
  }

  .drawing-board-container .el-dialog__wrapper{
    overflow: hidden;
  }

  .el-dialog.drawing-board-dialog>.el-dialog__body {
    padding: 0px;
  }

</style>
