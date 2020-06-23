<template>
  <div class="page">
    <div v-if="addingTransaction"
      class="addTransaction">
      <div class="addTransaction__header">
        <div class="addTransaction__title">
          <h2>Add a Transaction</h2>
        </div>
      </div>
      <NewTransactionForm @submitted="transactionAdded"
        @cancel="addingTransactionCanceled"
        :preselect="this.id" />
    </div>
    <div class="header">
      <h1 class="header__title">Transactions</h1>
      <div class="header__buttons">
        <button data-qa="new-transaction"
          class="button"
          @click="addTransaction">Add Transaction</button>
      </div>
    </div>

    <ol v-if="transactions.transactions.length"
      class="transactions"
      data-qa="transactions-list">
      <li v-for="transaction in transactions.transactions"
        :key="transaction.id">
          <TransactionRow :transaction="transaction" />
        </li>
    </ol>
    <p v-else
      data-qa="no-transactions-msg">There are no transactions to display.</p>
  </div>
</template>

<script>
import NewTransactionForm from '@/components/forms/NewTransactionForm'
import TransactionRow from '@/components/lists/TransactionRow'
import {mapState, mapActions} from 'vuex'

export default {
  name: 'transactions',
  data () {
    return {
      addingTransaction: false
    }
  },
  props: {
    id: {
      required: false,
      default: null
    }
  },
  computed: mapState(['transactions']),
  mounted () {
    this.loadTransactions()
  },
  methods: {
    ...mapActions(['loadTransactions']),
    addTransaction () {
      this.addingTransaction = true
    },
    addingTransactionCanceled () {
      this.addingTransaction = false
    },
    transactionAdded () {
      this.addingTransaction = false
      this.loadTransactions()
    }
  },
  components: {
    NewTransactionForm,
    TransactionRow
  }
}
</script>

<style scoped>
.page {
  position: relative;
}

.header {
  display: flex;
  margin: 0 0 2rem;
}

.header__title,
.header__buttons {
  line-height: 3rem;
  flex: 1;
}

.header__title {
  margin: 0;
}

.header__buttons {
  text-align: right;
}

.button {
  background: #4CAF50;
  color: #fff;
}

.transactions {
  list-style: none;
  padding: 0;
  margin: 0 -1rem;
  border-bottom: 1px solid #efefef;
}

.addTransaction {
  background-color: #fff;
  position: absolute;
  top: -1rem;
  left: -1rem;
  bottom: -1rem;
  right: -1rem;
  padding: 1em;
  box-sizing: border-box;
}

.addTransaction__header {
  display: flex;
  align-items: center;
  margin: 0 0 1em;
}

.addTransaction__title {
  flex: 1;
}

@media screen and (min-width: 980px) {
  .transactions {
    margin: 1em 0;
    border: 0;
  }
}
</style>
