<template>
  <div>
    <h1>Accounts</h1>
    <ol v-if="accounts.accounts.length"
      class="accounts"
      data-qa="list-of-accounts">
      <li v-for="account in accounts.accounts"
        :key="account.id"
        class="account">
        <AccountRow :account="account" />
      </li>
    </ol>
    <p v-else
      data-qa="no-accounts-msg">There are no accounts to display.</p>
  </div>
</template>

<script>
import AccountRow from '@/components/lists/AccountRow'
import {mapActions, mapState} from 'vuex'

export default {
  name: 'accounts',
  computed: mapState(['accounts']),
  mounted () {
    this.loadAccounts()
  },
  methods: mapActions(['loadAccounts']),
  components: {
    AccountRow
  }
}
</script>

<style scoped>
.accounts {
  list-style: none;
  padding: 0;
}

.account {
  margin: 0 0 1rem;
}
</style>
