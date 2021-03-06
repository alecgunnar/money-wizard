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
      <div class="header">
        <div class="header__title">
          <h1>Reconciling an Account</h1>
          <div>Account: <span data-qa="account-name">{{ account.name }}</span></div>
        </div>
        <div class="header__submit">
          <button v-if="balanceDifference === 0"
            @click="submit"
            data-qa="submit-reconciliation">Complete</button>
        </div>
      </div>
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
    <div v-if="!!account && account.reconciledBalance !== 0"
      class="carryoverBalance">
      <div class="carryoverBalance__label">Carryover Balance</div>
      <div class="carryoverBalance__amount">{{ account.reconciledBalance | dollarAmount }}</div>
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
      return this.reconciledBalance.toFixed(2) - this.expectedBalance.toFixed(2)
    }
  },
  mounted () {
    this.reconcileAccount(this.id)
      .then(this.initializationComplete)

    window.addEventListener('scroll', this.checkScroll)
  },
  methods: {
    ...mapActions({
      reconcileAccount: 'reconcile/reconcileAccount',
      completeReconciliation: 'reconcile/completeReconciliation'
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
    },
    submit () {
      this.completeReconciliation()
        .then(this.submitComplete)
        .catch(() => {})
    },
    submitComplete () {
      this.$router.push({
        name: 'account',
        params: {
          id: this.id
        }
      })
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

.header,
.header__title,
.summary {
  margin: 0 0 1em;
}

.header__submit button {
  background-color: #4CAF50;
  color: #fff;
}

.summary,
.carryoverBalance {
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

.carryoverBalance {
  margin: 0 0 1em;
  display: flex;
}

.carryoverBalance__label {
  font-weight: bold;
  flex: 1;
}

@media screen and (min-width: 480px) {
  .header {
    display: flex;
  }

  .header__title {
    margin: 0;
    flex: 1;
  }

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
