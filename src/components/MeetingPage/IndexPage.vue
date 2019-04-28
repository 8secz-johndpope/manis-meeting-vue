<template>
  <div class="wrapper">
    <el-container>
      <div class="main-container">
        <el-container class="top-control-container">
          <top-controls
            :screenShareStatus="screenSharing"
            :showAdminRight="showAdminRight"
            :showMembers="showMembers"
            :showTextMsg="showTextMsg"
            :showDeviceSetting="showDeviceSetting"
            :unreadMsg="unreadMsg"
            v-on:leaveRoom="leaveRoom"
            v-on:switchRoomMembers="switchRoomMembers"
            v-on:switchTextMsg="switchTextMsg"
            v-on:switchDeviceSetting="switchDeviceSetting"
            v-on:switchAdminRightManage="switchAdminRightManage"
            v-on:switchScreenShare="switchScreenShare"
            v-on:stopShareScreen="stopShareScreen"
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
          <text-chat :class="['hidden', {'show': showTextMsg}]"></text-chat>
          <device-setting :class="['hidden', {'show': showDeviceSetting}]"></device-setting>
          <admin-right
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
import DesktopCapture from '../V1.0/DesktopCapturer/IndexPage'
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
      this.showMembers = !this.showMembers
    },

    switchTextMsg: function () {
      this.showMembers = false
      this.showDeviceSetting = false
      this.showAdminRight = false
      this.showTextMsg = !this.showTextMsg
      this.unreadMsg = false
    },

    switchDeviceSetting: function () {
      this.showTextMsg = false
      this.showMembers = false
      this.showAdminRight = false
      this.showDeviceSetting = !this.showDeviceSetting
    },

    switchAdminRightManage: function () {
      this.showTextMsg = false
      this.showMembers = false
      this.showDeviceSetting = false
      this.showAdminRight = !this.showAdminRight
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
      let passCode = _this.$route.params.code || ''
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
          if (res.errorCode === '000000') {
            let isModerator = res.response.is_moderator || false
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
            _this.roomPassDialogVisible = true
          } else if (err.errorCode === '300204') {
            // connect lost, redirect to login page
            Utils.notification(_this, '服务连接已断开,请稍后重试', 'error')
            _this.clearLocalStream()
            _this.$router.push({name: 'login-page'})
          } else {
            console.log(err)
            Utils.notification(_this, '房间不存在或进入房间失败', 'error')
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
            _this.$router.push({name: 'login-page'})
          } else {
            console.log(err)
            Utils.notification(_this, '房间不存在或进入房间失败', 'error')
            _this.clearLocalStream()
            _this.$router.push({name: 'v2-participate'})
          }
        },
        _this.localStream
      )
    },

    registerEnvHandler: function () {
      let _this = this
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
      this.$store.dispatch('conferenceRoom/updateVideoStatus', res.response)
    },

    handleAudioStatusBeenSet: function (res) {
      console.log('handle audio status be set: ', res)
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
    },

    handleStats: function (res) {
      // console.log('handle participant status update: ', res)
      this.$store.dispatch('conferenceRoom/updateData', {
        e: res.resource,
        k: 'status',
        v: res
      })
    },

    handleSortShow: function (res) {
      // console.log('handle sort from focus:', res)
      this.$store.dispatch('conferenceRoom/updateDisplaySort', res)
    },

    handleSomeoneLeft: function (res) {
      console.log('handle some one left: ', res)
      this.$store.dispatch('conferenceRoom/onLeaveRoom', res.resource)
      this.$refs.annotationComponent.checkLeftIsPainter(res.resource)
    },

    updateLocalSSRC: function (obj) {
      this.$store.dispatch('conferenceRoom/updateData', {
        e: obj.endpoint,
        k: 'ssrc',
        v: obj.ssrc
      })
    },

    handleParticipate: function (res) {
      console.log('handle new participant attend: ', res)
      if (res && res.data.stream) {
        // store resource
        this.$store.dispatch('conferenceRoom/onJoinRoom', res)
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
      return _this.$router.push({name: 'v2-participate'})
    }

  },
  computed: {
    isModerator () {
      return this.$store.state.conferenceRoom.isModerator
    },
    displayMode () {
      return this.$store.state.conferenceRoom.mode
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

  .main-container:hover .top-control-container {
    display: block;
  }

  .aside-container {
    position: absolute;
    right: 0px;
    width: 360px !important;
    background: rgba(0, 0, 0, 0.75) none repeat scroll !important;
    height: 100%;
    z-index: 2;
    padding-top: 64px;
  }

  .drawing-board-container .el-dialog__wrapper{
    overflow: hidden;
  }

  .el-dialog.drawing-board-dialog>.el-dialog__body {
    padding: 0px;
  }

</style>
