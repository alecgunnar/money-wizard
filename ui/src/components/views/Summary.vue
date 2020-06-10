<template>
  <div class="summary">
    <div class="summary__category">
      <h2 class="summary__headline summary__headline--wants">Wants</h2>
    </div>
    <div class="summary__category">
      <h2 class="summary__headline summary__headline--savings">Savings</h2>
    </div>
    <div class="summary__category">
      <h2 class="summary__headline summary__headline--needs">Needs</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'summary'
}
</script>

<style scoped>
.summary {
  display: flex;
}

.summary__category {
  flex: 1;
}

.summary__headline {
  color: #fff;
  padding: 0.5rem;
}

.summary__headline--needs {
  background-color: #F44336;
}

.summary__headline--wants {
  background-color: #4CAF50;
}

.summary__headline--savings {
  background-color: #FFC107;
}
</style>