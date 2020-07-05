let listener;

export default {
  confirm (callback) {
    listener(callback)
  },
  onConfirm (callable) {
    listener = callable
  }
}