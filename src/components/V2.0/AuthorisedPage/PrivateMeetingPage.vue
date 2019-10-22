<template>
  <div class="gradual-bg block-top">
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="private-room-title">
          <small>
            <span>我的个人会议室</span>
          </small>
        </div>
      </el-col>
      <el-col :span="24">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-row :gutter="0" class="private-room-link">
              <el-col class="text-center" :span="4" :offset="2">
                <v-icon name="link"></v-icon>
              </el-col>
              <el-col :span="12">
                <div class="text-center">{{privateRoom | formatRoomNo}}</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12" class="private-room-submit">
            <!--<el-button round @click="startPrivateMeeting" class="light-blue">
              <strong>进入会议</strong>
            </el-button>-->
            <el-dropdown class="attend-dropdown-menu" split-button round  trigger="click" @click="startPrivateMeeting" @command="handleCommand">
              进入会议
              <el-dropdown-menu slot="dropdown" class="attend-dropdown">
                <el-dropdown-item command="sip" :disabled="!callConfig.sip">呼叫SIP</el-dropdown-item>
                <el-dropdown-item command="h323" :disabled="!callConfig.h323">呼叫H323</el-dropdown-item>
                <el-dropdown-item command="tel" :disabled="!callConfig.tel">呼叫电话</el-dropdown-item>
                <el-dropdown-item command="other" :disabled="!callConfig.other">使用其他终端参会</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Utils from '../../../utils/utils'

export default {
  name: 'v2-authorised-private-room-page',
  components: {},
  data: function () {
    return {
      privateRoom: '',
      privatePass: '',
      callConfig: window.config.call || {
        sip: false,
        h323: false,
        tel: false,
        other: false
      }
    }
  },
  methods: {
    copyMyPrivateRoomInfo () {
      let _this = this
      let content = ''
      content += '会议号: ' + _this.privateRoom +
        '\n' +
        '会议室密码: ' + (_this.privatePass || '')
      _this.$copyText(content).then(res => {
        Utils.notification(_this, '会议信息复制成功')
      }).catch(e => {
        console.log('copy conference information failed: ', e)
      })
    },
    getPrivateMeeting () {
      let _this = this
      Utils.getPrivateRoom(
        _this.apiServer,
        window.config,
        function (res) {
          console.log('handle private room result: ', res)
          if (res.mcode === 200) {
            _this.privateRoom = window.config.cNumber
            _this.privatePass = res.obj.meetPassword || ''
          }
        }
      )
    },
    startPrivateMeeting () {
      let _this = this
      if (_this.privateRoom) {
        _this.$emit('participate', _this.privateRoom, _this.privatePass)
      }
    },

    handleCommand (type) {
      let _this = this
      _this.$emit('attend', _this.privateRoom, _this.privatePass, type)
    }
  },
  filters: {
    formatRoomNo: function (str) {
      if (str.length) {
        return str
      }
    }
  },
  computed: {
    apiServer () {
      return this.$store.state.serverSetting.serverAddr
    }
  },
  mounted: function () {
    // this.privateRoom = window.config.cNumber || '101220016'
    this.getPrivateMeeting()
  },
  beforeDestroy: function () {
  }
}
</script>

<style scoped>
  .gradual-bg {
    padding: 10px;
    margin: 10px;
    color: #eeeeee;
    /* background-color: #0D4A96; */
    background: -webkit-gradient(
      linear,
      10% 10%,
      100% 100%,
      color-stop(0.24, rgb(62, 68, 89)),
      color-stop(0.74, rgb(99, 100, 109)),
      color-stop(1, rgb(137, 135, 136))
    );
  }

  a.none-decoration {
    text-decoration: none;
    color: inherit;
  }

  .block-top {
    height: 88px;
    border-radius: 5px;
  }

  .private-room-link {
    border-radius: 20px;
    padding: 12px 10px 8px 10px;
    color: #ffffff;
    background-color: rgba(99, 100, 109, 0.5);
    border-color: rgba(137, 135, 136, 0.5);
    text-align: center;
  }

  .el-input__inner {
    color: #ffffff;
    background-color: #5580B5;
    border-color: #5580B5;
  }

  .private-room-title {
    margin-bottom: 10px;
  }

  .light-blue {
    color: #ffffff;
    background-color: rgba(99, 100, 109, 0.5);
  }

  .el-button.light-blue {
    border-color: #898788;
  }

  .private-room-submit {
    text-align: right;
  }
</style>
