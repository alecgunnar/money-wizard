<template>
  <div>
    <div data-qa="name">{{ account.name }}</div>
    <div data-qa="balance">{{ balance }}</div>
  </div>
</template>

<script>
export default {
  name: 'account-row',
  props: {
    account: {
      required: true
    }
  },
  computed: {
    balance () {
      return Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(this.account.balance)
    }
  }
}
</script>