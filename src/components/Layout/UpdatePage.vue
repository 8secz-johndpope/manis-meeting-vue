<template>
  <div class="update-container">
    <el-row :gutter="10" type="flex" class="row-bg" justify="center">
      <el-col class="app-container app-logo" :span="4">
        <div class="grid-content logo-gird">
          <img :src="logoImgUrl" alt="logo-img">
        </div>
      </el-col>
      <el-col class="app-container app-content" :span="4">
        <div class="grid-content">
          <div class="app-info app-title">
            <h2 class="text-center">小强在线极速版</h2>
          </div>
          <div class="update-checking-container" v-show="steps === 1">
            <h4 class="text-center">正在检查更新....</h4>
          </div>
          <div class="update-info-container" v-show="steps > 1">
            <div class="app-info update-version">
                <div class="text-center">
                  <small>4.1.4</small>
                </div>
            </div>
            <div class="app-info update-info">
                <div v-for="o in 3" :key="o" class="text item text-center">
                  <span>{{'更新内新内容更新内容更新内容 ' + o }}</span>
                </div>
            </div>
            <div class="app-info update-buttons" v-show="steps === 2">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-button type="default" round size="small">下次再说</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button type="success" round size="small">立即下载</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="update-downloading-container" v-show="steps === 3">
            <el-row :gutter="10">
              <el-col :span="20">
                <el-progress :text-inside="true" :stroke-width="32" :percentage="60" status="exception"></el-progress>
              </el-col>
              <el-col :span="4">
                <el-button type="default" round size="small">后台运行</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="update-downloading-container" v-show="steps === 4">
            <el-row :gutter="10">
              <el-col :span="20">
                <el-progress :text-inside="true" :stroke-width="32" :percentage="100" status="success"></el-progress>
              </el-col>
              <el-col :span="4">
                <el-button type="success" round size="small">重启更新</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import logoImg from '../../assets/logoColor.png'

export default {
  name: 'update-page',
  components: {},
  data: function () {
    return {
      logoImgUrl: logoImg,
      steps: 3
    }
  },
  methods: {
    // @TODO ipcRensder send msg and handle ipcMain event
  },
  mounted: function () {},
  computed: {},
  beforeDestroy: function () {}
}
</script>

<style scoped>
.update-container {
  background: #ffffff;
  color: #000000;
  min-width: 480px;
  min-height: 320px;
  padding: 60px 0px;
}

.app-container.app-content {
  border-left: 2px solid #a3a3a3;
}

.grid-content {
  height: 120px;
  display: table-cell;
  vertical-align: middle;
  padding-left: 20px;
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
