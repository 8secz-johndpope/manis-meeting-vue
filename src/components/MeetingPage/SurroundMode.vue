<template>
  <div class="surround-mode">
      <el-row class="surround-main">
        <el-col :span="24" v-for="(videoParticipant, index) in showVideos" :key="index">
          <div v-if="!index" class="surround-main">
            <video v-if="videoParticipant" :id="'surround-video-'+ streamSSRC(videoParticipant.stream)" class="local-video" autoplay muted></video>
            <div class="no-video-status main-status">
              <div class="no-video-status-container surround-main-status">
                <i v-if="videoParticipant.video_muted" class="icon-icons8_No_Video"></i>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="surround-sub" :gutter="10">
        <el-col :span="3"  v-for="(videoParticipant, index) in subVideos" :key="index">
          <div class="surround-sub-stream" @click="setMainDisplay(videoParticipant)">
            <video v-if="videoParticipant && !videoParticipant.video_muted" :id="'surround-video-'+ streamSSRC(videoParticipant.stream)" class="surround-sub-video"  autoplay muted></video>
            <div class="no-video-status sub-status">
              <div class="surround-sub-nickname" v-if="videoParticipant">
                <el-row>
                  <el-col :span="12" class="surround-sub-nickname">
                    {{ videoParticipant.info.resource | getNickname(participants) }}
                  </el-col>
                  <el-col :span="12" class="surround-sub-audio-status">
                    <i v-if="videoParticipant.audio_muted"  class="icon-icons8_Mute_Unmute"></i>
                  </el-col>
                </el-row>
              </div>
              <div class="no-video-status-container surround-sub-status">
                <i v-if="videoParticipant.video_muted" class="icon-icons8_No_Video"></i>
                <i v-if="videoParticipant.is_phone" class="icon-icons8_Ringer_Volume_1"></i>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
  </div>
</template>

<script>
import Utils from '../../utils/utils'
export default {
  name: 'meeting-surround-mode',
  props: ['localVideo', 'screenSharing'],
  components: {
  },
  data: function () {
    return {
      attachVideoTimer: null,
      modeChanged: false
    }
  },
  methods: {
    setMainDisplay (item) {
      let _this = this
      if (!_this.isModerator) {
        // just moderator has this right nor ignore
        return false
      }
      Utils.changeMainDisplay(
        item.info.jid,
        _this.screenSharing,
        function (res) {
          console.log('handle change main display to : ', item.info.nickname, ' result: ', res)
        }
      )
    },
    streamSSRC (stream) {
      if (stream && stream.ssrc) {
        return stream.ssrc
      }
      return ''
    },
    clearTimer () {
      let _this = this
      if (_this.attachVideoTimer) {
        window.clearTimeout(_this.attachVideoTimer)
        _this.attachVideoTimer = null
      }
    },
    attachVideo () {
      let _this = this
      if (_this.showVideos.length) {
        for (let i = 0; i < _this.showVideos.length; i++) {
          let videoStream = _this.showVideos[i]
          if (!videoStream || !videoStream.stream) {
            continue
          }
          let ssrc = videoStream.stream.ssrc || ''
          let element = document.querySelector('#surround-video-' + ssrc)
          let alreadyStream = ''
          if (element) {
            alreadyStream = element.srcObject
          }
          let alreadySSRC = ''
          if (alreadyStream && alreadyStream.ssrc) {
            alreadySSRC = alreadyStream.ssrc
          }
          if ((element && !alreadyStream) || (ssrc !== alreadySSRC) || _this.modeChanged) {
            Utils.attachStream(element, videoStream.stream)
          }
        }
        _this.modeChanged = false
      }
      _this.clearTimer()
      _this.attachVideoTimer = setTimeout(function () {
        _this.attachVideo()
      }, 1000)
    }
  },
  computed: {
    showVideos () {
      return this.$store.state.conferenceRoom.showStreams
    },
    participants () {
      return this.$store.state.conferenceRoom.videoStreams
    },
    isModerator () {
      return this.$store.state.conferenceRoom.isModerator
    },
    displayMode () {
      return this.$store.state.conferenceRoom.mode
    },
    subVideos () {
      return this.showVideos.filter(function(item,index){
        if (index) {
          return item
        }
      })
    }
  },
  filters: {
    getNickname: function (endpoint, sources) {
      let nickname = ''
      for (let i = 0; i < sources.length; i++) {
        let p = sources[i]
        if (p && p.info && p.info.resource === endpoint) {
          nickname = p.info.nickname
          break
        }
      }
      return Utils.formatNickname(nickname)
    }
  },
  watch: {
    displayMode: function (mode) {
      if (mode === '0') {
        this.modeChanged = true
        this.attachVideo()
      }
    }
  },
  mounted: function () {
    this.attachVideo()
  },
  beforeDestroy: function () {
    this.clearTimer()
  }
}
</script>

<style scoped>
  div.surround-main {
    position: fixed;
    top: 0px;
    right: 0px;
    left: 0px;
    bottom: 0px;
    z-index: 1;
  }

  div.surround-main>div {
    width: 100%;
    height: 100%;
  }

  div.surround-main video.local-video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 0px;
    z-index: 1;
  }

  div.surround-sub {
    position: fixed;
    bottom: 0px;
    margin: 0px !important;
    padding-bottom: 10px;
    width: 100%;
    height: 180px;
    background: rgba(0, 0, 0, 0) none repeat scroll !important;
    z-index: 2;
  }

  div.surround-sub div.el-col-3 {
    height: 100%;
  }

  div.surround-sub-stream {
    background: #000000;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  video.surround-sub-video {
    background: #000000;
    width: 100%;
    height: 100%;
    margin-bottom: -5px;
    object-fit: contain;
  }

  div.no-video-status {
    position: relative;
    height: 100%;
    width: 100%;
  }

  div.sub-status {
    width: 12%;
    position: absolute;
    top: 0px;
  }

  div.sub-status:hover {
    background: rgba(0, 0, 0, 0.5) none repeat scroll !important;
  }

  div.no-video-status-container {
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }

  div.main-status {
    position: absolute;
    top: 0px;
    left: 0px;
  }

  div.surround-main-status {
    font-size: 4.8rem;
    width: 120px;
    height: 120px;
  }

  div.surround-sub-status {
    font-size: 2.2rem;
    width: 48px;
    height: 48px;
  }

  .no-video-status {
    color: #ffffff;
    padding: 5px;
  }

  .surround-sub-audio-status {
    text-align: right;
  }

  .surround-sub-nickname {
    overflow: hidden;
  }

</style>
