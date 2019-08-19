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
          <el-col :span="16">
            <a href="javascript: void (0);" @click="copyMyPrivateRoomInfo">
              <el-row :gutter="0" class="private-room-link">
                <el-col class="text-center" :span="4" :offset="2">
                  <v-icon name="link"></v-icon>
                </el-col>
                <el-col :span="12">
                  <div class="text-center">{{privateRoom | formatRoomNo}}</div>
                </el-col>
              </el-row>
            </a>
          </el-col>
          <el-col :span="8" class="private-room-submit">
            <el-button round @click="startPrivateMeeting" class="light-blue">
              <strong>进入会议</strong>
            </el-button>
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
      privatePass: ''
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
