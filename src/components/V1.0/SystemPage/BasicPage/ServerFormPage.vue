<template>
  <el-row>
    <el-col>
      <div class="basic-setting-form">
        <el-form :model="serverSettingForm" status-icon :rules="serverSettingRules" ref="serverSettingForm"
                 label-width="100px"
                 class="demo-ruleForm"
                 @submit.native.prevent
        >
          <el-form-item label="服务器地址" prop="serverAddr">
            <el-input type="text" v-model="serverSettingForm.serverAddr" autocomplete="off" placeholder="127.0.0.1"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="参会昵称" prop="nickname">
            <el-input type="text" v-model="serverSettingForm.nickname" autocomplete="off" placeholder="nickname"
                      clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('serverSettingForm')">保存</el-button>
            <el-button @click="resetForm('serverSettingForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import Utils from '../../../../utils/utils'

export default {
  name: 'server-form-page',
  components: {},
  data: function () {
    var validateServer = (rule, value, callback) => {
      if (value !== '') {
        callback()
      } else {
        callback(new Error('请输入需要连接的服务器地址'))
      }
    }
    var validateNickname = (rule, value, callback) => {
      if (value !== '') {
        callback()
      } else {
        callback(new Error('请输入默认的参会昵称'))
      }
    }
    return {
      serverSettingForm: {
        serverAddr: '',
        nickname: ''
      },
      serverSettingRules: {
        serverAddr: [
          {validator: validateServer, trigger: 'blur'}
        ],
        nickname: [
          {validator: validateNickname, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    getServerAddr: function () {
      this.serverSettingForm.serverAddr = this.$store.state.serverSetting.serverAddr || ''
    },
    getNickname: function () {
      this.serverSettingForm.nickname = this.$store.state.userSetting.profile || this.$store.state.serverSetting.nickname || ''
    },
    submitForm: function (formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          Utils.initServerConfig(
            _this.serverSettingForm.serverAddr,
            function () {
              _this.$store.dispatch('serverSetting/setServer', _this.serverSettingForm.serverAddr)
              _this.$store.dispatch('serverSetting/setNickname', _this.serverSettingForm.nickname)
              Utils.notification(_this, '服务器已设置成功', 'success')
              _this.$router.push({name: 'login-page'})
            },
            true
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm: function (formName) {
      this.$refs[formName].resetFields()
      this.$store.dispatch('serverSetting/clearSetting')
    }
  },
  mounted: function () {
    this.getServerAddr()
    this.getNickname()
  }
}
</script>

<style>
  .basic-setting-form {
    margin: 0 auto;
    width: 720px;
    padding: 80px 160px;
  }

</style>
