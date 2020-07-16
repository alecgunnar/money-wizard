<template>
  <div>
    <div v-for="transaction in transactions"
      :key="transaction.id">
      <ReconcilableTransactionRow :transaction="transaction" />
    </div>
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
