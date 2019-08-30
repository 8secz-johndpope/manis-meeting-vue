<template>
  <el-container class="manage-el-container">
    <el-main>
      <div class="main">
          <!-- Main content -->
          <section class="content">
            <div class="row">
              <div class="col-md-12">
                <div class="box">
                  <div class="box-body no-padding dashboard-main-box">
                    <el-row :gutter="10">
                      <el-col :xs="24" :sm="24" :md="24" :lg="24">
                        <div class="grid-content">
                          <el-form :model="appointmentForm" :rules="appointmentRules" ref="appointmentForm"
                                   label-width="120px" class="appointment-ruleForm">
                            <el-form-item label="会议主题" prop="title" required>
                              <el-col :span="24">
                                <el-input id="reserve-conference-title" v-model="appointmentForm.title" :placeholder="reserveConferenceNamePlaceholder"
                                          suffix-icon="el-icon-edit"></el-input>
                              </el-col>
                            </el-form-item>
                            <el-form-item label="参会人员" prop="participants">
                              <el-col :span="24">
                                <el-select
                                  id="reserve-conference-members-select"
                                  v-model="selectedMembers"
                                  multiple
                                  size="large"
                                  filterable
                                  remote
                                  :placeholder="participantSearchPlaceholder"
                                  :remote-method="remoteMethod"
                                  :default-first-option="true"
                                  :loading="loading">
                                  <el-option
                                    v-for="item in availableMembers"
                                    :key="item.mUserId"
                                    :label="item.email"
                                    :value="item.mUserId">
                                  </el-option>
                                </el-select>
                              </el-col>
                            </el-form-item>
                            <el-form-item label="密码">
                              <el-col :span="11">
                                <el-form-item prop="roomPass">
                                  <el-input id="reserve-conference-room-password" v-model="appointmentForm.roomPass" auto-complete="off"
                                            :placeholder="conferencePasswordPlaceholder" suffix-icon="el-icon-view"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col class="line text-center" :span="2">-</el-col>
                              <el-col :span="11">
                                <el-form-item prop="operatorPass">
                                  <el-input id="reserve-conference-operator-password" v-model="appointmentForm.operatorPass" auto-complete="off"
                                            :placeholder="operatorPasswordPlaceholder" suffix-icon="el-icon-view"></el-input>
                                </el-form-item>
                              </el-col>
                            </el-form-item>
                            <el-form-item label="会议时间" required>
                              <el-col :span="14">
                                <el-form-item prop="appointDate">
                                  <el-date-picker id="reserve-conference-date-picker" type="date" :placeholder="reserveDatePlaceholder" v-model="appointmentForm.appointDate"
                                                  style="width: 100%;" @change="onStartDateChange"
                                                  value-format="yyyy-MM-dd"
                                                  :picker-options="pickerOptions0"
                                  ></el-date-picker>
                                </el-form-item>
                              </el-col>
                              <el-col class="line text-center" :span="2">-</el-col>
                              <el-col :span="8">
                                <el-form-item prop="appointTime">
                                  <el-time-select id="reserve-conference-time-selector" :placeholder="reserveTimePlaceholder" v-model="appointmentForm.appointTime"
                                                  style="width: 100%;"
                                                  :picker-options="{ step: '00:15', start: timeSelectorStart, end: '23:59'}"
                                  ></el-time-select>
                                </el-form-item>
                              </el-col>
                            </el-form-item>
                            <el-form-item label="会议时长" required>
                              <el-col :span="6">
                                <el-form-item prop="conferenceDuration">
                                  <el-select id="reserve-conference-duration-selector" v-model="appointmentForm.conferenceDuration" :placeholder="reserveDurationPlaceholder">
                                    <el-option v-for="durationOption in durationOptions" :label="durationOption.label" :value="durationOption.value" :key="durationOption.value"></el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item prop="conferenceType">
                                  <el-switch
                                    id="reserve-conference-type"
                                    style="display: block"
                                    v-model="appointmentForm.conferenceType"
                                    @change="onConferenceTypeChange"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    :active-text="reserveCirculationConference"
                                    :inactive-text="reserveOnceConference"
                                    active-value="1"
                                    inactive-value="0">
                                  </el-switch>
                                </el-form-item>
                              </el-col>
                              <el-col :span="6" :class="['auto-recorder-switch', {'hidden': !hasRecorder}]">
                                <el-checkbox id="reserve-conference-auto-recorder" v-model="appointmentForm.autoRecord">自动录制</el-checkbox>
                              </el-col>
                            </el-form-item>
                            <el-form-item label="循环模式" v-if="isCycleConference">
                              <el-col :span="8">
                                <el-form-item prop="cycleTime">
                                  <el-select id="reserve-conference-cycle-type" v-model="appointmentForm.cycleTime" :placeholder="reserveCirculationCyclePlaceholder">
                                    <el-option v-for="cycleOption in cycleOptions" :label="cycleOption.label" :value="cycleOption.value" :key="cycleOption.value"></el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col class="line" :span="1">-</el-col>
                              <el-col :span="15">
                                <el-form-item prop="inDate">
                                  <el-date-picker
                                    id="reserve-conference-end-date"
                                    v-model="appointmentForm.inDate"
                                    type="datetime"
                                    :placeholder="reserveAvailableTimePlaceholder">
                                  </el-date-picker>
                                </el-form-item>
                              </el-col>
                            </el-form-item>
                            <el-form-item label="最大视频数" prop="maxVideoNum">
                              <el-col :span="4">
                                <el-input id="reserve-conference-max-videos" v-model="appointmentForm.maxVideoNum" :placeholder="maxVideoNumPlaceholder"></el-input>
                              </el-col>
                            </el-form-item>
                            <el-form-item label="备注信息" prop="desc">
                              <el-col :span="24">
                                <el-input id="reserve-conference-comment" type="textarea" v-model="appointmentForm.desc" :placeholder="reserveRemarkPlaceholder"
                                          :rows="4"></el-input>
                              </el-col>
                            </el-form-item>
                            <el-form-item>
                              <el-col :span="12">
                                <el-button id="submit-reserve-conference-form" type="success" @click="submitForm('appointmentForm')">提交</el-button>
                              </el-col>
                              <el-col :span="12">
                                <el-button id="reset-reserve-conference-form" @click="resetForm('appointmentForm')">清空</el-button>
                              </el-col>
                            </el-form-item>
                          </el-form>
                        </div>
                      </el-col>
                    </el-row>
                  </div><!-- /.box-body -->

                </div><!-- /. box -->
              </div><!-- /.col -->
            </div><!-- /.row -->
          </section><!-- /.content -->
      </div><!-- /.content-wrapper -->
    </el-main>
  </el-container>
