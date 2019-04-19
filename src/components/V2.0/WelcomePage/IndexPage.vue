<template>
  <div class="wrapper">
    <div class="bg-img"></div>
    <el-container class="welcome-container">
      <el-main>
        <el-row :gutter="10" class="row-title">
          <el-col :span="24" class="system-title">
            <h1 class="h1 text-center app-name">{{ appName }}</h1>
          </el-col>
          <el-col :span="24" class="system-sub-title">
            <h5 class="h4 text-center app-title">您身边的云视频通讯专家</h5>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <!--<el-col :span="24">-->
          <!--<div class="label-sign-in">-->
          <!--<h4 class="h4 text-center">登录系统以便获得更完善的会议体验</h4>-->
          <!--</div>-->
          <!--</el-col>-->
          <el-col :span="24">
            <div class="row-sign-in">
              <el-form
                :model="signInForm"
                :rules="signInFormRules"
                ref="signInForm"
                class="custom-form"
                @submit.native.prevent
              >
                <el-form-item label prop="server" v-show="!showSignInForm">
                  <el-row :gutter="10">
                    <el-col :span="24">
                      <el-input
                        v-model="signInForm.server"
                        class="sign-input server"
                        placeholder="请输入服务器地址"
                        clearable
                        @clear="setServerAddress('')"
                      ></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label prop="username" v-show="showSignInForm">
                  <el-row :gutter="10">
                    <el-col :span="24">
                      <el-input
                        v-model="signInForm.username"
                        class="sign-input username"
                        placeholder="请输入用户名"
                        @keyup.enter.native="nextStep()"
                        clearable
                      ></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label prop="password" v-show="showSignInForm">
                  <el-row :gutter="10">
                    <el-col :span="24">
                      <el-input
                        type="password"
                        v-model="signInForm.password"
                        class="sign-input password"
                        id="passcode-input"
                        placeholder="请输入用户密码"
                        @keyup.enter.native="submitForm('signInForm')"
                        clearable
                        autofocus="true"
                      ></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label prop="verifyCode" v-show="showSignInForm">
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-input
                        type="text"
                        v-model="signInForm.verifyCode"
                        class="sign-input password"
                        id="verify-code-input"
                        placeholder="验证码"
                        @keyup.enter.native="submitForm('signInForm')"
                        clearable
                        autofocus="true"
                      ></el-input>
                    </el-col>
                    <el-col :span="12">
                      <img :src="verifyImage" alt="verify-img" class="verify-img">
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item  v-show="showSignInForm">
                  <el-row :gutter="10">
                    <el-col :span="24" class="text-left">
                      <el-checkbox v-model="signInForm.rememberMe">记住我</el-checkbox>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-button
                    v-show="!showSignInForm"
                    type="primary"
                    class="btn-submit"
                    round
                    @click="nextStep()"
                  >设置</el-button>
                  <el-button
                    v-show="showSignInForm"
                    type="primary"
                    class="btn-transparent btn-submit"
                    round
                    @click="submitForm('signInForm')"
                  >登录</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="row-sign-in">
              <div class="link forget-pwd-link text-center">
                <!--<a href="javascript: void (0);" @click="openUrl('https://www.xiaoqiangio.com')">-->
                <!--<small>忘记密码</small>-->
                <!--</a>-->
              </div>
              <div class="link anonymous-participate-link text-center">
                <a href="javascript: void (0);" @click="anonymousParticipate">
                  <span class="anonymous-link">匿名入会</span>
                </a>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="version-row">
          <el-col :span="24">
            <div class="version text-center">
              <span class="reset-server">更换主站? 点击<a href="javascript: void(0);" @click="clearServerSet"><span>初始化</span></a></span>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>
        <el-row :gutter="10" type="flex"  justify="end">
          <el-col :span="6">
            <div class="grid-content text-right">
              <small>{{ version }}</small>
            </div>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Utils from '../../../utils/utils'
const {app} = require('electron').remote

