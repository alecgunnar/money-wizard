<template>
  <div id="app">
    <div v-if="serverError"
      class="serverError"
      data-qa="server-error-message">
      <p class="serverError__message">{{ serverError }}</p>
    </div>
    <header class="header">
      <div class="wrapper header__wrapper">
        <div class="branding">
          Money Wizard
        </div>
        <nav class="navigation">
          <ul class="navigations__links">
            <li class="navigation__link"><RouterLink :to="{name: 'accounts'}">Accounts</RouterLink></li>
            <li class="navigation__link"><RouterLink :to="{name: 'transactions'}">Transactions</RouterLink></li>
          </ul>
        </nav>
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
  .wrapper {
    width: 960px;
    margin: 0 auto;
    padding: 0 1rem;
    box-sizing: border-box;
  }

  .serverError__message {
    background-color: #EF5350;
    color: #fff;
    font-size: 1.5rem;
    padding: 0.5rem;
    text-align: center;
    margin: 0;
  }

  .header {
    background-color: #4CAF50;
    margin: 0 0 2rem;
  }

  .header__wrapper {
    display: flex;
    align-items: center;
  }

  .branding {
    color: #fff;
    font-size: 3rem;
    line-height: 5rem;
    margin: 0 2rem 0 0;
  }

  .navigation {
    flex: 1;
  }

  .navigations__links {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .navigation__link {
    display: inline;
  }

  .navigation__link a {
    color: #fff;
    text-decoration: none;
    padding: 0 0.5rem;
  }

  .navigation__link a.router-link-active {
    text-decoration: underline;
  }
</style>
