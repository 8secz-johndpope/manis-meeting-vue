<template>
  <div class="wrapper">
    <div class="bg-img"></div>
    <el-container>
      <el-main>
        <anonymous-page v-show="!authorised"></anonymous-page>
        <authorised-page v-show="authorised"></authorised-page>
        <device-selector-page
        v-on:videoInputChange="videoInChange"
        v-on:audioInputChange="audioInChange"
        v-on:audioOutputChange="audioOutChange"
        ></device-selector-page>
      </el-main>
    </el-container>
    <div class="local-video-box">
      <video autoplay class="local-video" id="local-video"></video>
    </div>
    <div class="local-audio-box">
      <audio autoplay class="local-audio" id="local-audio"></audio>
    </div>
  </div>
</template>

<script>
import Utils from '../../../utils/utils'
import anonymousPage from '../AnonymousPage/IndexPage'
import AuthorisedPage from '../AuthorisedPage/IndexPage'
import DeviceSelectorPage from '../LayoutPage/DeviceSelectorPage'

export default {
  name: 'v2-participate-index-page',
  components: {
    anonymousPage,
    AuthorisedPage,
    DeviceSelectorPage
  },
  data: function () {
    return {
      localVideo: null,
      localAudio: null
    }
  },
  methods: {
    /**
       * 变更视频输入设备
       * @param device
       * @param resolution
       */
    videoInChange (device, resolution) {
      let _this = this
      let videoInput = device
      if (_this.localVideo) {
        _this.localVideo.getTracks().forEach(function (track) {
          track.stop()
        })
      }
      if (!videoInput) {
        return false
      }
      let videoResolution = resolution || '1080'
      let constraints = Utils.generateConstraints(false, true, null, videoInput, videoResolution)
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
          try {
            console.log('got local media stream success with constraints: ', constraints, stream)
            _this.localVideo = stream
            let previewVideo = document.querySelector('#local-video')
            previewVideo.srcObject = stream
            _this.$store.dispatch('deviceSetting/setVideoIn', videoInput)
          } catch (e) {
            console.error(e)
          }
        }).catch(function (error) {
          if (error.name === 'DevicesNotFoundError' || error.constructor.name === 'DevicesNotFoundError') {
            Utils.notification(_this, '没有找到摄像头', 'error')
            _this.$store.dispatch('deviceSetting/setVideoIn', '')
          } else if (error.name === 'OverconstrainedError' || error.constructor.name === 'OverconstrainedError') {
            if (constraints.video) {
              console.log('over constrained error, try lower ', constraints.video)
              if (constraints.video.height.exact > 180) {
                let resolution = '180'
                switch (constraints.video.height.exact) {
                  case 1080:
                    resolution = '720'
                    break
                  case 720:
                    resolution = '768'
                    break
                  case 768:
                    resolution = '540'
                    break
                  case 540:
                    resolution = '480'
                    break
                  case 480:
                    resolution = '240'
                    break
                  default:
                    resolution = '180'
                    break
                }
                _this.videoInChange(videoInput, resolution)
              }
            }
          } else {
            Utils.notification(_this, '获取视频失败,请检查摄像头', 'error')
            _this.$store.dispatch('deviceSetting/setVideoIn', '')
          }
        })
    },
    /**
       * 变更音频输入设备
       */
    audioInChange: function (device) {
      var _this = this
      let audioInDevice = device
      var constraints = Utils.generateConstraints(true, false, audioInDevice)
      if (_this.localAudio) {
        _this.localAudio.getTracks().forEach(function (track) {
          track.stop()
        })
      }
      if (!audioInDevice) {
        return false
      }
      // var localAudioIn = document.querySelector('#local-audio')
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
          // localAudioIn.srcObject = stream
          // _this.localAudio = stream
          // if (_this.audioOut) {
          //   Utils.attachSinkId(localAudioIn, _this.audioOut)
          // }
          _this.$store.dispatch('deviceSetting/setAudioIn', device)
          return true
        }).catch(function (error) {
          console.error('navigator.getUserMedia error: ', error)
        })
    },
    /**
       * 变更音频输出设备
       */
    audioOutChange: function (device) {
      var _this = this
      if (!device) {
        return false
      }
      // var localAudioElement = document.querySelector('#local-audio')
      // Utils.attachSinkId(localAudioElement, device)
      _this.$store.dispatch('deviceSetting/setAudioOut', device)
    }
  },
  computed: {
    audioIn: function () {
      return this.$store.state.deviceSetting.audioIn || ''
    },
    videoIn: function () {
      return this.$store.state.deviceSetting.videoIn || ''
    },
    audioOut: function () {
      return this.$store.state.deviceSetting.audioOut || ''
    },
    authorised: function () {
      return this.$store.state.userSetting.authorization
    }
  },
  mounted: function () {
  },
  beforeDestroy: function () {
    let _this = this
    if (_this.localVideo) {
      _this.localVideo.getTracks().forEach(function (track) {
        track.stop()
      })
      _this.localVideo = null
    }
    if (_this.localAudio) {
      _this.localAudio.getTracks().forEach(function (track) {
        track.stop()
      })
      _this.localAudio = null
    }
  }
}
</script>

<style scoped>

  .wrapper {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    overflow: hidden;
  }

  .el-container {
    z-index: 2;
  }

  .bg-img {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    z-index: 0;
    background-image: url("../../../assets/img/in-active-bg.jpg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    transition: filter 2s;
    filter: blur(16px);
  }

  .wrapper:hover .bg-img {
    transition: filter 2s;
    filter: blur(64px);
  }

  .local-video-box {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    z-index: 1;
    text-align: center;
    display: block;
  }

  .local-video-box video.local-video {
    width: 100%;
    height: 100%;
    margin: 0px auto;
    object-fit: contain;
    transition: filter 2s;
    filter: blur(16px);
  }

  .local-video-box video.local-video:hover {
    width: 100%;
    height: 100%;
    margin: 0px auto;
    object-fit: contain;
    transition: filter 1s;
    filter: none;
  }

</style>
