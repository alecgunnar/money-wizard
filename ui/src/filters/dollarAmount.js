const filter = (amount) => {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const plugin = {
  install (Vue) {
    Vue.filter('dollarAmount', filter)
  }
}

export default filter

export {
  plugin
}