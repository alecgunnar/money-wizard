import Vue from 'vue'
import Router from 'vue-router'
import Transactions from '@/views/Transactions'
import Accounts from '@/views/Accounts'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/transactions',
      name: 'transactions',
      component: Transactions
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: Accounts
    },
    {
      path: '/transactions/account-:id',
      name: 'account-transactions',
      component: Transactions
    },
    {
      path: '/',
      redirect: '/accounts'
    }
  ]
})
