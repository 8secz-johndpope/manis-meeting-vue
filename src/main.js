import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import axios from 'axios'
import router from './router'
import store from './store'
import './plugins/icoMoon'
import './plugins/toast'
import './plugins/overlayLoading'
import './plugins/vueAwesome'
import './assets/css/style.css'

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

// export default {
//   render: h => h(App),
//   router,
//   store
// }
