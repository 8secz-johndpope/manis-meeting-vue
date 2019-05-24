import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
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
    },
    {
      path: '/v2/meeting',
      name: 'meeting',
      component: require('../components/MeetingPage/IndexPage').default
    },
    {
      path: '/app/drawing',
      name: 'drawing',
      component: require('../components/ShareApps/DrawingBrand').default
    },
    {
      path: '/about',
      name: 'about',
      component: require('../components/Layout/AboutPage').default
    },
    {
      path: '/settings',
      name: 'settings',
      component: require('../components/Layout/SettingPage').default
    },
    {
      path: '/update',
      name: 'update',
      component: require('../components/Layout/UpdatePage').default
    }
  ]
})
