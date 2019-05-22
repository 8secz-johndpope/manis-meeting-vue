<template>
  <el-row>
    <el-col>
      <div class="basic-setting-form device-setting-form">
        <!-- <div class="form-title">
          <h3>请选择你的媒体设备</h3>
        </div> -->
        <el-form :model="deviceForm" status-icon :rules="deviceRules" ref="deviceForm"
                 label-width="80px"
                 class="demo-ruleForm"
                 label-position="top"
                 @submit.native.prevent
        >
          <el-form-item label="麦克风" prop="audioInput">
            <el-select id="audio-in-selector" v-model="deviceForm.audioInput" placeholder="请选择音频输入设备" clearable
                       @focus="getAudioInputDevices" @change="audioInChange" :disabled="audioMuted">
              <el-option
                v-for="item in audioInputOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" " v-show="localAudio">
            <el-col :span="24">
              <div id="instant">
                <meter high="0" max="1" value="0" class="audio-in-level"></meter>
                <audio id="local-audio-in" class="hidden" muted></audio>
              </div>
            </el-col>
          </el-form-item>
          <el-form-item label="扬声器" prop="audioOutput">
            <el-select v-model="deviceForm.audioOutput" placeholder="请选择音频输出设备" clearable @focus="getAudioOutputDevices"
                       @change="audioOutChange">
              <el-option
                v-for="item in audioOutputOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" " v-show="deviceForm.audioOutput">
            <el-col :span="20">
              <div id="audio-play" class="audio-play">
                <audio title="local audio file" controls="true" id="local-audio-out" class="audio-play">
                  <source src="~@/assets/media/audio/audio.mp3" type="audio/mp3">
                  This browser does not support the audio element.
                </audio>
              </div>
            </el-col>
          </el-form-item>
          <el-form-item label="摄像头" prop="videoInput">
            <el-select id="video-in-selector" v-model="deviceForm.videoInput" placeholder="请选择视频输入设备" clearable
                       @focus="getVideoInputDevices" @change="videoInChange" :disabled="videoMuted">
              <el-option
                v-for="item in videoInputOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="视频预览" v-show="localVideo">
            <div class="video-source">
              <video class="local-video" id="local-video" autoplay></video>
            </div>
          </el-form-item>
          <!-- <el-form-item v-show="!inRoom">
            <el-button type="primary" @click="submitForm('deviceForm')">保存</el-button>
            <el-button @click="resetForm('deviceForm')">清空</el-button>
          </el-form-item> -->
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import Utils from '../../utils/utils'
import SoundMeter from '../../utils/soundmeter'

