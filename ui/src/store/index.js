import Vue from 'vue'
import Vuex from 'vuex'

import transactions from './transactions'
import accounts from './accounts'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    serverError: null
  },
  mutations: {
    encounteredServerError (state, msg) {
      state.serverError = msg
    },
    clearServerError (state) {
      state.serverError = null
    }
  },
  getters: {},
  actions: {},
  modules: {
    transactions,
    accounts
  }
})
