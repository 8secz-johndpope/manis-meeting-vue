<template>
  <div class="update-container">
    <el-row :gutter="10" type="flex" class="row-bg" justify="center">
      <el-col class="app-container app-logo" :span="12">
        <div class="grid-content logo-gird">
          <img :src="logoImgUrl" alt="logo-img" @click="sendMsgToMain()">
        </div>
      </el-col>
      <el-col class="app-container app-content" :span="12">
        <div class="grid-content">
          <div class="app-info app-title">
            <h2 class="text-center">{{ appName }}极速版</h2>
          </div>
          <div class="update-checking-container">
            <h4 class="text-center">{{ notice }}</h4>
          </div>
          <div class="update-info-container" v-show="steps > 1">
            <div class="app-info update-version" v-if="newVersionInfo">
                <div class="text-center">
                  <small>{{ newVersionInfo.version }}</small>
                </div>
            </div>
            <div class="app-info update-buttons" v-show="steps === 2">
              <el-row :gutter="10">
                <el-col :span="12" class="text-center">
                  <el-button type="default" round size="small" @click="sendMsgToMain('backgrounder')">下次再说</el-button>
                </el-col>
                <el-col :span="12" class="text-center">
                  <el-button type="success" round size="small" @click="startDownload">立即下载</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="update-downloading-container" v-if="downProgress" v-show="steps === 3">
            <el-row :gutter="10">
              <el-col :span="12" class="text-center">
                <el-progress :text-inside="true" :stroke-width="32" :percentage="downProgress.percent | formatPercentage"  status="exception"></el-progress>
              </el-col>
              <el-col :span="12" class="text-center">
                <el-button type="default" round size="small" @click="sendMsgToMain('backgrounder')">后台下载</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="update-downloading-container" v-show="steps === 4">
            <el-row :gutter="10">
              <el-col :span="12" class="text-center">
                <el-progress :text-inside="true" :stroke-width="32" :percentage="100" status="success"></el-progress>
              </el-col>
              <el-col :span="12" class="text-center">
                <el-button type="success" round size="small" @click="installUpdate">重启更新</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import xqLogo from '../../assets/img/logo/xq/logo.png'
import scLogo from '../../assets/img/logo/sc/logo.png'
// @TODO uncomment this before publish
const {
  ipcRenderer
} = require('electron')
const {app} = require('electron').remote // @TODO uncomment this before publish

export default {
  name: 'update-page',
  components: {},
  data: function () {
    return {
      logoImgUrl: xqLogo || scLogo,
      steps: 1,
      notice: '',
      newVersionInfo: null,
      downProgress: null,
      appName: ''
    }
  },

  filters: {
    formatPercentage (num) {
      let formatNum = num ? Math.floor(num) : 0
      return formatNum > 100 ? 100 : formatNum
    }
  },
  methods: {
    // @TODO uncomment this before publish
    handleUpdateStatus () {
      let _this = this
      ipcRenderer.on('update-asynchronous-reply', (event, arg) => {
        if (arg.steps !== undefined) {
          _this.steps = arg.steps
          switch (arg.action) {
            case 'checking':
              _this.notice = '正在检测升级...'
              break
            case 'available':
              _this.notice = '发现新版本'
              _this.newVersionInfo = arg.data
              break
            case 'downloading':
              _this.notice = '正在下载升级包...'
              _this.downProgress = arg.data
              break
            case 'downloaded':
              _this.notice = '下载完成,重启应用完成升级'
              break
            case 'latested':
              _this.notice = '当前版本为最新版,无需升级'
              break
            case 'error':
              _this.notice = '升级失败'
          }
        }
      })
    },

    sendMsgToMain (arg) {
      let msg = arg || 'ping'
      // @TODO uncomment this before publish
      ipcRenderer.send('update-asynchronous-message', msg)
    },

    installUpdate () {
      this.sendMsgToMain('downloaded')
    },

    startDownload () {
      this.sendMsgToMain('start-download')
    },
    getAppLogo () {
      /**
       * @TODO
       * @BeforePublish
       * uncomment this before publish to repository
       */
      let appName = app.getName()
      if (appName.indexOf('scmeeting') > -1) {
        this.appName = 'SCMeeting'
        this.logoImgUrl = scLogo
      } else if (appName.indexOf('xiaoqiang') > -1) {
        this.appName = '小强在线'
        this.logoImgUrl = xqLogo
      }
    }
  },
  mounted: function () {
    this.getAppLogo()
    this.handleUpdateStatus()
    this.sendMsgToMain()
  },
  computed: {},
  beforeDestroy: function () {}
}
</script>

<style scoped>
.update-container {
  /*min-width: 480px;*/
  /*min-height: 320px;*/
  /*padding-top: 60px;*/
  overflow-x: hidden;
  color: #2DEDCE;
}

.app-container.app-content {
  border-left: 2px solid #2DEDCE;
}

.grid-content {
  height: 120px;
  display: table-cell;
  vertical-align: middle;
  padding-left: 20px;
}

.app-info {
  margin: 15px auto;
}

.logo-gird {
  float: right;
}

.text-center {
  text-align: center;
}

.app-info {
  margin: 10px auto;
}
</style>
