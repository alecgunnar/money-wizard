<template>
  <ul class="accounts">
    <li v-for="account in accounts"
      class="accounts__account"
      :key="account.id">
      <div class="accounts__name">{{ account.name }}</div>
      <div class="accounts__balance">${{ account.balance }}</div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ListOfAccounts',
  props: {
    accounts: {
      required: true,
      type: Array
    }
  }
}
</script>

<style scoped>
.accounts {
  font-size: 1.6rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.accounts__account {
  margin: 0 0 0.5em;
  display: flex;
}

.accounts__name {
  flex: 1;
}
</style>
