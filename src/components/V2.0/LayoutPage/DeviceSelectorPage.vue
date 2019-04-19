<template>
  <div class="device-selector-container">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form :inline="true" :model="deviceForm" label-position="top" size="mini">
          <el-form-item label="摄像头">
            <el-select
              v-model="deviceForm.videoInput"
              placeholder="视频输入"
              size="mini"
              @focus="getVideoInputDevices"
              @change="videoInputChange"
            >
              <el-option
                v-for="item in videoInputOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="麦克风">
            <el-select
              v-model="deviceForm.audioInput"
              placeholder="音频输入"
              size="mini"
              @focus="getAudioInputDevices"
              @change="audioInputChange"
            >
              <el-option
                v-for="item in audioInputOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="扬声器">
            <el-select
              v-model="deviceForm.audioOutput"
              placeholder="音频输出"
              size="mini"
              @focus="getAudioOutputDevices"
              @change="audioOutputChange"
            >
              <el-option
                v-for="item in audioOutputOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <template>
                  <span class="option-label">{{ item.label }}</span>
                  <span class="option-btn">
                    <el-button @click="testSpeaker(item.value)">Test</el-button>
                  </span>
                </template>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <div id="audio-play" class="audio-play">
          <audio title="local audio file" controls="true" id="local_audio_out" class="audio-play">
            <source :src="audioFile" type="audio/mp3">
            This browser does not support the audio element.
          </audio>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Utils from '../../../utils/utils'
import audioFilePath from '../../../assets/media/audio/audio.mp3'

export default {
  name: 'v2-device-selector-page',
  components: {},
  data: function () {
    return {
      deviceForm: {
        videoInput: '',
        audioInput: '',
        audioOutput: ''
      },
      audioFile: audioFilePath,
      audioInputOptions: [],
      audioOutputOptions: [],
      videoInputOptions: []
    }
  },
  methods: {
    /**
       * 获取音频输入设备
       */
    getAudioInputDevices: function () {
      let _this = this
      Utils.getAudioInputs(function (devices) {
        _this.audioInputOptions = devices
      })
    },

    /**
       * 获取视频输入设备
       */
    getVideoInputDevices: function () {
      let _this = this
      Utils.getVideoInputs(function (devices) {
        _this.videoInputOptions = devices
      })
    },

    /**
       * 获取音频输出设备
       */
    getAudioOutputDevices: function () {
      let _this = this
      Utils.getAudioOutputs(function (devices) {
        _this.audioOutputOptions = devices
      })
    },
    /**
       * video input change
       */
    videoInputChange: function () {
      this.$emit('videoInputChange', this.deviceForm.videoInput)
    },
    audioInputChange: function () {
      this.$emit('audioInputChange', this.deviceForm.audioInput)
    },
    audioOutputChange: function () {
      this.$emit('audioOutputChange', this.deviceForm.audioOutput)
    },
    getStoreAudioIn: function () {
      this.deviceForm.audioInput = this.$store.state.deviceSetting.audioIn || ''
    },
    getStoreAudioOut: function () {
      this.deviceForm.audioOutput = this.$store.state.deviceSetting.audioOut || ''
    },
    getStoreVideoIn: function () {
      this.deviceForm.videoInput = this.$store.state.deviceSetting.videoIn || ''
    },
    getStoreDevice: function () {
      this.getStoreAudioIn()
      this.getStoreAudioOut()
      this.getStoreVideoIn()
      this.getMediaByStoreDevice()
    },
    getMediaByStoreDevice: function () {
      if (this.deviceForm.videoInput) {
        this.videoInputChange()
      }
      if (this.deviceForm.audioInput) {
        this.audioInputChange()
      }
      if (this.deviceForm.audioOutput) {
        this.audioOutputChange()
      }
    },

    testSpeaker: function (device) {
      let audioElement = document.querySelector('#local_audio_out')
      Utils.attachSinkId(audioElement, device)
      audioElement.currentTime = 0
      audioElement.play()
    }
  },
  computed: {},
  mounted: function () {
    this.getAudioInputDevices()
    this.getVideoInputDevices()
    this.getAudioOutputDevices()
    this.getStoreDevice()
  },
  beforeDestroy: function () {
  }
}
</script>

<style scoped>
  .device-selector-container {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 10px;
    float: right;
    z-index: 2;
  }

  .option-btn {
    float: right;
  }

  .audio-play {
    display: none;
  }

</style>
