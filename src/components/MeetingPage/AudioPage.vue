<template>
  <div class="audio-page">
    <div class="row" v-for="(audio, index) in audioStreams" :key="'audio-'+index">
      <audio :id="'audio-'+audio.stream.ssrc" autoplay></audio>
    </div>
  </div>
</template>

<script>
import Utils from '../../utils/utils'
export default {
  name: 'audio-page',
  components: {
  },
  data: function () {
    return {
      attachAudioTimer: null
    }
  },
  methods: {
    clearTimer () {
      let _this = this
      if (_this.attachAudioTimer) {
        window.clearTimeout(_this.attachAudioTimer)
        _this.attachAudioTimer = null
      }
    },
    attachAudio () {
      let _this = this
      if (_this.audioStreams.length) {
        for (let i = 0; i < _this.audioStreams.length; i++) {
          let audioStream = _this.audioStreams[i]
          let ssrc = audioStream.stream.ssrc
          let element = document.querySelector('#audio-' + ssrc)
          let alreadySSRC = null
          if (element.srcObject) {
            let alreadyStream = element.srcObject
            alreadySSRC = alreadyStream.ssrc
          }
          if (element && ssrc && ssrc !== alreadySSRC) {
            Utils.attachStream(element, audioStream.stream)
          }
          if (element) {
            Utils.attachSinkId(element, _this.audioOutput)
          }
        }
      }
      _this.clearTimer()
      _this.attachAudioTimer = setTimeout(function () {
        _this.attachAudio()
      }, 1000)
    }
  },
  computed: {
    audioStreams () {
      return this.$store.state.conferenceRoom.audioStreams
    },
    audioOutput () {
      return this.$store.state.deviceSetting.audioOut
    }
  },
  mounted: function () {
    this.attachAudio()
  },
  beforeDestroy: function () {
    this.clearTimer()
  }
}
</script>

<style scoped>

</style>
