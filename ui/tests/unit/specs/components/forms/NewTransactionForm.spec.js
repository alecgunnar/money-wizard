import NewTransactionForm from '@/components/forms/NewTransactionForm'
import AccountsClient from '@/clients/accounts'
import moment from 'moment'
import {shallowMount} from '@vue/test-utils'

jest.mock('@/clients/accounts')

describe('NewTransactionForm', () => {
  beforeEach(() => {
    AccountsClient.getAccounts.mockResolvedValueOnce([
      {
        id: 123,
        name: 'Sample'
      },
      {
        id: 456,
        name: 'Other'
      }
    ])
  })

  it('has a field to select an account', () => {
    const subject = shallowMount(NewTransactionForm)
    expect(subject.find('select[data-qa=choose-account]').exists()).toBeTruthy()
  })

  it('loads accounts', () => {
    shallowMount(NewTransactionForm)
    expect(AccountsClient.getAccounts).toBeCalled()
  })

  it('provides an option for each account', async () => {
    const subject = shallowMount(NewTransactionForm)
    await subject.vm.$nextTick()
    const options = subject.findAll('[data-qa=choose-account] option')
    expect(options.length).toBe(3)
  })

  it('fills each account option with the name of the account', async () => {
    const subject = shallowMount(NewTransactionForm)
    await subject.vm.$nextTick()
    const options = subject.findAll('[data-qa=choose-account] option')
    expect(options.at(1).text()).toBe('Sample')
    expect(options.at(2).text()).toBe('Other')
  })

  it('has a field to enter an amount', () => {
    const subject = shallowMount(NewTransactionForm)
    expect(subject.find('input[data-qa=amount]').exists()).toBeTruthy()
  })

  it('has a field to enter the date of the transaction', () => {
    const subject = shallowMount(NewTransactionForm)
    expect(subject.find('input[data-qa=date]').exists()).toBeTruthy()
  })

  it.skip('the date field is pre-filled with the current date', () => {
    const todaysDate = moment().format('MM/DD/YYYY')
    const subject = shallowMount(NewTransactionForm)
    expect(subject.find('[data-qa=date]').element.value).toBe(todaysDate)
  })

  it('there is a cancel button', () => {
    const subject = shallowMount(NewTransactionForm)
    expect(subject.find('button[type=button][data-qa=cancel]').exists()).toBeTruthy()
  })

  it('clicking the cancel button causes event to be emitted', () => {
    const subject = shallowMount(NewTransactionForm)
    subject.find('[data-qa=cancel]').trigger('click')
    expect(subject.emitted('cancel')).not.toBeUndefined()
  })
})
