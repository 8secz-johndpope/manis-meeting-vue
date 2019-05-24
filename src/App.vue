<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Utils from './utils/utils'

export default {
  name: 'manis-meeting-vue',
  data: function () {
    return {}
  },
  methods: {
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
        Utils.notification(_this, '网络连接好像出了点问题', 'error')
        _this.resetConnect()
        window.setTimeout(function () {
          _this.$router.push({name: 'v2-login'})
          // location.reload()
        }, 2000)
      })
    }
  },
  mounted: function () {
    this.checkConnected()
    this.systemError()
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

</style>
