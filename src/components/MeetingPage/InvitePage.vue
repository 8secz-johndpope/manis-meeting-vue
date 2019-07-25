<template>
  <div class="invite-container">
    <el-row>
      <el-col :span="24">
        <div class="text-right refresh">
          <a href="javascript: void (0);" @click="getOnlineMyFriends(true)">
            <span class="el-icon-refresh"></span>
          </a>
        </div>
      </el-col>
      <el-col :span="24">
        <el-divider></el-divider>
      </el-col>
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-checkbox-group v-model="checkedContacts" @change="checkedChanged">
            <el-checkbox-button v-for="contact in contacts" :label="contact.nickname" :key="contact.mUserId">
              <el-avatar :size="32" :src="contact.photo" @error="errorHandler">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
              </el-avatar>
              <div class="nickname">{{ contact.nickname }}</div>
            </el-checkbox-button>
          </el-checkbox-group>
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
          <el-button type="info" size="small" round plain @click="sendOnLineInvite">发送邀请</el-button>
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
      timer: null,
      checkedContacts: [],
      contacts: [],
      inRoomUsers: [],
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

    getInRoomUsers () {
      let _this = this
      Utils.getParticipateMembers(res => {
        // console.log('---getInRoomUsers----', res)
        _this.inRoomUsers = res
      })
    },

    checkFriendIsInRoomYet (uid) {
      let _this = this
      let inRoom = false
      if (!_this.inRoomUsers.length) {
        return inRoom
      }
      _this.inRoomUsers.filter(item => {
        if (item && item.jid) {
          let jid = item.jid
          if (jid.indexOf(uid) > -1) {
            inRoom = true
          }
        }
      })
      return inRoom
    },

    getOnlineMyFriends (reset) {
      let _this = this
      _this.getInRoomUsers()
      if (reset) {
        _this.checkedContacts = []
      }
      _this.contacts = []
      Utils.getContacts(_this.serverAddr, friends => {
        if (friends.length) {
          for (let i = 0; i < friends.length; i++) {
            let friend = friends[i]
            // ignore offline users
            if (friend.clientType) {
              console.log('friend online', friend)
              if (friend && !_this.checkFriendIsInRoomYet(friend.mUserId.toLowerCase())) {
                _this.contacts.push(friend)
              }
            }
          }
        }
      })
      if (_this.timer) {
        window.clearTimeout(_this.timer)
        _this.timer = null
      }
      _this.timer = window.setTimeout(() => {
        _this.getOnlineMyFriends(false)
      }, 10000)
    },

    sendOnLineInvite () {
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
      Utils.notification(_this, '会议邀请已发出, 请耐心等待受邀者加入会议')
      _this.$emit('showInviteDialog', false)
    }
  },
  computed: {
    serverAddr: function () {
      return this.$store.state.serverSetting.serverAddr
    }
  },
  mounted: function () {
    this.getOnlineMyFriends(true)
  },
  beforeDestroy: function () {
    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = null
    }
  }
}
</script>
<style scoped>

  .invite-container .grid-content {
    text-align: center;
    min-height: 93px;
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
