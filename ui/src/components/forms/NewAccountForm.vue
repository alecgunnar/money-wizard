<template>
  <div>
    <div v-if="failedToSubmit"
      class="submitFailure"
      data-qa="submit-error">The account could not be added.</div>
    <form class="form"
      data-qa="new-account-form"
      @submit="submit">
      <div class="form__row">
        <div class="form__label">
          <label for="name">
            Name
          </label>
        </div>
        <div class="form__input">
          <input id="name"
            type="text"
            v-model="name"
            data-qa="name-input" />
          <div v-if="emptyNameErr"
            class="form__fieldError"
            data-qa="empty-name-error">A name is required.</div>
        </div>
      </div>
      <div class="form__row">
        <div class="form__label">
          <label for="type">
            Type
          </label>
        </div>
        <div class="form__input">
          <select id="type"
            v-model="type"
            data-qa="account-type">
            <option value="" disabled selected>Choose an account type</option>
            <option value="asset">Cash or Bank</option>
            <option value="credit">Credit Card</option>
            <option value="loan">Loan</option>
          </select>
          <div v-if="withoutTypeErr"
            class="form__fieldError"
            data-qa="without-type-error">A type must be selected.</div>
        </div>
      </div>
      <div class="form__footer">
        <button type="submit"
          data-qa="submit">Save Account</button>
        <button type="button"
          data-qa="cancel"
          @click="cancel">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import AccountsClient from '@/clients/accounts'

export default {
  name: 'new-account-form',
  data () {
    return {
      name: '',
      type: '',
      emptyNameErr: false,
      withoutTypeErr: false,
      failedToSubmit: false
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    submit (e) {
      e.preventDefault()
      this.emptyNameErr = this.name === ''
      this.withoutTypeErr = this.type === ''

      if (this.emptyNameErr || this.withoutTypeErr) return

      AccountsClient.createAccount(this.name, this.type)
        .then(this.submitted)
        .catch(this.failed)
    },
    submitted () {
      this.$emit('submitted')
    },
    failed () {
      this.failedToSubmit = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/forms.scss';
</style>
