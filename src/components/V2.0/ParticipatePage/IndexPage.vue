<template>
  <div class="wrapper">
    <div class="bg-img"></div>
    <el-container>
      <el-header class="participate-control-header">
        <el-row :gutter="10">
          <el-col :span="8" :offset="8" class="text-center hidden">
            <el-button circle :class="{'active': videoMute}" :disabled="!localVideo" @click="switchVideoMute">
              <i class="icon-icons8_No_Video btn-icon" v-if="videoMute"></i>
              <i class="icon-icons8_Video_Call btn-icon" v-else></i>
            </el-button>
            <el-button circle :class="{'active': audioMute}" :disabled="!localAudio" @click="switchAudioMute">
              <i class="icon-icons8_Mute_Unmute btn-icon" v-if="audioMute"></i>
              <i class="icon-icons8_Microphone btn-icon" v-else></i>
            </el-button>
          </el-col>
          <el-col :span="8" :offset="16" class="text-right auth-user-nickname-container" v-show="authorised">
            <div class="sign-out-container">
              <el-row :gutter="10">
                <el-col :span="10" class="text-right">{{ userNickname }}</el-col>
                <el-col :span="10" class="text-left">
                  <a href="javascript: void (0);" @click="clickSignOut">
                    <span class="sign-out-text">[ 退 出 ]</span>
                  </a>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <anonymous-page v-show="!authorised"
                        v-on:doAttendIntoRoom="doAttendIntoRoom"
        ></anonymous-page>
        <authorised-page v-show="authorised"
                         ref="authorisedPage"
                         v-on:doAttendIntoRoom="doAttendIntoRoom"
                         v-on:showContactDetail="showContact"
                         v-on:callSomeone="callSomeone"
                         v-on:showAddContactForm="showAddContactForm"
        ></authorised-page>
        <device-selector-page
        v-on:videoInputChange="videoInChange"
        v-on:audioInputChange="audioInChange"
        v-on:audioOutputChange="audioOutChange"
        ></device-selector-page>
      </el-main>
    </el-container>
    <div class="local-video-box">
      <video autoplay class="local-video" id="local-video"></video>
    </div>
    <div class="local-audio-box">
      <audio autoplay class="local-audio" id="local-audio"></audio>
    </div>
    <div class="contact-show-box">
      <el-dialog
        v-if="contactDetail"
        :title="contactDetail.userName"
        :visible.sync="contactDialogVisible"
        width="30%">
        <div class="contact-detail">
          <el-row>
            <el-col :span="24">
              <div shadow="never" class="contact-card">
                <el-image :src="contactDetail.photo" class="contact-image">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <div style="padding: 14px;">
                  <!--<span>{{ contactDetail.nickname }}</span>-->
                  <div class="bottom clearfix">
                    <time class="time" v-show="!showEditContact">{{ contactDetail.nickname }}</time>
                    <el-row :gutter="10" v-show="showEditContact">
                      <el-col :span="8" :offset="8">
                        <el-input v-model="contactDetail.nickname" maxlength="16" :style="{textAlign: 'center'}" placeholder="请输入新昵称" @keyup.enter.native="updateContactComment"></el-input>
                      </el-col>
                    </el-row>
                    <el-button type="text" class="button" v-show="!showEditContact" @click.stop="showEditContact=true">
                      <small>编辑</small>
                    </el-button>
                  </div>
                  <div class="bottom clearfix">
                    <a class="contact-mail-to" :href="'mailto:' + contactDetail.email">{{ contactDetail.email }}</a>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="contact-actions text-center">
                <el-button type="danger" round size="small" @click="deleteContact(contactDetail)">删 除</el-button>
                <el-button type="primary" round size="small" @click="callSomeone(contactDetail)" :disabled="!contactDetail.onLine">呼 叫</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-dialog>
    </div>
    <div class="contact-add-container">
      <el-dialog
        title="添加联系人"
        :visible.sync="contactAddDialogVisible"
        width="30%">
        <div class="contact-add-form">
          <el-form :model="addContactForm" :rules="rules" ref="addContactForm" label-width="0px" class="demo-ruleForm">
            <el-form-item label="" prop="contactSelector">
              <el-autocomplete
                v-model="addContactForm.contactSelector"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入用户名或者邮箱进行搜索"
                @select="handleContactSelect"
                clearable
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="" prop="contactComment">
              <el-input
                v-model="addContactForm.contactComment"
                placeholder="请输入用户备注"
                clearable
                maxlength="16"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitAddContactForm('addContactForm')" size="small" plain round>立即添加</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Utils from '../../../utils/utils'
import anonymousPage from '../AnonymousPage/IndexPage'
import AuthorisedPage from '../AuthorisedPage/IndexPage'
import DeviceSelectorPage from '../LayoutPage/DeviceSelectorPage'

