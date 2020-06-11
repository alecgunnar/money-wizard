<template>
  <div class="form">
    <div class="form__row">
      <div class="form__label">
        <label for="name">
          Name
        </label>
      </div>
      <div class="form__input">
        <input id="name"
          type="text"
          data-qa="name-input" />
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
          data-qa="account-type">
          <option disabled selected>Choose an account type</option>
          <option>Cash or Bank</option>
          <option>Credit Card</option>
        </select>
      </div>
    </div>
    <div class="form__footer">
      <button type="submit"
        data-qa="submit">Save Account</button>
      <button type="button"
        data-qa="cancel"
        @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'new-account-form',
  methods: {
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.form__row {
  display: flex;
  margin: 0 0 2em;
  align-items: center;
}

.form__label {
  text-align: right;
  width: 30%;
  margin: 0 1em 0 0;
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
