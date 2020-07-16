<template>
  <div class="transaction" :class="{posted: transaction.posted}">
    <div class="transaction__data">
      <div data-qa="amount">{{ signedAmount | dollarAmount }}</div>
      <div data-qa="reason">{{ transaction.reason }}</div>
    </div>
    <div class="transaction__postedIndicator"
      data-qa="posted-indicator"
      @click="toggle">
      <div class="indicator"></div>
    </div>
  </div>
</template>

<script>
import dollarAmount from '@/filters/dollarAmount'
import {mapActions} from 'vuex'

export default {
  name: 'reconcilable-transaction-row',
  props: {
    transaction: {
      required: true
    }
  },
  computed: {
    signedAmount () {
      if (
        (this.transaction.account.type === 'credit' || this.transaction.account.type === 'loan') && this.transaction.type === 'credit'
        ||
        this.transaction.account.type === 'asset' && this.transaction.type === 'debit'
      ) return this.transaction.amount * -1

      return this.transaction.amount
    }
  },
  methods: {
    ...mapActions({
      togglePosted: 'reconcile/togglePosted'
    }),
    toggle () {
      this.togglePosted(this.transaction.id)
    }
  },
  filters: {
    dollarAmount
  }
}
</script>

<style lang="scss" scoped>
.transaction {
  padding: 1em;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.transaction__data {
  flex: 1;
}

.transaction__postedIndicator {
  border: 2px solid #efefef;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  box-sizing: border-box;
  padding: 2px;
  cursor: pointer;

  .indicator {
    width: 22px;
    height: 22px;
    border-radius: 11px;
  }
}

.posted .indicator {
  background-color: #4CAF50;
}
</style>
