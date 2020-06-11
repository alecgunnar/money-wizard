<template>
  <div id="app">
    <div v-if="serverError"
      class="serverError"
      data-qa="server-error-message">
      <p class="serverError__message">{{ serverError }}</p>
    </div>
    <header>
      <div class="wrapper">
        Money Wizard
      </div>
    </header>
    <div class="wrapper">
      <router-view/>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'App',
  computed: mapState(['serverError'])
}
</script>

<style scoped>
  header {
    background-color: #4CAF50;
    color: #fff;
    font-size: 3rem;
    padding: 0.5rem 0;
    margin: 0 0 2rem;
  }

  .wrapper {
    width: 960px;
    margin: 0 auto;
  }

  .serverError__message {
    background-color: #EF5350;
    color: #fff;
    font-size: 1.5rem;
    padding: 0.5rem;
    text-align: center;
    margin: 0;
  }
</style>
