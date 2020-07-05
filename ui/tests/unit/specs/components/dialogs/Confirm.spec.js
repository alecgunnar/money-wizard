import ConfirmDialog from '@/components/dialogs/Confirm'
import DialogsUtil from '@/utils/dialogs'
import {shallowMount} from '@vue/test-utils'

jest.mock('@/utils/dialogs')

describe('Confirm', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('waits for a confirmation to be requested', () => {
    shallowMount(ConfirmDialog)
    expect(DialogsUtil.onConfirm).toBeCalledWith(expect.any(Function))
  })

  it('shows the confirm dialog when confirmation requested', async () => {
    const subject = shallowMount(ConfirmDialog)
    DialogsUtil.onConfirm.mock.calls[0][0](() => {})
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=dialog]').exists()).toBeTruthy()
  })

  it('does not show the confirm dialog', () => {
    const subject = shallowMount(ConfirmDialog)
    expect(subject.find('[data-qa=dialog]').exists()).toBeFalsy()
  })

  it('the dialog has a button to confirm', async () => {
    const subject = shallowMount(ConfirmDialog)
    DialogsUtil.onConfirm.mock.calls[0][0](() => {})
    await subject.vm.$nextTick()
    expect(subject.find('button[data-qa=confirm]').exists()).toBeTruthy()
  })

  it('the dialog has a button to cancel', async () => {
    const subject = shallowMount(ConfirmDialog)
    DialogsUtil.onConfirm.mock.calls[0][0](() => {})
    await subject.vm.$nextTick()
    expect(subject.find('button[data-qa=cancel]').exists()).toBeTruthy()
  })

  it('confirming causes the callback to be called', async () => {
    const callback = jest.fn()
    const subject = shallowMount(ConfirmDialog)
    DialogsUtil.onConfirm.mock.calls[0][0](callback)
    await subject.vm.$nextTick()
    subject.find('[data-qa=confirm]').trigger('click')
    expect(callback).toBeCalled()
  })

  it('confirming causes the dialog to disappear', async () => {
    const callback = jest.fn()
    const subject = shallowMount(ConfirmDialog)
    DialogsUtil.onConfirm.mock.calls[0][0](callback)
    await subject.vm.$nextTick()
    subject.find('[data-qa=confirm]').trigger('click')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=dialog]').exists()).toBeFalsy()
  })

  it('canceling does not cause the callback to be called', async () => {
    const callback = jest.fn()
    const subject = shallowMount(ConfirmDialog)
    DialogsUtil.onConfirm.mock.calls[0][0](callback)
    await subject.vm.$nextTick()
    subject.find('[data-qa=cancel]').trigger('click')
    expect(callback).not.toBeCalled()
  })

  it('canceling causes the dialog to disappear', async () => {
    const callback = jest.fn()
    const subject = shallowMount(ConfirmDialog)
    DialogsUtil.onConfirm.mock.calls[0][0](callback)
    await subject.vm.$nextTick()
    subject.find('[data-qa=cancel]').trigger('click')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=dialog]').exists()).toBeFalsy()
  })
})
