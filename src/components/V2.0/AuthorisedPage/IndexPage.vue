<template>
  <div>
    <div class="participate-container">
      <el-row :gutter="10">
        <el-col :span="24">
          <private-meeting-form
            v-on:participate="joinRoom"
          ></private-meeting-form>
        </el-col>
        <el-col :span="24">
          <div class="gradual-bg block-main" id="conference-list-container">
            <el-row :gutter="10" class="tab-title-box">
              <el-col :span="24">
                <el-tabs v-model="activeName" @tab-click="handleClick" class="authorised-tabs">
                  <el-tab-pane label="我的会议" name="upcoming">
                    <template>
                      <el-row :gutter="10">
                        <el-col :span="24">
                          <div class="meeting-item" v-for="(item, index) in conferences" :key="index">
                            <el-row :gutter="10">
                              <el-col :span="4">
                                <div class="text-center conference-status">{{ item | formatMeetingStatus}}</div>
                              </el-col>
                              <el-col :span="12">
                                <div class="meeting-item-date text-center">
                                  <small>{{ item.startTime | formatDateTime }}</small>
                                </div>
                                <div class="meeting-item-title text-center">
                                  <span>{{ item.title | formatTitle}}</span>
                                </div>
                                <div class="meeting-item-title text-center">
                                  <div>
                                    <span>( </span>
                                    <small>{{ item.cNumber }}</small>
                                    <span>) </span>
                                  </div>
                                </div>
                              </el-col>
                              <el-col :span="8">
                                <div class="meeting-item-participate">
                                  <el-button round size="mini" @click="joinRoom(item.cNumber)">
                                    <span>加入会议</span>
                                  </el-button>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                        </el-col>
                        <el-col :span="24">
                          <div class="load-more text-center">
                            <el-button round :type="moreBtnType" size="mini" @click="getConferences(activePage, conferencesCount)" :disabled="moreBtnDisabled">{{ moreBtnTitle }}</el-button>
                          </div>
                        </el-col>
                      </el-row>
                    </template>
                  </el-tab-pane>
                  <el-tab-pane label="历史会议" name="history">
                    <template>
                      <el-row :gutter="10" id="history-conferences">
                        <el-col :span="24">
                          <div class="meeting-item" v-for="(item, index) in conferences" :key="index">
                            <el-row :gutter="10">
                              <el-col :span="4">
                                <div class="text-center conference-status">{{ item | formatMeetingStatus}}</div>
                              </el-col>
                              <el-col :span="12">
                                <div class="meeting-item-date text-center">
                                  <small>{{ item.startTime | formatDateTime }}</small>
                                </div>
                                <div class="meeting-item-title text-center">
                                  <span>{{ item.title | formatTitle}}</span>
                                </div>
                                <div class="meeting-item-title text-center">
                                  <div>
                                    <span>( </span>
                                    <small>{{ item.cNumber }}</small>
                                    <span>) </span>
                                  </div>
                                </div>
                              </el-col>
                              <!-- <el-col :span="8">
                                <div class="meeting-item-participate">
                                  <el-button round size="mini">
                                    <span>加入会议</span>
                                  </el-button>
                                </div>
                              </el-col> -->
                            </el-row>
                          </div>
                        </el-col>
                        <el-col :span="24">
                          <div class="load-more text-center">
                            <el-button round :type="moreBtnType" size="mini" @click="getConferences(activePage, conferencesCount)" :disabled="moreBtnDisabled">{{ moreBtnTitle }}</el-button>
                          </div>
                        </el-col>
                      </el-row>
                    </template>
                  </el-tab-pane>
                  <!--<el-tab-pane>
                    <span slot="label"><v-icon name="regular/calendar-plus"></v-icon></span>
                    <template>
                      预约会议表单
                    </template>
                  </el-tab-pane>-->
                </el-tabs>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="24">
          <authorised-participate-form
          v-on:participate="joinRoom"
          ></authorised-participate-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Utils from '../../../utils/utils'
import AuthorisedParticipateForm from './ParticipateFormPage'
import PrivateMeetingForm from './PrivateMeetingPage'

