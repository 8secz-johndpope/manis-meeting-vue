<template>
  <div class="right-ctl-container room-members">
    <el-row :gutter="0" class="segmentation-row">
      <el-col :span="6" :offset="6" class="segmentation-col">
        <div class="active-segmentation-part"></div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" class="member-row room-info-row">
      <el-col :span="20">
        <el-row class="room-info">
          <el-col :span="11"><span>会议房间号:</span></el-col>
          <el-col :span="13"><span>{{ roomNumber }}</span></el-col>
        </el-row>
        <el-row class="room-info">
          <el-col :span="11"><span>会议类型:</span></el-col>
          <el-col :span="13"><span>{{ roomNumber | formatRoomType }}</span></el-col>
        </el-row>
        <el-row class="room-info">
          <el-col :span="11"><span>参会昵称:</span></el-col>
          <el-col :span="13"><span>{{ nickname | getNickname }}</span></el-col>
        </el-row>
        <el-row class="room-info">
          <el-col :span="11"><span>参会角色:</span></el-col>
          <el-col :span="13"><span>{{ isModerator | formatRole }}</span></el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" class="member-row room-member-row">
      <el-col :span="20">
        <el-row class="ctl-all-audio-row" :gutter="10" v-show="isModerator">
          <el-col :span="8">
            <el-button type="default" size="small" @click="openInviteDialog">邀请参会</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="danger" size="small" @click="setRoomAudioMute(true)">全员静音</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="success" size="small" @click="setRoomAudioMute(false)">取消静音</el-button>
          </el-col>
        </el-row>
        <el-collapse>
          <el-collapse-item v-for="(item, index ) in members" :key="index">
            <template slot="title">
              <el-col :span="12" class="member-item">
                <a href="javascript: void (0);"><span class="nickname">{{ item.nickname | getNickname }}</span></a>
              </el-col>
              <el-col :span="3" class="member-item">
                <a href="javascript: void (0);" @click.stop="switchSomeoneAudio(item)">
                  <i class="icon-icons8_Mute_Unmute btn-icon"  v-if="item.audio_muted"></i>
                  <i class="icon-icons8_Microphone btn-icon"  v-else></i>
                </a>
              </el-col>
              <el-col :span="3" class="member-item">
                <a href="javascript: void (0);" @click.stop="switchSomeoneVideo(item)">
                  <i class="icon-icons8_No_Video btn-icon"  v-if="item.video_muted"></i>
                  <i class="icon-icons8_Video_Call btn-icon"  v-else></i>
                </a>
              </el-col>
              <el-col :span="3" class="member-item">
                <a href="javascript: void (0);" @click.stop="grantAdministrator(item)">
                  <i class="icon-icons8-master-32"></i>
                </a>
              </el-col>
              <el-col :span="3" class="member-item">
                <a href="javascript: void (0);" @click.stop="kickOutSomeone(item)">
                  <i class="icon-icons8_Exit_1"></i>
                </a>
              </el-col>
            </template>
            <div>
              <div class="member-info">
                <el-col :span="12">
                  <span>分辨率</span>
                </el-col>
                <el-col :span="12" v-if="item.media_sources && item.media_sources.video && item.media_sources.video.resolution">
                  <span>{{item.media_sources.video.resolution.width}} X {{item.media_sources.video.resolution.height}}</span>
                </el-col>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
    <!--<el-row type="flex" justify="center" class="member-row room-invite-row">
      <el-col :span="20">
        <div class="room-invite-url">
          <a href="javascript: void (0);"  @click="copyRoomAddress">
            <div style="margin-top: 15px;">
              <el-input
                type="text"
                placeholder="请输入内容"
                v-model="textarea"
              >
                <template slot="append" ><span class="el-icon-document"></span></template>
              </el-input>
            </div>
          </a>
        </div>
      </el-col>
    </el-row>-->
  </div>
