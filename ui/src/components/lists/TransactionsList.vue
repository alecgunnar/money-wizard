<template>
  <div>
    <h2 data-qa="date-of-transactions">{{ formattedDate }}</h2>
    <ul class="transactions">
      <li v-for="transaction in transactions"
        :key="transaction.id">
          <TransactionRow :transaction="transaction" />
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
  margin: 1em -1rem;
  border-bottom: 1px solid #efefef;
}

@media screen and (min-width: 980px) {
  .transactions {
    margin: 1em 0;
    border: 0;
  }
}
</style>
