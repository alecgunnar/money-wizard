<template>
  <div id="app">
    <header>
      <div class="wrapper">
        Money Wizard
      </div>
    </header>
    <router-view/>
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
</style>
