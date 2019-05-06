<template>
  <div class="desktop-capture">
    <el-row :gutter="20">
      <el-col :span="8" v-for="(source, index) in captureSources" :key="index">
        <div class="grid-content bg-purple" @click="startCapture(source.id, index)">
          <div class="capture-name">{{ source.name }}</div>
          <video class="capture-video" :id="'capture-video-'+index" autoplay muted></video>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Utils from '../../utils/utils'

export default {
  name: 'desktop-capture',
  props: {
    'getSource': Boolean
  },
  data: function () {
    return {
      timer: null,
      captureSources: []
    }
  },
  methods: {
    startCapture (id, index) {
      let _this = this
      let videoElement = document.querySelector('#capture-video-' + index)
      let stream = videoElement.srcObject
      if (stream && stream.id) {
        Utils.startShareScreen(stream, function (res) {
          console.log('handle screen share: ', res)
          _this.$emit('startShareScreen')
        })
      }
    },

    handleStream (stream, i) {
      const video = document.querySelector('#capture-video-' + i)
      video.srcObject = stream
      video.onloadedmetadata = () => video.play()
    },

    handleError (e) {
      console.error(e)
    },
    initCapture () {
      let _this = this
      // @TODO comment this in browser
      const {desktopCapturer} = require('electron')
      desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
        if (error) throw error
        _this.captureSources = sources
        for (let i = 0; i < sources.length; ++i) {
          if (sources[i].name !== 'Electron') {
            navigator.mediaDevices.getUserMedia({
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: 'desktop',
                  chromeMediaSourceId: sources[i].id
                }
              }
            }).then((stream) => _this.handleStream(stream, i))
              .catch((e) => _this.handleError(e))
          }
        }
      })
    }
  },
  mounted: function () {
    this.captureSources = []
    this.initCapture()
  },
  watch: {
    getSource: function (status) {
      if (status) {
        this.initCapture()
      } else {
        this.captureSources = []
      }
    }
  }
}
</script>
<style scoped>

  div.bg-purple {
    text-align: center;
  }

  div.capture-name {
    height: 18px;
    overflow: hidden;
  }

  video.capture-video {
    max-width: 100%;
    height: 100px;
    margin: 0px auto;
    object-fit: contain;
  }
</style>
