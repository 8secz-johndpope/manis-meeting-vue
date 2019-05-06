<template>
  <div class="about-container">
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
          <div class="update-checking-container">
          <h5 class="text-center">{{ varsion }}</h5>
          <h4 class="text-center">Xiaoqiang-io Co.,Ltd.</h4>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="10" type="flex" class="row-bg" justify="center">
      <el-col :span="4">
        <div class="grid-content">
          <img :src="logoImgUrl" alt="logo-img">
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content">
          <h2 class="text-center">小强在线极速版</h2>
          <h5 class="text-center">{{ varsion }}</h5>
          <h4 class="text-center">Xiaoqiang-io Co.,Ltd.</h4>
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import logoImg from '../../assets/logoColor.png'

export default {
  name: 'about-page',
  props: { inRoom: Boolean },
  components: {},
  data: function () {
    return {
      logoImgUrl: logoImg,
      varsion: '1.0.0'
    }
  },
  methods: {
    getVersion () {
      // @TODO get application version from electron.remote
    }
  },
  mounted: function () {
    this.getVersion()
  },
  computed: {},
  beforeDestroy: function () {}
}
</script>

<style scoped>
.about-container {
  background: #ffffff;
  color: #000000;
  min-width: 480px;
  min-height: 320px;
  padding-top: 60px;
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
</style>
