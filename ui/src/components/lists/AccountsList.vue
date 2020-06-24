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
      <li class="accounts__balance">
        <div>Total Balance</div>
        <div data-qa="total-balance">{{ totalBalance | dollarAmount }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import AccountRow from './AccountRow'
import dollarAmount from '@/filters/dollarAmount'

export default {
  name: 'accounts-list',
  props: {
    accounts: {
      required: true
    }
  },
  computed: {
    totalBalance () {
      return this.accounts.reduce((acc, account) => {
        return acc + account.balance
      }, 0)
    }
  },
  filters: {
    dollarAmount
  },
  components: {
    AccountRow
  }
}
</script>

<style lang="scss" scoped>
.accounts {
  list-style: none;
  padding: 0;
  margin: 1em -1rem;
  border-bottom: 1px solid #efefef;
}

.accounts__balance {
  background-color: #f9f9f9;
  border-top: 1px solid #efefef;
  padding: 1em 1rem;
  display: flex;

  div:first-of-type {
    font-weight: bold;
    flex: 1;
  }
}

@media screen and (min-width: 980px) {
  .accounts {
    margin: 1em 0;
    border: 0;
  }

  .accounts__balance {
    background-color: transparent;
    border: none;
    padding-left: 0;
  }
}
</style>
