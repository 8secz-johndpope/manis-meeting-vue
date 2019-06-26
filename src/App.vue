<template>
  <div id="app">
    <router-view
    v-on:signStateChange="signStateChanged"></router-view>
    <el-dialog
      title="关于应用"
      :visible.sync="showAboutPage"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="open-window-page"
      width="480px"
      center>
      <about-page></about-page>
    </el-dialog>
    <el-dialog
      title="设备管理"
      :visible.sync="showSettingPage"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="open-window-page"
      width="480px"
      center>
      <setting-page></setting-page>
    </el-dialog>
    <el-dialog
      title="应用更新"
      :visible.sync="showUpdatePage"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="open-window-page"
      width="480px"
      center>
      <update-page></update-page>
    </el-dialog>
  </div>
</template>

<script>
import Utils from './utils/utils'
import AboutPage from './components/Layout/AboutPage'
import SettingPage from './components/Layout/SettingPage'
import UpdatePage from './components/Layout/UpdatePage'
// @TODO uncomment this before publish
const { ipcRenderer } = require('electron')

export default {
  name: 'manis-meeting-vue',
  data: function () {
    return {
      showAboutPage: false,
      showSettingPage: false,
      showUpdatePage: false,
      audioInputOptions: [],
      audioOutputOptions: [],
      videoInputOptions: []
    }
  },
  components: {
    AboutPage,
    SettingPage,
    UpdatePage
  },
  methods: {
    handleMsgFromIPCMain () {
      // @TODO uncomment this before publish
      let _this = this
      ipcRenderer.on('ipc-sender-asynchronous-reply', (event, arg) => {
        console.log('-------------handle-ipc-sender-asynchronous-reply-------', arg)
        if (arg && typeof arg === 'object') {
          let action = arg.action || ''
          switch (action) {
            case 'signout':
              _this.clickSignOut()
              break
            case 'abouts':
              _this.showAbouts()
              break
            case 'settings':
              _this.showSettings()
              break
            case 'updates':
              _this.showUpdates()
              break
          }
        }
      })
    },

    showAbouts () {
      let _this = this
      _this.showAboutPage = true
      _this.showSettingPage = false
      _this.showUpdatePage = false
    },

    showSettings () {
      let _this = this
      _this.showAboutPage = false
      _this.showSettingPage = true
      _this.showUpdatePage = false
    },

    showUpdates () {
      let _this = this
      _this.showAboutPage = false
      _this.showSettingPage = false
      _this.showUpdatePage = true
    },

    clickSignOut () {
      let _this = this
      Utils.clearSignInUserInfo(_this)
      window.location.reload()
    },

    sendMsgToIPCMain (msg) {
      // @TODO uncomment this before publish
      ipcRenderer.send('ipc-main-asynchronous-message', msg)
    },

    signStateChanged (state) {
      console.log('------handle-sign-state-changed-event----------', state)
      this.sendMsgToIPCMain({
        action: 'signed'
      })
    },
    /**
       * reset connect status
       */
    resetConnect () {
      Utils.logOut()
      this.$store.dispatch('userSetting/clearUser')
      window.config = Utils.resetConfig()
    },
    /**
       * check connect status
       */
    checkConnected () {
      let _this = this
      let connected = Utils.mssConnected()
      if (!connected) {
        console.log('connected closed or not connect')
        _this.resetConnect()
      }
    },
    /**
       * handle system error
       */
    systemError () {
      let _this = this
      Utils.handleSystemError(function (res) {
        console.log(res)
        if (!_this.initiativeSignOut) {
          Utils.notification(_this, '网络连接好像出了点问题', 'error')
        }
        _this.resetConnect()
        window.setTimeout(function () {
          _this.$router.push({name: 'v2-login'})
          // location.reload()
        }, 2000)
      })
    },

    /**
     * 获取音频输入设备
     */
    getAudioInputDevices: function () {
      let _this = this
      Utils.getAudioInputs(function (devices) {
        _this.audioInputOptions = devices
        _this.$store.dispatch('deviceSetting/availableDevices', {
          type: 'audio-in',
          devices: _this.audioInputOptions
        })
      })
    },

    /**
     * 获取视频输入设备
     */
    getVideoInputDevices: function () {
      let _this = this
      Utils.getVideoInputs(function (devices) {
        _this.videoInputOptions = devices
        _this.$store.dispatch('deviceSetting/availableDevices', {
          type: 'video-in',
          devices: _this.videoInputOptions
        })
      })
    },

    /**
     * 获取音频输出设备
     */
    getAudioOutputDevices: function () {
      let _this = this
      Utils.getAudioOutputs(function (devices) {
        _this.audioOutputOptions = devices
        _this.$store.dispatch('deviceSetting/availableDevices', {
          type: 'audio-out',
          devices: _this.audioOutputOptions
        })
      })
    }
  },
  computed: {
    initiativeSignOut: function () {
      return this.$store.state.userSetting.initiativeSignOut
    }
  },
  mounted: function () {
    this.getAudioInputDevices()
    this.getVideoInputDevices()
    this.getAudioOutputDevices()
    this.checkConnected()
    this.systemError()
    this.sendMsgToIPCMain({
      action: 'app-ready'
    })
    this.handleMsgFromIPCMain()
  }
}
</script>

