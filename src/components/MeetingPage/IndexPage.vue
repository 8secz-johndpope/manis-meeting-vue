<template>
  <div class="wrapper">
    <el-container>
      <div class="main-container" @click="switchShowController">
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
            v-on:showInviteDialog="showInviteDialog"
            v-on:doDTMF="showDTMF"
          ></room-members>
          <text-chat :class="['hidden', {'show': showTextMsg}]" ref="text-chat"></text-chat>
          <device-setting :class="['hidden', {'show': showDeviceSetting}]"></device-setting>
          <admin-right
            :screenShareStatus="screenSharing"
            :class="['hidden', {'show': showAdminRight}]"
            v-on:switchDrawingBoard="switchDrawingBoard"
            v-on:changeDisplayModeAndSort="changeDisplayModeAndSort"
          ></admin-right>
        </el-aside>
        <audio-page></audio-page>
        <el-container>
          <el-dialog
            title="请选择需要分享的窗口"
            :visible.sync="captureDialogVisible"
            :modal="false"
            width="50%"
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
        <el-container>
          <el-dialog
            title="邀请在线好友加入会议"
            custom-class="invite-page-dialog"
            :modal="false"
            :show-close="true"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :visible.sync="inviteDialogVisible"
          >
            <invite-page
            v-on:showInviteDialog="showInviteDialog"
            ></invite-page>
          </el-dialog>
        </el-container>
        <el-container>
            <el-dialog
              :title="targetModeTitle"
              :modal="false"
              :show-close="true"
              :close-on-press-escape="false"
              :close-on-click-modal="false"
              :visible.sync="sortDialogVisible"
              center
            >
              <display-layout-page
              :activeMode="targetMode"
              ref="displayLayoutSet"
              v-on:saveDisplaySort="saveDisplaySort"
              ></display-layout-page>
            </el-dialog>
        </el-container>
        <el-container>
          <el-dialog title="会议延时"
                     :visible.sync="delayDialogFormVisible"
                     width="30%"
                     :modal="false"
          >
            <el-form>
              <el-form-item label="延长时间(分钟)">
                <el-input type="number" v-model="delayMinutes" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="delayDialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitDelay">确 定</el-button>
            </div>
          </el-dialog>
        </el-container>
        <el-container>
          <el-dialog :title="dtmfNickname"
                     :visible.sync="dtmfDialogFormVisible"
                     :modal="false"
                     :before-close="closeDTMF"
                     width="320px"
                     style="padding: 10px 20px"
          >
            <div class="dtmf-container">
              <el-row :gutter="10">
                <el-col :span="24">
                  <div class="dtmf-input" v-show="dtmfInput">{{ dtmfInput }}</div>
                </el-col>
              </el-row>
              <el-row type="flex" class="row-bg dtmf-row" :gutter="10" justify="center">
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-button @click.stop="sendDTMF('7')">7</el-button>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-button @click.stop="sendDTMF('8')">8</el-button>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-button @click.stop="sendDTMF('9')">9</el-button>
                  </div>
                </el-col>
              </el-row>
              <el-row type="flex" class="row-bg dtmf-row" :gutter="10" justify="center">
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-button @click.stop="sendDTMF('4')">4</el-button>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-button @click.stop="sendDTMF('5')">5</el-button>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-button @click.stop="sendDTMF('6')">6</el-button>
                  </div>
                </el-col>
              </el-row>
              <el-row type="flex" class="row-bg dtmf-row" :gutter="10" justify="center">
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-button @click.stop="sendDTMF('1')">1</el-button>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-button @click.stop="sendDTMF('2')">2</el-button>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-button @click.stop="sendDTMF('3')">3</el-button>
                  </div>
                </el-col>
              </el-row>
              <el-row type="flex" class="row-bg dtmf-row" :gutter="10" justify="center">
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-button @click.stop="sendDTMF('*')">*</el-button>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-button @click.stop="sendDTMF('0')">0</el-button>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-button @click.stop="sendDTMF('#')">#</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-dialog>
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
import InvitePage from './InvitePage'
import DisplayLayoutPage from './DisplayLayout'

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
    Annotation,
    InvitePage,
    DisplayLayoutPage
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
      recorders: {},
      inviteDialogVisible: false,
      targetMode: '0',
      targetModeTitle: '环绕模式',
      sortDialogVisible: false,
      delayMinutes: 15,
      delayDialogFormVisible: false,
      dtmfDialogFormVisible: false,
      dtmfInput: '',
      dtmfItem: null,
      dtmfNickname: ''
    }
  },
  methods: {
    showDTMF: function (item) {
      console.log('show dtmf keyboard for : ', item)
      this.dtmfItem = item
      this.dtmfNickname = Utils.formatNickname((this.dtmfItem.nickname || ''), 15)
      this.dtmfDialogFormVisible = true
    },

    sendDTMF: function (code) {
      let _this = this
      Utils.sendDTMF(
        _this.apiServer,
        _this.dtmfItem,
        code,
        res => {
          console.log('send DTMF code: ', code, ' success and handle result: ', res)
        }
      )
      this.dtmfInput += ('' + code)
    },

    closeDTMF: function () {
      console.log('will close dtmf and clean history')
      this.dtmfInput = ''
      this.dtmfNickname = ''
      this.dtmfDialogFormVisible = false
      this.dtmfItem = null
    },

    showInviteDialog: function (status) {
      this.inviteDialogVisible = status
      this.hideAsideContainer()
    },
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
      Utils.participantIntoRoom(
        room,
        _this.roomPass,
        res => {
          try {
            _this.loadingHide()
            console.log(res)
            if (res.errorCode === '000000') {
              let isModerator = res.response.is_moderator || false
              _this.nickname = res.response.info.nickname || ''
              _this.$store.dispatch('conferenceRoom/updateControlStatus', isModerator)
            }
            _this.handleParticipate({type: 'video', data: res.response})
            _this.registerEnvHandler()
          } catch (e) {
            console.error('register events failed', e)
          }
        },
        err => {
          console.error(err)
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

    actionsAfterJoinRoom: function () {
      let _this = this
      let params = _this.$route.params
      if (params.actions && params.actions.attendNum && params.actions.attendType) {
        Utils.doClientCall(
          _this.apiServer,
          params.roomNumber,
          params.code,
          params.actions.attendNum,
          params.actions.attendType,
          (params.actions.attendOthersType || params.actions.attendType),
          params.actions.attendNickname,
          function (res) {
            console.log('call after attend', res)
            Utils.notification(_this, '已呼叫, 请等待')
          }
        )
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
      Utils.onModeratorExistChange(_this.handleModeratorExistChange)
      Utils.onRoomWillCountDwon(_this.handleRoomTimeout)
      Utils.onShareWindowClosed(_this.handleShareWindowClosed)
      let attendRoomNum = _this.$route.params.roomNumber || ''
      if (attendRoomNum) {
        _this.$store.dispatch('userSetting/commitHistory', {
          value: attendRoomNum.toString(),
          label: attendRoomNum.toString()
        })
      }
      let inviteAccepter = _this.$route.params.invite || ''
      if (inviteAccepter) {
        let roomPass = _this.$route.params.code || ''
        Utils.noticeRoomReady(
          inviteAccepter,
          attendRoomNum,
          roomPass,
          res => {
            console.log('handle send room ready notification result', res)
          }
        )
      }
      _this.actionsAfterJoinRoom()
    },

    handleShareWindowClosed: function (env) {
      console.log(env)
      let _this = this
      Utils.notification(_this, '分享的窗口已经关闭,结束屏幕分享', 'error')
      _this.stopShareScreen()
    },

    handleRemoveModerator: function (res) {
      let _this = this
      _this.$store.dispatch('conferenceRoom/updateControlStatus', false)
    },

    handleSourceRemoved: function (res) {
      console.log('handle resource removed: ', res)
      let _this = this
      _this.$store.dispatch('conferenceRoom/onSourceRemoved', res.ssrc)
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
      let _this = this
      // _this.checkLeftGuy(res.resource)
      _this.$store.dispatch('conferenceRoom/onLeaveRoom', res.resource)
      _this.$refs.annotationComponent.checkLeftIsPainter(res.resource)
      if (_this.$refs['displayLayoutSet']) {
        setTimeout(function () {
          _this.$refs['displayLayoutSet'].resetDisplay()
        }, 2000)
      }
    },

    handleModeratorExistChange: function (response) {
      let _this = this
      let timeLeft = response.time || null
      let appendStr = ''
      if (timeLeft) {
        appendStr = ', 会议室即将关闭'
      }
      Utils.notification(_this, '主持人离开了房间' + appendStr, 'error')
    },

    handleRoomTimeout: function (response) {
      let _this = this
      let timeLeft = response.countdown || ''
      Utils.notification(_this, '本地会议还剩下: ' + timeLeft + '分钟, 会议室即将关闭')
      if (_this.isModerator) {
        // show delay dialog
        _this.delayDialogFormVisible = true
      }
    },

    submitDelay: function () {
      let _this = this
      _this.delayDialogFormVisible = false
      let minutes = _this.delayMinutes
      Utils.delayRoom(minutes, function (res) {
        Utils.notification(_this, '会议延时' + minutes + '分钟')
      })
    },

    // checkLeftGuy: function (endpoint) {
    //   let _this = this
    //   Utils.isModeratorLeft(_this.videoParticipants, endpoint, res => {
    //     if (res) Utils.notification(_this, '主持人离开了房间,会议室将在5分钟后关闭', 'error')
    //   })
    // },

    updateLocalSSRC: function (obj) {
      this.$store.dispatch('conferenceRoom/updateData', {
        e: obj.endpoint,
        k: 'ssrc',
        v: obj.ssrc
      })
    },

    handleParticipate: function (res) {
      console.log('handle new participant attend: ', res, res.data.info.nickname)
      let _this = this
      if (res && res.data.stream) {
        // store resource
        _this.$store.dispatch('conferenceRoom/onJoinRoom', res)
      }
      if (res.data.info && res.data.info.nickname) {
        _this.hideCallDialog(res.data.info.nickname)
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
            _this.changeLocalVideoResolution(_this.calculateTargetResolution(0))
          } else {
            // set resolution to 180
            _this.changeLocalVideoResolution(_this.calculateTargetResolution(9))
          }
        }
      } else {
        // spread mode, calculate resolution with participants count in room
        let videoCount = _this.showVideos.length || 1
        _this.changeLocalVideoResolution(_this.calculateTargetResolution(videoCount))
      }
    },

    calculateTargetResolution: function (videoCount) {
      let maxResolution = (window.config && window.config.resolution) ? window.config.resolution.toString() : '1080'
      if (videoCount >= 6) {
        return (maxResolution >= '1080') ? '240' : '180'
      } else if (videoCount >= 3) {
        return (maxResolution >= '1080') ? '540' : '240'
      } else {
        return maxResolution
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
    },

    changeDisplayModeAndSort: function (mode) {
      let _this = this
      _this.targetMode = mode
      _this.targetModeTitle = (mode === '0' ? '环绕模式' : '平铺模式')
      _this.hideAsideContainer()
      _this.sortDialogVisible = true
    },

    saveDisplaySort: function () {
      let _this = this
      _this.sortDialogVisible = false
    },

    switchShowController: function () {
      let element = document.querySelector('.top-control-container')
      if (element) {
        let elementClass = element.getAttribute('class')
        if (elementClass.indexOf('show') < 0) {
          // switch show top controller
          if (element.style.display !== 'none') {
            element.style.display = 'none'
          } else {
            element.style.display = 'block'
          }
        }
      }
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
    apiServer () {
      return this.$store.state.serverSetting.serverAddr
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
    display: block;
  }

  .main-container .top-control-container.show {
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

  .dtmf-container {
    text-align: center;
  }
  .dtmf-row {
    margin: 20px auto;
  }

  div.dtmf-input {
    margin: 0px 16px;
    text-align: center;
    background: #ddd;
    font-size: 1.6rem;
    word-break: break-word;
  }
</style>
