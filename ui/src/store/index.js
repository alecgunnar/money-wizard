import Vue from 'vue'
import Vuex from 'vuex'

import transactions from './transactions'
import accounts from './accounts'
import reconcile from './reconcile'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    serverError: null
  },
  mutations: {
    encounteredServerError (state) {
      state.serverError = true
    },
    clearServerError (state) {
      state.serverError = null
    }
  },
  getters: {},
  actions: {},
  modules: {
    transactions,
    accounts,
    reconcile
  }
})
