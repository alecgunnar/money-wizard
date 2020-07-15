<template>
  <div>
    <div v-if="initialized && expectedBalance === null"
      class="modal">
      <div class="modal__window">
        <h3>Enter an Expected Balance</h3>
        <ExpectedBalanceForm @submitted="balanceExpected"
          @canceled="formCanceled" />
      </div>
    </div>
    <div v-if="account !== null"
      class="summary">
      <h1>Reconciling <span data-qa="account-name">{{ account.name }}</span></h1>
      <span v-if="expectedBalance !== null">The expected balance is <span style="font-weight: bold;"
        data-qa="expected-balance">{{ expectedBalance | dollarAmount }}</span>.</span>
    </div>
  </div>
</template>

<script>
import ExpectedBalanceForm from '@/components/forms/ExpectedBalanceForm'
import dollarAmount from '@/filters/dollarAmount'
import {mapActions, mapState} from 'vuex'

export default {
  name: 'reconcile',
  data () {
    return {
      initialized: false,
      expectedBalance: null
    }
  },
  props: {
    id: {
      required: true
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.reconcile.account
    })
  },
  mounted () {
    this.reconcileAccount(this.id)
      .then(this.initializationComplete)
  },
  methods: {
    ...mapActions({
      reconcileAccount: 'reconcile/reconcileAccount'
    }),
    balanceExpected (balance) {
      this.expectedBalance = balance
    },
    formCanceled () {
      this.$router.push({
        name: 'account',
        params: {
          id: this.id
        }
      })
    },
    initializationComplete () {
      this.initialized = true
    }
  },
  filters: {
    dollarAmount
  },
  components: {
    ExpectedBalanceForm
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/modals.scss';
</style>
