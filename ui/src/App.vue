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
    background-color: #607D8B;
    color: #fff;
    font-size: 1.5rem;
    padding: 0.5rem 0;
  }

  .wrapper {
    width: 960px;
    margin: 0 auto;
  }
</style>
