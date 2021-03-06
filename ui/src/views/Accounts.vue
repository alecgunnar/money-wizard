<template>
  <div class="page">
    <div v-if="addingAccount"
      class="modal">
      <div class="modal__window">
        <h3>Add an Account</h3>
        <NewAccountForm
          @submitted="accountAdded"
          @cancel="cancelAddAccount" />
      </div>
    </div>
    <div class="header">
      <h1 class="header__title">Accounts</h1>
      <div class="header__buttons">
        <button data-qa="add-account-btn"
          class="button"
          @click="addAccount">Add Account</button>
      </div>
    </div>
    <AccountsList v-if="assetAccounts.length"
      :accounts="assetAccounts"
      ref="assetList">
      Bank Accounts and Cash
    </AccountsList>
    <AccountsList v-if="creditAccounts.length"
      :accounts="creditAccounts"
      ref="creditList">
      Credit Cards
    </AccountsList>
    <AccountsList v-if="loanAccounts.length"
      :accounts="loanAccounts"
      ref="loanList">
      Loans
    </AccountsList>
    <p v-if="accounts.length === 0"
      data-qa="no-accounts-msg">There are no accounts to display.</p>
  </div>
</template>

<script>
import AccountsList from '@/components/lists/AccountsList'
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
    },
    loanAccounts () {
      return this.accounts.filter((account) => account.type === 'loan')
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
    AccountsList,
    AccountRow,
    NewAccountForm
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/modals.scss';

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
</style>
