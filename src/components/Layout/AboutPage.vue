<template>
  <div class="about-container">
    <el-row :gutter="10" type="flex" class="row-bg" justify="center">
      <el-col class="app-container app-logo" :span="12">
        <div class="grid-content logo-gird">
          <img :src="logoImgUrl" alt="logo-img">
        </div>
      </el-col>
      <el-col class="app-container app-content" :span="12">
        <div class="grid-content">
          <div class="app-info app-title">
            <h2 class="text-center">{{ appName }}极速版</h2>
          </div>
          <div class="update-checking-container">
          <h5 class="text-center">{{ version }}</h5>
          <!-- <h4 class="text-center">Xiaoqiang-io Co.,Ltd.</h4> -->
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import xqLogo from '../../assets/img/logo/xq/logo.png'
import scLogo from '../../assets/img/logo/sc/logo.png'
const {app} = require('electron').remote // @TODO uncomment this before publish

export default {
  name: 'about-page',
  props: { inRoom: Boolean },
  components: {},
  data: function () {
    return {
      logoImgUrl: xqLogo || scLogo,
      version: '1.0.0',
      appName: ''
    }
  },
  methods: {
    getVersion () {
      // @TODO uncomment this before publish
      this.version = app.getVersion()
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
    this.getVersion()
  },
  computed: {},
  beforeDestroy: function () {}
}
</script>

<style scoped>
.about-container {
  /* background: -webkit-gradient(linear, 0 0, 100% 100%, from(#8c8a84), to(#292f4c)); */
  /*min-width: 480px;*/
  /*min-height: 320px;*/
  /*padding-top: 60px;*/
  overflow: hidden;
  color: #2DEDCE;
}

.app-container.app-content {
  border-left: 2px solid #2DEDCE;
}

.grid-content {
  /*height: 120px;*/
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

.logo-gird>img {
  max-width: 80px;
  max-height: 80px;
}

.text-center {
  text-align: center;
}

.update-checking-container>.text-center {
  padding: 5px 0px;
}
</style>
