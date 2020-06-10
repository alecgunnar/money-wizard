import Transactions from '@/views/Transactions'
import NewTransactionForm from '@/components/forms/NewTransactionForm'
import {shallowMount} from '@vue/test-utils'

describe('Transactions', () => {
  it('has a button to create new transaction', () => {
    const subject = shallowMount(Transactions)
    expect(subject.find('button[data-qa=new-transaction]').exists()).toBeTruthy()
  })

  it('shows a form to create a new transaction', async () => {
    const subject = shallowMount(Transactions)
    subject.find('[data-qa=new-transaction]').trigger('click')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewTransactionForm).exists()).toBeTruthy()
  })

  it('does not show new transaction form by default', () => {
    const subject = shallowMount(Transactions)
    expect(subject.findComponent(NewTransactionForm).exists()).toBeFalsy()
  })
})
