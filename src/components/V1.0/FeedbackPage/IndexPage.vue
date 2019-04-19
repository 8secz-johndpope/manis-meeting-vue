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
          <el-row>
            <el-col :span="12" :offset="6">
              <h4 class="text-center">意见建议及问题反馈</h4>
            </el-col>
            <el-col :span="12" :offset="6" class="apologise">
              <small>
                感谢您使用我们的会议系统,目前应用版本属于内侧阶段, 使用过程中可能会有一些功能影响您的体验,为
                此我们深感抱歉.同时,为了能够给您提供更良好的使用效果和体验,在此诚挚的向您发出邀请,参与我们的
                用户体验计划.将您的意见建议和使用过程中遇到的问题反馈给我们,我们将尽快对问题进行修复,对良好的
                建议在后续版本中采纳实施.十分感谢!
              </small>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="6">
              <el-form :model="feedbackForm" :rules="rules" ref="feedbackForm" label-width="0px">
                <el-form-item label="" prop="type">
                  <el-select v-model="feedbackForm.type" placeholder="请选择您要反馈的问题类型">
                    <el-option label="问题反馈" value="bug"></el-option>
                    <el-option label="意见建议" value="suggestion"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="" prop="desc">
                  <el-input type="textarea"
                            v-model="feedbackForm.desc"
                            :rows="3"
                            placeholder="请描述一下您遇到的问题经过或者建议内容"></el-input>
                </el-form-item>
                <el-form-item label="" prop="contact">
                  <el-input v-model="feedbackForm.contact" placeholder="请留下您的联系方式以便我们能尽快联系到您"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('feedbackForm')">提交反馈</el-button>
                  <el-button @click="resetForm('feedbackForm')">清空内容</el-button>
                </el-form-item>
              </el-form>
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
import Utils from '../../../utils/utils'

export default {
  name: 'feedback-index-page',
  components: {
    AsidePage,
    ProfileHeadPage
  },
  data: function () {
    return {
      feedbackForm: {
        contact: '',
        type: '',
        desc: ''
      },
      rules: {
        type: [
          { required: true, message: '请您选择活需要反馈的问题类型', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请您对遇到的问题或建议做一下描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          // submit feedback to http://116.62.112.50/feedback.php
          let api = 'http://116.62.112.50/feedback.php?type=' + _this.feedbackForm.type + '&desc=' + _this.feedbackForm.desc + '&contact=' + _this.feedbackForm.contact
          _this.$http.get(api)
            .then(function (response) {
              console.log(response)
              Utils.notification(_this, '感谢您参与我们的调研, 您的反馈我们会尽快处理,如有需要将与您取得联系')
              _this.feedbackForm.desc = ''
              _this.feedbackForm.contact = ''
            })
            .catch(function (error) {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
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

  .text-center {
    text-align: center;
  }

  .apologise {
    margin: 20px auto;
  }

</style>
