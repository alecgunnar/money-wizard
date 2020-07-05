import DialogsUtil from '@/utils/dialogs'

describe('Dialogs util', () => {
  it('calls the listener when confirmation is requested', () => {
    const listener = jest.fn()
    const callback = () => {}
    DialogsUtil.onConfirm(listener)
    DialogsUtil.confirm(callback)
    expect(listener).toBeCalledWith(callback)
  })
})
