<template>
  <div>
    <h1>Accounts</h1>
    <h2>Bank Accounts</h2>
    <ListOfAccounts
      :accounts="debitAccounts"
      class="accountsGroup" />
    <h2>Cash on Hand</h2>
    <ListOfAccounts
      :accounts="cashAccounts"
      class="accountsGroup" />
    <h2>Credit Cards</h2>
    <ListOfAccounts :accounts="creditAccounts"
      class="accountsGroup" />
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import ListOfAccounts from '../lists/ListOfAccounts'

export default {
  name: 'Accounts',
  computed: {
    ...mapState(['accounts']),
    debitAccounts () {
      return this.accounts.filter((account) => ['checking', 'savings'].indexOf(account.type) > -1)
    },
    creditAccounts () {
      return this.accounts.filter((account) => ['credit-card'].indexOf(account.type) > -1)
    },
    cashAccounts () {
      return this.accounts.filter((account) => ['cash'].indexOf(account.type) > -1)
    }
  },
  mounted () {
    this.loadAccounts()
  },
  methods: mapActions(['loadAccounts']),
  components: { ListOfAccounts }
}
</script>

<style scoped>
.accountsGroup {
  margin: 0 0 2rem;
}
</style>
