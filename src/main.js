import Vue from 'vue'
import App from './App.vue'
import './plugins/elementUIPlugin.js'
import './plugins/clipboardPlugin'
import axios from 'axios'
import router from './router'
import store from './store'
import './plugins/icoMoonPlugin'
import './plugins/toastPlugin'
import './plugins/overlayLoadingPlugin'
import './plugins/vueAwesomePlugin'
import './plugins/mouseMenuPlugin'
import './assets/css/style.css'

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// @TODO comment this before publish
// new Vue({
//   render: h => h(App),
//   router,
//   store
// }).$mount('#app')

// @TODO uncomment this before publish
export default {
  render: h => h(App),
  router,
  store
}
