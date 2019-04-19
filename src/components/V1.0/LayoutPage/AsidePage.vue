<template>
  <el-container>
    <el-header class="aside-item aside-header">
      <el-row>
        <el-col>
          <div class="aside-col">
            <router-link :to="{ name: 'index-page', params: { userId: 123 }}">
              <img id="logo" class="aside-icon" src="~@/assets/logoWhite.png" alt="manis-conference-electron-vue">
            </router-link>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="aside-item aside-main main-item">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#333333"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1">
          <router-link :to="{ name: 'index-page', params: { userId: 123 }}">
            <span class="icon-icons8_Home_white"></span>
          </router-link>
        </el-menu-item>
        <el-menu-item index="2" :disabled="profile.length > 0">
          <router-link :to="{ name: 'login-page'}">
            <span class="icon-icons8_Checked_User_Male"></span>
          </router-link>
        </el-menu-item>
        <el-menu-item index="3">
          <router-link :to="{ name: 'basic-setting-page'}">
            <span class="icon-icons8_Settings_1"></span>
          </router-link>
        </el-menu-item>
        <!--<el-menu-item index="4">
          <router-link :to="{ name: 'list-page'}">
            <i class=""></i>
          </router-link>
        </el-menu-item>-->
        <el-menu-item index="5">
          <router-link :to="{ name: 'device-setting-page'}">
            <span class="icon-icons8_PC_white"></span>
          </router-link>
        </el-menu-item>
        <!--<el-menu-item index="6">-->
          <!--<router-link :to="{ name: 'drawing'}">-->
            <!--<i class="icon-icons8_Whiteboard"></i>-->
          <!--</router-link>-->
        <!--</el-menu-item>-->
      </el-menu>
    </el-main>
    <el-footer class="aside-footer">
      <el-row>
        <el-col>
          <div class="aside-col">
            <router-link :to="{ name: 'feedback'}">
              <i class="el-icon-question aside-icon"></i>
            </router-link>
          </div>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
import Utils from '../../../utils/utils'

export default {
  name: 'aside-page',
  data: function () {
    return {
      isCollapse: true,
      currentDate: new Date()
    }
  },
  methods: {
    handleOpen: function (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },

    getServer: function () {
      let server = this.$store.state.serverSetting.serverAddr || ''
      return server
    }
  },
  mounted: function () {
    let server = this.getServer()
    if (!server) {
      // redirect system init page
      Utils.notification(this, '请先设置需要连接的服务器', 'error')
      this.$router.push({name: 'basic-setting-page'})
    } else {
      Utils.initServerConfig(server, res => { console.log(res) }, false)
    }
  },
  computed: {
    profile () {
      return this.$store.state.userSetting.profile || ''
    }
  }
}
</script>

<style>

  .el-menu--collapse {
    width: 100% !important;
  }

  .el-submenu>.el-submenu__title .el-submenu__icon-arrow {
    display: none;
  }

  .el-menu-item {
    text-align: center;
  }

  .el-submenu__title a, .el-menu-item a {
    text-decoration:none;
    out-line: none;
    font-size: 2.2rem !important;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 74px;
    min-height: 400px;
    border-right-width: 0px !important;
  }

  .aside-item {
    padding: 0 2px !important;
  }

  .aside-footer {
    position: fixed;
    bottom: 0px;
  }

  .aside-col {
    text-align: center;
    margin: 10px auto;
    font-size: 2.2rem;
  }

  .aside-col a {
    text-decoration: none;
    color: #eeeeee;
  }

  .aside-icon {
    margin-bottom: 2px;
    width: 36px;
    height: 36px;
  }

</style>
