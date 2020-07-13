<template>
  <div>
    <form class="form"
      data-qa="begin-reconciliation"
      @submit="beginReconciliation">
      <div v-if="enterAnAmountError"
        class="form__fieldError"
        data-qa="enter-an-amount-error"></div>

      <div class="form__row">
        <div class="form__label">
          <label for="expected-balance">
            Expected Balance
          </label>
        </div>
        <div class="form__input">
          <div class="form__input--withPrefix">
              <div class="form__inputPrefix">
                $
              </div>
              <input data-qa="expected-balance"
                type="text"
                id="expected-balance"
                v-model="amount" />
            </div>
          <div v-if="emptyAmountErr"
            class="form__fieldError"
            data-qa="enter-an-amount-error">You must enter an expected balance.</div>
          <div v-if="nonNumericAmountErr"
            class="form__fieldError"
            data-qa="enter-numeric-amount-error">You must enter a number.</div>
        </div>
      </div>
      <div class="form__footer">
        <button type="submit"
          data-qa="continue">Continue</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'expected-balance-form',
  data () {
    return {
      amount: '',
      emptyAmountErr: false,
      nonNumericAmountErr: false
    }
  },
  methods: {
    beginReconciliation (e) {
      e.stopPropagation()
      this.emptyAmountErr = !this.amount
      this.nonNumericAmountErr = isNaN(parseFloat(this.amount))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/forms.scss';
</style>
