<template>
  <div>
    <NewAccountForm v-if="addingAccount" />
    <div class="header">
      <div class="header__title">
        <h1>Accounts</h1>
      </div>
      <div class="header__buttons">
        <button data-qa="add-account-btn"
          class="button"
          @click="addAccount">Add Account</button>
      </div>
    </div>
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
import NewAccountForm from '@/components/forms/NewAccountForm'
import {mapActions, mapState} from 'vuex'

export default {
  name: 'accounts',
  data () {
    return {
      addingAccount: false
    }
  },
  computed: mapState(['accounts']),
  mounted () {
    this.loadAccounts()
  },
  methods: {
    ...mapActions(['loadAccounts']),
    addAccount () {
      this.addingAccount = true
    }
  },
  components: {
    AccountRow,
    NewAccountForm
  }
}
</script>

<style scoped>
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
  font-size: 1.5rem;
  color: #fff;
  border: none;
  outline: none;
  padding: 0.5rem 1rem;
  border-radius: 3px;
  cursor: pointer;
}

.accounts {
  list-style: none;
  padding: 0;
}

.account {
  margin: 0 0 1rem;
}
</style>
