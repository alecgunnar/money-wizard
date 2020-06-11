import Vue from 'vue'
import Router from 'vue-router'
import Transactions from '@/views/Transactions'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'transactions',
      component: Transactions
    }
  ]
})
