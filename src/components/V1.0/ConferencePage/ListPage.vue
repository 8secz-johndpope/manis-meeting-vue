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
          <el-row :gutter="12">
            <el-col  :xs="12" :sm="6" :md="4" :lg="3" :xl="2" class="conference-item" v-for="item in 30" :key="item">
              <el-card>
                从不显示
              </el-card>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AsidePage from '../LayoutPage/AsidePage'
import ProfileHeadPage from '../ProfilePage/ProfileHeadPage'
import ParticipantPage from './ParticipantFormPage'

export default {
  name: 'list-page',
  components: {
    AsidePage,
    ProfileHeadPage,
    ParticipantPage
  },
  data: function () {
    return {
      counts: 0,
      type: 'MSM0',
      page: 1,
      uri: '/clientApi/conferences'
    }
  },
  methods: {
  }
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

  .conference-item {
    margin-bottom: 12px;
  }

</style>
