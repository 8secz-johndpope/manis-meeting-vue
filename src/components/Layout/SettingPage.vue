<template>
  <div class="setting-container">
    <el-row :gutter="10" type="flex" class="row-bg" justify="center">
      <el-col :span="8">
        <device-selector-page 
        :inEnvSetting="true"
        v-on:saveDevice="saveDevice"
        ></device-selector-page>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DeviceSelectorPage from './DeviceFormPage'

export default {
  name: 'setting-page',
  components: {
    DeviceSelectorPage
  },
  data: function () {
    return {
    }
  },
  methods: {
    // @TODO send window webcontent to close window
    saveDevice () {
      
    }
  },
  mounted: function () {},
  computed: {},
  beforeDestroy: function () {}
}
</script>

<style scoped>
.setting-container {
  background: #ffffff;
  color: #000000;
  min-width: 480px;
  min-height: 320px;
}
</style>
