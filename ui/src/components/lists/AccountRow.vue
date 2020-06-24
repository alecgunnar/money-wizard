<template>
  <div class="account"
    :data-accountId="account.id">
    <div class="account__field account__field--name"
      data-qa="name">
        <RouterLink :to="{name: 'account-transactions', params: {id: account.id}}">{{ account.name }}</RouterLink>
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
  align-items: center;
  padding: 1em;
  box-sizing: border-box;
}

.account__field--name {
  flex: 1;
}

.account__field--balance {
  text-align: right;
  flex: 1;
}

@media screen and (min-width: 980px) {
  .account__field--balance {
    flex: 2;
  }
}
</style>