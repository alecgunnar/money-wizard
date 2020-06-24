<template>
  <div class="transaction">
    <div class="transaction__field transaction__field--reason"
      data-qa="reason">{{ transaction.reason }}</div>
    <div class="transaction__field transaction__field--amount"
      data-qa="amount">{{ transaction.amount | dollarAmount }}</div>
  </div>
</template>

<script>
import dollarAmount from '@/filters/dollarAmount'

export default {
  name: 'transaction-row',
  props: {
    transaction: {
      required: true
    }
  },
  filters: {
    dollarAmount
  }
}
</script>

<style scoped>
.transaction {
  display: flex;
  padding: 1em;
  box-sizing: border-box;
}

.transaction__field--reason,
.transaction__field--amount {
  flex: 1;
}

.transaction__field--amount {
  text-align: right;
}
</style>
