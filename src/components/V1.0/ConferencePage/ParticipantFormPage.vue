<template>
  <div class="participant-form">
    <div class="participant-conference">
      <el-form :inline="true" :model="attendForm" :rules="attendRule" ref="attendForm" class="participant-form-inline"  @submit.native.prevent>
        <el-form-item prop="room">
          <el-input type="text" v-model="attendForm.room" placeholder="请输入会议号" @keyup.enter.native="submitForm('attendForm')"  clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('attendForm')">开始会议</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Utils from '../../../utils/utils'

export default {
  name: 'v1-participate-index-page',
  data: function () {
    var checkRoomNumber = (rule, value, callback) => {
      let reg = /^\d+$/
      if (!value) {
        return callback(new Error('会议房间号不能为空'))
      } else if (!reg.test(value) || value.length !== 9) {
        return callback(new Error('请输入九位数字组成的会议房间号'))
      } else {
        return callback()
      }
    }
    return {
      attendForm: {
        room: ''
      },
      attendRule: {
        room: [
          { validator: checkRoomNumber, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      let _this = this
      if (!_this.audioIn || !_this.videoIn) {
        Utils.notification(_this, '请选择您可以用于参会的设备', 'error')
        return _this.$router.push({name: 'device-setting-page'})
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.$store.dispatch('conferenceRoom/clearData')
          this.$router.push({
            name: 'meeting',
            params: {
              roomNumber: this.attendForm.room
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  computed: {
    profile () {
      return this.$store.state.userSetting.profile || ''
    },
    roomNumber () {
      return this.$store.state.userSetting.room || ''
    },
    audioIn () {
      return this.$store.state.deviceSetting.audioIn
    },
    videoIn () {
      return this.$store.state.deviceSetting.videoIn
    }
  },
  mounted: function () {
    if (this.roomNumber) {
      this.attendForm.room = this.roomNumber
    }
  }
}
</script>

<style scoped>
  .participant-form {
    width: 720px;
    margin: 120px auto;
    text-align: center;
  }

</style>
