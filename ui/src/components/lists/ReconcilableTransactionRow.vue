<template>
  <div class="row"
    :class="{posted: transaction.posted}"
    @click="expand">
    <div class="transaction">
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
    <div v-if="expanded"
      data-qa="expanded-content"
      class="expandedContent">
      <div class="expandedContent__dataLabel">Date:</div>
      <div data-qa="date">{{ formattedDate }}</div>
      <div class="expandedContent__dataLabel">Additional Notes:</div>
      <div data-qa="notes">{{ transaction.notes }}</div>
    </div>
  </div>
</template>

<script>
import dollarAmount from '@/filters/dollarAmount'
import moment from 'moment'
import {mapActions} from 'vuex'

export default {
  name: 'reconcilable-transaction-row',
  data () {
    return {
      expanded: false
    }
  },
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
    },
    formattedDate () {
      return moment(this.transaction.date).format('MMMM D, YYYY')
    }
  },
  methods: {
    ...mapActions({
      togglePosted: 'reconcile/togglePosted'
    }),
    toggle (e) {
      e.stopPropagation()
      this.togglePosted(this.transaction.id)
    },
    expand () {
      this.expanded = !this.expanded
    }
  },
  filters: {
    dollarAmount
  }
}
</script>

<style lang="scss" scoped>
.row:hover {
  background-color: #f9f9f9;
  cursor: pointer;
}

.transaction {
  padding: 1em;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.transaction__data {
  flex: 1;
}

.expandedContent {
  padding: 0 1em 1em;
}

.expandedContent__dataLabel {
  font-weight: bold;
  margin: 1em 0 0;

  &:first-of-type {
    margin: 0;
  }
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
