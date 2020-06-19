import NewTransactionForm from '@/components/forms/NewTransactionForm'
import AccountsClient from '@/clients/accounts'
import TransactionsClient from '@/clients/transactions'
import moment from 'moment'
import {shallowMount} from '@vue/test-utils'

jest.mock('@/clients/accounts')
jest.mock('@/clients/transactions')

describe('NewTransactionForm', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    AccountsClient.getAccounts.mockResolvedValueOnce([
      {
        id: 123,
        name: 'Sample',
        type: 'asset'
      },
      {
        id: 456,
        name: 'Other',
        type: 'credit'
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

  it('preselects the propped account', async () => {
    const subject = shallowMount(NewTransactionForm, {
      propsData: {
        preselect: 456
      }
    })
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=choose-account]').element.value).toBe('456')
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

  it('has a field to enter notes', () => {
    const subject = shallowMount(NewTransactionForm)
    expect(subject.find('textarea[data-qa=notes]').exists()).toBeTruthy()
  })

  it('there is a submit button', () => {
    const subject = shallowMount(NewTransactionForm)
    expect(subject.find('button[type=submit][data-qa=submit]').exists()).toBeTruthy()
  })

  it('when an asset type account is selected, the asset transaction type fields are shown', async () => {
    const subject = shallowMount(NewTransactionForm)
    await subject.vm.$nextTick()
    subject.find('[data-qa=choose-account]').setValue(123)
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=asset-types]').exists()).toBeTruthy()
  })

  it('when a credit type account is selected, the credit transaction type fields are shown', async () => {
    const subject = shallowMount(NewTransactionForm)
    await subject.vm.$nextTick()
    subject.find('[data-qa=choose-account]').setValue(456)
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=credit-types]').exists()).toBeTruthy()
  })

  it('when a credit type account is selected, the asset transaction type fields are not shown', async () => {
    const subject = shallowMount(NewTransactionForm)
    await subject.vm.$nextTick()
    subject.find('[data-qa=choose-account]').setValue(456)
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=asset-types]').exists()).toBeFalsy()
  })

  it('when a asset type account is selected, the credit transaction type fields are not shown', async () => {
    const subject = shallowMount(NewTransactionForm)
    await subject.vm.$nextTick()
    subject.find('[data-qa=choose-account]').setValue(123)
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=credit-types]').exists()).toBeFalsy()
  })

  it('when no account is selected, the disabled types appear', async () => {
    const subject = shallowMount(NewTransactionForm)
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=choose-account-types]').exists()).toBeTruthy()
  })

  it('when no account is selected, the asset types do not appear', async () => {
    const subject = shallowMount(NewTransactionForm)
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=asset-types]').exists()).toBeFalsy()
  })

  it('when no account is selected, the credit types do not appear', async () => {
    const subject = shallowMount(NewTransactionForm)
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=credit-types]').exists()).toBeFalsy()
  })

  it('submiting without choosing an account results in an error', async () => {
    const subject = shallowMount(NewTransactionForm)
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=choose-account-error]').exists()).toBeTruthy()
  })

  it('submiting with an account does not result in an error', async () => {
    const subject = shallowMount(NewTransactionForm)
    await subject.vm.$nextTick()
    subject.find('[data-qa=choose-account]').setValue(123)
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=choose-account-error]').exists()).toBeFalsy()
  })

  it('submiting without choosing a type results in an error', async () => {
    const subject = shallowMount(NewTransactionForm)
    await subject.vm.$nextTick()
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=choose-type-error]').exists()).toBeTruthy()
  })

  it('submiting with a type does not result in an error', async () => {
    const subject = shallowMount(NewTransactionForm)
    await subject.vm.$nextTick()
    subject.find('[data-qa=choose-account]').setValue(123)
    await subject.vm.$nextTick()
    subject.find('[data-qa=debit-opt]').setChecked(true)
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=choose-type-error]').exists()).toBeFalsy()
  })

  it('submitting with amount less than zero results in an error', async () => {
    const subject = shallowMount(NewTransactionForm)
    subject.find('[data-qa=amount]').setValue('-10')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=amount-too-low-error]').exists()).toBeTruthy()
  })

  it('submitting with amount equal to zero results in an error', async () => {
    const subject = shallowMount(NewTransactionForm)
    subject.find('[data-qa=amount]').setValue('0')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=amount-too-low-error]').exists()).toBeTruthy()
  })

  it('submitting with amount greater than zero does not result in an error', async () => {
    const subject = shallowMount(NewTransactionForm)
    subject.find('[data-qa=amount]').setValue('100.53')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=amount-too-low-error]').exists()).toBeFalsy()
  })

  it('submitting without a date results in an error', async () => {
    const subject = shallowMount(NewTransactionForm)
    subject.find('[data-qa=date]').setValue('')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=date-is-empty-error]').exists()).toBeTruthy()
  })

  it('submitting with a date does not result in an error', async () => {
    const subject = shallowMount(NewTransactionForm)
    subject.find('[data-qa=date]').setValue('05/28/1994')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=date-is-empty-error]').exists()).toBeFalsy()
  })

  it('submitting with valid input results in a service call', async () => {
    TransactionsClient.addTransaction.mockResolvedValueOnce()
    const subject = shallowMount(NewTransactionForm)
    await subject.vm.$nextTick()
    subject.find('[data-qa=choose-account]').setValue(123)
    await subject.vm.$nextTick()
    subject.find('[data-qa=debit-opt]').setChecked(true)
    subject.find('[data-qa=amount]').setValue('10')
    subject.find('[data-qa=date]').setValue('05/28/1994')
    subject.find('[data-qa=notes]').setValue('Something about the transaction')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    expect(TransactionsClient.addTransaction).toBeCalledWith(
      123, 'debit', '10', '05/28/1994', 'Something about the transaction'
    )
  })

  it('when the transaction creation succeeds an event is emitted', async () => {
    TransactionsClient.addTransaction.mockResolvedValueOnce()
    const subject = shallowMount(NewTransactionForm)
    await subject.vm.$nextTick()
    subject.find('[data-qa=choose-account]').setValue(123)
    await subject.vm.$nextTick()
    subject.find('[data-qa=debit-opt]').setChecked(true)
    subject.find('[data-qa=amount]').setValue('10')
    subject.find('[data-qa=date]').setValue('05/28/1994')
    subject.find('[data-qa=notes]').setValue('Something about the transaction')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.emitted('submitted')).not.toBeUndefined()
  })

  it('when the transaction creation fails an event is not emitted', async () => {
    TransactionsClient.addTransaction.mockRejectedValueOnce()
    const subject = shallowMount(NewTransactionForm)
    await subject.vm.$nextTick()
    subject.find('[data-qa=choose-account]').setValue(123)
    await subject.vm.$nextTick()
    subject.find('[data-qa=debit-opt]').setChecked(true)
    subject.find('[data-qa=amount]').setValue('10')
    subject.find('[data-qa=date]').setValue('05/28/1994')
    subject.find('[data-qa=notes]').setValue('Something about the transaction')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.emitted('submitted')).toBeUndefined()
  })

  it('when the transaction creation fails an error is shown', async () => {
    TransactionsClient.addTransaction.mockRejectedValueOnce()
    const subject = shallowMount(NewTransactionForm)
    await subject.vm.$nextTick()
    subject.find('[data-qa=choose-account]').setValue(123)
    await subject.vm.$nextTick()
    subject.find('[data-qa=debit-opt]').setChecked(true)
    subject.find('[data-qa=amount]').setValue('10')
    subject.find('[data-qa=date]').setValue('05/28/1994')
    subject.find('[data-qa=notes]').setValue('Something about the transaction')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=submit-error]').exists()).toBeTruthy()
  })

  it('when the transaction creation succeeds an error is not shown', async () => {
    TransactionsClient.addTransaction.mockResolvedValueOnce()
    const subject = shallowMount(NewTransactionForm)
    await subject.vm.$nextTick()
    subject.find('[data-qa=choose-account]').setValue(123)
    await subject.vm.$nextTick()
    subject.find('[data-qa=debit-opt]').setChecked(true)
    subject.find('[data-qa=amount]').setValue('10')
    subject.find('[data-qa=date]').setValue('05/28/1994')
    subject.find('[data-qa=notes]').setValue('Something about the transaction')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=submit-error]').exists()).toBeFalsy()
  })

  it('submitting with invalid input does not result in a service call', async () => {
    const subject = shallowMount(NewTransactionForm)
    await subject.vm.$nextTick()
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    expect(TransactionsClient.addTransaction).not.toBeCalled()
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
