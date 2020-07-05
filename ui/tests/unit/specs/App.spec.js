import App from '@/App'
import ConfirmDialog from '@/components/dialogs/Confirm'
import store from '@/store'
import VueRouter from 'vue-router'
import {shallowMount, createLocalVue} from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(VueRouter)

const router = new VueRouter()

describe('App', () => {
  afterEach(() => {
    store.commit('clearServerError')
  })

  it('shows server errors', () => {
    store.commit('encounteredServerError', 'There was an error')
    const subject = shallowMount(App, {store, localVue, router})
    expect(subject.find('[data-qa=server-error-message]').exists()).toBeTruthy()
  })

  it('shows server error message', () => {
    store.commit('encounteredServerError', 'There was an error...')
    const subject = shallowMount(App, {store, localVue, router})
    expect(subject.find('[data-qa=server-error-message]').text()).toBe('There was an error...')
  })

  it('does not show a server error', () => {
    const subject = shallowMount(App, {store, localVue, router})
    expect(subject.find('[data-qa=server-error-message]').exists()).toBeFalsy()
  })

  it('there is a mobile nav trigger', () => {
    const subject = shallowMount(App, {store, localVue, router})
    expect(subject.find('[data-qa=mobile-nav-trigger]').exists()).toBeTruthy()
  })

  it('the mobile nav is not triggered', () => {
    const subject = shallowMount(App, {store, localVue, router})
    expect(subject.find('[data-qa=nav-menu]').classes('triggered')).toBeFalsy()
  })

  it('clicking the mobile nav trigger shows the mobile nav menu', async () => {
    const subject = shallowMount(App, {store, localVue, router})
    subject.find('[data-qa=mobile-nav-trigger]').trigger('click')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=nav-menu]').classes('triggered')).toBeTruthy()
  })

  it('clicking the mobile nav trigger again hides the mobile nav menu', async () => {
    const subject = shallowMount(App, {store, localVue, router})
    subject.find('[data-qa=mobile-nav-trigger]').trigger('click')
    await subject.vm.$nextTick()
    subject.find('[data-qa=mobile-nav-trigger]').trigger('click')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=nav-menu]').classes('triggered')).toBeFalsy()
  })

  it('when the page changes, the mobile menu disappears', async () => {
    const subject = shallowMount(App, {store, localVue, router})
    subject.find('[data-qa=mobile-nav-trigger]').trigger('click')
    await subject.vm.$nextTick()

    router.push('/some-other-page')
    await subject.vm.$nextTick()

    expect(subject.find('[data-qa=nav-menu]').classes('triggered')).toBeFalsy()
  })

  it('has a confirm dialog', () => {
    const subject = shallowMount(App, {store, localVue, router})
    expect(subject.findComponent(ConfirmDialog).exists()).toBeTruthy()
  })
})
