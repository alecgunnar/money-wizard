<template>
  <div>
    <div data-qa="name">{{ account.name }}</div>
    <div data-qa="balance">{{ account.balance | dollarAmount }}</div>
  </div>
</template>

<script>
import dollarAmount from '@/filters/dollarAmount'

export default {
  name: 'account-row',
  props: {
    account: {
      required: true
    }
  },
  filters: {
    dollarAmount
  }
}
</script>