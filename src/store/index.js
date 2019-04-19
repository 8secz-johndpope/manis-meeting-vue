import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

/**
 * @TODO
 * @BeforePublish
 * uncomment this before publish to repository
 */
// import { createPersistedState } from 'vuex-electron'
// const plugins = [createPersistedState()]

/**
 * @TODO
 * @BeforePublish
 * comment before publish to repository
 * @type {Array}
 */
const plugins = []

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: plugins,
  strict: process.env.NODE_ENV !== 'production'
})
