<template>
  <div>
    <form class="form"
      data-qa="begin-reconciliation"
      @submit="beginReconciliation">
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
        <button data-qa="cancel"
          type="button"
          @click="cancel">Cancel</button>
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
      e.preventDefault()
      this.emptyAmountErr = !this.amount
      this.nonNumericAmountErr = !this.emptyAmountErr && isNaN(parseFloat(this.amount))
    },
    cancel () {
      this.$emit('canceled')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/forms.scss';
</style>
