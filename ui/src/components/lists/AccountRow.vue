<template>
  <div class="account">
    <div class="account__field account__field--name"
      data-qa="name">{{ account.name }}</div>
    <div class="account__field account__field--options">
      <RouterLink :to="{name: 'account-transactions', params: {id: account.id}}"
        data-qa="account-transactions-link">See Transactions</RouterLink>
    </div>
    <div class="account__field account__field--balance"
      data-qa="balance">{{ account.balance | dollarAmount }}</div>
  </div>
</template>

<script>
import dollarAmount from '@/filters/dollarAmount'

export default {
  name: 'account-row',
  props: {
    account: {
      required: true
    }
  },
  filters: {
    dollarAmount
  }
}
</script>

<style lang="scss" scoped>
.account {
  display: flex;
}

.account__field--name {
  margin: 0 1rem 0 0;
  color: #aaa;
  padding: 1rem 0;
  width: 20%;
}

.account__field--options,
.account__field--balance {
  background-color: #efefef;
}

.account__field--options {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;

  a {
    color: #999;
    text-decoration: none;
    padding: 1rem;
    display: inline-block;

    &:hover {
      background-color: #eaeaea;
    }

    &:first-of-type {
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }
  }
}

.account__field--balance {
  text-align: right;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  padding: 1rem;
  flex: 1;
}
</style>