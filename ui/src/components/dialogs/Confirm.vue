<template>
  <div>
    <div v-if="onceConfirmed"
      class="dialogShadow">
      <div class="dialog"
        data-qa="dialog">
        <h3>Please confirm</h3>
        <p>Are you sure you would like to continue?</p>
        <div class="dialog__buttons">
          <button data-qa="confirm"
            type="button"
            class="primary"
            @click="confirm">Yes, continue</button>
          <button data-qa="cancel"
            type="button"
            @click="cancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DialogsUtil from '@/utils/dialogs'

export default {
  name: 'confirm',
  data () {
    return {
      onceConfirmed: null
    }
  },
  mounted () {
    DialogsUtil.onConfirm(this.toConfirm)
  },
  methods: {
    toConfirm (callback) {
      this.onceConfirmed = callback
    },
    confirm () {
      this.onceConfirmed()
      this.onceConfirmed = null
    },
    cancel () {
      this.onceConfirmed = null
    }
  }
}
</script>

<style scoped>
.dialog {
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  padding: 1em;
}

.dialog__buttons {
  text-align: center;
}

.dialog__buttons button {
  margin: 0 1em 0 0;
}

.dialog__buttons button:last-of-type {
  margin: 0;
}

h3, p {
  margin: 0 0 1em;
}

@media screen and (min-width: 480px) {
  .dialogShadow {
    background-color: rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
  }

  .dialog {
    position: static;
    border-radius: 3px;
  }

  p {
    margin: 0 0 2em;
  }
}
</style>
