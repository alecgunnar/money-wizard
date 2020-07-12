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
            <div v-else-if="accountTypeIsSelected('credit') || accountTypeIsSelected('loan')"
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
          <div class="form__input">
            <div class="form__input--withPrefix">
              <div class="form__inputPrefix">
                $
              </div>
              <input type="text"
                id="amount"
                v-model="amount"
                autocomplete="off"
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
          <div class="form__input">
            <div class="form__input--withPrefix">
              <div class="form__inputPrefix">
                &nbsp;
              </div>
              <input type="text"
                id="date"
                v-model="date"
                autocomplete="off"
                data-qa="date" />
            </div>
            <div v-if="dateIsEmptyError"
              class="form__fieldError"
              data-qa="date-is-empty-error">A date must be entered.</div>
          </div>
        </div>
        <div class="form__row">
          <div class="form__label">
            <label for="reason">
              Reason
            </label>
          </div>
          <div class="form__input">
            <input id="reason"
              type="text"
              v-model="reason"
              data-qa="reason" />
            <div v-if="reasonIsEmptyError"
              class="form__fieldError"
              data-qa="reason-is-empty-error">A reason must be entered.</div>
          </div>
        </div>
        <div class="form__row">
          <div class="form__label">
            <label for="notes">
              Additional Notes
            </label>
          </div>
          <div class="form__input">
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
import moment from 'moment'
import {mapState, mapActions} from 'vuex'

export default {
  name: 'new-transaction-form',
  data () {
    return {
      type: null,
      amount: '',
      date: '',
      reason: '',
      notes: '',
      accountIsEmptyError: false,
      typeIsEmptyError: false,
      amountTooLowError: false,
      dateIsEmptyError: false,
      reasonIsEmptyError: false,
      accounts: [],
      failedToSubmit: false
    }
  },
  computed: {
    ...mapState({
      account: state => state.transactions.account
    })
  },
  mounted () {
    this.date = moment().format('MM/DD/YYYY')
  },
  methods: {
    ...mapActions(['addTransaction']),
    accountsLoaded (accounts) {
      this.accounts = accounts
    },
    cancel () {
      this.$emit('cancel')
    },
    async submit (e) {
      e.preventDefault()

      this.accountIsEmptyError = this.account === null
      this.typeIsEmptyError = this.type === null
      this.amountTooLowError = this.amount <= 0
      this.dateIsEmptyError = this.date === ''
      this.reasonIsEmptyError = this.reason === ''

      if (this.accountIsEmptyError ||
        this.typeIsEmptyError ||
        this.amountTooLowError ||
        this.dateIsEmptyError ||
        this.reasonIsEmptyError) return

      const status = await this.addTransaction({
        type: this.type,
        amount: this.amount,
        date: this.date,
        reason: this.reason,
        notes: this.notes
      })

      if (status) this.transactionAdded()
      else this.transactionNotAdded()
    },
    transactionAdded () {
      this.$emit('submitted')
    },
    transactionNotAdded () {
      this.failedToSubmit = true
    },
    accountTypeIsSelected (type) {
      return this.account.type === type
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/forms.scss';
</style>
