<template>
  <div class="transaction">
    <div class="transaction__field transaction__field--date"
      data-qa="date">{{ date }}</div>
    <div class="transaction__field transaction__field--reason"
      data-qa="reason">{{ transaction.reason }}</div>
    <div class="transaction__field transaction__field--amount"
      data-qa="amount">{{ amount }}</div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'transaction-row',
  props: {
    transaction: {
      required: true
    }
  },
  computed: {
    date () {
      return moment(this.transaction.date).format('MMM D, YYYY')
    },
    amount () {
      return Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(this.transaction.amount)
    }
  }
}
</script>

<style scoped>
.transaction {
  display: flex;
}

.transaction__field--date {
  margin: 0 1rem 0 0;
  color: #aaa;
  padding: 1rem 0;
}

.transaction__field--reason,
.transaction__field--amount {
  background-color: #efefef;
  padding: 1rem;
  box-sizing: border-box;
}

.transaction__field--reason {
  flex: 1;
  padding-right: 0;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}

.transaction__field--amount {
  text-align: right;
  width: 10%;
  padding-left: 0;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
</style>
