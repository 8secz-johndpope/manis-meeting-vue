<template>
  <div class="right-ctl-container text-chat">
    <el-row :gutter="0" class="segmentation-row">
      <el-col :span="6" :offset="12" class="segmentation-col">
        <div class="active-segmentation-part"></div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" class="text-row room-text-row" id="text-msg-contents">
      <el-col :span="22">
        <div :class="['text-msg-row', {'pull-left': !(item.sendFromMe)}, {'pull-right': (item.sendFromMe)}]" v-for="(item, index) in messages" :key="index">
          <div :class="['text-msg', {'text-container-before bg-white': !(item.sendFromMe)}, {'text-container-after bg-green': (item.sendFromMe)}]">
            <div :class="['remote-text', {'pull-right': !(item.sendFromMe)}, {'pull-left': (item.sendFromMe)}]">{{item.content}}</div>
            <div :class="['text-msg-avatar', {'pull-right': !(item.sendFromMe)}, {'pull-left': (item.sendFromMe)}]">
              <div class="text-msg-avatar-img">{{item.from | name2Avatar}}</div>
              <div class="text-msg-from">{{item.from}}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" :gutter="10" class="text-row room-text-msg-row">
      <el-col :span="20">
        <div class="text-msg-form">
          <div style="margin-top: 15px;">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="textMsg"
              @keyup.enter.native="sendText"
            >
            </el-input>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Utils from '../../utils/utils'

export default {
  name: 'meeting-text-chat',
  components: {},
  data: function () {
    return {
      textMsg: ''
    }
  },
  methods: {
    sendText: function () {
      let _this = this
      console.log('will send text: ', _this.textMsg)
      if (!_this.textMsg.trim()) {
        return
      }
      Utils.sendTextMsg(this.textMsg, null, res => {
        console.log('handle send text msg result : ', res)
        _this.textMsg = ''
      })
    },

    scrollToEnd: function () {
      window.setTimeout(function () {
        let element = document.querySelector('#text-msg-contents')
        if (element) {
          let height = element.scrollTop += 10000
          // console.log('set scroll top: ', height)
          element.scrollTop = height
        }

      }, 1000)
    }
  },

  filters: {
    name2Avatar: function (text) {
      let str = text.split('')[0] || 'A'
      return str.toUpperCase()
    }
  },
  computed: {
    messages () {
      return this.$store.state.conferenceRoom.textMsg
    }
  },
  mounted: function () {
    this.scrollToEnd()
  }
}
</script>
<style scoped>
  .text-row {
    margin: 20px auto;
  }

  .room-text-row {
    margin-bottom: 100px;
    height: calc(100vh - 240px);
    overflow-y: scroll;
  }

  .room-text-row::-webkit-scrollbar {
    width: 0px;
  }
  .room-text-row::-webkit-scrollbar-track {
    background-color:#898788;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius:2em;
  }
  .room-text-row::-webkit-scrollbar-thumb {
    background-color:#ffffff;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius:2em;
  }

  .room-text-msg-row {
    position: fixed;
    bottom: 0px;
    width: 340px;
    z-index: 3;
  }

  .text-msg {
    word-break: break-all;
    padding: 8px;
    width: 280px;
    margin-bottom: 10px;
    float: left;
  }

  .remote-text {
    width: 200px;
  }

  .text-msg-avatar {
    padding: 4px;
    margin-bottom: 10px;
    width: 60px;
    float: right;
  }

  .text-msg-avatar-img {
    text-align: center;
    font-size: 18px;
    border: 2px solid;
    width: 32px;
    height: 32px;
    margin: 2px auto;
    border-radius: 50%;
  }

  .text-msg-from {
    text-align: center;
    word-break: break-all;
  }

  .text-container-after {
    position: relative;
    margin: 3px auto 0;
    border-radius: 5px;
    color: #606266;
  }

  .text-container-after:after {
    content: '';
    width: 8px;
    height: 8px;
    position: absolute;
    top: 10px;
    right: -5px;
    transform: rotate(45deg);
    background-color: #5ED055;
    border: 1px #9ED055;
    border-style: solid solid none none;
    color: #606266;
  }

  .text-container-before {
    position: relative;
    margin: 3px auto 0;
    border-radius: 5px;
    color: #606266;
  }

  .text-container-before:before {
    content: '';
    width: 8px;
    height: 8px;
    position: absolute;
    top: 10px;
    left: -5px;
    transform: rotate(45deg);
    background-color: #d3d4d6;
    border: 1px solid #a3b4b6;
    border-style:  none none solid solid;
    color: #606266;
  }

  .bg-green {
    background-color: #5ED055;
    border: 1px solid #9ED055;
  }

  .bg-white {
    background-color: #d3d4d6;
    border: 1px solid #a3b4b6;
  }

  .pull-left {
    float: left;
  }

  .pull-right {
    float: right;
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
</style>