export default {
  name: 'device-form-page',
  props: {'inRoom': Boolean, 'inEnvSetting': Boolean},
  components: {},
  data: function () {
    return {
      deviceForm: {
        audioInput: '',
        audioOutput: '',
        videoInput: ''
      },
      audioInputOptions: [],
      audioOutputOptions: [],
      videoInputOptions: [],
      localAudio: null,
      localVideo: null,
      audioInputLevel: 0,
      deviceRules: {
        audioInput: [
          {required: true, message: '请选择音频输入设备', trigger: 'change'}
        ],
        audioOutput: [
          {required: true, message: '请选择音频输出设备', trigger: 'change'}
        ],
        videoInput: [
          {required: true, message: '请选择视频输入设备', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    /**
       * 保存选中的设备
       * @param formName
       */
    submitForm: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('deviceSetting/setAudioIn', this.deviceForm.audioInput)
          this.$store.dispatch('deviceSetting/setAudioOut', this.deviceForm.audioOutput)
          this.$store.dispatch('deviceSetting/setVideoIn', this.deviceForm.videoInput)
          if (this.inEnvSetting) {
            this.releaseLocalResources()
            this.$emit('saveDevice')
            return false
          }
          Utils.notification(this, '参会设备已选定', 'success')
          this.$router.push({name: 'index-page'})
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    /**
       * 重置选项
       * @param formName
       */
    resetForm: function (formName) {
      this.$refs[formName].resetFields()
      this.$store.dispatch('deviceSetting/clearDevice')
      this.clearSource()
    },

    /**
       * 释放媒体资源
       */
    clearSource: function () {
      if (this.localAudio) {
        this.localAudio.getVideoTracks().forEach(function (track) {
          track.stop()
        })
        this.localAudio = null
      }
      if (this.localVideo) {
        this.localVideo.getVideoTracks().forEach(function (track) {
          track.stop()
        })
        this.localVideo = null
      }
    },

    /**
       * 获取音频输入设备
       */
    getAudioInputDevices: function () {
      let _this = this
      Utils.getAudioInputs(function (devices) {
        _this.audioInputOptions = devices
        _this.audioInputLevel = 0
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
       * 变更音频输入设备
       */
    audioInChange: function () {
      var _this = this
      let audioInDevice = _this.deviceForm.audioInput
      var constraints = Utils.generateConstraints(true, false, audioInDevice)
      if (_this.localAudio) {
        _this.localAudio.getTracks().forEach(function (track) {
          track.stop()
        })
      }
      if (!audioInDevice) {
        return
      }
      var instantMeter = document.querySelector('#instant meter')
      var localAudioIn = document.querySelector('#local-audio-in')
      try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext
        window.audioContext = new AudioContext()
      } catch (e) {
        console.warn('Web Audio API not supported.', e)
      }
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
          let element = document.querySelector('#audio-in-selector')
          element.blur()
          localAudioIn.srcObject = stream
          _this.localAudio = stream
          _this.deviceForm.audioInput = audioInDevice
          var soundMeter = window.soundMeter = new SoundMeter(window.audioContext)
          soundMeter.connectToSource(stream, function (e) {
            if (e) {
              alert(e)
              return
            }
            setInterval(function () {
              instantMeter.value = soundMeter.instant.toFixed(2) * 10
            }, 200)
          })
          if (_this.inRoom) {
            Utils.changeAudioInput(_this.deviceForm.audioInput, function (res) {
              console.log('handle change audio input device result : ', res)
              _this.$store.dispatch('conferenceRoom/replaceLocalStream', {
                type: 'audio',
                stream: res.stream,
                endpoint: res.resource
              })
              _this.$store.dispatch('deviceSetting/setAudioIn', _this.deviceForm.audioInput)
            })
          }
        }).catch(function (error) {
          _this.deviceForm.audioInput = ''
          console.error('navigator.getUserMedia error: ', error)
        })
    },
    /**
       * 变更音频输出设备
       */
    audioOutChange: function () {
      var _this = this
      var localAudioElement = document.querySelector('#local-audio-out')
      localAudioElement.pause()
      Utils.attachSinkId(localAudioElement, _this.deviceForm.audioOutput)
      if (_this.inRoom) {
        _this.$store.dispatch('deviceSetting/setAudioOut', _this.deviceForm.audioOutput)
      }
    },

    /**
       * 变更视频输入设备
       * @param device
       * @param resolution
       */
    videoInChange (device, resolution) {
      let _this = this
      let videoInput = device || _this.deviceForm.videoInput
      if (_this.localVideo) {
        _this.localVideo.getTracks().forEach(function (track) {
          track.stop()
        })
      }
      if (!videoInput) {
        return
      }
      let videoResolution = resolution || '1080'
      let constraints = Utils.generateConstraints(false, true, null, videoInput, videoResolution)
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
          try {
            let element = document.querySelector('#video-in-selector')
            element.blur()
            _this.localVideo = stream
            let previewVideo = document.querySelector('#local-video')
            previewVideo.srcObject = stream
            _this.deviceForm.videoInput = videoInput
            console.log('got local media stream success with constraints: ', constraints)
            if (_this.inRoom) {
              Utils.changeVideoInput(videoInput, function (res) {
                console.log('handle change video input device result : ', res)
                _this.$store.dispatch('conferenceRoom/replaceLocalStream', {
                  type: 'video',
                  stream: res.stream,
                  endpoint: res.resource
                })
                _this.$store.dispatch('deviceSetting/setVideoIn', res.videoInput)
                let ssrc = res.stream.ssrc || ''
                let elementId = '#surround-video-' + ssrc
                if (_this.displayMode === '5') {
                  elementId = '#spread-video-' + ssrc
                }
                let videoElement = document.querySelector(elementId)
                Utils.attachStream(videoElement, res.stream)
              })
            }
          } catch (e) {
            console.error(e)
          }
        }).catch(function (error) {
          if (error.name === 'DevicesNotFoundError' || error.constructor.name === 'DevicesNotFoundError') {
            Utils.notification(_this, '没有找到可用的视频输入设备', 'error')
            _this.deviceForm.videoInput = ''
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
              } else {
                _this.deviceForm.videoInput = ''
              }
            }
          } else {
            Utils.notification(_this, '获取本地视频失败,请检查设备是否可用', 'error')
            _this.deviceForm.videoInput = ''
          }
        })
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
    },
    releaseLocalResources: function () {
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
  },
  mounted: function () {
    this.getAudioInputDevices()
    this.getVideoInputDevices()
    this.getAudioOutputDevices()
    this.getStoreDevice()
  },
  computed: {
    videoMuted () {
      return this.$store.state.conferenceRoom.videoMute
    },
    audioMuted () {
      return this.$store.state.conferenceRoom.audioMute
    },
    displayMode () {
      return this.$store.state.conferenceRoom.mode
    }
  },
  beforeDestroy: function () {
    let _this = this
    _this.releaseLocalResources()
  }
}
</script>

<style scoped>
  .basic-setting-form {
    margin: 0 auto;
    width: 280px;
    padding: 0px 10px;
  }

  .form-title {
    text-align: center;
    /* margin-bottom: 40px; */
    /* color: #606266; */
  }

  .el-form-item__content .audio-in-level {
    margin-top: 12px;
    width: 100%;
  }

  .el-select {
    width: 100%;
  }

  video.local-video {
    max-width: 100%;
    border-radius: 4px;
  }

  audio.audio-play {
    width: 240px;
  }
</style>
