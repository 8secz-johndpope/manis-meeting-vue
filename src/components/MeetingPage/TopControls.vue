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
            <el-button circle @click="switchAudioMute" :class="['ctl-btn',{'active': audioMute}]">
              <i class="icon-icons8_Mute_Unmute btn-icon"  v-if="audioMute"></i>
              <i class="icon-icons8_Microphone btn-icon"  v-else></i>
            </el-button>
          </el-col>
          <el-col :span="6" class="block-center-text">
            <el-button circle @click="switchVideoMute" :class="['ctl-btn',{'active': videoMute}]">
              <i class="icon-icons8_No_Video btn-icon"  v-if="videoMute"></i>
              <i class="icon-icons8_Video_Call btn-icon"  v-else></i>
            </el-button>
          </el-col>
          <el-col :span="6" class="block-center-text">
            <el-button circle @click="switchScreenShare" :class="['ctl-btn', {'active': screenShareStatus}]" :disabled="!isModerator">
              <i class="icon-icons8_Laptop btn-icon"></i>
            </el-button>
          </el-col>
          <el-col :span="6" class="block-center-text">
            <el-button circle @click="leaveRoom" class="ctl-btn">
              <i class="icon-icons8_End_Call btn-icon text-danger"></i>
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="top-btn-block right-btn-block">
        <el-row>
          <el-col :span="4">
            <div class="close-right-btn-container">
              <el-button icon="el-icon-close" circle @click="closeSideBar"  v-if="showAdminRight || showMembers || showTextMsg || showDeviceSetting"></el-button>
            </div>
          </el-col>
          <el-col :span="5" class="block-right-text">
            <el-button @click="switchFetchAdmin" :class="['right-ctl-btn', {'font-white': (!showAdminRight && !showMembers && !showTextMsg && !showDeviceSetting)}, {'active': showAdminRight}]">
              <i class="icon-icons8_Moderator btn-icon"></i>
              <div class="text-center"><small>管理</small></div>
            </el-button>
          </el-col>
          <el-col :span="5" class="block-right-text">
            <el-badge :value="membersCount" class="members-btn" type="info">
              <el-button @click="switchRoomMembers" :class="['right-ctl-btn', {'font-white': (!showAdminRight && !showMembers && !showTextMsg && !showDeviceSetting)}, {'active': showMembers}]">
                <i class="icon-icons8_User_Account btn-icon"></i>
                <div class="text-center"><small>参会人</small></div>
              </el-button>
            </el-badge>
          </el-col>
          <el-col :span="5" class="block-right-text">
            <el-button @click="switchTextMsg" :class="['right-ctl-btn', {'font-white': (!showAdminRight && !showMembers && !showTextMsg && !showDeviceSetting)}, {'active': showTextMsg}]">
              <el-badge v-if="unreadMsg" is-dot class="item"><i class="icon-icons8_Chat btn-icon"></i></el-badge>
              <span v-else><i class="icon-icons8_Chat btn-icon"></i></span>
              <div class="text-center"><small>聊天</small></div>
            </el-button>
          </el-col>
          <el-col :span="5" class="block-right-text">
            <el-button @click="switchDeviceSetting" :class="['right-ctl-btn', {'font-white': (!showAdminRight && !showMembers && !showTextMsg && !showDeviceSetting)}, {'active': showDeviceSetting}]">
              <i class="icon-icons8_Settings btn-icon"></i>
              <div class="text-center"><small>设置</small></div>
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
    unreadMsg: Boolean,
    audioTakeover: Boolean,
    videoTakeover: Boolean
  },
  components: {
  },
  data: function () {
    return {
      membersCount: 1
    }
  },
  methods: {
    leaveRoom: function () {
      this.$emit('leaveRoom')
    },
    getMembers: function (cb) {
      let _this = this
      Utils.getParticipateMembers(function (members) {
        console.log('handle room members: ', members)
        _this.membersCount = members.length
        if (cb && typeof (cb) === 'function') {
          cb(members)
        }
      })
    },
    switchRoomMembers: function () {
      let _this = this
      _this.getMembers(members => {
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
    closeSideBar: function () {
      this.$emit('closeSideBar')
    },
    switchAudioMute: function () {
      let _this = this
      if (_this.audioTakeover && !_this.isModerator) {
        Utils.notification(_this, '对不起,您的音频开关已经被管理员接管', 'error')
        return false
      }
      let status = !_this.audioMute
      // Utils.changeAudioSwitch(status, function (res) {
      //   console.log('handle switch audio mute res', res)
      //   _this.$store.dispatch('conferenceRoom/updateAudioStatus', res)
      // })
      _this.$emit('setLocalAudioMuteStatus', status)
    },
    switchVideoMute: function () {
      let _this = this
      if (_this.videoTakeover && !_this.isModerator) {
        Utils.notification(_this, '对不起,您的视频开关已经被管理员接管', 'error')
        return false
      }
      let status = !_this.videoMute
      // Utils.changeVideoSwitch(status, function (res) {
      //   console.log('handle switch video mute res', res)
      //   _this.$store.dispatch('conferenceRoom/updateVideoStatus', res)
      // })
      _this.$emit('setLocalVideoMuteStatus', status)
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
    this.getMembers()
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
    top: 30px;
    left: 0px;
    right: 0px;
    z-index: 3;
    background: rgba(0, 0, 0, .0) none repeat scroll !important;
    background: #000;
    filter: Alpha(opacity=50);
    box-shadow: 0px 10px 10px rgba(0, 0, 0, .0);;
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
    width: 280px;
    margin: 0 auto;
    z-index: 3;
  }

  div.right-btn-block {
    width: 380px;
    position: fixed;
    top: 30px;
    right: 0px;
    float: right;
    /*padding-right: 20px;*/
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

  .el-button.ctl-btn, .el-button.ctl-btn:hover, .el-button.ctl-btn:active, .el-button.ctl-btn:focus {
    /*background: #333;*/
    border: 2px solid #dcdfe6;
  }

  .el-button.ctl-btn.is-disabled, .el-button.ctl-btn.is-disabled:focus, .el-button.ctl-btn.is-disabled:hover {
    background-color: #aaa;
  }

  .el-button.ctl-btn.active {
    background: #5ED055;
    color: #ffffff;
  }

  .el-button.right-ctl-btn {
    border: 0px;
    background: none;
  }

  .font-white {
    color: #ffffff;
  }

  .font-default {
    color: #606266;
  }

  .el-button.right-ctl-btn.active {
    color: #5ED055;
  }

  .close-right-btn-container {
    width: 40px;
    padding: 10px 0px;
    float: right;
    margin-right: -15px;
  }

</style>
