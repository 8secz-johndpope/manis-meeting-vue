<template>
  <div class="device-setting">
    <device-form-page :inRoom="true"></device-form-page>
  </div>
</template>
<script>
// import Utils from '../../utils/utils'
import DeviceFormPage from '../V1.0/SystemPage/DevicePage/DeviceFormPage'

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

</style>
