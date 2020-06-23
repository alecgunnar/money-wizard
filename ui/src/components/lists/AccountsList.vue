<template>
  <div>
    <h2>
      <slot></slot>
    </h2>
    <ul class="accounts">
      <li v-for="account in accounts"
        :key="account.id">
        <AccountRow :account="account" />
      </li>
    </ul>
  </div>
</template>

<script>
import AccountRow from './AccountRow'

export default {
  name: 'accounts-list',
  props: {
    accounts: {
      required: true
    }
  },
  components: {
    AccountRow
  }
}
</script>

<style scoped>
.accounts {
  list-style: none;
  padding: 0;
  margin: 1em -1rem;
  border-bottom: 1px solid #efefef;
}

@media screen and (min-width: 980px) {
  .accounts {
    margin: 1em 0;
    border: 0;
  }
}
</style>
