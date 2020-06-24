<template>
  <div>
    <h2 data-qa="date-of-transactions">{{ formattedDate }}</h2>
    <ul class="transactions">
      <li v-for="transaction in transactions"
        class="transaction__listItem"
        :key="transaction.id">
          <TransactionRow :transaction="transaction"
            class="transactions__transaction" />
        </li>
    </ul>
  </div>
</template>

<script>
import TransactionRow from './TransactionRow'
import moment from 'moment'

export default {
  name: 'transactions-list',
  props: {
    date: {
      required: true
    },
    transactions: {
      required: true
    }
  },
  computed: {
    formattedDate () {
      return moment(this.date).format('MMMM D, YYYY')
    }
  },
  components: {
    TransactionRow
  }
}
</script>

<style scoped>
.transactions {
  list-style: none;
  padding: 0;
}

.transactions__transaction {
  border: 1px solid #efefef;
  border-bottom-width: 0;
}

.transaction__listItem:first-of-type .transactions__transaction {
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.transaction__listItem:last-of-type .transactions__transaction {
  border-bottom-width: 1px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}
</style>