export default {
  name: 'v2-login-index-page',
  components: {},
  data: function () {
    return {
      showSignInForm: false,
      appName: '视频会议系统',
      version: '1.0.0',
      signInForm: {
        server: '',
        username: '',
        password: '',
        verifyCode: '',
        rememberMe: false
      },
      signInFormRules: {
        username: [
          { required: true, message: '请输入登陆用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ]
      },
      verifyImage: ''
    }
  },
  methods: {
    showVerifyImage () {
      let verifyCodeData =
        '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'

      if (verifyCodeData) {
        let imgData = 'data:image/gif;base64,' + verifyCodeData
        // console.log('show verify code image: ', imgData)
        this.verifyImage = imgData
      }
    },
    nextStep () {
      if (this.signInForm.server) {
        this.setMSS(this.signInForm.server)
      }
    },
    submitForm (formName) {
      let _this = this
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.autoLogin()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    setMSS (server) {
      let _this = this
      console.log('set mss server', server)
      Utils.initServerConfig(
        server,
        function () {
          _this.$store.dispatch('serverSetting/setServer', server)
          _this.showSignInForm = true
        },
        true
      )
    },
    autoLogin () {
      let _this = this
      Utils.autoLogin(
        _this.signInForm.username,
        _this.signInForm.password,
        res => {
          console.log(res)
          _this.$store.dispatch('userSetting/storeUser', {
            username: _this.signInForm.username,
            password: _this.signInForm.password,
            profile: window.config.nickname || '',
            room: window.config.cNumber || ''
          })
          // Utils.notification(_this, '登陆成功', 'success')
          _this.$router.push({ name: 'v2-participate' })
        },
        err => {
          console.error(err)
          _this.handleLoginFailed(err)
        }
      )
    },
    handleLoginFailed (res) {
      let _this = this
      if (res.errorCode === '300111') {
        Utils.notification(_this, '登陆失败, 服务已到期', 'error')
      } else if (res.errorCode === '300112') {
        Utils.notification(_this, '登陆失败, 请确认账号密码是否正确', 'error')
      } else {
        Utils.notification(_this, '登陆失败, 错误码: ' + res.code, 'error')
      }
    },
    openUrl (url) {
      Utils.openUrlInBrowser(url)
    },
    getServer: function () {
      this.signInForm.server =
        this.$store.state.serverSetting.serverAddr || ''
      if (this.signInForm.server) {
        this.showSignInForm = true
      }
    },
    anonymousParticipate () {
      this.$router.push({ name: 'v2-participate' })
    },
    setServerAddress (server) {
      this.$store.dispatch('serverSetting/setServer', server)
    },
    clearServerSet () {
      this.$store.dispatch('serverSetting/setServer', '')
      this.signInForm.server = ''
      this.showSignInForm = false
    },
    getAppVersion () {
      /**
       * @TODO
       * @BeforePublish
       * uncomment this before publish to repository
       */
      let appName = app.getName()
      if (appName.indexOf('scmeeting') > -1) {
        this.appName = 'SCMeeting' + this.appName
      } else if (appName.indexOf('xiaoqiang') > -1) {
        this.appName += 'SCMeeting' + this.appName
      }
      this.version = app.getVersion()
    }
  },
  computed: {},
  mounted: function () {
    this.getAppVersion()
    this.getServer()
    Utils.logOut()
    this.$store.dispatch('userSetting/clearUser')
    window.config = Utils.resetConfig()
    this.showVerifyImage()
  },
  beforeDestroy: function () {}
}
</script>

<style scoped>
.welcome-container {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.wrapper {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background: rgba(77, 94, 121, 0.2) none repeat scroll !important;
  background: #364049;
  filter: Alpha(opacity=80);
}

.bg-img {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-image: url("../../../assets/img/in-active-bg.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  transition: filter 2s;
  filter: blur(16px);
}

.wrapper:hover .bg-img {
  transition: filter 2s;
  filter: blur(64px);
}

.row-title {
  width: 100%;
}

.system-title,
.label-sign-in {
  margin: 40px 0px 20px 0px;
}

.text-center {
  text-align: center;
}

div.row-sign-in {
  width: 320px;
  margin: 10px auto;
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

.anonymous-link {
  font-size: 16px;
  color: #ffffff;
  border-bottom: 1px solid #ffffff;
}

.app-name {
  font-size: 28px;
  color: rgba(255, 255, 255, 1);
  /* font-family: SourceHanSansSC-regular; */
}

.app-title {
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  /* font-family: SourceHanSansSC-regular; */
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

.el-form-item {
  margin-bottom: 25px;
}

.text-left {
  clear: both;
  text-align: left;
  color: rgba(255, 255, 255, 1);
}

.el-checkbox {
  color: rgba(255, 255, 255, 1);
}

.verify-img {
  width: 100%;
  height: 30px;
  margin-top: 10px;
}

.reset-server a, .reset-server a:hover,.reset-server a:active, .reset-server a:checked {
  text-decoration: none;
  color: #ffffff;
  border-bottom: 1px solid #ffffff;
}

.reset-server {
  color: #ffffff;
  font-size: 12px;
}

.text-right {
  text-align: right;
}

</style>
