import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import './plugins/clipboard'
import axios from 'axios'
import router from './router'
import store from './store'
import './plugins/icoMoon'
import './plugins/toast'
import './plugins/overlayLoading'
import './plugins/vueAwesome'
// import './plugins/customTitlebar' // @TODO uncomment this before publsh
import './assets/css/style.css'

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// @TODO comment this before publish

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

// @TODO uncomment this before publish
// export default {
//   render: h => h(App),
//   router,
//   store
// }
