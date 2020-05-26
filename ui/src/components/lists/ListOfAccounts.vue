<template>
  <div>
    <ul class="accounts">
      <li v-for="account in accounts"
        class="accounts__account"
        :key="account.id">
        <div class="accounts__name">{{ account.name }}</div>
        <div class="accounts__balance">{{ account.balance | dollarAmount }}</div>
      </li>
      <li class="accounts__account accounts__account--totalBalance">
        <div class="accounts__name accounts__name--totalBalance">Total</div>
        <div class="accounts__balance accounts__balance--totalBalance">{{ totalBalance | dollarAmount }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ListOfAccounts',
  props: {
    accounts: {
      required: true,
      type: Array
    }
  },
  computed: {
    totalBalance () {
      return this.accounts.reduce((balance, account) => balance + account.balance, 0)
    }
  },
  filters: {
    dollarAmount (amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)
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

.accounts__account--totalBalance {
  font-weight: bold;
}
</style>
