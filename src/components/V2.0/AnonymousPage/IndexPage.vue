<template>
  <div>
    <div class="participate-container gradual-bg">
      <el-row :gutter="10" class="padding-y-10 padding-x-40">
        <el-col :span="24" class="system-title">
          <h3 class="h3 text-center">匿名加入会议</h3>
        </el-col>
        <el-col :span="24" class="system-sub-title">
          <div class="text-center">
            <small>如果您没有账号,请使用提供给您的房间号和口令快速加入会议</small>
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
              <el-form-item label prop="server">
                <el-input
                  v-model="anonymousForm.server"
                  class="sign-input server"
                  placeholder="请输入服务器地址"
                  clearable
                  @clear="setServerAddress('')"
                ></el-input>
              </el-form-item>
              <el-form-item label prop="roomNumber">
                <el-input
                  v-model="anonymousForm.roomNumber"
                  class="sign-input roomNumber"
                  placeholder="请输入房间号"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label prop="nickname">
                <el-input
                  v-model="anonymousForm.nickname"
                  class="sign-input nickname"
                  placeholder="请输入参会昵称"
                  @keyup.enter.native="submitForm('anonymousForm')"
                  clearable
                  @clear="setNickname('')"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  class="btn-transparent"
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
                <span>现在登录</span>
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
  components: {
  },
  data: function () {
    return {
      anonymousForm: {
        server: '',
        roomNumber: '',
        nickname: ''
      },
      anonymousFormRules: {
        server: [
          {
            required: true,
            message: '请输入服务器地址',
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
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      let _this = this
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.setServerConfig(_this.anonymousForm.server)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setServerConfig (server) {
      let _this = this
      Utils.initServerConfig(
        server,
        function () {
          _this.$store.dispatch('serverSetting/setServer', server)
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
      _this.$store.dispatch('serverSetting/setNickname', _this.anonymousForm.nickname)
      this.$router.push({
        name: 'meeting',
        params: {
          roomNumber: _this.anonymousForm.roomNumber,
          mode: 'anonymous'
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    getNickname () {
      this.anonymousForm.nickname =
          this.$store.state.serverSetting.nickname || ''
    },
    getServer () {
      this.anonymousForm.server =
          this.$store.state.serverSetting.serverAddr || ''
    },
    signInPage () {
      this.$router.push({name: 'v2-login'})
    },
    setServerAddress (server) {
      this.$store.dispatch('serverSetting/setServer', server)
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
    width: 360px;
    position: fixed;
    z-index: 2;
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
    background: -webkit-gradient(
      linear,
      10% 10%,
      100% 100%,
      color-stop(0.34, rgb(62, 68, 89)),
      color-stop(1, rgb(148, 145, 126))
    );
  }
</style>
