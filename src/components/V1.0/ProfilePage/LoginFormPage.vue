<template>
  <el-row>
    <el-col>
      <div class="basic-setting-form">
        <el-form :model="loginForm" status-icon :rules="loginRules" ref="loginForm"
                 label-width="100px"
                 class="demo-ruleForm"
                 @submit.native.prevent
        >
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="loginForm.username" autocomplete="off" placeholder="username"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginForm.password" autocomplete="off" placeholder="password"
                      clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')">登陆</el-button>
            <el-button @click="resetForm('loginForm')">匿名入会</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import Utils from '../../../utils/utils'

export default {
  name: 'login-form-page',
  components: {},
  data: function () {
    var validateUsername = (rule, value, callback) => {
      if (value !== '') {
        callback()
      } else {
        callback(new Error('请输入用户名'))
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (value !== '') {
        callback()
      } else {
        callback(new Error('请输入密码'))
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          {validator: validateUsername, trigger: 'blur'}
        ],
        password: [
          {validator: validatePassword, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm: function (formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          Utils.autoLogin(
            _this.loginForm.username,
            _this.loginForm.password,
            res => {
              console.log(res)
              _this.$store.dispatch('userSetting/storeUser', {
                username: _this.loginForm.username,
                password: _this.loginForm.password,
                profile: window.config.nickname || '',
                room: window.config.cNumber || ''
              })
              Utils.notification(_this, '登陆成功', 'success')
              _this.$router.push({name: 'index-page'})
            },
            err => {
              console.error(err)
              _this.handleLoginFailed(err)
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm: function (formName) {
      this.$refs[formName].resetFields()
      this.$store.dispatch('userSetting/clearUser')
      this.$router.push({name: 'index-page'})
    },

    handleLoginFailed: function (res) {
      let _this = this
      if (res.errorCode === '300111') {
        Utils.notification(_this, '登陆失败, 服务已到期', 'error')
      } else if (res.errorCode === '300112') {
        Utils.notification(_this, '登陆失败, 请确认账号密码是否正确', 'error')
      } else {
        Utils.notification(_this, '登陆失败, 错误码: ' + res.code, 'error')
      }
    }
  },
  mounted: function () {
    Utils.logOut()
    this.$store.dispatch('userSetting/clearUser')
    window.config = Utils.resetConfig()
  }
}
</script>

<style scoped>
  .basic-setting-form {
    margin: 0 auto;
    width: 720px;
    padding: 80px 160px;
  }

  .el-form-item__label {
    color: #eeeeee !important;
  }

</style>
