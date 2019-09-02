<template>
  <div class="desktop-capture">
    <el-row :gutter="20">
      <el-col :span="6" class="desktop-capture-item" v-for="(source, index) in captureSources" :key="index">
        <div class="grid-content bg-purple" @click="startCapture(source.id)">
          <div class="capture-name">{{ source.name }}</div>
          <div class="desktop-capture-thumbnail">
            <img class="thumbnail" :src="source.thumbnail.toDataURL()" alt="thumbnail">
            <!--<video class="capture-video" :id="'capture-video-'+index" autoplay muted></video>-->
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Utils from '../../utils/utils'
// const {desktopCapturer} = require('electron') // @TODO uncomment this before publish

export default {
  name: 'desktop-capture',
  props: {
    'getSource': Boolean
  },
  data: function () {
    return {
      timer: null,
      captureSources: [],
      localStream: null
    }
  },
  methods: {
    showSources () {
      let _this = this
      if (_this.timer) {
        window.clearTimeout(_this.timer)
        _this.timer = null
      }
      // @TODO uncomment this before publish
      // desktopCapturer.getSources(
      //   { types: ['window', 'screen'] },
      //   (error, sources) => {
      //     _this.captureSources = sources.filter(item => {
      //       if (item.name.toLowerCase().indexOf('electron') < 0) {
      //         return item
      //       }
      //     })
      //     _this.timer = window.setTimeout(_this.showSources, 2000)
      //     if (error) {
      //       console.warn('get desktop capture sources failed: ', error)
      //     }
      //   })
    },

    startCapture (id) {
      let _this = this
      if (_this.localStream) {
        _this.localStream.getTracks()[0].stop()
        _this.localStream = null
      }
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: id
          }
        }
      }).then((stream) => {
        _this.handleStream(stream)
      }).catch(e => {
        _this.handleError(e)
      })
    },

    handleStream (stream) {
      let _this = this
      if (stream && stream.id) {
        Utils.startShareScreen(stream, function (res) {
          console.log('handle screen share: ', res)
          _this.$emit('startShareScreen')
        })
      }
    },

    handleError (e) {
      console.error(e)
    }
  },
  mounted: function () {
    this.captureSources = []
    this.showSources()
  },
  beforeDestroy: function () {
    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = null
    }
  }
}
</script>
<style scoped>

  div.bg-purple {
    text-align: center;
    padding: 10px;
  }

  .desktop-capture-item {
    height: 128px;
  }

  div.capture-name {
    height: 18px;
    overflow: hidden;
  }

  div.desktop-capture-thumbnail {
    height: 110px;
    padding: 5px;
    line-height: 100px;
    background: #eeeeee;
  }

  .grid-content .thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