export default {
  name: 'v2-participate-index-page',
  components: {
    anonymousPage,
    AuthorisedPage,
    DeviceSelectorPage
  },
  data: function () {
    return {
      signOutVisible: false,
      myRoomNum: '',
      myRoomPass: '',
      userNickname: window.config.nickname || '',
      localVideo: null,
      localAudio: null,
      audioMute: false,
      videoMute: false,
      contactDialogVisible: false,
      contactDetail: null,
      showEditContact: false,
      contactAddDialogVisible: false,
      activeFriend: null,
      addContactForm: {
        contactSelector: null,
        contactComment: ''
      },
      rules: {
        contactSelector: [
          { required: true, message: '请选择需要添加的联系人', trigger: ['blur', 'change'] }
        ],
        contactComment: [
          { required: true, message: '请输入用户备注', trigger: ['blur', 'change'] },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    errorHandler () {
      return true
    },

    clickSignOut () {
      let _this = this
      Utils.clearSignInUserInfo(_this)
      window.setTimeout(function () {
        window.location.reload()
      }, 1000)
    },
    /**
     * get my private room for call
     */
    getPrivateMeeting () {
      let _this = this
      Utils.getPrivateRoom(
        _this.serverAddr,
        window.config,
        function (res) {
          console.log('handle private room result: ', res)
          if (res.mcode === 200) {
            _this.myRoomNum = window.config.cNumber
            _this.myRoomPass = res.obj.meetPassword || ''
          }
        }
      )
    },

    /**
       * 变更视频输入设备
       * @param device
       * @param resolution
       */
    videoInChange (device, resolution) {
      let _this = this
      let videoInput = device
      if (_this.localVideo) {
        _this.localVideo.getTracks().forEach(function (track) {
          track.stop()
        })
      }
      if (!videoInput) {
        return false
      }
      let videoResolution = resolution || '1080'
      let constraints = Utils.generateConstraints(false, true, null, videoInput, videoResolution)
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
          try {
            console.log('got local media stream success with constraints: ', constraints, stream)
            _this.localVideo = stream
            let previewVideo = document.querySelector('#local-video')
            previewVideo.srcObject = stream
            _this.$store.dispatch('deviceSetting/setVideoIn', videoInput)
          } catch (e) {
            console.error(e)
          }
        }).catch(function (error) {
          if (error.name === 'DevicesNotFoundError' || error.constructor.name === 'DevicesNotFoundError') {
            Utils.notification(_this, '没有找到摄像头', 'error')
            _this.$store.dispatch('deviceSetting/setVideoIn', '')
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
                _this.videoInChange(videoInput, resolution)
              }
            }
          } else {
            Utils.notification(_this, '获取视频失败,请检查摄像头', 'error')
            _this.$store.dispatch('deviceSetting/setVideoIn', '')
          }
        })
    },
    /**
       * 变更音频输入设备
       */
    audioInChange: function (device) {
      var _this = this
      let audioInDevice = device
      var constraints = Utils.generateConstraints(true, false, audioInDevice)
      if (_this.localAudio) {
        _this.localAudio.getTracks().forEach(function (track) {
          track.stop()
        })
      }
      if (!audioInDevice) {
        return false
      }
      // var localAudioIn = document.querySelector('#local-audio')
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
          // localAudioIn.srcObject = stream
          _this.localAudio = stream
          // if (_this.audioOut) {
          //   Utils.attachSinkId(localAudioIn, _this.audioOut)
          // }
          _this.$store.dispatch('deviceSetting/setAudioIn', device)
          return true
        }).catch(function (error) {
          console.error('navigator.getUserMedia error: ', error)
        })
    },
    /**
       * 变更音频输出设备
       */
    audioOutChange: function (device) {
      var _this = this
      if (!device) {
        return false
      }
      // var localAudioElement = document.querySelector('#local-audio')
      // Utils.attachSinkId(localAudioElement, device)
      _this.$store.dispatch('deviceSetting/setAudioOut', device)
    },

    /**
     * 开关本地音频
     */
    switchAudioMute: function () {
      console.log('current audio mute status: ', this.audioMute, ' will change to:', !this.audioMute)
      let _this = this
      if (_this.localAudio) {
        let localAudioTracks = _this.localAudio.getAudioTracks()
        if (localAudioTracks.length > 0) {
          for (let i = 0; i < localAudioTracks.length; i++) {
            localAudioTracks[i].enabled = _this.audioMute
          }
          _this.audioMute = !_this.audioMute
        }
      }
    },

    /**
     * 开关本地视频
     */
    switchVideoMute: function () {
      console.log('current video mute status: ', this.videoMute, ' will change to:', !this.videoMute)
      let _this = this
      if (_this.localVideo) {
        let localVideoTracks = _this.localVideo.getVideoTracks()
        if (localVideoTracks.length > 0) {
          for (let i = 0; i < localVideoTracks.length; i++) {
            localVideoTracks[i].enabled = _this.videoMute
          }
          _this.videoMute = !_this.videoMute
        }
      }
    },

    /**
     *  开始进入房间
     * @param params
     */
    doAttendIntoRoom: function (params) {
      let _this = this
      params.audio_muted = _this.audioMute
      params.video_muted = _this.videoMute
      _this.$store.dispatch('userSetting/isInitiativeSignOut', false)
      _this.$router.push({
        name: 'meeting',
        params: params
      })
    },

    /**
     * show contact
     * @param contact
     */
    showContact (contact) {
      this.contactDetail = contact
      this.contactDialogVisible = true
    },

    /**
     * show add new contact form
     */
    showAddContactForm () {
      console.log('will show add new contact form ')
      this.contactAddDialogVisible = true
    },

    /**
     * selected friend changed
     * @param item
     */
    handleContactSelect (item) {
      this.addContactForm.contactSelector = item.value
      this.addContactForm.contactComment = item.value
      this.activeFriend = item.obj
    },

    /**
     * search friends
     * @param queryString
     * @param cb
     */
    querySearchAsync (queryString, cb) {
      let _this = this
      Utils.searchAvailableFriends(
        _this.serverAddr,
        res => {
          cb(res.map(item => {
            return {
              obj: item,
              value: item.userName
            }
          }))
        },
        queryString
      )
    },

    /**
     * refresh contacts list
     */
    contactsChanged () {
      this.$refs.authorisedPage.getMyContacts()
    },

    /**
     * submit add friend
     * @param formName
     */
    submitAddContactForm (formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          let friendId = _this.activeFriend.mUserId.toLowerCase() || ''
          if (!friendId) {
            Utils.notification(_this, '添加好友失败', 'error')
            return false
          }
          Utils.saveFriend(
            _this.serverAddr,
            _this.activeFriend.mUserId,
            _this.addContactForm.contactComment,
            res => {
              if (res.mcode === 200) {
                Utils.notification(_this, '添加联系人成功', 'success')
              }
              _this.contactAddDialogVisible = false
              _this.activeFriend = null
              _this.addContactForm.contactComment = ''
              _this.addContactForm.contactSelector = null
              _this.contactsChanged()
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    /**
     * remove someone
     * @param contact
     */
    deleteContact (contact) {
      let _this = this
      Utils.deleteFriend(
        _this.serverAddr,
        contact.mUserId,
        res => {
          console.log('contact ', contact, 'has been removed', res)
          _this.contactDialogVisible = false
          _this.contactDetail = null
          _this.contactsChanged()
        }
      )
    },

    /**
     * update contact
     */
    updateContactComment () {
      let _this = this
      console.log('handle update contact comment', this.contactDetail)
      Utils.saveFriend(
        _this.serverAddr,
        _this.contactDetail.mUserId,
        _this.contactDetail.nickname,
        res => {
          console.log(res)
          Utils.notification(_this, '用户备注已更新')
          _this.contactsChanged()
        }
      )
      this.showEditContact = false
    },

    /**
     * handle ring call dialog
     * @param id
     */
    hideRingCallToast: function (id) {
      let _this = this
      let element = id || '#ring_call_toast'
      if (element && document.querySelector(element)) {
        try {
          _this.$toast.hide(element)
          _this.$toast.destroy()
        } catch (e) {
          console.log('hide toast in error: ', e)
        }
      }
    },

    /**
     * call someone
     * @param contact
     */
    callSomeone (contact) {
      let _this = this
      console.log('will call someone and show loading', contact)
      if (!_this.myRoomNum) {
        console.warn('can not find room for call others')
        _this.getPrivateMeeting()
        return false
      }
      Utils.sendInvite(
        contact.mUserId.toLowerCase(),
        _this.myRoomNum,
        _this.myRoomPass,
        '0',
        res => {
          if (res.errorCode === '000000') {
            try {
              _this.showCallProgress(contact)
            } catch (e) {
              console.error(e)
            }
          }
        }
      )
    },

    /**
     * show ring call progress
     * @param contact
     */
    showCallProgress (contact) {
      let _this = this
      _this.$toast.show(contact.nickname + '...', '正在呼叫', {
        timeout: (1000 * 60),
        theme: 'dark',
        icon: 'icon-person',
        progressBarColor: 'rgb(0, 255, 184)',
        close: false,
        id: 'ring_call_toast',
        overlay: true,
        image: contact.photo,
        imageWidth: 50,
        position: 'center',
        buttons: [
          [
            '<button><b>取消呼叫</b></button>',
            function (instance, toast) {
              instance.hide({transitionOut: 'fadeOut'}, toast, 'button')
              _this.cancelInvite(contact)
            },
            true
          ]
        ]
      })
    },

    cancelInvite (contact) {
      let _this = this
      Utils.responseInvite(
        '',
        'reject',
        contact.mUserId.toLowerCase(),
        (res) => {
          if (res.errorCode === '000000') {
            Utils.notification(_this, '呼叫已取消')
          }
        },
        true
      )
    },

    /**
     * handle invite response
     */
    handleInviteResponse () {
      let _this = this
      Utils.onInviteResponse(res => {
        console.log('handle invite response: ', res)
        _this.hideRingCallToast()
        if (res.answer === 'timeout') {
          // Utils.notification(_this, '对方无人应答')
          return false
        } else if (res.answer === 'cancel') {
          Utils.notification(_this, res.nickname + '取消了会议邀请')
          return false
        } else if (res.answer === 'reject') {
          Utils.notification(_this, res.nickname + '拒绝了你的会议邀请', 'error')
          return false
        } else if (res.answer === 'busy') {
          Utils.notification(_this, res.nickname + '正在忙线中')
          return false
        } else if (res.answer === 'accept') {
          Utils.notification(_this, res.nickname + '接受了你的会议邀请, 正在等待加入房间', 'success')
          _this.doAttendIntoRoom({
            roomNumber: _this.myRoomNum,
            mode: 'authorised',
            code: (_this.myRoomPass || ''),
            invite: res.uuid
          })
          return false
        }
      })
    }
  },
  computed: {
    audioIn: function () {
      return this.$store.state.deviceSetting.audioIn || ''
    },
    videoIn: function () {
      return this.$store.state.deviceSetting.videoIn || ''
    },
    audioOut: function () {
      return this.$store.state.deviceSetting.audioOut || ''
    },
    authorised: function () {
      return this.$store.state.userSetting.authorization
    },
    serverAddr: function () {
      return this.$store.state.serverSetting.serverAddr
    }
  },
  mounted: function () {
    if (!this.serverAddr) {
      return this.$router.push({name: 'v2-login'})
    }
    this.getPrivateMeeting()
    this.handleInviteResponse()
  },
  beforeDestroy: function () {
    let _this = this
    if (_this.localVideo) {
      _this.localVideo.getTracks().forEach(function (track) {
        track.stop()
      })
      _this.localVideo = null
    }
    if (_this.localAudio) {
      _this.localAudio.getTracks().forEach(function (track) {
        track.stop()
      })
      _this.localAudio = null
    }
  }
}
</script>

<style scoped>

  .wrapper {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    overflow: hidden;
  }

  .el-container {
    z-index: 2;
  }

  .bg-img {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    z-index: 0;
    background-image: url("../../../assets/img/in-active-bg.jpg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    transition: filter 2s;
    filter: blur(16px);
  }

  .wrapper:hover .bg-img {
    transition: filter 2s;
    filter: blur(64px);
  }

  .local-video-box {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    z-index: 1;
    text-align: center;
    display: block;
  }

  .local-video-box video.local-video {
    width: 100%;
    height: 100%;
    margin: 0px auto;
    object-fit: contain;
    transition: filter 2s;
    filter: blur(16px);
  }

  .local-video-box video.local-video:hover {
    width: 100%;
    height: 100%;
    margin: 0px auto;
    object-fit: contain;
    transition: filter 1s;
    filter: none;
  }

  .participate-control-header {
    position: absolute;
    width: 100%;
    margin-top: 20px;
    /*text-align: center;*/
    z-index: 2;
  }

  .el-button--default.is-circle {
    padding: 8px;
  }

  .el-button--default.is-circle>span {
    width: 24px;
    height: 24px;
  }

  .el-button--default.is-circle>span>i {
    font-size: 2rem;
  }

  .el-button.is-circle.active {
    background-color: rgba(48, 202, 119, 1);
    color: rgba(255, 255, 255, 1);
    border-color: rgba(48, 202, 119, .6);
  }

  .hidden {
    display: none;
  }

  .contact-card {
    border: 0px;
    text-align: center;
  }

  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .text-left {
    text-align: left;
  }

  .sign-out-container {
    width: 160px;
    float: right;
  }

  .sign-out-container a {
    text-decoration: none;
    color: #eeeeee;
  }

  .auth-user-nickname-container {
    line-height: 50px;
    padding-right: 50px !important;
  }

  a.contact-mail-to, a.contact-mail-to:visited, a.contact-mail-to:focus {
    text-decoration: none;
    color: rgba(255, 255, 255, 1);
  }
</style>
