<template>
  <div class="room-password-confirm">
    <el-row>
      <el-col :span="24">
        <el-dialog
          title="请输入会议室密码"
          :visible.sync="dialogVisible"
          :modal="false"
          :show-close="false"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          width="30%"
          center>
                <span>
                  <el-input v-model="roomPass" placeholder="请输入会议室密码"></el-input>
                </span>
          <span slot="footer" class="dialog-footer">
                  <el-button type="default" @click="cancelParticipant">取 消</el-button>
                  <el-button type="primary" @click="passwordConfirm">确 定</el-button>
                </span>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'meeting-room-password-confirm',
  props: {
    'dialogVisible': Boolean
  },
  components: {
  },
  data: function () {
    return {
      roomPass: ''
    }
  },
  methods: {
    passwordConfirm: function () {
      this.$emit('roomPasswordConfirm', this.roomPass)
      this.roomPass = ''
    },
    cancelParticipant: function () {
      this.roomPass = ''
      this.$router.push({name: 'v2-participate'})
    }
  },
  mounted: function () {

  }
}
</script>
<style scoped>

</style>
