<template>
  <div class="invite-container">
    <el-row>
      <el-col :span="24">
        <div class="text-right refresh">
          <a href="javascript: void (0);" @click="getOnlineMyFriends">
            <span class="el-icon-refresh"></span>
          </a>
        </div>
      </el-col>
      <el-col :span="24">
        <el-divider></el-divider>
      </el-col>
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-checkbox-group v-model="checkedContacts" v-if="contacts.length" @change="checkedChanged">
            <el-checkbox-button v-for="contact in contacts" :label="contact.nickname" :key="contact.mUserId">
              <el-avatar :size="32" :src="contact.photo" @error="errorHandler">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
              </el-avatar>
              <div class="nickname">{{ contact.nickname }}</div>
            </el-checkbox-button>
          </el-checkbox-group>
          <div class="text-center" v-else>没有好友在线</div>
        </div>
      </el-col>
      <el-col :span="24">
        <el-divider></el-divider>
      </el-col>
      <el-col :span="24">
        <div class="check-require" v-show="showCheckNotice">
          <div class="text-danger">请选择您要邀请加入会议的在线好友</div>
        </div>
        <div class="text-right">
          <el-button type="info" size="small" round plain @click="sendInvites">发送邀请</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Utils from '../../utils/utils'
export default {
  name: 'invite-page',
  props: {},
  components: {
  },
  data: function () {
    return {
      checkedContacts: [],
      contacts: [],
      showCheckNotice: false
    }
  },
  filters: {
  },
  methods: {
    errorHandler () {
      return true
    },

    checkedChanged () {
      if (this.checkedContacts.length) {
        this.showCheckNotice = false
      }
    },

    getOnlineMyFriends () {
      let _this = this
      _this.checkedContacts = []
      _this.contacts = []
      Utils.getContacts(_this.serverAddr, res => {
        if (res.obj) {
          let friends = res.obj
          for (let i = 0; i < friends.length; i++) {
            let friend = friends[i]
            // ignore offline users
            if (friend.clientType) {
              console.log('friend online', friend)
              // @TODO ignore who was in room
              _this.contacts.push(friend)
            }
          }
        }
      })
    },

    sendInvites () {
      let _this = this
      if (!_this.checkedContacts.length) {
        _this.showCheckNotice = true
        return false
      }
      console.log('will invite users, ', _this.checkedContacts, ' into this room : ', window.config.r, ' with password: ', window.config.roomPassword)
      let friends = _this.checkedContacts
      for (let i = 0; i < friends.length; i++) {
        let friend = friends[i]
        console.log('invite user : ', friend)
        _this.contacts.map(item => {
          if (item && item.nickname === friend) {
            Utils.sendInvite(
              item.mUserId.toLowerCase(),
              window.config.r,
              window.config.roomPassword,
              '2',
              res => {
                console.log('success invite ', friend)
              }
            )
          }
        })
      }
      // @TODO hide invite dialog
    }
  },
  computed: {
    serverAddr: function () {
      return this.$store.state.serverSetting.serverAddr
    }
  },
  mounted: function () {
    this.getOnlineMyFriends()
  }
}
</script>
<style scoped>
  .fetch-admin-row {
    margin-top: 40px;
  }

  .number-row {
    margin-top: 20px;
  }

  .number-row .grid-content {
    text-align: center;
  }

  .number-group {
    margin: 20px auto;
  }

  .el-select {
    width: 80px;
  }

  .parting-line {
    height: 2px;
    background: #eeeeee;
  }

  .recorder-btn-row, .drawing-btn-row {
    margin: 20px auto;
  }

  .text-center {
    text-align: center;
  }

  .display-mode-row {
    margin: 0px;
  }

  .display-mode {
    margin: 20px auto;
  }

  .display-mode .bg-purple {
    text-align: center;
  }

  .surround-mode, .spread-mode {
    background: #eeeeee;
  }

  .surround-mode .bg-purple {
    height: 24px;
    background: #000000;
    margin: 2px auto;
    padding: 4px;
  }

  .surround-mode .surround-mode-main {
    height: 48px;
    padding: 16px;
  }

  .spread-mode .bg-purple {
    height: 36px;
    background: #000000;
    margin: 2px auto;
    padding: 10px;
  }

  .display-mode-item .display-mode-name {
    color: #606266;
  }

  .display-mode-item.active .display-mode-name {
    color: #5ED055;
  }

  .display-mode-item {
    border: solid #eeeeee;
    color: #eeeeee;
  }

  .display-mode-item.active {
    border: solid #5ED055;
    color: #5ED055;
  }

  .right-ctl-container {
    margin-top: 40px;
  }

  .segmentation-row{
    background-color: #eeeeee;
    padding-left: 12px;
    margin-bottom: 10px;
  }

  .segmentation-col {
    height: 2px;
    text-align: center;
    padding: 0px 5px;
  }

  .segmentation-col>.active-segmentation-part {
    height: 2px;
    background-color: #5ED055;
  }

  .text-right {
    text-align: right;
  }

  .refresh a, .refresh a:hover, .refresh a:visited,.refresh a:focus {
    text-decoration: none;
    font-size: 1.2rem;
    color: #909399;
  }

  .text-danger {
    color: #F56C6C;
    font-size: 0.8rem;
  }

</style>
