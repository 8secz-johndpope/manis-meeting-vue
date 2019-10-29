<template>
  <div class="gradual-bg block-bottom">
          <el-row :gutter="10" class="join-room-box">
            <el-col :span="24">
              <div class="join-room-box-title">
                <small>加入会议</small>
              </div>
              <div class="join-room-form-box">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form @submit.native.prevent
                      :model="authorisedJoinForm"
                      :rules="authorisedJoinFormRules"
                      ref="authorisedJoinForm"
                      label-width="0px"
                      class="join-room-form">
                      <el-form-item label=""  prop="roomCode">
                        <!--<el-input placeholder="房间号"
                        class="auth-attend-form-item"
                          v-model="authorisedJoinForm.roomCode"
                          autocomplete="off"
                          maxlength="9"
                          @keyup.enter.native="submitForm('authorisedJoinForm')"
                          clearable></el-input>-->
                        <!--<el-autocomplete
                          class="auth-attend-form-item auto-complete-room"
                          v-model.trim="authorisedJoinForm.roomCode"
                          :fetch-suggestions="querySearch"
                          placeholder="房间号"
                          @select="handleSelect"
                          @keyup.enter.native="submitForm('authorisedJoinForm')"
                          clearable
                        ></el-autocomplete>-->
                        <el-select
                          v-model="authorisedJoinForm.roomCode"
                          filterable
                          remote
                          reserve-keyword
                          placeholder="房间号"
                          :remote-method="remoteMethod"
                          :loading="loading">
                          <el-option
                            v-for="item in historyOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="" prop="roomPass">
                        <el-input placeholder="房间口令(可选)"
                        class="auth-attend-form-item"
                          v-model="authorisedJoinForm.roomPass"
                          autocomplete="off"
                          @keyup.enter.native="submitForm('authorisedJoinForm')"
                          clearable></el-input>
                      </el-form-item>
                    </el-form>
                  </el-col>
                  <el-col :span="12">
                    <div class="meeting-item-participate join-with-room-id">
                      <!--<el-button class="participate-room-submit" round @click="submitForm('authorisedJoinForm')" size="mini">
                        <span>加入会议</span>
                      </el-button>-->
                      <el-dropdown class="attend-dropdown-menu" split-button round  trigger="click" @click="submitForm('authorisedJoinForm')" @command="handleCommand">
                        加入会议
                        <el-dropdown-menu slot="dropdown" class="attend-dropdown">
                          <el-dropdown-item command="sip" :disabled="!callConfig.sip" v-show="callConfig.sip">呼叫SIP</el-dropdown-item>
                          <el-dropdown-item command="h323" :disabled="!callConfig.h323" v-show="callConfig.h323">呼叫H323</el-dropdown-item>
                          <el-dropdown-item command="tel" :disabled="!callConfig.tel" v-show="callConfig.tel">呼叫电话</el-dropdown-item>
                          <el-dropdown-item command="other" :disabled="!callConfig.other" v-show="callConfig.other">使用其他终端参会</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
</template>

<script>
import Utils from '../../../utils/utils'

export default {
  name: 'v2-authorised-participate-form-page',
  components: {},
  data: function () {
    var validateRoomNum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入房间号'))
      } else {
        callback()
      }
    }
    return {
      privateRoom: '',
      authorisedJoinForm: {
        roomCode: '123123123',
        roomPass: null
      },
      authorisedJoinFormRules: {
        roomCode: [
          { validator: validateRoomNum, trigger: ['blur', 'change'] }
        ]
      },
      historyOptions: [],
      loading: false,
      callConfig: window.config.call || {
        sip: false,
        h323: false,
        tel: false,
        other: false
      }
    }
  },
  methods: {
    handleCommand (type) {
      let _this = this
      _this.$emit('attend', _this.authorisedJoinForm.roomCode, _this.authorisedJoinForm.roomPass, type)
    },
    remoteMethod (query) {
      let _this = this
      if (query !== '') {
        if (query.length === 9) {
          _this.$store.dispatch('userSetting/commitHistory', {
            value: query,
            label: query
          })
        }
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.historyOptions = this.histories.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.historyOptions = []
      }
    },
    querySearch (queryString, cb) {
      let _this = this
      let histories = _this.histories || []
      let results = queryString ? _this.createFilter(queryString, histories) : histories
      cb(results)
    },
    createFilter (queryString, histories) {
      let res = histories.filter(history => {
        if (history.value && history.value.indexOf(queryString) > -1) {
          return history
        }
      })
      return res
    },
    handleSelect (item) {
      if (item.value) {
        this.authorisedJoinForm.roomCode = item.value
      }
    },
    getPrivateMeeting () {
      let _this = this
      Utils.getPrivateRoom(
        _this.apiServer,
        window.config,
        function (res) {
          console.log('handle private room result: ', res)
          if (res.mcode === 200) {
            _this.authorisedJoinForm.roomCode = window.config.cNumber
            _this.authorisedJoinForm.roomPass = res.obj.meetPassword || ''
            _this.$store.dispatch('userSetting/commitHistory', {
              value: window.config.cNumber.toString(),
              label: window.config.cNumber.toString()
            })
          }
        }
      )
    },
    submitForm (formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.$emit('participate', _this.authorisedJoinForm.roomCode, _this.authorisedJoinForm.roomPass)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    signOut () {
      let _this = this
      Utils.logOut()
      this.$store.dispatch('userSetting/clearUser')
      window.config = Utils.resetConfig()
      _this.$router.push({ name: 'v2-login' })
    }
  },
  computed: {
    apiServer () {
      return this.$store.state.serverSetting.serverAddr
    },
    histories: function () {
      return this.$store.state.userSetting.histories
    }
  },
  mounted: function () {
    // this.authorisedJoinForm.roomCode = window.config.cNumber || '101220016'
    this.getPrivateMeeting()
  },
  beforeDestroy: function () {
  }
}
</script>

<style scoped>
  /*.gradual-bg {*/
    /*background-color: #ffffff;*/
    /*color: black;*/
  /*}*/

  .block-bottom {
    border-radius: 5px;
    background-color: #ffffff !important;
    /* color: black !important; */
  }

  .join-room-form .el-form-item {
    margin-bottom: 2px;
    border-radius: 0px;
  }

  a.none-decoration {
    text-decoration: none;
    color: inherit;
  }

  .auth-attend-form-item, .auth-attend-form-item>input {
    /* color: #ffffff !important; */
  }

  .join-with-room-id {
    margin-top: 48px;
    text-align: right;
  }

  .participate-room-submit {
    background-color: #3E4459;
    border-color: #898788;
    color: #ffffff;
  }

  .join-room-box-title {
    padding: 0px 5px;
    font-weight: bold;
  }

  .auto-complete-room {
    width: 100%;
    background: none;
    color: #ffffff;
    border: none;
    border-bottom: 1px solid #ffffff;
  }

</style>
