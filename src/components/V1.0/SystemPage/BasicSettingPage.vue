<template>
  <div id="wrapper">
    <el-container>
      <el-aside width="80px" class="conference-aside">
        <aside-page></aside-page>
      </el-aside>
      <el-container class="conference-container">
        <el-header style="text-align: right;">
          <profile-head-page></profile-head-page>
        </el-header>
        <el-main>
          <server-form-page :inRoom="false"></server-form-page>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AsidePage from '../LayoutPage/AsidePage'
import ProfileHeadPage from '../ProfilePage/ProfileHeadPage'
import ServerFormPage from './BasicPage/ServerFormPage'

export default {
  name: 'basic-setting-page',
  components: {
    AsidePage,
    ProfileHeadPage,
    ServerFormPage
  },
  data: function () {
    return {}
  },
  methods: {}
}
</script>

<style>
  #wrapper {
    padding-top: 22px !important;
    width: 100%;
  }

  .conference-aside {
    position: fixed;
    top: 0px;
    left: 0px;
    bottom: 0px;
    border-right: solid 1px #A8A8A8;
  }

  .conference-container {
    margin-left: 86px;
    overflow-x: hidden;
  }

</style>
