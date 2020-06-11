<template>
  <div class="page">
    <div v-if="addingAccount"
      class="addAccount">
      <div class="addAccount__header">
        <div class="addAccount__title">
          <h2>Add an Account</h2>
        </div>
        <div class="addAccount__cancel">
          <button data-qa="close-form-btn"
            @click="cancelAddAccount"
            title="Cancel">Cancel</button>
        </div>
      </div>
      <NewAccountForm />
    </div>
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
    },
    cancelAddAccount () {
      this.addingAccount = false
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

.addAccount {
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  box-sizing: border-box;
}

.addAccount__header {
  display: flex;
  align-items: center;
}

.addAccount__title {
  flex: 1;
}

.addAccount__cancel button {
  background: #e1e1e1;
  border: none;
  outline: none;
  font-size: 1.5em;
  cursor: pointer;
  padding: 0.25em 0.5em;
  border-radius: 3px;
}
</style>
