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
        <nav class="navigation"
          :class="{triggered: mobileNavTriggered}"
          data-qa="nav-menu">
          <div class="navigation__trigger"
            data-qa="mobile-nav-trigger"
            @click="toggleMobileNav"></div>
          <ul class="navigation__links">
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
  data () {
    return {
      mobileNavTriggered: false
    }
  },
  computed: mapState(['serverError']),
  mounted () {
    this.$router.beforeEach(this.disableMobileNav)
  },
  methods: {
    toggleMobileNav () {
      this.mobileNavTriggered = !this.mobileNavTriggered
    },
    disableMobileNav (to, from, next) {
      this.mobileNavTriggered = false
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
  .wrapper {
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
    margin: 0 0 1rem;
  }

  .header__wrapper {
    display: flex;
    align-items: center;
    padding: 0 1em;
  }

  .branding {
    color: #fff;
    font-size: 1.5em;
    line-height: 2em;
  }

  .navigation {
    flex: 1;
    position: relative;
    height: 1.5em;

    &.triggered {
      .navigation__trigger {
        z-index: 1001;
        &::before,
        &::after {
          background-color: #4CAF50;
        }


        &::before {
          transform: rotate(45deg);
          transform-origin: left;
          top: 0.25em;
          left: 0.25em;
        }

        &::after {
          transform: rotate(-45deg);
          transform-origin: left;
          bottom: 0.25em;
          left: 0.25em;
        }
      }

      .navigation__links {
        background-color: #fff;
        display: block;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        padding: 2em 0 0 1em;
      }

      .navigation__link {
        margin: 0 0 0.5em;
      }

      a {
        color: #4CAF50;
        font-size: 2em;

        &.router-link-exact-active {
          text-decoration: none;
        }
      }
    }
  }

  .navigation__trigger {
    position: absolute;
    width: 1.5em;
    height: 1.5em;
    right: 0;
    top: 0;
    bottom: 0;

    &::before,
    &::after {
      background-color: #fff;
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      content: " ";
      transition: 0.5s;
    }

    &::before {
      top: 0.4em;
    }

    &::after {
      bottom: 0.4em;
    }
  }

  .navigation__links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: none;
  }

  .navigation__link a {
    color: #fff;
    text-decoration: none;
    padding: 0 0.5rem;
  }

  .navigation__link a.router-link-active {
    text-decoration: underline;
  }

  @media screen and (min-width: 480px) {
    .branding {
      margin: 0 2rem 0 0;
    }

    .navigation.triggered {
      .navigation__links {
        background-color: transparent;
        display: block;
        position: static;
        padding: 0;
      }

      .navigation__link {
        margin: 0;
      }

      a {
        color: #fff;
        font-size: 1em;

        &.router-link-exact-active {
          text-decoration: underline;
        }
      }
    }

    .navigation__trigger {
      display: none;
    }

    .navigation__links {
      display: block;
    }

    .navigation__link {
      display: inline;
    }
  }

  @media screen and (min-width: 980px) {
    .wrapper {
      width: 960px;
      margin: 0 auto;
      padding: 0;
    }

    .header__wrapper {
      padding: 0;
    }
  }
</style>
