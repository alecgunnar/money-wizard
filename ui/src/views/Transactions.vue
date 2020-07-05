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

    <div v-if="thereAreTransactions"
      class="transactions"
      data-qa="lists-of-transactions">
      <div v-for="group in transactionGroups"
        :key="group[0]">
        <TransactionsList :date="group[0]"
          @remove="(id) => removeFromGroup(group[0], id)"
          :transactions="group[1]" />
      </div>
    </div>
    <p v-else
      data-qa="no-transactions-msg">There are no transactions to display.</p>
  </div>
</template>

<script>
import TransactionsClient from '@/clients/transactions'
import NewTransactionForm from '@/components/forms/NewTransactionForm'
import TransactionsList from '@/components/lists/TransactionsList'

export default {
  name: 'transactions',
  data () {
    return {
      transactions: {},
      addingTransaction: false
    }
  },
  props: {
    id: {
      required: false,
      default: null
    }
  },
  computed: {
    thereAreTransactions () {
      return Object.keys(this.transactions).length > 0
    },
    transactionGroups () {
      return Object.entries(this.transactions)
    }
  },
  mounted () {
    this.loadTransactions()
  },
  methods: {
    loadTransactions () {
      TransactionsClient.getTransactions(this.id)
      .then(this.transactionsLoaded)
    },
    transactionsLoaded (transactions) {
      this.transactions = transactions
    },
    addTransaction () {
      this.addingTransaction = true
    },
    addingTransactionCanceled () {
      this.addingTransaction = false
    },
    transactionAdded () {
      this.addingTransaction = false
      this.loadTransactions()
    },
    removeFromGroup (date, id) {
      this.transactions[date] = this.transactions[date].filter((transaction) => transaction.id !== id)
    }
  },
  components: {
    NewTransactionForm,
    TransactionsList
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
</style>
