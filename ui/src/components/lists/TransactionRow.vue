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
  border-top: 1px solid #efefef;
  padding: 1em 1rem;
  box-sizing: border-box;
}

.transaction__field--reason {
  flex: 1;
}

.transaction__field--amount {
  text-align: right;
  flex: 1;
}

@media screen and (min-width: 980px) {
  .transaction {
    padding: 0;
    border: 0;
    margin: 0 0 1em;
  }

  .transaction__field--reason {
    padding: 1em 0;
  }

  .transaction__field--amount {
    background-color: #efefef;
    padding: 1em;
    border-radius: 3px;
    flex: 2;
  }
}
</style>
