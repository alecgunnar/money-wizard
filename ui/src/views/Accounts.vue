<template>
  <div class="page">
    <div v-if="addingAccount"
      class="addAccount">
      <div class="addAccount__header">
        <div class="addAccount__title">
          <h2>Add an Account</h2>
        </div>
      </div>
      <NewAccountForm
        @submitted="accountAdded"
        @cancel="cancelAddAccount" />
    </div>
    <div class="header">
      <h1 class="header__title">Accounts</h1>
      <div class="header__buttons">
        <button data-qa="add-account-btn"
          class="button"
          @click="addAccount">Add Account</button>
      </div>
    </div>
    <div v-if="assetAccounts.length">
      <h2>Bank Accounts and Cash</h2>
      <ul class="accounts"
        data-qa="list-of-asset-accounts">
        <li v-for="account in assetAccounts"
          :key="account.id">
          <AccountRow :account="account" />
        </li>
      </ul>
    </div>
    <div v-if="creditAccounts.length">
      <h2>Credit Cards</h2>
      <ul class="accounts"
        data-qa="list-of-credit-accounts">
        <li v-for="account in creditAccounts"
          :key="account.id">
          <AccountRow :account="account" />
        </li>
      </ul>
    </div>
    <p v-if="accounts.length === 0"
      data-qa="no-accounts-msg">There are no accounts to display.</p>
  </div>
</template>

<script>
import AccountRow from '@/components/lists/AccountRow'
import NewAccountForm from '@/components/forms/NewAccountForm'
import AccountsClient from '@/clients/accounts'

export default {
  name: 'accounts',
  data () {
    return {
      accounts: [],
      addingAccount: false
    }
  },
  computed: {
    assetAccounts () {
      return this.accounts.filter((account) => account.type === 'asset')
    },
    creditAccounts () {
      return this.accounts.filter((account) => account.type === 'credit')
    }
  },
  mounted () {
    this.loadAccounts()
  },
  methods: {
    loadAccounts () {
      AccountsClient.getAccounts()
        .then(this.accountsLoaded)
    },
    accountsLoaded (accounts) {
      this.accounts = accounts
    },
    addAccount () {
      this.addingAccount = true
    },
    cancelAddAccount () {
      this.addingAccount = false
    },
    accountAdded () {
      this.addingAccount = false
      this.loadAccounts()
    }
  },
  components: {
    AccountRow,
    NewAccountForm
  }
}
</script>

<style scoped>
.page {
  position: relative;
}

.header {
  display: flex;
  margin: 0 0 2rem;
}

.header__title,
.header__buttons {
  line-height: 3rem;
  flex: 1;
}

.header__title {
  margin: 0;
}

.header__buttons {
  text-align: right;
}

.button {
  background: #4CAF50;
  color: #fff;
}

.accounts {
  list-style: none;
  padding: 0;
  margin: 1em -1rem;
  border-bottom: 1px solid #efefef;
}

.addAccount {
  background-color: #fff;
  position: absolute;
  top: -1rem;
  left: -1rem;
  bottom: -1rem;
  right: -1rem;
  padding: 1em;
  box-sizing: border-box;
}

.addAccount__header {
  display: flex;
  align-items: center;
  margin: 0 0 1em;
}

.addAccount__title {
  flex: 1;
}

@media screen and (min-width: 980px) {
  .accounts {
    margin: 1em 0;
    border: 0;
  }
}
</style>
