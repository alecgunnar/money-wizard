import Transactions from '@/views/Transactions'
import {shallowMount} from '@vue/test-utils'

describe('Transactions', () => {
  it('has a button to create new transaction', () => {
    const subject = shallowMount(Transactions)
    expect(subject.find('button[data-qa=new-transaction]').exists()).toBeTruthy()
  })
})
