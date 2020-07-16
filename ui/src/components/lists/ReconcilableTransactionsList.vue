<template>
  <div>
    <div class="header">
      Posted
    </div>
    <ul class="transactions">
      <li v-for="transaction in transactions"
        class="transactions__listItem"
        :key="transaction.id">
        <ReconcilableTransactionRow :transaction="transaction"
          class="transactions__transaction" />
      </li>
    </ul>
  </div>
</template>

<script>
import ReconcilableTransactionRow from '@/components/lists/ReconcilableTransactionRow'

export default {
  name: 'reconcilable-transactions-list',
  props: {
    transactions: {
      required: true
    }
  },
  components: {
    ReconcilableTransactionRow
  }
}
</script>

<style lang="scss" scoped>
.header {
  text-align: right;
  padding: 0 1em;
}

.transactions {
  list-style: none;
  padding: 0;
}

.transactions__transaction {
  border: 1px solid #efefef;
  border-bottom-width: 0;
}

.transactions__listItem:first-of-type .transactions__transaction {
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.transactions__listItem:last-of-type .transactions__transaction {
  border-bottom-width: 1px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}
</style>
