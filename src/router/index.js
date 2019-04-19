import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/meeting/:roomNumber/:mode',
      name: 'meeting',
      component: require('../components/MeetingPage/IndexPage').default
    },
    {
      path: '/app/drawing',
      name: 'drawing',
      component: require('../components/ShareApps/DrawingBrand').default
    },
    /* version 1.0 */
    {
      path: '/v1/setting/basic',
      name: 'basic-setting-page',
      component: require('../components/V1.0/SystemPage/BasicSettingPage').default
    },
    {
      path: '/v1/setting/device',
      name: 'device-setting-page',
      component: require('../components/V1.0/SystemPage/DeviceSettingPage').default
    },
    {
      path: '/v1',
      name: 'index-page',
      component: require('../components/V1.0/ConferencePage/IndexPage').default
    },
    {
      path: '/v1/list',
      name: 'list-page',
      component: require('../components/V1.0/ConferencePage/ListPage').default
    },
    {
      path: '/v1/login',
      name: 'login-page',
      component: require('../components/V1.0/LoginPage').default
    },
    {
      path: '/v1/feedback',
      name: 'feedback',
      component: require('../components/V1.0/FeedbackPage/IndexPage').default
    },
    {
      path: '*',
      redirect: '/'
    },
    /* version 2.0 */
    {
      path: '/',
      name: 'v2-login',
      component: require('../components/V2.0/WelcomePage/IndexPage').default
    },
    {
      path: '/v2/participate',
      name: 'v2-participate',
      component: require('../components/V2.0/ParticipatePage/IndexPage').default
    }
  ]
})
