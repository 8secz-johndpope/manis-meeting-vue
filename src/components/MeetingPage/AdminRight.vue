<template>
  <div class="right-ctl-container admin-right">
    <el-row :gutter="0" class="segmentation-row">
      <el-col :span="6" :offset="0" class="segmentation-col">
        <div class="active-segmentation-part"></div>
      </el-col>
    </el-row>
    <el-row class="fetch-admin-row" v-show="!isModerator">
      <el-col :span="20" :offset="2">
        <div class="grid-content bg-purple-dark">
          <el-form :inline="true" :model="fetchAdminForm"  :rules="fetchAdminFormRule" ref="fetchAdminForm"  class="demo-form-inline" @submit.native.prevent>
            <el-form-item label="" prop="authToken">
              <el-input v-model="fetchAdminForm.authToken" placeholder="请输入主持人密码" @keyup.enter.native="onFetchAdminSubmit('fetchAdminForm')" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onFetchAdminSubmit('fetchAdminForm')" :disabled="isModerator">获取权限</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <el-row class="terminal-client-row" v-show="isModerator">
      <el-col :span="20" :offset="2">
        <el-tabs v-model="activeName" @tab-click="handleClientTypeClick"  type="border-card">
          <el-tab-pane label="呼叫视频终端" name="sip">
            <div>
              <el-input maxlength="16" placeholder="请输入视频终端号" v-model="clientNumber"  @keyup.enter.native="doSipCall" clearable>
                <el-select v-model="clientType" slot="prepend" placeholder="终端类型">
                  <el-option label="SIP" value="sip"></el-option>
                  <el-option label="H323" value="h323"></el-option>
                </el-select>
              </el-input>
            </div>
          </el-tab-pane>
          <el-tab-pane label="拨打电话" name="phone">
            <div>
              <el-input  maxlength="16" placeholder="请输入电话号码" v-model="clientNumber"  @keyup.enter.native="doPhoneCall" clearable>
                <template slot="prepend">
                  <span class="color-dark">Tel</span>
                </template>
              </el-input>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="20" :offset="2">
        <el-row class="number-row">
          <el-row class="number-group" :gutter="10">
            <el-col :span="8">
              <div class="grid-content">
                <el-button type="" @click="appendClientNum(7)">7</el-button>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <el-button type="" @click="appendClientNum(8)">8</el-button>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <el-button type="" @click="appendClientNum(9)">9</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row class="number-group" :gutter="10">
            <el-col :span="8">
              <div class="grid-content">
                <el-button type="" @click="appendClientNum(4)">4</el-button>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <el-button type="" @click="appendClientNum(5)">5</el-button>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <el-button type="" @click="appendClientNum(6)">6</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row class="number-group" :gutter="10">
            <el-col :span="8">
              <div class="grid-content">
                <el-button type="" @click="appendClientNum(1)">1</el-button>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <el-button type="" @click="appendClientNum(2)">2</el-button>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <el-button type="" @click="appendClientNum(3)">3</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row class="number-group" :gutter="10">
            <el-col :span="8">
              <div class="grid-content">
                <el-button type="success" @click="subClientNum">
                  <span class="del">删除</span>
                </el-button>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <el-button type="" @click="appendClientNum(0)">0</el-button>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <el-button type="success" @click="doClientCall">
                  <span class="call">拨号</span>
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-row>
      </el-col>
      <el-col :span="20" :offset="2">
        <div class="parting-line"></div>
        <el-row>
          <el-col :span="12">
            <el-row class="recorder-btn-row text-center">
              <el-button type="success" @click="onStartRecordClick" v-show="!recording" :disabled="recording || btnDisabled">会议录制</el-button>
              <el-button type="danger" @click="onStopRecordClick" v-show="recording" :disabled="!recording || btnDisabled">结束录制</el-button>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row class="drawing-btn-row text-center">
              <el-button type="info" @click="openDrawingBoard" :disabled="screenShareStatus">打开画图板</el-button>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="20" :offset="2">
        <div class="parting-line"></div>
        <el-row class="display-mode-row" :gutter="20">
          <a href="javascript: void(0);" @click="onDisplayModeClick('0')">
            <el-col :span="12" class="display-mode">
              <el-row :gutter="4" :class="['display-mode-item surround-mode', {'active': displayMode === '0'}]">
                <el-col :span="24"><div class="grid-content bg-purple surround-mode-main"><span class="icon-icons8_Video_Chat"></span></div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple"><span class="icon-icons8_Video_Chat"></span></div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple"><span class="icon-icons8_Video_Chat"></span></div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple"><span class="icon-icons8_Video_Chat"></span></div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple"><span class="icon-icons8_Video_Chat"></span></div></el-col>
                <el-col :span="24"><div class="grid-content text-center display-mode-name">环绕模式</div></el-col>
              </el-row>
            </el-col>
          </a>
          <a href="javascript: void (0);" @click="onDisplayModeClick('5')">
            <el-col :span="12" class="display-mode">
              <el-row :gutter="4" :class="['display-mode-item spread-mode', {'active': displayMode === '5'}]">
                <el-col :span="8"><div class="grid-content bg-purple"><span class="icon-icons8_Video_Chat"></span></div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple"><span class="icon-icons8_Video_Chat"></span></div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple"><span class="icon-icons8_Video_Chat"></span></div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple"><span class="icon-icons8_Video_Chat"></span></div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple"><span class="icon-icons8_Video_Chat"></span></div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple"><span class="icon-icons8_Video_Chat"></span></div></el-col>
                <el-col :span="24"><div class="grid-content text-center display-mode-name">平铺模式</div></el-col>
              </el-row>
            </el-col>
          </a>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Utils from '../../utils/utils'
