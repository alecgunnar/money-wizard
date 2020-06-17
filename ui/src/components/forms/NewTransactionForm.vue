<template>
  <div>
    <select data-qa="choose-account"
      v-model="account">
      <option :value="null"
        disabled>Choose an Account</option>
      <option v-for="account in accounts"
        :key="account.id">{{ account.name }}</option>
    </select>
    <input data-qa="amount" />
  </div>
</template>

<script>
import AccountsClient from '@/clients/accounts'

export default {
  name: 'new-transaction-form',
  data () {
    return {
      account: null,
      accounts: []
    }
  },
  mounted () {
    AccountsClient.getAccounts()
      .then(this.accountsLoaded)
  },
  methods: {
    accountsLoaded (accounts) {
      this.accounts = accounts
    }
  }
}
</script>
