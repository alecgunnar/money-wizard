<template>
  <div class="account">
    <div class="account__field account__field--name"
      data-qa="name">{{ account.name }}</div>
    <div class="account__field account__field--balance"
      data-qa="balance">{{ account.balance | dollarAmount }}</div>
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

<style lang="scss" scoped>
.account {
  display: flex;
  border-top: 1px solid #efefef;
  padding: 1em;
  box-sizing: border-box;
}

.account__field--name {
  flex: 1;
}

.account__field--balance {
  text-align: right;
  flex: 1;
}

@media screen and (min-width: 980px) {
  .account {
    padding: 0;
    border: 0;
    margin: 0 0 1em;
  }

  .account__field--name {
    padding: 1em 0;
  }

  .account__field--balance {
    background-color: #efefef;
    padding: 1em;
    border-radius: 3px;
    flex: 2;
  }
}
</style>