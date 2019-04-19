<template>
  <div v-show="profile">
    <span>{{ profile }}</span>
    <el-dropdown>
      <i class="el-icon-caret-bottom" style="margin-right: 15px"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>个人资料</el-dropdown-item>
        <a href="javascript: void (0);" class="dropdown-a" @click="signOut"><el-dropdown-item>注销登陆</el-dropdown-item></a>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import Utils from '../../../utils/utils'

export default {
  name: 'profile-head-page',
  data: function () {
    return {
    }
  },
  methods: {
    signOut () {
      Utils.logOut()
      this.$store.dispatch('userSetting/clearUser')
      window.config = Utils.resetConfig()
    }
  },
  mounted: function () {
  },
  computed: {
    profile () {
      return this.$store.state.userSetting.profile || ''
    }
  }
}
</script>

<style scoped>
  a.dropdown-a {
    text-decoration:none;
    out-line: none;
  }

</style>