</template>
<script>
import Utils from '../../utils/utils'
export default {
  name: 'meeting-room-members',
  props: ['members', 'nickname', 'isModerator', 'screenSharing'],
  components: {
  },
  data: function () {
    return {
      roomNumber: '',
      textarea: 'https://dev.fdclouds.com/meeting/101220016',
      allMute: false
    }
  },
  filters: {
    formatRoomType (num) {
      return Utils.getRoomType(num)
    },
    formatRole (tag) {
      return Utils.getRole(tag)
    },
    getNickname (nickname) {
      return Utils.formatNickname(nickname)
    }
  },
  methods: {
    switchSomeoneAudio: function (item) {
      let _this = this
      console.log('handle switch someone audio', item)
      if (!_this.isModerator) {
        // not moderator, without this right
        Utils.notification(_this, '对不起,您无权执行此操作')
        return true
      }
      Utils.switchSomeoneAudioStatus(item.resource, !item.audio_muted, function (res) {
        console.log('handle set ', item.nickname, ' audio mute status to ', res.response)
        if (item.is_moderator) {
          _this.$store.dispatch('conferenceRoom/updateAudioStatus', res.response)
        }
      })
    },

    switchSomeoneVideo: function (item) {
      let _this = this
      console.log('handle switch someone video', item)
      if (!_this.isModerator) {
        // not moderator, without this right
        Utils.notification(_this, '对不起,您无权执行此操作')
        return true
      }
      Utils.switchSomeoneVideoStatus(item.resource, !item.video_muted, function (res) {
        console.log('handle set ', item.nickname, ' video mute status to ', res.response)
        if (item.is_moderator) {
          _this.$store.dispatch('conferenceRoom/updateVideoStatus', res.response)
        }
      })
    },

    copyRoomAddress: function () {
      console.log('handle copy room address url')
    },

    grantAdministrator: function (item) {
      let _this = this
      if (!_this.isModerator) {
        // not moderator, without this right
        Utils.notification(_this, '对不起,您无权执行此操作')
        return true
      }
      if (item.resource.indexOf('gateway') !== -1) {
        Utils.notification(_this, '对不起,不能将房间管理权限移交给硬件终端')
        return true
      }
      if (_this.screenSharing) {
        Utils.notification(_this, '屏幕分享正在进行,无法将管理权限移交给他人')
        return true
      }
      console.log('handle grant administrator', item)
      if (item.is_moderator) {
        // is moderator, ignore
        return true
      }
      _this.$toast.question('此操作将把主持人权限移交给:"' + item.nickname + '"?', '提示', {
        timeout: 20000,
        close: false,
        overlay: true,
        toastOnce: true,
        id: 'question',
        zindex: 999,
        position: 'center',
        buttons: [
          ['<button><b>确定</b></button>', function (instance, toast) {
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button')
            console.log('handle yes click')
            Utils.grantModerator(item.resource, function (res) {
              console.info(res)
              _this.$store.dispatch('conferenceRoom/updateControlStatus', false)
            })
          }, true],
          ['<button>取消</button>', function (instance, toast) {
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button')
            console.log('handle no click')
          }]
        ]
      })
    },

    kickOutSomeone: function (item) {
      let _this = this
      console.log('handle kick out some one', item)
      if (!this.isModerator) {
        // not moderator, without this right
        Utils.notification(_this, '对不起,您无权执行此操作')
        return true
      }
      if (item.is_moderator) {
        return true
      }
      _this.$toast.question('此操作将把"' + item.nickname + '"从当前房间移出?', '提示', {
        timeout: 20000,
        close: false,
        overlay: true,
        toastOnce: true,
        id: 'question',
        zindex: 999,
        position: 'center',
        buttons: [
          ['<button><b>确定</b></button>', function (instance, toast) {
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button')
            console.log('handle yes click')
            Utils.ejectSomeone(item.resource, function (res) {
              console.info(res)
            })
          }, true],
          ['<button>取消</button>', function (instance, toast) {
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button')
            console.log('handle no click')
          }]
        ]
      })
    },

    setRoomAudioMute: function (status) {
      let _this = this
      Utils.switchAllAudioMute(status, function (res) {
        console.log('handle set room audio status result: ', res)
        _this.allMute = status
      })
    },

    openInviteDialog: function () {
      this.$emit('showInviteDialog', true)
    }
  },
  mounted: function () {
    this.roomNumber = this.$route.params.roomNumber
  }
}
</script>
<style scoped>
  .member-row {
    margin: 20px auto;
  }

  .room-member-row {
    margin-bottom: 100px;
  }

  .member-item {
    overflow: hidden;
  }

  .member-item a {
    text-decoration:none;
    color: #EEEEEE;
    font-size: 1.2rem;
  }

  .member-info, .room-info-row, .el-collapse-item__arrow {
    color: #EEEEEE;
  }

  .room-invite-row {
    position: fixed;
    bottom: 0px;
    width: 360px;
    z-index: 3;
  }

  .room-member-row {
    border-top: 2px solid;
  }

  .ctl-all-audio-row {
    margin-top: 10px;
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

  .room-info.el-row {
    line-height: 21px;
  }

</style>