export default {
  name: 'v2-authorised-index-page',
  components: {
    AuthorisedParticipateForm,
    PrivateMeetingForm
  },
  filters: {
    formatDateTime (time) {
      var date = new Date(time)
      return Utils.doFormatDate(date, 'yyyy-MM-dd hh:mm')
    },
    formatMeetingStatus (conference) {
      return Utils.formatConferenceStatus(conference)
    },
    formatTitle (title) {
      return title.substr(0, 10)
    }
  },
  data: function () {
    return {
      activeName: 'upcoming',
      activePage: 1,
      conferencesCount: 0,
      conferences: [],
      moreBtnTitle: '加载更多...',
      moreBtnDisabled: false,
      moreBtnType: ''
    }
  },
  methods: {
    handleClick () {
      let _this = this
      console.log('handle tab click event: ', this.activeName)
      _this.conferences = []
      _this.activePage = 1
      _this.conferencesCount = 0
      _this.moreBtnTitle = '加载更多...'
      _this.moreBtnDisabled = false
      _this.moreBtnType = ''
      _this.getConferences(_this.activePage, _this.conferencesCount)
    },
    getConferences (page, count) {
      let _this = this
      if (!_this.apiServer || !window.config.mUserId) {
        console.warn('params except: ', _this.apiServer, window.config.mUserId)
        return false
      }
      let url = ''
      if (_this.activeName === 'history') {
        url = 'https://' + _this.apiServer + '/clientApi/conferences?userId=' +
            window.config.mUserId + '&status=MSE0&page=' + page + '&count=' + count
      } else {
        url = 'https://' + _this.apiServer + '/clientApi/conferences/' +
            window.config.mUserId + '?page=' + page + '&count=' + count
      }
      _this.$http(url).then(res => {
        if (res.status === 200) {
          if (res.data && res.data.mcode === 200) {
            _this.conferencesCount = res.data.msg
            if (res.data.obj && res.data.obj.length) {
              _this.conferences = _this.conferences.concat(res.data.obj)
              _this.activePage++
            }
          } else {
            console.warn('unknown response code: ', res.data)
            if (res.data && res.data.mcode === 128) {
              _this.moreBtnTitle = '没有更多数据了'
              _this.moreBtnDisabled = true
              _this.moreBtnType = 'danger'
            }
          }
        }
      }).catch(err => {
        console.error(err)
      })
    },
    joinRoom (room) {
      let _this = this
      if (!room) {
        return false
      }
      if (!_this.audioIn || !_this.videoIn || !_this.audioOut) {
        Utils.notification(_this, '请先选择参会设备后再进入房间', 'error')
        return false
      }
      _this.$store.dispatch('conferenceRoom/clearData')
      _this.$router.push({
        name: 'meeting',
        params: {
          roomNumber: room,
          mode: 'authorised'
        }
      })
    }
  },
  computed: {
    apiServer () {
      return this.$store.state.serverSetting.serverAddr
    },
    audioIn: function () {
      return this.$store.state.deviceSetting.audioIn || ''
    },
    videoIn: function () {
      return this.$store.state.deviceSetting.videoIn || ''
    },
    audioOut: function () {
      return this.$store.state.deviceSetting.audioOut || ''
    }
  },
  mounted: function () {
    this.getConferences(this.activePage, this.conferencesCount)
  },
  beforeDestroy: function () {
  }
}
</script>

<style scoped>
  .participate-container {
    width: 360px;
    position: fixed;
    z-index: 2;
  }

  .gradual-bg {
    padding: 10px;
    margin: 10px;
    color: #eeeeee;
    background: -webkit-gradient(
      linear,
      10% 10%,
      100% 100%,
      color-stop(0.24, rgb(62, 68, 89)),
      color-stop(0.74, rgb(99, 100, 109)),
      color-stop(1, rgb(137, 135, 136))
    );
  }

  a.none-decoration {
    text-decoration: none;
    color: inherit;
  }

  .block-main {
    padding: 0px;
    overflow-y: scroll;
    overflow-x: hidden;
    height: calc(100vh - 300px);
  }
  .block-main::-webkit-scrollbar{
    width:4px;
    height:4px;
  }

  .block-main::-webkit-scrollbar-track{
    background: #f6f6f6;
  }
  .block-main::-webkit-scrollbar-thumb{
    background: #63646D;
  }
  .block-main::-webkit-scrollbar-thumb:hover {
    background: #3E4459;
  }
  .block-main::-webkit-scrollbar-corner {
    background: #f6f6f6;
  }

  .block-bottom {
    height: 132px;
  }

  .el-tabs__item.is-active {
    color: #eeeeee !important;
  }

  .meeting-item {
    padding: 10px;
    border-bottom: 1px solid #eeeeee;
  }

  .meeting-item:hover {
    background: #2d3140;
  }

  div.meeting-item{
    word-break:break-all;
  }

  .group-date {
    background: #898788;
  }

  .meeting-item-participate {
    padding: 20px 0px;
  }

  .meeting-item .meeting-item-participate {
    display: none;
  }

  .meeting-item:hover .meeting-item-participate {
    display: block;
  }

  .conference-status {
    padding: 10px 0px;
    background: #3E4459;
  }

  .load-more {
    padding: 10px;
  }

</style>
