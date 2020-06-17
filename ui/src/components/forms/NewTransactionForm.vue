<template>
  <div>
    <form data-qa="add-transaction-form"
      @submit="submit">
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
                :value="account.id"
                :key="account.id">{{ account.name }}</option>
            </select>
            <div v-if="accountIsEmpty"
              class="form__fieldError"
              data-qa="choose-account-error">An account must be chosen.</div>
          </div>
        </div>
        <div class="form__row">
          <div class="form__label">
            <label for="amount">
              Amount
            </label>
          </div>
          <div class="form__input form__input--right form__input--withPrefix">
            <div class="form__inputPrefix">
              $
            </div>
            <input type="text"
              id="amount"
              v-model="amount"
              data-qa="amount" />
          </div>
        </div>
        <div class="form__row">
          <div class="form__label">
            <label for="date">
              Date
            </label>
          </div>
          <div class="form__input form__input--right">
            <input type="text"
              id="date"
              v-model="date"
              data-qa="date" />
          </div>
        </div>
        <div class="form__row">
          <div class="form__label">
            <label for="notes">
              Notes
            </label>
          </div>
          <div class="form__input form__input--right">
            <textarea data-qa="notes"
              v-model="notes"
              id="notes"></textarea>
          </div>
        </div>
        <div class="form__footer">
          <button type="submit"
            data-qa="submit">Save Transaction</button>
          <button type="button"
            data-qa="cancel"
            @click="cancel">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import AccountsClient from '@/clients/accounts'
import moment from 'moment'

export default {
  name: 'new-transaction-form',
  data () {
    return {
      account: null,
      amount: '0.00',
      date: '',
      notes: '',
      accountIsEmpty: false,
      accounts: []
    }
  },
  mounted () {
    this.date = moment().format('MM/DD/YYYY')
    AccountsClient.getAccounts()
      .then(this.accountsLoaded)
  },
  methods: {
    accountsLoaded (accounts) {
      this.accounts = accounts
    },
    cancel () {
      this.$emit('cancel')
    },
    submit (e) {
      e.preventDefault()

      if (this.account === null) this.accountIsEmpty = true
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
  width: 300px;
}

.form__input--right input {
  text-align: right;
}

.form__input--withPrefix {
  display: flex;

  input {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    min-width: unset;
    flex: 1;
  }
}

.form__inputPrefix {
  background-color: #eaeaea;
  border: 1px solid #c1c1c1;
  border-right: none;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  padding: 0.5em 0.75em;
}

.form__footer {
  padding-left: calc(30% + 1em);

  button {
    margin: 0 0.5em 0 0;
  }
}
</style>
