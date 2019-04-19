<template>
  <div class="gradual-bg block-top">
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="private-room-title">
          <small>
            <span>我的私人会议室</span>
          </small>
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <el-input class="private-room-link" v-model="privateRoom" disabled size="mini">
            <template slot="prepend">
              <a href="javascript: void (0);" class="none-decoration">
                <v-icon name="link"></v-icon>
              </a>
            </template>
            <template slot="append">
              <el-button round @click="startPrivateMeeting">发起会议</el-button>
            </template>
          </el-input>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import Utils from '../../../utils/utils'

export default {
  name: 'v2-authorised-private-room-page',
  components: {},
  data: function () {
    return {
      privateRoom: ''
    }
  },
  methods: {
    startPrivateMeeting () {
      let _this = this
      if (_this.privateRoom) {
        _this.$emit('participate', _this.privateRoom)
      }
    }
  },
  computed: {},
  mounted: function () {
    this.privateRoom = window.config.cNumber || ''
  },
  beforeDestroy: function () {
  }
}
</script>

<style scoped>
  .gradual-bg {
    padding: 10px;
    margin: 10px;
    color: #eeeeee;
    background: -webkit-gradient(
      linear,
      10% 10%,
      100% 100%,
      color-stop(0.24, rgb(62, 68, 89)),
      color-stop(0.74, rgb(99, 100, 109)),
      color-stop(1, rgb(137, 135, 136))
    );
  }

  a.none-decoration {
    text-decoration: none;
    color: inherit;
  }

  .block-top {
    height: 88px;
  }

  .private-room-link {
    border-radius: 20px;
    overflow: hidden;
  }

  .private-room-title {
    margin-bottom: 10px;
  }

</style>
