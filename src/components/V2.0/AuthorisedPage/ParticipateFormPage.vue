<template>
  <div class="gradual-bg block-bottom">
          <el-row :gutter="10" class="join-room-box">
            <el-col :span="24">
              <div class="join-room-box-title">
                <small>加入会议</small>
              </div>
              <div class="join-room-form-box">
                <el-row :gutter="10">
                  <el-col :span="16">
                    <el-form
                      @submit.native.prevent
                      :model="authorisedJoinForm"
                      status-icon
                      :rules="authorisedJoinFormRules"
                      ref="authorisedJoinForm"
                      label-width="0px"
                      class="join-room-form">
                      <el-form-item label="" prop="roomCode">
                        <el-input
                          class="auth-attend-form-item"
                          v-model="authorisedJoinForm.roomCode"
                          autocomplete="off"
                          maxlength="9"
                          placholder="请输入房间号"
                          @keyup.enter.native="submitForm('authorisedJoinForm')"
                          clearable></el-input>
                      </el-form-item>
                      <el-form-item label="" prop="roomPass">
                        <el-input
                          class="auth-attend-form-item"
                          v-model="authorisedJoinForm.roomPass"
                          autocomplete="off"
                          placholder="房间口令(可选)"
                          @keyup.enter.native="submitForm('authorisedJoinForm')"
                          clearable></el-input>
                      </el-form-item>
                    </el-form>
                  </el-col>
                  <el-col :span="8">
                    <div class="meeting-item-participate join-with-room-id">
                      <el-button class="participate-room-submit" round @click="submitForm('authorisedJoinForm')" size="mini">
                        <span>加入会议</span>
                      </el-button>
                    </div>
                  </el-col>
                  <!--<el-col :span="24">
                    <div class="sign-out-box">
                      <a href="javascript: void (0);" class="none-decoration" @click="signOut">
                        <span>注销登录</span>
                      </a>
                    </div>
                  </el-col>-->
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
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入房间号'))
      } else {
        callback()
      }
    }
    return {
      privateRoom: '',
      authorisedJoinForm: {
        roomCode: '',
        roomPass: ''
      },
      authorisedJoinFormRules: {
        roomCode: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
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
    color: black !important;
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
    color: black !important;
  }

  .join-with-room-id {
    margin-top: 48px;
  }

  .participate-room-submit {
    background-color: #00A7F4;
    border-color: #00A7F4;
    color: #ffffff;
  }

  .join-room-box-title {
    padding: 0px 5px;
    font-weight: bold;
  }

</style>
