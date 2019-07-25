<template>
  <div class="display-layout-container">
    <div class="surround-mode" v-if="activeMode == '0'">
      <el-row class="surround-block main-block" :gutter="10">
        <el-col :span="8" :offset="8">
          <div class="video-container main-video-container">
            <div class="display-item" v-if="displays && displays[0]">
              <div class="display-action display-selector">
                <el-select v-model="displays[0].endpoint" placeholder="请选择" :disabled="displays[0].polling" @change="changeDisplayItem(0)">
                  <el-option
                    v-for="item in options"
                    :key="item.endpoint"
                    :label="item.nickname"
                    :value="item.endpoint">
                  </el-option>
                </el-select>
              </div>
              <div class="display-action display-poll">
                <el-switch
                  v-model="displays[0].polling"
                  active-text="轮询"
                  @change="pollingDisplayItem(0)"
                >
                </el-switch>
              </div>
              <div class="item-validate text-danger" v-show="!displays[0].validated">请选择需要显示的人员</div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="surround-block sub-block" :gutter="10">
        <!--<el-col :span="6" v-if="index" v-for="(displayItem, index) in displays" :key="index">-->
        <el-col :span="6" v-if="index" v-for="(displayItem, index) in displays" :key="index">
          <div class="video-container sub-video-container">
            <div class="display-item"  v-if="displayItem">
              <div class="display-action display-selector">
                <el-select v-model="displayItem.endpoint" placeholder="请选择" :disabled="displayItem.polling" @change="changeDisplayItem(index)">
                  <el-option
                    v-for="item in options"
                    :key="item.endpoint"
                    :label="item.nickname"
                    :value="item.endpoint">
                  </el-option>
                </el-select>
              </div>
              <div class="display-action display-poll">
                <el-switch
                  v-model="displayItem.polling"
                  active-text="轮询"
                  @change="pollingDisplayItem(index)"
                >
                </el-switch>
              </div>
              <div class="item-validate text-danger" v-show="!displayItem.validated">请选择需要显示的人员</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="spread-mode" v-if="activeMode != '0'">
      <el-row class="spread-block" :gutter="10">
        <el-col :span="8" v-for="(displayItem, index) in displays" :key="index">
          <div class="video-container spread-video-container">
            <div class="display-item"  v-if="displayItem">
              <div class="display-action display-selector">
                <el-select v-model="displayItem.endpoint" placeholder="请选择" :disabled="displayItem.polling" @change="changeDisplayItem(index)">
                  <el-option
                    v-for="item in options"
                    :key="item.endpoint"
                    :label="item.nickname"
                    :value="item.endpoint">
                  </el-option>
                </el-select>
              </div>
              <div class="display-action display-poll">
                <el-switch
                  v-model="displayItem.polling"
                  active-text="轮询"
                  @change="pollingDisplayItem(index)"
                >
                </el-switch>
              </div>
              <div class="item-validate text-danger" v-show="!displayItem.validated">请选择需要显示的人员</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="save-display">
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="text-center">
            <el-button type="success" round plain @click="saveDisplay">保 存</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import Utils from '../../utils/utils'

export default {
  name: 'display-layout',
  props: {
    activeMode: String
  },
  components: {},
  data: function () {
    return {
      options: [], // 可选项
      displays: [], // 当前显示的窗口
      timer: null
    }
  },
  filters: {},
  methods: {
    /**
       * get all participants
       */
    getAllParticipants () {
      let _this = this
      if (_this.timer) {
        window.clearTimeout(_this.timer)
        _this.timer = null
      }
      Utils.getParticipateMembers(members => {
        _this.options = members.map(item => {
          return {
            nickname: item.nickname,
            endpoint: item.resource,
            disabled: false
          }
        })
      })
      _this.timer = window.setTimeout(function () {
        _this.getAllParticipants()
      }, 1000)
    },

    /**
     * get current displays
     */
    getCurrentDisplays () {
      let _this = this
      let currentShows = _this.showVideos.map(item => {
        let isPolling = item.info.resource === ''
        let isValidated = (isPolling !== undefined && item.info.resource !== '')
        return {
          endpoint: item.info.resource,
          polling: isPolling,
          validated: isValidated
        }
      })
      _this.displays = currentShows
    },

    /**
     * select display item
     * @param index
     */
    changeDisplayItem (index) {
      let _this = this
      let activeItem = _this.displays[index]
      for (let i = 0; i < _this.displays.length; i++) {
        let item = _this.displays[i]
        if (i !== index && item.endpoint === activeItem.endpoint) {
          item.endpoint = ''
          item.validated = false
          _this.displays.splice(i, 1, item)
        }
      }
      activeItem.validated = true
      _this.displays.splice(index, 1, activeItem)
    },

    /**
     * set polling, clear selected
     * @param index
     */
    pollingDisplayItem (index) {
      let _this = this
      let activeItem = _this.displays[index]
      activeItem.endpoint = ''
      if (activeItem.polling) {
        activeItem.validated = true
      } else {
        activeItem.validated = false
      }
      _this.displays.splice(index, 1, activeItem)
    },

    /**
     * save display
     */
    saveDisplay () {
      let _this = this
      _this.$emit('saveDisplaySort', {
        activeMode: _this.activeMode,
        activeSort: _this.displays
      })
    }

  },
  computed: {
    showVideos () {
      return this.$store.state.conferenceRoom.showStreams
    }
  },
  mounted: function () {
    this.getCurrentDisplays()
    this.getAllParticipants()
  },
  beforeDestroy: function () {
    let _this = this
    if (_this.timer) {
      window.clearTimeout(_this.timer)
      _this.timer = null
    }
  }
}
</script>
<style scoped>
  .display-layout-container {
    padding: 20px;
  }

  .surround-block {
    margin: 10px auto;
  }

  .video-container {
    margin: 5px auto;
    height: 80px;
    background: #333333;
    text-align: center;
  }

  .main-video-container {
    height: 120px;
  }

  .display-item {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }

  .display-item .display-action {
    margin: 5px auto;
  }

  .save-display {
    margin: 20px auto;
  }

  div.text-center {
    text-align: center;
  }

  .text-danger {
    color: red;
  }
</style>
