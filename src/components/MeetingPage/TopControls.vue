<template>
  <div>
    <div class="ctl-top-row">
      <div class="top-btn-block left-btn-block">
        <el-row>
          <el-col :span="24" class="block-center-text recorder-status" v-show="recording">
              <div class="text-danger blink">
                <span class="icon-icons8_Record_red"></span>
                <span>REC</span>
              </div>
          </el-col>
        </el-row>
      </div>
      <div class="top-btn-block center-btn-block">
        <el-row>
          <el-col :span="6" class="block-center-text">
            <el-button circle @click="switchAudioMute" :class="{'active': audioMute}">
              <i class="icon-icons8_Mute_Unmute btn-icon"  v-if="audioMute"></i>
              <i class="icon-icons8_Microphone btn-icon"  v-else></i>
            </el-button>
          </el-col>
          <el-col :span="6" class="block-center-text">
            <el-button circle @click="switchVideoMute" :class="{'active': videoMute}">
              <i class="icon-icons8_No_Video btn-icon"  v-if="videoMute"></i>
              <i class="icon-icons8_Video_Call btn-icon"  v-else></i>
            </el-button>
          </el-col>
          <el-col :span="6" class="block-center-text">
            <el-button circle @click="switchScreenShare" :class="{'active': screenShareStatus}" :disabled="!isModerator">
              <i class="icon-icons8_Laptop btn-icon"></i>
            </el-button>
          </el-col>
          <el-col :span="6" class="block-center-text">
            <el-button circle @click="leaveRoom">
              <i class="icon-icons8_End_Call btn-icon text-danger"></i>
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="top-btn-block right-btn-block">
        <el-row>
          <el-col :span="6" class="block-right-text">
            <el-button circle @click="switchFetchAdmin" :class="{'active': showAdminRight}">
              <i class="icon-icons8_Moderator btn-icon"></i>
            </el-button>
          </el-col>
          <el-col :span="6" class="block-right-text">
            <el-button circle @click="switchRoomMembers" :class="{'active': showMembers}">
              <i class="icon-icons8_User_Account btn-icon"></i>
            </el-button>
          </el-col>
          <el-col :span="6" class="block-right-text">
            <el-button circle @click="switchTextMsg" :class="{'active': showTextMsg}">
              <el-badge v-if="unreadMsg" is-dot class="item"><i class="icon-icons8_Chat btn-icon"></i></el-badge>
              <span v-else><i class="icon-icons8_Chat btn-icon"></i></span>
            </el-button>
          </el-col>
          <el-col :span="6" class="block-right-text">
            <el-button circle @click="switchDeviceSetting" :class="{'active': showDeviceSetting}">
              <i class="icon-icons8_Settings btn-icon"></i>
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Utils from '../../utils/utils'

export default {
  name: 'meeting-top-controls',
  props: {
    screenShareStatus: Boolean,
    showMembers: Boolean,
    showTextMsg: Boolean,
    showDeviceSetting: Boolean,
    showAdminRight: Boolean,
    unreadMsg: Boolean
  },
  components: {
  },
  data: function () {
    return {
    }
  },
  methods: {
    leaveRoom: function () {
      this.$emit('leaveRoom')
    },
    switchRoomMembers: function () {
      let _this = this
      Utils.getParticipateMembers(function (members) {
        console.log('handle room members: ', members)
        _this.$emit('switchRoomMembers', members)
      })
    },
    switchTextMsg: function () {
      this.$emit('switchTextMsg')
    },
    switchDeviceSetting: function () {
      this.$emit('switchDeviceSetting')
    },
    switchFetchAdmin: function () {
      this.$emit('switchAdminRightManage')
    },
    switchAudioMute: function () {
      let _this = this
      let status = !_this.audioMute
      Utils.changeAudioSwitch(status, function (res) {
        console.log('handle switch audio mute res', res)
        _this.$store.dispatch('conferenceRoom/updateAudioStatus', res)
      })
    },
    switchVideoMute: function () {
      let _this = this
      let status = !_this.videoMute
      Utils.changeVideoSwitch(status, function (res) {
        console.log('handle switch video mute res', res)
        _this.$store.dispatch('conferenceRoom/updateVideoStatus', res)
      })
    },
    switchScreenShare: function () {
      let _this = this
      Utils.getParticipateMembers(function (members) {
        console.log('handle room members: ', members)
        if (members.length < 2) {
          Utils.notification(_this, '需要至少有另外一位参会人员后才可以使用此功能')
          return false
        }
        if (_this.displayMode !== '0') {
          Utils.notification(_this, '当前显示模式下无法进屏幕分享,请先切换到环绕模式')
          return false
        }
        if (_this.screenShareStatus) {
          // stop share
          _this.$emit('stopShareScreen')
        } else {
          _this.$emit('switchScreenShare')
        }
      })
    }
  },
  computed: {
    displayMode () {
      return this.$store.state.conferenceRoom.mode
    },
    audioMute () {
      return this.$store.state.conferenceRoom.audioMute
    },
    videoMute () {
      return this.$store.state.conferenceRoom.videoMute
    },
    isModerator () {
      return this.$store.state.conferenceRoom.isModerator
    },
    recording () {
      return this.$store.state.conferenceRoom.recording
    }
  },
  mounted: function () {

  }
}
</script>

<style scoped>
  i.btn-icon {
    font-size: 1.4rem;
  }

  div.ctl-top-row {
    padding-top: 4px;
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    z-index: 3;
    background: rgba(0, 0, 0, .4) none repeat scroll !important;
    background: #000;
    filter: Alpha(opacity=50);
    box-shadow: 0px 10px 10px rgba(0, 0, 0, .4);;
  }

  div.left-btn-block {
    width: 100px;
    position: fixed;
    top: 4px;
    left: 4px;
    float: left;
    z-index: 3;
  }

  div.center-btn-block {
    width: 320px;
    margin: 0 auto;
    z-index: 3;
  }

  div.right-btn-block {
    width: 320px;
    position: fixed;
    top: 4px;
    right: 24px;
    float: right;
    z-index: 3;
  }

  .block-center-text {
    text-align: center;
  }

  .block-right-text {
    text-align: right;
  }

  .text-danger {
    color: #ff0000;
  }

  /* 定义keyframe动画，命名为blink */
  @keyframes blink{
    0%{opacity: 1;}
    100%{opacity: 0;}
  }
  /* 添加兼容性前缀 */
  @-webkit-keyframes blink {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }
  @-moz-keyframes blink {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }
  @-ms-keyframes blink {
    0% {opacity: 1; }
    100% { opacity: 0;}
  }
  @-o-keyframes blink {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }
  /* 定义blink类*/
  .blink{
    color: #ff0000;
    padding: 12px;
    animation: blink 3s linear infinite;
    /* 其它浏览器兼容性前缀 */
    -webkit-animation: blink 3s linear infinite;
    -moz-animation: blink 3s linear infinite;
    -ms-animation: blink 3s linear infinite;
    -o-animation: blink 3s linear infinite;
  }

  .el-button, .el-button:hover, .el-button:active, .el-button:focus {
    background: #333;
    border: 2px solid #dcdfe6;
  }

  .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
    background-color: #aaa;
  }

  button.active {
    background: #5ED055;
  }

</style>
