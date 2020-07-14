<template>
  <div>
    <h1>Reconcile Account</h1>
    <div class="modal">
      <div class="modal__window">
        <h3>Enter an Expected Balance</h3>
        <ExpectedBalanceForm @canceled="formCanceled" />
      </div>
    </div>
  </div>
</template>

<script>
import ExpectedBalanceForm from '@/components/forms/ExpectedBalanceForm'

export default {
  name: 'reconcile',
  props: {
    id: {
      required: true,
      type: Number
    }
  },
  methods: {
    formCanceled () {
      this.$router.push({
        name: 'account',
        params: {
          id: this.id
        }
      })
    }
  },
  components: {
    ExpectedBalanceForm
  }
}
</script>

<style scoped>
.modal__window {
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  padding: 1em;
}

h3 {
  margin: 0 0 1em;
}

@media screen and (min-width: 480px) {
  .modal {
    background-color: rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
  }

  .modal__window {
    position: static;
    border-radius: 3px;
  }
}
</style>
