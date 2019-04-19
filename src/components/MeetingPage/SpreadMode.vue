<template>
  <div class="spread-mode spread-main">
    <el-row class="spread-sub" :gutter="0">
      <el-col :span="showVideos | getLayout('width')" :class="showVideos | getLayout('height')" v-for="(videoParticipant, index) in showVideos" :key="index">
        <div class="spread-sub-stream">
          <div class="spread-no-video">
            <span class="icon-icons8_No_Video" v-show="videoParticipant.video_muted"></span>
            <span class="icon-icons8_Ringer_Volume_1" v-show="videoParticipant.is_phone"></span>
          </div>
          <div class="spread-info">
            <el-row>
              <el-col :span="12">
                <span class="nickname" v-if="videoParticipant && videoParticipant.info">{{videoParticipant.info.nickname | getNickname}}</span>
              </el-col>
              <el-col :span="12" class="spread-audio-status">
                <span v-if="videoParticipant && videoParticipant.audio_muted"  class="icon-icons8_Mute_Unmute"></span>
              </el-col>
            </el-row>
          </div>
          <video v-if="videoParticipant && !videoParticipant.video_muted" :id="'spread-video-'+ streamSSRC(videoParticipant.stream)" class="spread-sub-video"  autoplay muted v-show="!videoParticipant.video_muted"></video>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Utils from '../../utils/utils'
export default {
  name: 'meeting-spread-mode',
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
          let element = document.querySelector('#spread-video-' + ssrc)
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
    }
  },
  filters: {
    getNickname: function (nickname) {
      return Utils.formatNickname(nickname)
    },
    getLayout: function (items, key) {
      let col = 24
      let className = 'one-row'
      switch (items.length) {
        case 9:
        case 8:
        case 7:
          col = 8
          className = 'three-row'
          break
        case 6:
        case 5:
          col = 8
          className = 'two-row'
          break
        case 4:
        case 3:
          col = 12
          className = 'two-row'
          break
        case 2:
          col = 12
          className = 'one-row'
          break
        default:
          col = 24
          className = 'one-row'
      }
      if (key === 'width') {
        return col
      } else if (key === 'height') {
        return className
      }
    }
  },
  watch: {
    displayMode: function (mode) {
      if (mode === '5') {
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
  div.spread-main {
    position: fixed;
    top: 0px;
    right: 0px;
    left: 0px;
    bottom: 0px;
    z-index: 1;
  }

  div.spread-main>div {
    width: 100%;
    height: 100%;
  }

  div.spread-sub {
    position: absolute;
    margin: 0px !important;
    background: rgba(0, 0, 0, 0) none repeat scroll !important;
    z-index: 2;
  }

  div.spread-sub-stream {
    background: #000000;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  video.spread-sub-video {
    background: #000000;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .one-row {
    height: 100%;
  }

  .two-row {
    height: 50%;
  }

  .three-row {
    height: 33.33%;
  }

  .spread-no-video {
    text-align: center;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2.2rem;
  }

  .spread-info {
    position: absolute;
    padding: 10px;
    background: rgba(0, 0, 0, 0.6) none repeat scroll !important;
  }

  .el-col-24 .spread-info {
    width: 100%;
  }

  .el-col-12 .spread-info {
    width: 50%;
  }

  .el-col-8 .spread-info {
    width: 33.33%;
  }

  .spread-audio-status {
    text-align: right;
  }
</style>