export default {
  name: 'meeting-admin-right',
  props: {
    screenShareStatus: Boolean
  },
  components: {
  },
  data: function () {
    var validateAuthToken = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入主持人密码'))
      } else {
        callback()
      }
    }
    return {
      fetchAdminForm: {
        authToken: ''
      },
      fetchAdminFormRule: {
        authToken: [
          { validator: validateAuthToken, trigger: 'blur' }
        ]
      },
      clientNumber: '',
      clientType: 'sip',
      btnDisabled: false,
      activeName: 'phone'
    }
  },
  filters: {
  },
  methods: {
    /**
       * submit fetch admin request
       * @param formName
       */
    onFetchAdminSubmit (formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          // start fetch admin
          Utils.fetchAdminRight(_this.fetchAdminForm.authToken, _this.handleFetchAdminSuccess, _this.handleFetchAdminFailed)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    /**
       * handle fetch admin success
       * @param res
       */
    handleFetchAdminSuccess (res) {
      let _this = this
      console.log('handle fetch admin success: ', res)
      _this.fetchAdminForm.authToken = ''
    },

    /**
       * handle fetch admin failed
       * @param res
       */
    handleFetchAdminFailed (res) {
      let _this = this
      _this.fetchAdminForm.authToken = ''
      console.error('handle fetch admin failed: ', res)
      if (res.errorCode === '300418') {
        // password wrong
        Utils.notification(_this, '获取主持人权限失败,管理员密码错误', 'error')
      } else if (res.errorCode === '300419') {
        // moderator exist
        Utils.notification(_this, '获取主持人权限失败,房间存在管理员')
      } else {
        // fetch admin failed
        Utils.notification(_this, '获取主持人权限失败')
      }
    },

    /**
       * do phone call
       */
    doPhoneCall () {
      let _this = this
      Utils.fetchRightPhoneNum(_this.clientNumber, function (res) {
        Utils.sendClientCall(res.response, function () {
          _this.showCallInProgress(_this.clientNumber, res.response)
        }, function (err) {
          console.error('handle phone client call failed: ', err)
        })
      }, function (err) {
        console.error(err)
      })
    },

    /**
       * do sip call
       */
    doSipCall () {
      let _this = this
      let clientNum = _this.clientType + ':' + _this.clientNumber
      Utils.sendClientCall(clientNum, function (res) {
        _this.showCallInProgress(_this.clientNumber, clientNum)
      }, function (err) {
        console.error('handle sip client call failed: ', err)
      })
    },

    /**
       * do client call
       */
    doClientCall () {
      let _this = this
      if (_this.activeName === 'phone') {
        _this.doPhoneCall()
      } else if (_this.activeName === 'sip') {
        _this.doSipCall()
      }
    },

    /**
       * show call in progress
       * @param showNum
       * @param originNum
       */
    showCallInProgress (showNum, originNum) {
      let _this = this
      _this.clientNumber = ''
      _this.$toast.question(showNum, '正在呼叫', {
        timeout: (1000 * 60),
        close: false,
        id: 'question_' + showNum,
        zindex: 999,
        position: 'bottomRight',
        buttons: [
          [
            '<button><b>取消呼叫</b></button>',
            function (instance, toast) {
              console.log('will cancel call: ', originNum, showNum)
              Utils.cancelClientCall(originNum, function (res) {
                console.log('handle cancel call: ', res)
              })
              instance.hide({transitionOut: 'fadeOut'}, toast, 'button')
            },
            true
          ],
          [
            '<button>关闭</button>',
            function (instance, toast) {
              instance.hide({transitionOut: 'fadeOut'}, toast, 'button')
            }
          ]
        ]
      })
    },

    /**
       * handle client type select
       * @param tab
       * @param event
       */
    handleClientTypeClick (tab, event) {
      this.activeName = tab.name
    },

    /**
       * append client number
       * @param num
       */
    appendClientNum: function (num) {
      this.clientNumber += num.toString()
    },

    /**
       * sub client number
       */
    subClientNum: function () {
      if (this.clientNumber.length) {
        this.clientNumber = this.clientNumber.substr(0, (this.clientNumber.length - 1))
      }
    },

    /**
       * start record
       */
    onStartRecordClick: function () {
      let _this = this
      console.log('start to record')
      // update source
      Utils.updateRecorderSource(
        _this.apiServer,
        window.config,
        function (res) {
          console.log('handle config result: ', res)
          _this.handleUpdateRecordSource(res)
        }
      )
    },

    /**
       * handle update recorder config response
       * @param res
       * @returns {boolean}
       */
    handleUpdateRecordSource: function (res) {
      let _this = this
      if (!res) {
        // record config error, return
        Utils.notification(_this, '会议录制失败,录播服务器配置错误')
        return false
      }
      // do start record
      Utils.startRecord(_this.apiServer, window.config, res, _this.handleStartRecordResponse)
    },

    /**
       * handle start record request
       * @param res
       */
    handleStartRecordResponse: function (res) {
      let _this = this
      console.log('handle start record response', res)
      if (_this.disabledTimer) {
        clearTimeout(_this.disabledTimer)
        _this.disabledTimer = null
      }
      _this.btnDisabled = true
      _this.disabledTimer = setTimeout(function () {
        _this.btnDisabled = false
      }, 1000 * 60)
    },

    /**
       * click stop record
       */
    onStopRecordClick: function () {
      let _this = this
      console.log('stop to record')
      Utils.stopRecord(_this.apiServer, window.config, _this.recorder, _this.handleStopRecordResponse)
    },

    /**
       * handle stop record click response
       * @param res
       */
    handleStopRecordResponse: function (res) {
      let _this = this
      console.log('handle stop record response', res)
      if (_this.disabledTimer) {
        clearTimeout(_this.disabledTimer)
        _this.disabledTimer = null
      }
      _this.btnDisabled = true
      _this.disabledTimer = setTimeout(function () {
        _this.btnDisabled = false
      }, 1000 * 60)
    },

    /**
       * change display mode
       * @param mode
       */
    onDisplayModeClick: function (_mode) {
      let _this = this
      if (_this.screenShareStatus) {
        Utils.notification(_this, '屏幕分享正在进行,请勿切换显示模式')
        return false
      }
      Utils.setDisplayMode(
        parseInt(_mode),
        function (res) {
          console.log('handle change display mode result : ', res)
          if (res.errorCode === Utils.noErr) {
            _this.$store.dispatch('conferenceRoom/updateDisplaySort', {
              mode: _mode,
              sort: []
            })
          }
        }
      )
    },

    /**
       * open drawing board
       */
    openDrawingBoard: function () {
      if (this.screenShareStatus) {
        Utils.notification(this, '屏幕分享过程中不能进行画板操作', 'error')
        return false
      }
      this.$emit('switchDrawingBoard', true)
    }
  },
  computed: {
    isModerator () {
      return this.$store.state.conferenceRoom.isModerator
    },
    recording () {
      return this.$store.state.conferenceRoom.recording
    },
    recorder () {
      return this.$store.state.conferenceRoom.recorder
    },
    apiServer () {
      return this.$store.state.serverSetting.serverAddr
    },
    displayMode () {
      return this.$store.state.conferenceRoom.mode
    }
  },
  mounted: function () {
  }
}
</script>
<style scoped>
  .fetch-admin-row {
    margin-top: 40px;
  }

  .number-row {
    margin-top: 20px;
  }

  .number-row .grid-content {
    text-align: center;
  }

  .number-group {
    margin: 20px auto;
  }

  .el-select {
    width: 80px;
  }

  .parting-line {
    height: 2px;
    background: #eeeeee;
  }

  .recorder-btn-row, .drawing-btn-row {
    margin: 20px auto;
  }

  .text-center {
    text-align: center;
  }

  .display-mode-row {
    margin: 0px;
  }

  .display-mode {
    margin: 20px auto;
  }

  .display-mode .bg-purple {
    text-align: center;
  }

  .surround-mode, .spread-mode {
    background: #eeeeee;
  }

  .surround-mode .bg-purple {
    height: 24px;
    background: #000000;
    margin: 2px auto;
    padding: 4px;
  }

  .surround-mode .surround-mode-main {
    height: 48px;
    padding: 16px;
  }

  .spread-mode .bg-purple {
    height: 36px;
    background: #000000;
    margin: 2px auto;
    padding: 10px;
  }

  .display-mode-item .display-mode-name {
    color: #606266;
  }

  .display-mode-item.active .display-mode-name {
    color: #5ED055;
  }

  .display-mode-item {
    border: solid #eeeeee;
    color: #eeeeee;
  }

  .display-mode-item.active {
    border: solid #5ED055;
    color: #5ED055;
  }

  .right-ctl-container {
    margin-top: 40px;
  }

    .segmentation-row{
    background-color: #eeeeee;
    padding-left: 12px;
    margin-bottom: 10px;
  }

  .segmentation-col {
    height: 2px;
    text-align: center;
    padding: 0px 5px;
  }

  .segmentation-col>.active-segmentation-part {
    height: 2px;
    background-color: #5ED055;
  }

</style>
