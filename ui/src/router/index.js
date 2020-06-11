import Vue from 'vue'
import Router from 'vue-router'
import Transactions from '@/views/Transactions'
import Accounts from '@/views/Accounts'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'transactions',
      component: Transactions
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: Accounts
    }
  ]
})
