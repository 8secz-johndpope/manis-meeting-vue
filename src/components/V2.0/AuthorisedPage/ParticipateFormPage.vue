<template>
  <div class="gradual-bg block-bottom">
          <el-row :gutter="10" class="join-room-box">
            <el-col :span="24">
              <div class="join-room-box-title">
                <small>请输入房间号加入会议室</small>
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
                          v-model="authorisedJoinForm.roomCode"
                          autocomplete="off"
                          @keyup.enter.native="submitForm('authorisedJoinForm')"
                          clearable></el-input>
                      </el-form-item>
                    </el-form>
                  </el-col>
                  <el-col :span="8">
                    <div class="meeting-item-participate join-with-room-id">
                      <el-button round @click="submitForm('authorisedJoinForm')" size="mini">
                        <span>加入会议</span>
                      </el-button>
                    </div>
                  </el-col>
                  <el-col :span="24">
                    <div class="sign-out-box">
                      <a href="javascript: void (0);" class="none-decoration" @click="signOut">
                        <span>注销登录</span>
                      </a>
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
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入房间号'))
      } else {
        callback()
      }
    }
    return {
      activeName: 'upcoming',
      authorisedJoinForm: {
        roomCode: ''
      },
      authorisedJoinFormRules: {
        roomCode: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.$emit('participate', _this.authorisedJoinForm.roomCode)
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
  computed: {},
  mounted: function () {

  },
  beforeDestroy: function () {
  }
}
</script>

<style scoped>

  .join-room-form .el-form-item {
    margin-bottom: 20px;
    border-radius: 0px;
  }

  a.none-decoration {
    text-decoration: none;
    color: inherit;
  }

</style>
