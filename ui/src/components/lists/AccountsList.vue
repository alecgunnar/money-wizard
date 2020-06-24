<template>
  <div>
    <h2>
      <slot></slot>
    </h2>
    <ul class="accounts">
      <li v-for="account in accounts"
        class="accounts__listItem"
        :key="account.id">
        <AccountRow class="accounts__account"
          :account="account" />
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
}

.accounts__account,
.accounts__balance {
  border: 1px solid #efefef;
  border-bottom-width: 0;
}

.accounts__listItem:first-of-type .accounts__account {
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.accounts__balance {
  background-color: #f9f9f9;
  padding: 1em;
  display: flex;
  border-bottom-width: 1px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;

  div:first-of-type {
    font-weight: bold;
    flex: 1;
  }
}
</style>
