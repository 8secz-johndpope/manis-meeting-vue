<template>
  <div class="right-ctl-container device-setting">
    <el-row :gutter="0" class="segmentation-row">
      <el-col :span="6" :offset="18" class="segmentation-col">
        <div class="active-segmentation-part"></div>
      </el-col>
    </el-row>
    <device-form-page :inRoom="true"></device-form-page>
  </div>
</template>
<script>
// import Utils from '../../utils/utils'
import DeviceFormPage from '../Layout/DeviceFormPage'

export default {
  name: 'meeting-device-setting',
  components: {
    DeviceFormPage
  },
  data: function () {
    return {
    }
  },
  methods: {
  },
  mounted: function () {

  }
}
</script>
<style scoped>
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
