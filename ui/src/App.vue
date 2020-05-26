<template>
  <div id="app">
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
export default {
  name: 'App'
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
</style>
