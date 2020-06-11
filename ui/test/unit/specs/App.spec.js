import App from '@/App'
import store from '@/store'
import router from 'vue-router'
import {shallowMount, createLocalVue} from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(router)

describe('App', () => {
  afterEach(() => {
    store.commit('clearServerError')
  })

  it('shows server errors', () => {
    store.commit('encounteredServerError', 'There was an error')
    const subject = shallowMount(App, {store, localVue})
    expect(subject.find('[data-qa=server-error-message]').exists()).toBeTruthy()
  })

  it('shows server error message', () => {
    store.commit('encounteredServerError', 'There was an error...')
    const subject = shallowMount(App, {store, localVue})
    expect(subject.find('[data-qa=server-error-message]').text()).toBe('There was an error...')
  })

  it('does not show a server error', () => {
    const subject = shallowMount(App, {store, localVue})
    expect(subject.find('[data-qa=server-error-message]').exists()).toBeFalsy()
  })
})
