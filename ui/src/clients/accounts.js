export default {
  async getAccounts () {
    return [
      {
        id: '82be107d-fd15-4373-869b-db8473a0cc97',
        name: 'Checking',
        type: 'checking',
        balance: 342.54
      },
      {
        id: 'b46d1090-f8a0-4cdf-9ef4-8e91c63d1440',
        name: 'Savings',
        type: 'savings',
        balance: 12432.22
      },
      {
        id: '91f14cdb-598d-4aa2-a69b-2ae0cb0e5189',
        name: 'Amex Card',
        type: 'credit-card',
        balance: 45.00
      }
    ]
  }
}
