<template>
  <div>
    <div class="form">
      <div class="form__row">
        <div class="form__label">
          <label for="account">
            Account
          </label>
        </div>
        <div class="form__input">
          <select data-qa="choose-account"
            id="account"
            v-model="account">
            <option :value="null"
              disabled>Choose an Account</option>
            <option v-for="account in accounts"
              :key="account.id">{{ account.name }}</option>
          </select>
        </div>
      </div>
      <div class="form__row">
        <div class="form__label">
          <label for="amount">
            Amount
          </label>
        </div>
        <div class="form__input">
          <input type="text"
            id="amount"
            data-qa="amount" />
        </div>
      </div>
    </div>
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

<style lang="scss" scoped>
.submitFailure {
  background-color: #FFCDD2;
  color: #D50000;
  padding: 0.5em;
  margin: 0 0 2em;
}

.form__row {
  display: flex;
  margin: 0 0 2em;
  position: relative;
}

.form__fieldError {
  color: #D50000;
  position: absolute;
}

.form__label {
  text-align: right;
  width: 30%;
  margin: 0 1em 0 0;
  padding: 0.5em 0;
}

.form__input {
  flex: 1;
}

.form__footer {
  padding-left: calc(30% + 1em);

  button {
    margin: 0 0.5em 0 0;
  }
}
</style>
