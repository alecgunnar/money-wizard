<template>
  <div>
    <form data-qa="add-transaction-form"
      @submit="submit">
      <div v-if="failedToSubmit"
        class="submitFailure"
        data-qa="submit-error">The transaction could not be added.</div>
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
            <div v-if="accountIsEmptyError"
              class="form__fieldError"
              data-qa="choose-account-error">An account must be chosen.</div>
          </div>
        </div>
        <div class="form__row">
          <div class="form__label">
            <label for="amount">
              Type
            </label>
          </div>
          <div class="form__input form__input--right">
            <div v-if="accountTypeIsSelected('asset')"
              class="form__radios"
              data-qa="asset-types">
              <div class="form__radio">
                <input type="radio"
                  data-qa="debit-opt"
                  value="debit"
                  v-model="type"
                  id="debit" />
                <label for="debit">Withdrawl</label>
              </div>
              <div class="form__radio">
                <input type="radio"
                  data-qa="credit-opt"
                  value="credit"
                  v-model="type"
                  id="credit" />
                <label for="credit">Deposit</label>
              </div>
            </div>
            <div v-else-if="accountTypeIsSelected('credit')"
              class="form__radios"
              data-qa="credit-types">
              <div class="form__radio">
                <input type="radio"
                  data-qa="debit-opt"
                  value="debit"
                  v-model="type"
                  id="debit" />
                <label for="debit">Charge</label>
              </div>
              <div class="form__radio">
                <input type="radio"
                  data-qa="credit-opt"
                  value="credit"
                  v-model="type"
                  id="credit" />
                <label for="credit">Payment</label>
              </div>
            </div>
            <div v-else
              class="form__radios"
              data-qa="choose-account-types">
              <div class="form__radio">
                <label for="debit">Debit</label>
                <input type="radio"
                  disabled
                  id="debit" />
              </div>
              <div class="form__radio">
                <label for="credit">Credit</label>
                <input type="radio"
                  disabled
                  id="credit" />
              </div>
            </div>
            <div v-if="typeIsEmptyError"
              class="form__fieldError"
              data-qa="choose-type-error">A type must be chosen.</div>
          </div>
        </div>
        <div class="form__row">
          <div class="form__label">
            <label for="amount">
              Amount
            </label>
          </div>
          <div class="form__input form__input--right">
            <div class="form__input--withPrefix">
              <div class="form__inputPrefix">
                $
              </div>
              <input type="text"
                id="amount"
                v-model="amount"
                data-qa="amount" />
            </div>
            <div v-if="amountTooLowError"
              class="form__fieldError"
              data-qa="amount-too-low-error">The amount must be greater than zero.</div>
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
            <div v-if="dateIsEmptyError"
              class="form__fieldError"
              data-qa="date-is-empty-error">A date must be entered.</div>
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
import TransactionsClient from '@/clients/transactions'
import moment from 'moment'

export default {
  name: 'new-transaction-form',
  data () {
    return {
      account: null,
      type: null,
      amount: '0.00',
      date: '',
      notes: '',
      accountIsEmptyError: false,
      typeIsEmptyError: false,
      amountTooLowError: false,
      dateIsEmptyError: false,
      accounts: [],
      failedToSubmit: false
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

      this.accountIsEmptyError = this.account === null
      this.typeIsEmptyError = this.type === null
      this.amountTooLowError = this.amount <= 0
      this.dateIsEmptyError = this.date === ''

      if (this.accountIsEmptyError ||
        this.typeIsEmptyError ||
        this.amountTooLowError ||
        this.dateIsEmptyError) return

      TransactionsClient.addTransaction(
        this.account,
        this.type,
        this.amount,
        this.date,
        this.notes
      ).then(this.transactionAdded)
        .catch(this.transactionNotAdded)
    },
    transactionAdded () {
      this.$emit('submitted')
    },
    transactionNotAdded () {
      this.failedToSubmit = true
    },
    accountTypeIsSelected (type) {
      return this.accounts.filter((account) => account.id === this.account && account.type === type).length === 1
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

.form__radios {
  display: flex;
}

.form__radio {
  background-color: #eaeaea;
  border: 1px solid #c1c1c1;
  border-right-width: 0px;
  flex: 1;

  label {
    text-align: center;
    display: block;
    padding: 0.5em;
    cursor: pointer;
  }

  input {
    display: none;

    &:checked + label {
      font-weight: bold;
      text-decoration: underline;
    }
  }

  &:first-of-type {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  &:last-of-type {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    border-right-width: 1px;
  }
}

.form__footer {
  padding-left: calc(30% + 1em);

  button {
    margin: 0 0.5em 0 0;
  }
}
</style>
