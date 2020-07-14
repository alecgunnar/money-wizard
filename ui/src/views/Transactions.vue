<template>
  <div class="page">
    <div v-if="addingTransaction"
      class="modal">
      <div class="modal__window">
        <div class="addTransaction__header">
          <div class="addTransaction__title">
            <h2>Add a Transaction</h2>
          </div>
        </div>
        <NewTransactionForm @submitted="transactionAdded"
          @canceled="addingTransactionCanceled" />
      </div>
    </div>
    <div class="accountSnapshot">
      <div v-if="account"
        class="accountSnapshot__details">
        <div class="accountSnapshot__name"
          data-qa="account-name">
          {{ account.name }}
        </div>
        <div class="accountSnapshot__balance"
          data-qa="account-balance">
          {{ account.balance | dollarAmount }}
        </div>
      </div>
      <div class="accountSnapshot__options">
        <button data-qa="reconcile-account"
          style="visibility: hidden;"
          @click="reconcileAccount">Reconcile</button>
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
import AccountsClient from '@/clients/accounts'
import NewTransactionForm from '@/components/forms/NewTransactionForm'
import TransactionsList from '@/components/lists/TransactionsList'
import dollarAmount from '@/filters/dollarAmount'
import {mapActions, mapState} from 'vuex'

export default {
  name: 'transactions',
  data () {
    return {
      addingTransaction: false
    }
  },
  props: {
    id: {
      required: true,
      default: null
    }
  },
  computed: {
    ...mapState({
      account: state => state.transactions.account,
      transactions: state => state.transactions.transactions
    }),
    thereAreTransactions () {
      return Object.keys(this.transactions).length > 0
    },
    transactionGroups () {
      return Object.entries(this.transactions)
    }
  },
  mounted () {
    this.forAccount(this.id)
  },
  methods: {
    ...mapActions(['forAccount']),
    addTransaction () {
      this.addingTransaction = true
    },
    addingTransactionCanceled () {
      this.addingTransaction = false
    },
    transactionAdded () {
      this.addingTransaction = false
    },
    removeFromGroup (date, id) {
      this.transactions[date] = this.transactions[date].filter((transaction) => transaction.id !== id)
    },
    reconcileAccount () {
      this.$router.push({
        name: 'reconcile',
        params: {
          id: this.id
        }
      })
    }
  },
  filters: {
    dollarAmount
  },
  components: {
    NewTransactionForm,
    TransactionsList
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/modals.scss';

.page {
  position: relative;
}

.accountSnapshot {
  background-color: #f1f1f1;
  padding: 0.5em;
  border-radius: 3px;
  margin: 0 0 1em;
}

.accountSnapshot__details {
  margin: 0 0 1em;
}

.accountSnapshot__options {
  text-align: center;
}

.accountSnapshot__options button {
  margin: 0 1em 0 0;
}

.accountSnapshot__options button:last-of-type {
  margin: 0;
}

.accountSnapshot__name {
  font-size: 1.5em;
  font-weight: bold;
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

@media screen and (min-width: 480px) {
  .accountSnapshot {
    display: flex;
  }

  .accountSnapshot__details {
    flex: 1;
    margin: 0;
  }

  .accountSnapshot__options {
    text-align: unset;
  }
}
</style>
