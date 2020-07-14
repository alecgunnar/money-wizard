import RootClient from '@/clients'

const state = {
  account: null
}

const mutations = {
  accountLoaded (state, account) {
    state.account = account
  }
}

const actions = {
  reconcileAccount ({commit}, id) {
    return RootClient.get(`/accounts/${id}`)
      .then(resp => resp.data)
      .then(data => commit('accountLoaded', data))
      .then(() => true)
      .catch(() => false)
  }
}

export default {
  state,
  mutations,
  actions
}
