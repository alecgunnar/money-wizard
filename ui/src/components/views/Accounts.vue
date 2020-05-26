<template>
  <div>
    <h1>Accounts</h1>
    <ListOfAccounts :accounts="accounts" />
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import ListOfAccounts from '../lists/ListOfAccounts'

export default {
  name: 'Accounts',
  computed: mapState(['accounts']),
  mounted () {
    this.loadAccounts()
  },
  methods: mapActions(['loadAccounts']),
  components: { ListOfAccounts }
}
</script>
