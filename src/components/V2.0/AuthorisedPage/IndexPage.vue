<template>
  <div>
    <div class="participate-container">
      <el-row :gutter="10">
        <el-col :span="24">
          <private-meeting-form
            v-on:participate="joinRoom"
            v-on:attend="attendRoom"
          ></private-meeting-form>
        </el-col>
        <el-col :span="24">
          <div class="gradual-bg block-main" id="conference-list-container">
            <el-row :gutter="10" class="conferences-type-title">
              <a href="javascript: void (0);" @click="handleClick('upcoming')">
                <el-col :span="6" :class="['type-tab text-center', {'active-tab': activeName === 'upcoming'}]">
                  <small>我的会议</small>
                </el-col>
              </a>
              <a href="javascript: void (0);" @click="handleClick('history')">
                <el-col :span="6" :class="['type-tab text-center', {'active-tab': activeName === 'history'}]">
                  <small>历史会议</small>
                </el-col>
              </a>
              <a href="javascript: void (0);" @click="handleClick('contacts')">
                <el-col :span="6" :class="['type-tab text-center', {'active-tab': activeName === 'contacts'}]">
                  <small>联系人</small>
                </el-col>
              </a>
              <a href="javascript: void (0);" @click="showReservation">
                <el-col :span="5" class="type-tab text-center">
                  <span class="el-icon-date"></span>
                  <small>预约</small>
                </el-col>
              </a>
            </el-row>
            <el-row :gutter="10">
              <div class="conferences-list-content">
                <el-row :gutter="10" v-show="activeName !== 'contacts'">
                  <el-col :span="24">
                    <div class="meeting-item" v-for="(item, index) in conferences" :key="index">
                      <el-popover
                        placement="right"
                        width="240"
                        trigger="hover">
                        <div class="conference-item-detail">
                          <el-row :gutter="10">
                            <el-col class="conference-item-title" :span="24">
                              <div class="text-center">{{ item.title }}</div>
                            </el-col>
                            <el-col class="conference-item-content" :span="24">
                              <el-row :gutter="10">
                                <el-col :span="12">
                                  <small>会议号:</small>
                                </el-col>
                                <el-col :span="12">
                                  <small>{{ item.cNumber }}</small>
                                </el-col>
                              </el-row>
                              <el-row :gutter="10">
                                <el-col :span="12">
                                  <small>主持人:</small>
                                </el-col>
                                <el-col :span="12">
                                  <small>{{ item.mConferenceUsers | findOperator }}</small>
                                </el-col>
                              </el-row>
                              <el-row :gutter="10">
                                <el-col :span="12">
                                  <small>主持人密码:</small>
                                </el-col>
                                <el-col :span="12">
                                  <small>{{ item.ownerPassword }}</small>
                                </el-col>
                              </el-row>
                              <el-row :gutter="10">
                                <el-col :span="12">
                                  <small>会议室密码:</small>
                                </el-col>
                                <el-col :span="12">
                                  <small v-if="item.meetPassword">{{ item.meetPassword }}</small>
                                  <small v-else> 无 </small>
                                </el-col>
                              </el-row>
                              <el-row :gutter="10">
                                <el-col :span="12">
                                  <small>会议时长:</small>
                                </el-col>
                                <el-col :span="12">
                                  <small v-if="item.lengthTime">{{ item.lengthTime | formatDuration }} 分钟</small>
                                </el-col>
                              </el-row>
                              <el-row :gutter="10">
                                <el-col :span="12">
                                  <small>会议类型:</small>
                                </el-col>
                                <el-col :span="12">
                                  <small>{{ item | formatType }}</small>
                                </el-col>
                              </el-row>
                            </el-col>
                          </el-row>
                        </div>
                        <el-row :gutter="10" slot="reference">
                          <el-col :span="6" class="conference-type">
                            <div class="text-center">
                              <small>{{ item | formatMeetingStatus}}</small>
                            </div>
                          </el-col>
                          <el-col :span="12">
                            <el-row :gutter="10">
                              <el-col :span="12">
                                <small>{{ item.cNumber }}</small>
                              </el-col>
                              <el-col :span="12" class="conference-title">
                                <small>{{ item.title | formatTitle}}</small>
                              </el-col>
                              <el-col :span="24">
                                <small class="extra-start-time">{{ item.startTime | formatDateTime }}</small>
                              </el-col>
                            </el-row>
                          </el-col>
                          <el-col :span="6" class="conference-join" v-if="activeName === 'upcoming'">
                            <div class="meeting-item-participate">
                              <el-button class="participate-btn" round size="mini" @click="joinRoom(item.cNumber, item.meetPassword)">
                                <span>加入会议</span>
                              </el-button>
                            </div>
                          </el-col>
                        </el-row>
                      </el-popover>
                    </div>
                  </el-col>
                  <el-col :span="24" v-if="conferences.length">
                    <div class="load-more text-center">
                      <el-button round :type="moreBtnType" size="mini" @click="getConferences(activePage, conferencesCount)" :disabled="moreBtnDisabled">{{ moreBtnTitle }}</el-button>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="10" v-show="activeName === 'contacts'">
                  <el-col :span="24">
                    <div class="meeting-item" v-for="(item, index) in contacts" :key="index" @click="showContact(item)">
                      <el-row :gutter="10" >
                        <el-col :span="6" class="conference-type">
                          <div class="text-center">
                            <small>{{ item.nickname }}</small>
                          </div>
                        </el-col>
                        <el-col :span="12">
                          <el-col :span="24" class="conference-title">
                            <small>
                              <el-link class="off-line-status" v-if="!item.onLine" type="info">off-line</el-link>
                              <el-link class="on-line-status" v-else type="success">on-line</el-link>
                            </small>
                          </el-col>
                          <el-col :span="24">
                            <small class="extra-start-time">
                              {{ item.email }}
                            </small>
                          </el-col>
                        </el-col>
                        <el-col :span="6" class="conference-join" v-show="item.onLine">
                          <div class="contact-item-edit">
                            <el-button class="participate-btn call-btn" type="success" round size="mini" @click.stop="videoCall(item)">
                              <span>呼 叫</span>
                            </el-button>
                          </div>
                        </el-col>
                        <el-col :span="6" class="conference-join" v-show="!item.onLine">
                          <div class="contact-item-edit">
                            <el-button class="participate-btn" type="success" round size="mini" @click.stop="showContact(item)">
                              <span>详 情</span>
                            </el-button>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </el-col>
                  <el-col :span="24">
                    <div class="add-contact-box text-center">
                      <el-button class="participate-btn" round type="success"  size="mini" @click="showAddContact">+ 添加联系人</el-button>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-row>
          </div>
        </el-col>
        <el-col :span="24">
          <authorised-participate-form
          v-on:participate="joinRoom"
          v-on:attend="attendRoom"
          ></authorised-participate-form>
        </el-col>
      </el-row>
    </div>
    <div class="reservation-container">
      <el-dialog
        title="预约会议"
        width="60%"
        :visible.sync="reservationDialogFormVisible">
        <reservation-page
        v-on:reservationSubmit="reservationSubmit"></reservation-page>
      </el-dialog>
    </div>
    <vue-simple-context-menu
      :elementId="'myFirstMenu'"
      :options="optionsRightMenu"
      :ref="'vueSimpleContextMenu1'"
      @option-clicked="menuItemClicked">
    </vue-simple-context-menu>
    <div class="attend-container">
      <el-dialog
        width="260px"
        class="text-center"
        :title="attendDialogFormTitle"
        :visible.sync="attendDialogFormVisible">
        <el-form :model="attendForm" :rules="attendFormRules" ref="attendForm" >
          <el-form-item label="">
            <el-select v-model="attendForm.attendType" placeholder="请选择类型" @change="clientChange">
              <el-option label="SIP" value="sip" :disabled="!callConfig.sip" v-show="callConfig.sip"></el-option>
              <el-option label="H323" value="h323" :disabled="!callConfig.h323" v-show="callConfig.h323"></el-option>
              <el-option label="电话" value="tel" :disabled="!callConfig.tel" v-show="callConfig.tel"></el-option>
              <el-option label="使用其他终端参会" value="other" :disabled="!callConfig.other" v-show="callConfig.other"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="attendNum">
            <el-input v-model="attendForm.attendNum"
                      autocomplete="off"
                      :placeholder="((attendForm.attendType == 'tel') || (attendForm.attendType == 'other' && attendForm.attendOthersType == 'tel') )? '请输入电话号码' :  '请输入终端号码'"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="" v-show="(attendForm.attendType != 'tel')">
            <el-input v-model="attendForm.attendNickname" autocomplete="off" placeholder="请输入昵称" clearable></el-input>
          </el-form-item>
          <el-form-item label="" v-show="(attendForm.attendType == 'other')" prop="attendOthersType">
            <el-select v-model="attendForm.attendOthersType"  @change="otherClientChange">
              <el-option label="SIP" value="sip" :disabled="!callConfig.sip" v-show="callConfig.sip"></el-option>
              <el-option label="H323" value="h323" :disabled="!callConfig.h323" v-show="callConfig.h323"></el-option>
              <el-option label="电话" value="tel" :disabled="!callConfig.tel"  v-show="callConfig.tel"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('attendForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('attendForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Utils from '../../../utils/utils'
import AuthorisedParticipateForm from './ParticipateFormPage'
import PrivateMeetingForm from './PrivateMeetingPage'
import ReservationPage from '../Reservation/FormPage'

export default {
  name: 'v2-authorised-index-page',
  components: {
    AuthorisedParticipateForm,
    PrivateMeetingForm,
    ReservationPage
  },
  filters: {
    formatDateTime (time) {
      var date = new Date(time)
      return Utils.doFormatDate(date, 'yyyy-MM-dd hh:mm')
    },
    formatMeetingStatus (conference) {
      return Utils.formatConferenceStatus(conference)
    },
    formatTitle (title) {
      return title.substr(0, 10)
    },
    findOperator (participants) {
      return Utils.findOperator(participants)
    },
    formatDuration (seconds) {
      return Utils.calculateDuration(seconds)
    },
    formatType (item) {
      return Utils.formatConferenceType(item)
    }
  },
  data: function () {
    var checkClientType = (rule, value, callback) => {
      let _this = this
      if (!value && _this.attendForm.attendType === 'other') {
        return callback(new Error('请选择需要使用的终端类型'))
      }
      callback()
    }
    return {
      loading: false,
      activeName: 'upcoming',
      activePage: 1,
      conferencesCount: 0,
      // conferences: [{'mConferenceId': '40FB712C4C791F37', 'cNumber': 101237158, 'status': 'MSA0', 'title': 'conference173037', 'startTime': 1555901560157, 'lengthTime': 0, 'number': 0, 'meetPassword': '99999999', 'ownerPassword': '00000000', 'cycle': 0, 'cycleDmy': 0, 'cycleStartPre': 0, 'cycleStart': 0, 'cycleEndDay': null, 'layout': 5, 'createTime': 1555407062316, 'updateTime': 1555407062316, 'type': 'CTF1', 'notice': 0, 'info': '备注信息yyyyyyyyyyyyyyyyyyy173037', 'domain': 'dev.fdclouds.com', 'outUsers': null, 'autoRecord': 'CRAO', 'memberCount': null, 'audioCodec': null, 'videoCodec': null, 'videoNum': 6, 'mOperatorsId': null, 'creator': null, 'realStartTime': null, 'realEndTime': null, 'lock': false, 'conferenceType': 3, 'mConferenceUsers': [{'mUserId': null, 'mConferenceId': '40FB712C4C791F37', 'owner': null, 'photo': null, 'email': null, 'userName': null}]}, {'mConferenceId': '09F7E799AA29F6CB', 'cNumber': 101237835, 'status': 'MSA0', 'title': 'conference211922', 'startTime': 1555766375019, 'lengthTime': 0, 'number': 0, 'meetPassword': '99999999', 'ownerPassword': '00000000', 'cycle': 0, 'cycleDmy': 0, 'cycleStartPre': 0, 'cycleStart': 0, 'cycleEndDay': null, 'layout': 5, 'createTime': 1555766375019, 'updateTime': 1555766375019, 'type': 'CTF1', 'notice': 0, 'info': '备注信息yyyyyyyyyyyyyyyyyyy211922', 'domain': 'dev.fdclouds.com', 'outUsers': null, 'autoRecord': 'CRAO', 'memberCount': null, 'audioCodec': null, 'videoCodec': null, 'videoNum': 6, 'mOperatorsId': null, 'creator': null, 'realStartTime': null, 'realEndTime': null, 'lock': false, 'conferenceType': 3, 'mConferenceUsers': [{'mUserId': null, 'mConferenceId': '09F7E799AA29F6CB', 'owner': null, 'photo': null, 'email': null, 'userName': null}]}, {'mConferenceId': '19BF801D4C0AAEA3', 'cNumber': 101236676, 'status': 'MSA0', 'title': 'conference111434', 'startTime': 1555576278137, 'lengthTime': 0, 'number': 0, 'meetPassword': '99999999', 'ownerPassword': '00000000', 'cycle': 0, 'cycleDmy': 0, 'cycleStartPre': 0, 'cycleStart': 0, 'cycleEndDay': null, 'layout': 5, 'createTime': 1554952493987, 'updateTime': 1554952493987, 'type': 'CTF1', 'notice': 0, 'info': '备注信息yyyyyyyyyyyyyyyyyyy111434', 'domain': 'dev.fdclouds.com', 'outUsers': null, 'autoRecord': 'CRAO', 'memberCount': null, 'audioCodec': null, 'videoCodec': null, 'videoNum': 6, 'mOperatorsId': null, 'creator': null, 'realStartTime': null, 'realEndTime': null, 'lock': false, 'conferenceType': 3, 'mConferenceUsers': [{'mUserId': null, 'mConferenceId': '19BF801D4C0AAEA3', 'owner': null, 'photo': null, 'email': null, 'userName': null}]}, {'mConferenceId': '181AC0B977A5D3FB', 'cNumber': 101230760, 'status': 'MSA0', 'title': 'API预约3333', 'startTime': 1555566344181, 'lengthTime': 0, 'number': 0, 'meetPassword': '', 'ownerPassword': '10420615', 'cycle': 0, 'cycleDmy': 0, 'cycleStartPre': 0, 'cycleStart': 0, 'cycleEndDay': null, 'layout': 5, 'createTime': 1554985189756, 'updateTime': 1554985189756, 'type': 'CTF1', 'notice': 0, 'info': null, 'domain': 'dev.fdclouds.com', 'outUsers': null, 'autoRecord': null, 'memberCount': null, 'audioCodec': null, 'videoCodec': null, 'videoNum': 9, 'mOperatorsId': null, 'creator': null, 'realStartTime': null, 'realEndTime': null, 'lock': false, 'conferenceType': 3, 'mConferenceUsers': [{'mUserId': null, 'mConferenceId': '181AC0B977A5D3FB', 'owner': null, 'photo': null, 'email': null, 'userName': null}]}, {'mConferenceId': '97B451BAF3474D97', 'cNumber': 101233753, 'status': 'MSA0', 'title': 'API预约3333', 'startTime': 1555478019621, 'lengthTime': 0, 'number': 0, 'meetPassword': '', 'ownerPassword': '16881045', 'cycle': 0, 'cycleDmy': 0, 'cycleStartPre': 0, 'cycleStart': 0, 'cycleEndDay': null, 'layout': 5, 'createTime': 1555061571124, 'updateTime': 1555061571124, 'type': 'CTF1', 'notice': 0, 'info': null, 'domain': 'dev.fdclouds.com', 'outUsers': null, 'autoRecord': null, 'memberCount': null, 'audioCodec': null, 'videoCodec': null, 'videoNum': 9, 'mOperatorsId': null, 'creator': null, 'realStartTime': null, 'realEndTime': null, 'lock': false, 'conferenceType': 3, 'mConferenceUsers': [{'mUserId': null, 'mConferenceId': '97B451BAF3474D97', 'owner': null, 'photo': null, 'email': null, 'userName': null}]}, {'mConferenceId': 'B55DEFAABF034414', 'cNumber': 101232078, 'status': 'MSA0', 'title': 'conference173514', 'startTime': 1554975780906, 'lengthTime': 0, 'number': 0, 'meetPassword': '99999999', 'ownerPassword': '00000000', 'cycle': 0, 'cycleDmy': 0, 'cycleStartPre': 0, 'cycleStart': 0, 'cycleEndDay': null, 'layout': 5, 'createTime': 1554975334274, 'updateTime': 1554975334273, 'type': 'CTF1', 'notice': 0, 'info': '备注信息yyyyyyyyyyyyyyyyyyy173514', 'domain': 'dev.fdclouds.com', 'outUsers': null, 'autoRecord': 'CRAO', 'memberCount': null, 'audioCodec': null, 'videoCodec': null, 'videoNum': 6, 'mOperatorsId': null, 'creator': null, 'realStartTime': null, 'realEndTime': null, 'lock': false, 'conferenceType': 3, 'mConferenceUsers': [{'mUserId': null, 'mConferenceId': 'B55DEFAABF034414', 'owner': null, 'photo': null, 'email': null, 'userName': null}]}, {'mConferenceId': '30131103F4B7BF56', 'cNumber': 101239373, 'status': 'MSA0', 'title': 'conference113859', 'startTime': 1554953959237, 'lengthTime': 0, 'number': 0, 'meetPassword': '99999999', 'ownerPassword': '00000000', 'cycle': 0, 'cycleDmy': 0, 'cycleStartPre': 0, 'cycleStart': 0, 'cycleEndDay': null, 'layout': 5, 'createTime': 1554953959237, 'updateTime': 1554953959237, 'type': 'CTF1', 'notice': 0, 'info': '备注信息yyyyyyyyyyyyyyyyyyy113859', 'domain': 'dev.fdclouds.com', 'outUsers': null, 'autoRecord': 'CRAO', 'memberCount': null, 'audioCodec': null, 'videoCodec': null, 'videoNum': 6, 'mOperatorsId': null, 'creator': null, 'realStartTime': null, 'realEndTime': null, 'lock': false, 'conferenceType': 3, 'mConferenceUsers': [{'mUserId': null, 'mConferenceId': '30131103F4B7BF56', 'owner': null, 'photo': null, 'email': null, 'userName': null}]}, {'mConferenceId': 'EB9A8C824AB35F4D', 'cNumber': 101236879, 'status': 'MSA0', 'title': 'conference113513', 'startTime': 1554953733566, 'lengthTime': 0, 'number': 0, 'meetPassword': '99999999', 'ownerPassword': '00000000', 'cycle': 0, 'cycleDmy': 0, 'cycleStartPre': 0, 'cycleStart': 0, 'cycleEndDay': null, 'layout': 5, 'createTime': 1554953733566, 'updateTime': 1554953733566, 'type': 'CTF1', 'notice': 0, 'info': '备注信息yyyyyyyyyyyyyyyyyyy113513', 'domain': 'dev.fdclouds.com', 'outUsers': null, 'autoRecord': 'CRAO', 'memberCount': null, 'audioCodec': null, 'videoCodec': null, 'videoNum': 6, 'mOperatorsId': null, 'creator': null, 'realStartTime': null, 'realEndTime': null, 'lock': false, 'conferenceType': 3, 'mConferenceUsers': [{'mUserId': null, 'mConferenceId': 'EB9A8C824AB35F4D', 'owner': null, 'photo': null, 'email': null, 'userName': null}]}, {'mConferenceId': '9027205462496F60', 'cNumber': 101232439, 'status': 'MSA0', 'title': 'conference171851', 'startTime': 1554893152376, 'lengthTime': 0, 'number': 0, 'meetPassword': '99999999', 'ownerPassword': '00000000', 'cycle': 0, 'cycleDmy': 0, 'cycleStartPre': 0, 'cycleStart': 0, 'cycleEndDay': null, 'layout': 5, 'createTime': 1554801550319, 'updateTime': 1554801550319, 'type': 'CTF1', 'notice': 0, 'info': '备注信息yyyyyyyyyyyyyyyyyyy171851', 'domain': 'dev.fdclouds.com', 'outUsers': null, 'autoRecord': 'CRAO', 'memberCount': null, 'audioCodec': null, 'videoCodec': null, 'videoNum': 6, 'mOperatorsId': null, 'creator': null, 'realStartTime': null, 'realEndTime': null, 'lock': false, 'conferenceType': 3, 'mConferenceUsers': [{'mUserId': null, 'mConferenceId': '9027205462496F60', 'owner': null, 'photo': null, 'email': null, 'userName': null}]}, {'mConferenceId': '526293414829125A', 'cNumber': 101236611, 'status': 'MSA0', 'title': 'lizn', 'startTime': 1554893130637, 'lengthTime': 0, 'number': 0, 'meetPassword': '123456', 'ownerPassword': '123456', 'cycle': 0, 'cycleDmy': 0, 'cycleStartPre': 0, 'cycleStart': 0, 'cycleEndDay': null, 'layout': 5, 'createTime': 1554893052374, 'updateTime': 1554893052374, 'type': 'CTF1', 'notice': 0, 'info': '', 'domain': 'dev.fdclouds.com', 'outUsers': null, 'autoRecord': 'CRAO', 'memberCount': null, 'audioCodec': null, 'videoCodec': null, 'videoNum': 9, 'mOperatorsId': null, 'creator': null, 'realStartTime': null, 'realEndTime': null, 'lock': false, 'conferenceType': 3, 'mConferenceUsers': [{'mUserId': null, 'mConferenceId': '526293414829125A', 'owner': null, 'photo': null, 'email': null, 'userName': null}]}],
      conferences: [],
      moreBtnTitle: '加载更多...',
      moreBtnDisabled: false,
      moreBtnType: '',
      contacts: [],
      contactsTimer: null,
      reservationDialogFormVisible: false,
      optionsRightMenu: [
        {
          name: '复制',
          slug: 'copy'
        }
      ],
      attendFormLabelWidth: '120px',
      attendDialogFormTitle: '加入会议',
      attendDialogFormVisible: false,
      attendForm: {
        attendType: '',
        attendNum: '',
        attendNickname: '',
        attendOthersType: ''
      },
      attendRoomNum: '',
      attendRoomPwd: '',
      callConfig: window.config.call || {
        sip: false,
        h323: false,
        tel: false,
        other: false
      },
      attendFormRules: {
        attendNum: [
          { required: true, message: '请输入需要呼叫的号码', trigger: 'blur' }
        ],
        attendOthersType: [
          { validator: checkClientType, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    attendRoom (room, pass, type) {
      let _this = this
      _this.attendForm.attendType = type
      _this.attendRoomNum = room
      _this.attendRoomPwd = pass || ''
      _this.attendDialogFormVisible = true
    },

    joinWithCall () {
      let _this = this
      _this.attendDialogFormVisible = false
      _this.joinRoom(_this.attendRoomNum, _this.attendRoomPwd, _this.attendForm)
    },

    clientChange (value) {
      console.log('client type change to: ', value)
      this.attendForm.attendNum = ''
    },

    otherClientChange (value) {
      console.log('other client type change to: ', value)
      this.attendForm.attendNum = ''
    },

    submitForm (formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.attendForm.attendType === 'other') {
            Utils.doClientCall(
              _this.apiServer,
              _this.attendRoomNum,
              _this.attendRoomPwd,
              _this.attendForm.attendNum,
              _this.attendForm.attendType,
              _this.attendForm.attendOthersType,
              _this.attendForm.attendNickname,
              function (res) {
                console.log('call other client attend', res)
                Utils.notification(_this, '呼叫消息已发送')
              }
            )
            _this.attendDialogFormVisible = false
          } else {
            _this.joinWithCall()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    resetForm (formName) {
      let _this = this
      _this.attendDialogFormVisible = false
      _this.$refs[formName].resetFields()
    },

    handleShowMenuClick (event, item) {
      this.$refs.vueSimpleContextMenu1.showMenu(event, item)
    },
    menuItemClicked (event) {
      let _this = this
      // console.log(JSON.stringify(event))
      if (event.option.slug === 'copy') {
        _this.copyConferenceInfo(event.item)
      } else {
        Utils.notification(_this, '功能持续开放中,敬请期待')
      }
    },
    showReservation () {
      let _this = this
      _this.reservationDialogFormVisible = true
    },

    reservationSubmit () {
      let _this = this
      _this.reservationDialogFormVisible = false
      Utils.notification(_this, '会议预约成功')
      _this.refreshConferences()
    },

    refreshConferences () {
      let _this = this
      _this.activeName = 'upcoming'
      _this.conferences = []
      _this.activePage = 1
      _this.conferencesCount = 0
      _this.getConferences(_this.activePage, _this.conferencesCount)
      if (_this.activeName !== 'contacts') {
        if (_this.contactsTimer) {
          window.clearTimeout(_this.contactsTimer)
          _this.contactsTimer = null
        }
      }
    },

    copyConferenceInfo (info) {
      let _this = this
      let content = ''
      let startAt = ''
      if (info.startTime) {
        let date = new Date(info.startTime)
        startAt = Utils.doFormatDate(date, 'yyyy-MM-dd hh:mm')
      }
      // console.log('will copy conference information : ', info)
      content += '会议号: ' + info.cNumber +
      '\n' +
      '会议室密码: ' + (info.meetPassword || '') +
      '\n\n' +
      '会议主题: ' + info.title +
      '\n' +
      '开始时间: ' + startAt +
      '\n' +
      '会议状态: ' + Utils.formatConferenceStatus(info)
      _this.$copyText(content).then(res => {
        Utils.notification(_this, '会议信息复制成功')
      }).catch(e => {
        console.log('copy conference information failed: ', e)
      })
    },
    showContact (item) {
      this.$emit('showContactDetail', item)
    },
    videoCall (item) {
      console.log('will send video call to ', item)
      this.$emit('callSomeone', item)
    },
    showAddContact () {
      this.$emit('showAddContactForm')
    },
    handleClick (activeType) {
      let _this = this
      if (_this.loading) {
        Utils.notification(_this, '正在获取数据,请稍后.')
        return false
      }
      _this.activeName = activeType
      _this.loading = true
      console.log('handle tab click event: ', _this.activeName)
      if (_this.activeName === 'contacts') {
        _this.getMyContacts()
        _this.loading = false
      }
      _this.conferences = []
      _this.activePage = 1
      _this.conferencesCount = 0
      _this.moreBtnTitle = '加载更多...'
      _this.moreBtnDisabled = false
      _this.moreBtnType = ''
      _this.getConferences(_this.activePage, _this.conferencesCount)
      if (_this.activeName !== 'contacts') {
        if (_this.contactsTimer) {
          window.clearTimeout(_this.contactsTimer)
          _this.contactsTimer = null
        }
      }
    },

    sortContacts (items) {
      for (let i = 0; i < items.length; i++) {
        let item = items[i]
        if (item.onLine) {
          items.splice(i, 1)
          items.unshift(item)
        }
      }
      return items
    },

    getMyContacts () {
      let _this = this
      if (_this.contactsTimer) {
        window.clearTimeout(_this.contactsTimer)
        _this.contactsTimer = null
      }
      Utils.getContacts(
        _this.apiServer,
        res => {
          _this.contacts = _this.sortContacts(res)
        }
      )
      _this.contactsTimer = window.setTimeout(function () {
        _this.getMyContacts()
      }, 1000)
    },

    getConferences (page, count) {
      let _this = this
      if (!_this.apiServer || !window.config.mUserId) {
        console.warn('params except: ', _this.apiServer, window.config.mUserId)
        return false
      }
      let url = ''
      if (_this.activeName === 'history') {
        url = 'https://' + _this.apiServer + '/clientApi/conferences?userId=' +
            window.config.mUserId + '&status=MSE0&page=' + page + '&count=' + count
      } else {
        url = 'https://' + _this.apiServer + '/clientApi/conferences/' +
            window.config.mUserId + '?page=' + page + '&count=' + count
      }
      _this.$http(url, {
        headers: {
          'userJid': (window.connection ? (window.connection.jid || '') : ''),
          'token': (window.config ? (window.config.token || '') : '')
        }
      }).then(res => {
        if (res.status === 200) {
          if (res.data && res.data.mcode === 200) {
            _this.conferencesCount = res.data.msg
            if (res.data.obj && res.data.obj.length) {
              _this.conferences = _this.conferences.concat(res.data.obj)
              _this.activePage++
              _this.$nextTick(function () {
                _this.loading = false
              })
            }
          } else {
            console.warn('unknown response code: ', res.data)
            if (res.data && res.data.mcode === 128) {
              _this.moreBtnTitle = '没有更多数据了'
              _this.moreBtnDisabled = true
              _this.moreBtnType = 'danger'
              _this.$nextTick(function () {
                _this.loading = false
              })
            }
          }
        }
      }).catch(err => {
        console.error(err)
      })
    },
    joinRoom (_room, _pass, _actions) {
      let _this = this
      if (!_room) {
        return false
      }
      if (!_this.audioIn || !_this.videoIn || !_this.audioOut) {
        Utils.notification(_this, '请先选择参会设备后再进入房间', 'error')
        return false
      }
      _this.$store.dispatch('conferenceRoom/clearData')
      // _this.$router.push({
      //   name: 'meeting',
      //   params: {
      //     roomNumber: room,
      //     mode: 'authorised',
      //     code: (pass || '')
      //   }
      // })
      _this.$emit('doAttendIntoRoom', {
        roomNumber: _room,
        mode: 'authorised',
        code: (_pass || ''),
        actions: _actions
      })
    }
  },
  computed: {
    apiServer () {
      return this.$store.state.serverSetting.serverAddr
    },
    audioIn: function () {
      return this.$store.state.deviceSetting.audioIn || ''
    },
    videoIn: function () {
      return this.$store.state.deviceSetting.videoIn || ''
    },
    audioOut: function () {
      return this.$store.state.deviceSetting.audioOut || ''
    }
  },
  mounted: function () {
    this.getConferences(this.activePage, this.conferencesCount)
  },
  beforeDestroy: function () {
    let _this = this
    if (_this.contactsTimer) {
      window.clearTimeout(_this.contactsTimer)
      _this.contactsTimer = null
    }
  }
}
</script>

<style scoped>
  .participate-container {
    width: 400px;
    position: fixed;
    z-index: 2;
    bottom: 0px;
  }

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
    /* background-color: #0D4A96; */
  }

  a.none-decoration {
    text-decoration: none;
    color: inherit;
  }

  .block-main {
    padding: 0px;
    border-radius: 5px;
    /*overflow-y: scroll;*/
    overflow-x: hidden;
    /*height: calc(100vh - 300px);*/
  }

  .conferences-list-content {
    height: calc(100vh - 360px);
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    float: left;
  }

  .conferences-list-content::-webkit-scrollbar{
    width:4px;
    height:4px;
  }

  /*.conferences-list-content::-webkit-scrollbar-track{*/
    /*background: #f6f6f6;*/
  /*}*/
  /*.conferences-list-content::-webkit-scrollbar-thumb{*/
    /*background: #63646D;*/
  /*}*/
  /*.conferences-list-content::-webkit-scrollbar-thumb:hover {*/
    /*background: #3E4459;*/
  /*}*/
  /*.conferences-list-content::-webkit-scrollbar-corner {*/
    /*background: #f6f6f6;*/
  /*}*/

  .block-bottom {
    height: 132px;
  }

  .el-tabs__item.is-active {
    color: #eeeeee !important;
  }

  .meeting-item {
    padding: 10px;
    border-bottom: 1px solid #eeeeee;
  }

  /*.meeting-item:hover {*/
    /*background: #2d3140;*/
  /*}*/

  div.meeting-item{
    word-break:break-all;
  }

  .group-date {
    background: #898788;
  }

  .meeting-item-participate {
    /*padding: 10px 0px;*/
    text-align: right;
  }

  .meeting-item .meeting-item-participate {
    display: none;
  }

  .meeting-item:hover .meeting-item-participate {
    display: block;
  }

  .conference-status {
    padding: 10px 0px;
    background: #3E4459;
  }

  .load-more {
    padding: 10px;
  }

  .text-center {
    text-align: center;
  }

  .conferences-type-title {
    height: 50px;
    z-index: 2;
    background-color: #3E4459;
    padding: 0px;
  }

  .conferences-type-title>a,.conferences-type-title>a:hover,.conferences-type-title>a:active {
    text-decoration: none;
    color: #ffffff;
  }

  .active-tab {
    border-bottom: solid 2px #30CA77;
  }

  .type-tab {
    padding: 15px;
  }

  .conference-type {
    margin: 8px 0px;
  }

  .conference-title {
    height: 18px;
    overflow: hidden;
  }

  .conference-join {
    margin: 4px 0px;
  }

  .participate-btn {
    background-color: #3E4459;
    border-color: #898788;
    color: #ffffff;
  }

  .conference-item-title {
    height: 50px;
  }

  .conference-item-title>div.text-center {
    padding-top: 15px;
    padding-bottom: 15px;
    background-color: #3E4459;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  .conference-item-content {
    padding: 15px 30px !important;
    /*background-color: #0D4A96;*/
  }

  .extra-start-time {
    font-size: 10px;
  }

  .hidden {
    display: none;
  }

  .on-line-status {
    padding: 0px 6px;
    color: #37C478;
    border: 1px solid #37C478;
    border-radius: 7px;
    font-size: 10px;
  }

  .off-line-status {
    padding: 0px 6px;
    color: gray;
    border: 1px solid gray;
    border-radius: 7px;
    font-size: 10px;
  }

  .call-btn {
    background-color: #37C478 !important;
  }

  .add-contact-box {
    padding: 12px;
  }

</style>
