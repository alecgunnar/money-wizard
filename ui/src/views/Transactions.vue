<template>
  <div>
    <div class="header">
      <h1 class="header__title">Transactions</h1>
      <div class="header__buttons">
        <button data-qa="new-transaction"
          class="button"
          @click="addTransaction">Add Transaction</button>
      </div>
    </div>
    <div v-if="addingTransaction">
      <NewTransactionForm />
    </div>
  </div>
</template>

<script>
import NewTransactionForm from '@/components/forms/NewTransactionForm'

export default {
  name: 'transactions',
  data () {
    return {
      addingTransaction: false
    }
  },
  methods: {
    addTransaction () {
      this.addingTransaction = true
    }
  },
  components: {
    NewTransactionForm
  }
}
</script>

<style scoped>
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
  font-size: 1.5rem;
  color: #fff;
  border: none;
  outline: none;
  padding: 0.5rem 1rem;
  border-radius: 3px;
  cursor: pointer;
}
</style>
