<template>
  <div class="account">
    <div class="account__field account__field--name"
      data-qa="name">{{ account.name }}</div>
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

<style scoped>
.account {
  display: flex;
}

.account__field--name {
  margin: 0 1rem 0 0;
  color: #aaa;
  padding: 1rem 0;
  width: 20%;
}

.account__field--balance {
  text-align: right;
  background-color: #efefef;
  padding: 1rem;
  border-radius: 3px;
  flex: 1;
}
</style>