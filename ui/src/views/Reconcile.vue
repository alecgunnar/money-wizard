<template>
  <div>
    <div v-if="initialized"
      class="modal">
      <div class="modal__window">
        <h3>Enter an Expected Balance</h3>
        <ExpectedBalanceForm @canceled="formCanceled" />
      </div>
    </div>
  </div>
</template>

<script>
import ExpectedBalanceForm from '@/components/forms/ExpectedBalanceForm'
import {mapActions} from 'vuex'

export default {
  name: 'reconcile',
  data () {
    return {
      initialized: false
    }
  },
  props: {
    id: {
      required: true
    }
  },
  mounted () {
    this.reconcileAccount(this.id)
      .then(this.initializationComplete)
  },
  methods: {
    ...mapActions(['reconcileAccount']),
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
  components: {
    ExpectedBalanceForm
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/modals.scss';
</style>