<style>
  /* @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro'); */

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Source Sans Pro', sans-serif;
    color: #EEEEEE;
  }

  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background: -webkit-gradient(linear, 0 0, 100% 100%, from(#8c8a84), to(#292f4c));
  }

  .room-members .el-collapse-item__wrap, .room-members .el-collapse-item__header {
    background: none !important;
    border: 0px;
    color: #EEEEEE;
  }

  .room-members .el-collapse {
    border: 0px;
  }

  .device-setting-form .el-form-item__label, .basic-setting-form  .el-form-item__label{
    color: #EEEEEE;
  }

  .hidden {
    display: none !important;
  }

  .show {
    display: block !important;
  }

  .ctl-top-row .el-button.ctl-btn {
    width: 52px !important;
    height: 52px !important;
  }

  .drawing-board-dialog, .drawing-board-dialog .layout, .drawing-board-dialog .el-dialog__body .body{
    background: none !important;
  }

  .drawing-board-dialog .el-dialog__body .body {
    background: rgba(0, 0, 0, .5) none repeat scroll !important;
    background: #000;
    filter: Alpha(opacity=50);
  }

  .drawing-board-dialog .el-dialog__header {
    display: none;
  }

  .drawing-board-dialog .el-dialog__body {
    padding: 0px;
  }

  div.sign-input>.el-input__inner, .join-room-form .el-form-item .el-input__inner {
    background: rgba(0, 0, 0, 0) none repeat scroll !important;
    background: #000;
    filter: Alpha(opacity=100);
    border: 0px;
    border-radius: 0px;
    border-bottom: 1px solid #eeeeee;
    color: #ffffff;
  }

  .join-room-form .el-form-item .el-input__inner {
    padding-left: 5px !important;
    color: #ffffff;
  }

  .join-room-form-box .el-form-item .el-input__inner {
    color: #ffffff;
  }

  .custom-form .el-form-item__error {
    position: relative;
  }

  .custom-form .el-input__inner {
    border-radius: 0px;
  }

  .authorised-tabs .el-tabs__item{
    color: #9a9ca0;
  }

  .authorised-tabs .el-tabs__item.is-active,
  .device-selector-container .el-form-item__label {
    color: #ffffff;
    font-size: 12px;
  }

  .authorised-tabs .el-tabs__nav.is-top {
    padding: 10px !important;
  }

  #conference-list-container .el-tabs__header{
    position: fixed;
    background: #3E4459;
    z-index: 3;
    width: 340px;
  }

  #conference-list-container .el-tabs__content {
    position: absolute;
    margin-top: 64px;
    width: 100%;
  }

  .el-popover{
    /* background-color: #3E4459 !important; */
    background: -webkit-gradient(
      linear,
      10% 10%,
      100% 100%,
      color-stop(0.24, rgb(62, 68, 89)),
      color-stop(0.74, rgb(99, 100, 109)),
      color-stop(1, rgb(137, 135, 136))
    ) !important;
    border: 0px !important;
    color: #ffffff !important;
    padding: 0px !important;
  }

  .members-btn .el-badge__content.is-fixed {
    top: 14px;
    right: 20px;
  }

  .open-window-page .el-dialog__body {
    background: -webkit-gradient(
      linear,
      10% 10%,
      100% 100%,
      color-stop(0.24, rgb(62, 68, 89)),
      color-stop(0.74, rgb(99, 100, 109)),
      color-stop(1, rgb(137, 135, 136))
    ) !important;
    border: 0px !important;
    color: #ffffff !important;
  }

  .open-window-page .el-dialog__header, .open-window-page .el-dialog__title {
    background: #3E4459;
    color: #ffffff;
  }

</style>
