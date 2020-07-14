import NewTransactionForm from '@/components/forms/NewTransactionForm'
import moment from 'moment'
import {shallowMount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

let store

const setupTest = (addTr = null, type = 'asset') => {
  store = new Vuex.Store({
    modules: {
      transactions: {
        state: {
          account: {
            id: 123,
            name: 'Sample',
            type
          }
        },
        actions: {
          addTransaction: addTr || jest.fn()
        }
      }
    }
  })
}

describe('NewTransactionForm', () => {
  it('has a field to enter an amount', () => {
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    expect(subject.find('input[data-qa=amount]').exists()).toBeTruthy()
  })

  it('has a field to enter the date of the transaction', () => {
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    expect(subject.find('input[data-qa=date]').exists()).toBeTruthy()
  })

  it.skip('the date field is pre-filled with the current date', () => {
    const todaysDate = moment().format('MM/DD/YYYY')
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    expect(subject.find('[data-qa=date]').element.value).toBe(todaysDate)
  })

  it('has a field to enter a readon', () => {
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    expect(subject.find('input[data-qa=reason]').exists()).toBeTruthy()
  })

  it('has a field to enter notes', () => {
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    expect(subject.find('textarea[data-qa=notes]').exists()).toBeTruthy()
  })

  it('there is a submit button', () => {
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    expect(subject.find('button[type=submit][data-qa=submit]').exists()).toBeTruthy()
  })

  it('when an asset type account is selected, the asset transaction type fields are shown', async () => {
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    await subject.vm.$nextTick()
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=asset-types]').exists()).toBeTruthy()
  })

  it('when a credit type account is selected, the credit transaction type fields are shown', async () => {
    setupTest(null, 'credit')

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    await subject.vm.$nextTick()
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=credit-types]').exists()).toBeTruthy()
  })

  it('when a loan type account is selected, the credit transaction type fields are shown', async () => {
    setupTest(null, 'loan')

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    await subject.vm.$nextTick()
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=credit-types]').exists()).toBeTruthy()
  })

  it('when a credit type account is selected, the asset transaction type fields are not shown', async () => {
    setupTest(null, 'credit')

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    await subject.vm.$nextTick()
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=asset-types]').exists()).toBeFalsy()
  })

  it('when a loan type account is selected, the asset transaction type fields are not shown', async () => {
    setupTest(null, 'loan')

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    await subject.vm.$nextTick()
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=asset-types]').exists()).toBeFalsy()
  })

  it('when a asset type account is selected, the credit transaction type fields are not shown', async () => {
    setupTest(null, 'asset')

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    await subject.vm.$nextTick()
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=credit-types]').exists()).toBeFalsy()
  })

  it('submiting without choosing a type results in an error', async () => {
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    await subject.vm.$nextTick()
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=choose-type-error]').exists()).toBeTruthy()
  })

  it('submiting with a type does not result in an error', async () => {
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    await subject.vm.$nextTick()
    await subject.vm.$nextTick()
    subject.find('[data-qa=debit-opt]').setChecked(true)
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=choose-type-error]').exists()).toBeFalsy()
  })

  it('submitting with amount less than zero results in an error', async () => {
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    subject.find('[data-qa=amount]').setValue('-10')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=amount-too-low-error]').exists()).toBeTruthy()
  })

  it('submitting with amount equal to zero results in an error', async () => {
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    subject.find('[data-qa=amount]').setValue('0')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=amount-too-low-error]').exists()).toBeTruthy()
  })

  it('submitting with amount greater than zero does not result in an error', async () => {
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    subject.find('[data-qa=amount]').setValue('100.53')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=amount-too-low-error]').exists()).toBeFalsy()
  })

  it('submitting without a date results in an error', async () => {
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    subject.find('[data-qa=date]').setValue('')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=date-is-empty-error]').exists()).toBeTruthy()
  })

  it('submitting with a date does not result in an error', async () => {
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    subject.find('[data-qa=date]').setValue('05/28/1994')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=date-is-empty-error]').exists()).toBeFalsy()
  })

  it('submitting without a reason results in an error', async () => {
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    subject.find('[data-qa=date]').setValue('')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=reason-is-empty-error]').exists()).toBeTruthy()
  })

  it('submitting with a reason does not result in an error', async () => {
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    subject.find('[data-qa=reason]').setValue('Testing123')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=reason-is-empty-error]').exists()).toBeFalsy()
  })

  it('submitting with valid input results in a service call', async () => {
    const addTr = jest.fn()
    setupTest(addTr)

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    await subject.vm.$nextTick()
    await subject.vm.$nextTick()
    subject.find('[data-qa=debit-opt]').setChecked(true)
    subject.find('[data-qa=amount]').setValue('10')
    subject.find('[data-qa=date]').setValue('05/28/1994')
    subject.find('[data-qa=reason]').setValue('Just because')
    subject.find('[data-qa=notes]').setValue('Something about the transaction')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    expect(addTr).toBeCalledWith(
      expect.any(Object), {
        type: 'debit', 
        amount: '10', 
        date: '05/28/1994',
        reason: 'Just because',
        notes: 'Something about the transaction'
      }
    )
  })

  it('when the transaction creation succeeds an event is emitted', async () => {
    const addTr = jest.fn()
    addTr.mockResolvedValueOnce(true)

    setupTest(addTr)

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    await subject.vm.$nextTick()
    await subject.vm.$nextTick()
    subject.find('[data-qa=debit-opt]').setChecked(true)
    subject.find('[data-qa=amount]').setValue('10')
    subject.find('[data-qa=date]').setValue('05/28/1994')
    subject.find('[data-qa=reason]').setValue('Just because')
    subject.find('[data-qa=notes]').setValue('Something about the transaction')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.emitted('submitted')).not.toBeUndefined()
  })

  it('when the transaction creation fails an event is not emitted', async () => {
    const addTr = jest.fn()
    addTr.mockResolvedValueOnce(false)

    setupTest(addTr)

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    await subject.vm.$nextTick()
    await subject.vm.$nextTick()
    subject.find('[data-qa=debit-opt]').setChecked(true)
    subject.find('[data-qa=amount]').setValue('10')
    subject.find('[data-qa=date]').setValue('05/28/1994')
    subject.find('[data-qa=reason]').setValue('Just because')
    subject.find('[data-qa=notes]').setValue('Something about the transaction')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.emitted('submitted')).toBeUndefined()
  })

  it('when the transaction creation fails an error is shown', async () => {
    const addTr = jest.fn()
    addTr.mockResolvedValueOnce(false)

    setupTest(addTr)

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    await subject.vm.$nextTick()
    await subject.vm.$nextTick()
    subject.find('[data-qa=debit-opt]').setChecked(true)
    subject.find('[data-qa=amount]').setValue('10')
    subject.find('[data-qa=date]').setValue('05/28/1994')
    subject.find('[data-qa=reason]').setValue('Just because')
    subject.find('[data-qa=notes]').setValue('Something about the transaction')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    await addTr
    expect(subject.find('[data-qa=submit-error]').exists()).toBeTruthy()
  })

  it('when the transaction creation succeeds an error is not shown', async () => {
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    await subject.vm.$nextTick()
    await subject.vm.$nextTick()
    subject.find('[data-qa=debit-opt]').setChecked(true)
    subject.find('[data-qa=amount]').setValue('10')
    subject.find('[data-qa=date]').setValue('05/28/1994')
    subject.find('[data-qa=reason]').setValue('Just because')
    subject.find('[data-qa=notes]').setValue('Something about the transaction')
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=submit-error]').exists()).toBeFalsy()
  })

  it('submitting with invalid input does not result in a service call', async () => {
    const addTr = jest.fn()
    setupTest(addTr)

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    await subject.vm.$nextTick()
    subject.find('[data-qa=add-transaction-form]').trigger('submit')
    expect(addTr).not.toBeCalled()
  })

  it('there is a cancel button', () => {
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    expect(subject.find('button[type=button][data-qa=cancel]').exists()).toBeTruthy()
  })

  it('clicking the cancel button causes event to be emitted', () => {
    setupTest()

    const subject = shallowMount(NewTransactionForm, {
      localVue,
      store
    })
    subject.find('[data-qa=cancel]').trigger('click')
    expect(subject.emitted('canceled')).not.toBeUndefined()
  })
})
