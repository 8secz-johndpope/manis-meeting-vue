<template>
  <div>
    <div class="participate-container gradual-bg">
      <el-row :gutter="10" class="padding-y-10 padding-x-40">
        <el-col :span="24" class="system-title">
          <h3 class="h3 text-center anonymous-participate-title">匿名加入会议</h3>
        </el-col>
        <el-col :span="24" class="system-sub-title">
          <div class="text-center">
            <small class="anonymous-participate-description">请使用提供给您的房间号和口令快速加入会议</small>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="row-sign-in">
            <el-form
              :model="anonymousForm"
              :rules="anonymousFormRules"
              ref="anonymousForm"
              class="custom-form"
              @submit.native.prevent
            >
              <el-form-item label prop="roomNumber">
                <el-input
                  v-model="anonymousForm.roomNumber"
                  class="sign-input roomNumber"
                  placeholder="房间号"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label prop="roomPass">
                <el-input
                  v-model="anonymousForm.roomPass"
                  class="sign-input roomPass"
                  placeholder="口令(可选)"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label prop="nickname">
                <el-input
                  v-model="anonymousForm.nickname"
                  class="sign-input nickname"
                  placeholder="昵称"
                  @keyup.enter.native="submitForm('anonymousForm')"
                  clearable
                  @clear="setNickname('')"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  class="btn-submit"
                  round
                  @click="submitForm('anonymousForm')"
                >加入会议
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="row-sign-in">
            <div class="link anonymous-participate-link text-center">
              <span class="text-gray">已经拥有账号?</span>
              <a href="javascript: void (0);" @click="signInPage">
                <span class="link-to-sign-in-page">登录</span>
              </a>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Utils from '../../../utils/utils'

export default {
  name: 'v2-anonymous-index-page',
  components: {},
  data: function () {
    return {
      server: '',
      anonymousForm: {
        roomNumber: '',
        roomPass: '',
        nickname: ''
      },
      anonymousFormRules: {
        roomPass: [
          {
            required: false,
            message: '请输入房间口令',
            trigger: 'blur'
          }
        ],
        roomNumber: [
          {
            required: true,
            message: '请输入会议房间号',
            trigger: 'blur'
          }
        ],
        nickname: [
          {required: true, message: '请输入昵称', trigger: 'blur'},
          {min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      let _this = this
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.setServerConfig(_this.server)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setServerConfig (server) {
      let _this = this
      if (!server) {
        Utils.notification(_this, '请先配置需要连接的服务器', 'error')
        _this.signInPage()
        return false
      }
      Utils.initServerConfig(
        server,
        function () {
          _this.anonymousParticipate()
        },
        true
      )
    },
    anonymousParticipate () {
      let _this = this
      if (!_this.audioIn || !_this.videoIn || !_this.audioOut) {
        Utils.notification(_this, '请先选择参会设备后再进入房间', 'error')
        return false
      }
      _this.$store.dispatch('conferenceRoom/clearData')
      _this.$store.dispatch(
        'serverSetting/setNickname',
        _this.anonymousForm.nickname
      )
      // _this.$router.push({
      //   name: 'meeting',
      //   params: {
      //     roomNumber: _this.anonymousForm.roomNumber,
      //     mode: 'anonymous',
      //     code: _this.anonymousForm.roomPass
      //   }
      // })
      _this.$emit('doAttendIntoRoom', {
        roomNumber: _this.anonymousForm.roomNumber,
        mode: 'anonymous',
        code: _this.anonymousForm.roomPass
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    getNickname () {
      this.anonymousForm.nickname = this.$store.state.serverSetting.nickname || ''
    },
    getServer () {
      this.server = this.$store.state.serverSetting.serverAddr || ''
    },
    signInPage () {
      this.$store.dispatch('userSetting/isInitiativeSignOut', true)
      this.$router.push({name: 'v2-login'})
    },
    setNickname (nickname) {
      this.$store.dispatch('serverSetting/setNickname', nickname)
    }
  },
  computed: {
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
    this.getNickname()
    this.getServer()
  },
  beforeDestroy: function () {
  }
}
</script>

<style scoped>
  .participate-container {
    width: 400px;
    position: fixed;
    z-index: 2;
    border-radius: 5px;
  }

  .system-title,
  .label-sign-in {
    margin: 20px auto;
  }

  .system-sub-title {
    margin-bottom: 20px;
  }

  .text-center {
    text-align: center;
  }

  div.row-sign-in {
    text-align: center;
  }

  .link {
    margin: 10px auto;
  }

  .link a,
  .link a:hover,
  .link a:active,
  .link a:visited {
    text-decoration: none;
    color: #eeeeee;
  }

  .btn-transparent {
    padding: 12px 64px !important;
    background: rgba(200, 200, 200, 0.2) none repeat scroll;
    border: 0px;
  }

  .text-gray {
    color: #a1a1a1;
  }

  .padding-y-10 {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .padding-x-40 {
    padding-left: 40px;
    padding-right: 40px;
  }

  .gradual-bg {
    /* background: #0D4A96 100%; */
    background: -webkit-gradient(
    linear,
    10% 10%,
    100% 100%,
    color-stop(0.34, rgb(62, 68, 89)),
    color-stop(1, rgb(148, 145, 126))
    );
  }

  .anonymous-participate-title {
    color: rgba(255, 255, 255, 1);
    font-size: 20px;
  }

  .anonymous-participate-description, .anonymous-participate-link {
    height: 18px;
    color: rgba(255, 255, 255, 1);
    font-size: 12px;
  }

  .anonymous-participate-link .link-to-sign-in-page {
    border-bottom: 1px solid #ffffff;
  }

  .btn-submit {
    width: 240px;
    height: 45px;
    border-radius: 50px 50px 50px 50px;
    background-color: rgba(48, 202, 119, 1);
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    text-align: center;
    font-family: Microsoft Yahei;
  }
</style>
