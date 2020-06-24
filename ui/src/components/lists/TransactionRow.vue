<template>
  <div class="transaction"
    @click="toggleExpandedContent">
    <div class="transaction__permanentContent">
      <div class="transaction__field transaction__field--reason"
        data-qa="reason">{{ transaction.reason }}</div>
      <div class="transaction__field transaction__field--amount"
        data-qa="amount">{{ transaction.amount | dollarAmount }}</div>
    </div>
    <div v-if="expanded"
      class="transaction__expandedContent"
      data-qa="expanded-content">
      <div style="font-weight: bold;">Notes:</div>
      <div data-qa="notes">
        {{ transaction.notes || '–' }}
      </div>
    </div>
  </div>
</template>

<script>
import dollarAmount from '@/filters/dollarAmount'

export default {
  name: 'transaction-row',
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
  methods: {
    toggleExpandedContent () {
      this.expanded = !this.expanded
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

  &:hover {
    background-color: #f9f9f9;
    cursor: pointer;
  }
}

.transaction__permanentContent {
  display: flex;
}

.transaction__expandedContent {
  margin: 1em 0 0;
}

.transaction__field--reason,
.transaction__field--amount {
  flex: 1;
}

.transaction__field--amount {
  text-align: right;
}
</style>
