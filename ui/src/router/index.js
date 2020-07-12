import Vue from 'vue'
import Router from 'vue-router'
import Transactions from '@/views/Transactions'
import Accounts from '@/views/Accounts'
import Reconcile from '@/views/Reconcile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/accounts',
      name: 'accounts',
      component: Accounts
    },
    {
      path: '/account/:id',
      name: 'account',
      component: Transactions,
      props: true
    },
    {
      path: '/account/:id/reconcile',
      name: 'reconcile',
      component: Reconcile,
      props: true
    },
    {
      path: '/',
      redirect: '/accounts'
    }
  ]
})
