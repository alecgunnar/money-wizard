<template>
  <div class="serverError">
    <h1>Server Error</h1>
    <p>There was an error that prevented the page from loading. You can refresh the page to try again.</p>
    <p>Alternatively, you can return to your <a href="/">list of accounts</a>.</p>
  </div>
</template>

<script>
export default {
  name: 'server-error'
}
</script>

<style lang="scss" scoped>
.serverError {
  background-color: #fff;
  text-align: justify;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1em;
}
</style>