</template>

<script>
import Utils from '../../../utils/utils'

export default {
  name: 'v2-reservation-add-page',
  data () {
    var validateTitle = (rule, value, callback) => {
      let conferenceTitleRequire = '请输入会议主题'
      let conferenceTitleRule = '会议主题长度范围2~20个字符'
      let conferenceTitleRuleSpe = '会议主题不能有特殊字符'
      let sensitiveError = '会议主题包含不合法词汇'
      if (!value || !(value.toString().trim())) {
        return callback(new Error(conferenceTitleRequire))
      } else if (!Utils.ignoreSpecialCharacter(value)) {
        return callback(new Error(conferenceTitleRuleSpe))
      } else if (value.toString().length < 2 || value.toString().length > 20) {
        return callback(new Error(conferenceTitleRule))
      } else {
        Utils.sensitiveWordsCheck(value, function (res) {
          if (res.errorCode) {
            return callback(new Error(sensitiveError))
          } else {
            callback()
          }
        })
      }
    }
    var validatePass = (rule, value, callback) => {
      let conferencePasswordRule = '密码应为4~8位数字或置空'
      if (value) {
        if (!Number.isInteger(parseInt(value))) {
          callback(new Error(conferencePasswordRule))
        } else {
          if (value.toString().length < 4 || value.toString().length > 8) {
            callback(new Error(conferencePasswordRule))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    }
    var validateStartDate = (rule, value, callback) => {
      let conferenceDateRequire = '请选择会议开始日期'
      let conferenceDateRule = '开始时间应晚于当前时间'
      if (!value) {
        return callback(new Error(conferenceDateRequire))
      } else {
        var date = new Date()
        var dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 00:00:00'
        if (Date.parse(new Date(value)) < Date.parse(new Date(dateString))) {
          return callback(new Error(conferenceDateRule))
        }
        callback()
      }
    }
    var validateStartTime = (rule, value, callback) => {
      let conferenceStartAtRequire = '请选择会议开始时刻'
      if (!value) {
        return callback(new Error(conferenceStartAtRequire))
      } else {
        callback()
      }
    }
    var validateCycleTime = (rule, value, callback) => {
      let conferenceCycleRequire = '请选择循环周期'
      if (this.appointmentForm.conferenceType.toString() === '1' && !value) {
        return callback(new Error(conferenceCycleRequire))
      } else {
        callback()
      }
    }
    var validateInDate = (rule, value, callback) => {
      let conferenceAvailableRequire = '请设置周期会议有效期'
      let conferenceAvailableRule = '会议有效期应晚于当前日期'
      if (this.appointmentForm.conferenceType.toString() === '1' && !value) {
        return callback(new Error(conferenceAvailableRequire))
      } else {
        if (Date.parse(new Date(value)) < Date.parse(new Date())) {
          return callback(new Error(conferenceAvailableRule))
        }
        callback()
      }
    }
    // var validateParticipants = (rule, value, callback) => {
    //   let conferenceParticipantRequire = '请选择与会人员'
    //   if (value.length < 1) {
    //     return callback(new Error(conferenceParticipantRequire))
    //   } else {
    //     callback()
    //   }
    // }
    var validateConferenceDesc = (rule, value, callback) => {
      let conferenceDescRule = '会议描述信息做多不能超过60个字符,请简要说明'
      if (!value || !(value.toString().trim())) {
        callback()
      } else if (value.toString().length > 60) {
        return callback(new Error(conferenceDescRule))
      } else {
        callback()
      }
    }
    var validateMaxVideoNum = (rule, value, callback) => {
      let maxVideoNumRequire = '请输入最大视频显示数'
      let maxVideoNumRule = '最大视频显示数错误或超限'
      if (!value || !(value.toString().trim())) {
        callback(new Error(maxVideoNumRequire))
      } else if (!Number.isInteger(parseInt(value)) || parseInt(value) > this.maxView || parseInt(value) <= 0) {
        return callback(new Error(maxVideoNumRule))
      } else {
        callback()
      }
    }

    return {
      meetingCount: 0,
      reserveConferenceCountString: '',
      reserveConferenceNamePlaceholder: '会议名称(xx 的会议)',
      participantSearchPlaceholder: '请输入用户名或邮箱地址搜索',
      conferencePasswordPlaceholder: '会议室密码, 4~8位数字,默认不加密',
      operatorPasswordPlaceholder: '主持人密码, 4~8位数字,默认随机',
      reserveDatePlaceholder: '选择日期',
      reserveTimePlaceholder: '选择时间',
      reserveDurationPlaceholder: '会议时长(分钟)',
      reserveCirculationConference: '周期会议',
      reserveOnceConference: '一次性会议',
      reserveCirculationCyclePlaceholder: '循环周期',
      reserveAvailableTimePlaceholder: '请选择有效期',
      reserveRemarkPlaceholder: '备注信息',
      maxVideoNumPlaceholder: '最大视频显示数',
      durationOptions: [
        {value: '15', label: '15' + '分钟'},
        {value: '30', label: '30' + '分钟'},
        {value: '60', label: '60' + '分钟'},
        {value: '90', label: '90' + '分钟'},
        {value: '120', label: '120' + '分钟'},
        {value: '180', label: '180' + '分钟'},
        {value: '240', label: '240' + '分钟'}
      ],
      cycleOptions: [
        {value: '0', label: '日循环'},
        {value: '1', label: '周循环'},
        {value: '2', label: '月循环'}
      ],
      meetingStatus: 'MSA0',
      timeSelectorStart: '00:00',
      availableMembers: [],
      selectedMembers: [],
      list: [],
      loading: false,
      isCycleConference: false,
      conferenceDetail: null,
      maxView: window.config.videoNum ? window.config.videoNum : 9,
      hasRecorder: window.window.config.hasRecord ? window.window.config.hasRecord : false,
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() < (Date.now() - 24 * 3600 * 1000)
        }
      },
      appointmentForm: {
        title: window.config.nickname ? (window.config.nickname + '的预约会议') : '',
        participants: [],
        roomPass: null,
        autoRecord: false,
        operatorPass: null,
        appointDate: '',
        appointTime: '',
        conferenceDuration: '60',
        conferenceType: '0',
        cycleTime: '0',
        inDate: '',
        desc: '',
        maxVideoNum: window.config.videoNum ? window.config.videoNum : 9
      },
      appointmentRules: {
        title: [
          {validator: validateTitle, trigger: ['blur', 'change']}
        ],
        roomPass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        operatorPass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        appointDate: [
          {validator: validateStartDate, trigger: 'blur'}
        ],
        appointTime: [
          {validator: validateStartTime, trigger: 'blur'}
        ],
        cycleTime: [
          {validator: validateCycleTime, trigger: 'change'}
        ],
        inDate: [
          {validator: validateInDate, trigger: 'change'}
        ],
        //          participants: [
        //            {validator: validateParticipants, trigger: 'change'}
        //          ],
        maxVideoNum: [
          {validator: validateMaxVideoNum, trigger: 'change'}
        ],
        desc: [
          {validator: validateConferenceDesc, trigger: 'change'}
        ]
      }
    }
  },
  components: {
  },

  methods: {

    remoteMethod (query) {
      var _this = this
      if (query !== '') {
        _this.loading = true
        Utils.searchUsers(_this.serverAddr, query, function (response) {
          _this.loading = false
          if (response.mcode === 200) {
            var members = response.obj
            if (members.length > 0) {
              _this.availableMembers = members
            } else {
              var reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/
              if (reg.test(query)) {
                _this.availableMembers = [{
                  mUserId: query,
                  email: query
                }]
              }
            }
          }
        })
      } else {
        _this.availableMembers = []
      }
    },

    /**
       * 日期选择
       */
    onStartDateChange: function (date) {
      if (!date) {
        return false
      }
      var now = new Date()
      var activeDateArray = date.split('-')
      var currentHours = now.getHours()
      var currentMinutes = now.getMinutes()
      var plusHours = Math.floor((15 * Math.ceil(currentMinutes / 15)) / 60)
      var plusMinutes = Math.floor((15 * Math.ceil(currentMinutes / 15)) % 60)
      var selectStartTime = (currentHours + plusHours) + ':' + ((plusMinutes > 10) ? plusMinutes : ('0' + plusMinutes))
      if (now.getFullYear() === parseInt(activeDateArray[0]) && now.getMonth() === (parseInt(activeDateArray[1]) - 1) && now.getDate() === parseInt(activeDateArray[2])) {
        // select today
        this.timeSelectorStart = selectStartTime
        this.appointmentForm.appointTime = selectStartTime
      } else {
        // select other day
        this.timeSelectorStart = '00:00'
        this.appointmentForm.appointTime = selectStartTime
      }
    },

    /**
       * 提交预约
       * @param formName
       */
    submitForm (formName) {
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var _startDateStr = _this.appointmentForm.appointDate.toString()
          var _startTimeStr = _this.appointmentForm.appointTime.toString()
          var startDateArr = _startDateStr.split('-')
          var startTimeArr = _startTimeStr.split(':')
          var _startTime = new Date(startDateArr[0], startDateArr[1] - 1, startDateArr[2], startTimeArr[0], startTimeArr[1], '00')
          console.log(' conference should start at: ', startDateArr, startTimeArr, _startTime)
          if (!_startTime) {
            _this.appointmentForm.appointDate = null
            _this.appointmentForm.appointTime = null
          }
          var _cycleTime = _this.appointmentForm.appointTime
          var cycleHours = parseInt(_cycleTime.split(':')[0])
          var cycleMinites = parseInt(_cycleTime.split(':')[1])
          var cycleSeconds = cycleHours * 3600 + cycleMinites * 60
          if (window.config && window.config.mUserId) {
            _this.appointmentForm.participants.push({mUserId: window.config.mUserId.toUpperCase()})
          }

          Utils.submitReservation(_this.serverAddr,
            JSON.stringify({
              title: _this.appointmentForm.title,
              startTime: Date.parse(_startTime),
              lengthTime: parseInt(_this.appointmentForm.conferenceDuration) * 60,
              number: _this.appointmentForm.participants.length,
              meetPassword: _this.appointmentForm.roomPass,
              ownerPassword: _this.appointmentForm.operatorPass,
              cycle: _this.appointmentForm.conferenceType,
              cycleDmy: _this.appointmentForm.cycleTime,
              cycleStart: cycleSeconds,
              cycleEndDay: Date.parse(new Date(_this.appointmentForm.inDate)),
              mConferenceUsers: _this.appointmentForm.participants,
              info: _this.appointmentForm.desc,
              domain: window.apiServer,
              autoRecord: _this.hasRecorder ? (_this.appointmentForm.autoRecord ? 'CRAO' : 'CRAC') : '',
              videoNum: _this.appointmentForm.maxVideoNum
            }), response => {
              if (response.mcode === 200) {
                console.log('reservation submit success', response)
                _this.resetForm('appointmentForm')
                _this.$emit('reservationSubmit')
              } else if (response.mcode === 140) {
                let appendStr = '最大视频显示人数不超过' + response.obj
                Utils.notification(_this, appendStr, 'error')
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    /**
       * 重置表单
       * @param formName
       */
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },

    /**
       * 类型变化
       */
    onConferenceTypeChange: function () {
      if (this.appointmentForm.conferenceType.toString() === '1') {
        this.isCycleConference = true
      } else {
        this.isCycleConference = false
      }
    }

  },
  computed: {
    serverAddr: function () {
      return this.$store.state.serverSetting.serverAddr
    }
  },
  watch: {
    selectedMembers: function (newSelectedMembers) {
      this.appointmentForm.participants = newSelectedMembers.map(function (item) {
        return {mUserId: item}
      })
    }
  },
  mounted: function () {
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .text-center {
    text-align: center;
  }
  .el-select--large {
    width: 100%;
  }
</style>
