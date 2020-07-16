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
    <div v-if="account !== null">
      <h1>Reconciling an Account</h1>
      <div>Account: <span data-qa="account-name">{{ account.name }}</span></div>
      <div class="anchor"
        :class="{fill: stickSummary}"
        ref="anchor">&nbsp;</div>
      <ul class="summary"
        :class="{stuck: stickSummary}">
        <li class="summary__item">
          <div class="summary__label">Reconciled Balance</div>
          <div class=""
            data-qa="reconciled-balance">{{ reconciledBalance | dollarAmount }}</div>
        </li>
        <li class="summary__item">
          <div class="summary__label">Expected Balance</div>
          <div class="summary__amount"
            data-qa="expected-balance">{{ (expectedBalance || 0) | dollarAmount }}</div>
        </li>
        <li class="summary__item">
          <div class="summary__label">Difference</div>
          <div class=""
            data-qa="balance-difference">{{ balanceDifference | dollarAmount }}</div>
        </li>
      </ul>
    </div>
    <ReconcilableTransactionsList :transactions="transactions" />
  </div>
</template>

<script>
import ExpectedBalanceForm from '@/components/forms/ExpectedBalanceForm'
import ReconcilableTransactionsList from '@/components/lists/ReconcilableTransactionsList'
import dollarAmount from '@/filters/dollarAmount'
import {mapActions, mapState, mapGetters} from 'vuex'

export default {
  name: 'reconcile',
  data () {
    return {
      initialized: false,
      expectedBalance: null,
      stickSummary: false
    }
  },
  props: {
    id: {
      required: true
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.reconcile.account,
      transactions: (state) => state.reconcile.transactions
    }),
    ...mapGetters({
      reconciledBalance: 'reconcile/reconciledBalance'
    }),
    balanceDifference () {
      if (!this.expectedBalance) return 0
      return this.reconciledBalance - this.expectedBalance
    }
  },
  mounted () {
    this.reconcileAccount(this.id)
      .then(this.initializationComplete)

    window.addEventListener('scroll', this.checkScroll)
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
    },
    checkScroll () {
      const {anchor} = this.$refs
      if (!anchor) return
      const {y} = anchor.getBoundingClientRect()
      this.stickSummary = y <= 0
    }
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.checkScroll)
  },
  filters: {
    dollarAmount
  },
  components: {
    ExpectedBalanceForm,
    ReconcilableTransactionsList
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/modals.scss';

h1 {
  margin: 0;
}

.summary {
  border: 1px solid #efefef;
  padding: 1em;
  list-style: none;
  border-radius: 3px;
}

.summary__item {
  display: flex;
}

.summary__label {
  font-weight: bold;
  flex: 1;
}

@media screen and (min-width: 480px) {
  .summary {
    display: flex;
    padding: 0;
    margin: 1em 0;

    &.stuck {
      background-color: #fff;
      margin: 0;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      border-top: 0;
      border-left: 0;
      border-right: 0;
      border-radius: 0;
      box-shadow: 10px 10px 10px #efefef;
    }
  }

  .anchor {
    padding: 0;

    &.fill {
      padding: 1em;
      margin: 0 0 3em;
    }
  }

  .summary__item {
    flex: 1;
    border-right: 1px solid #efefef;
    padding: 1em;
    box-sizing: border-box;

    &:last-of-type {
      border: 0;
    }
  }
}
</style>
