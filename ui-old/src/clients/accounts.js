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
      },
      {
        id: 'ef9f90af-d92e-4576-a801-e414e91a026e',
        name: 'Wallet',
        type: 'cash',
        balance: 100.00
      },
      {
        id: '58a20494-1a41-4e0b-b34b-420604ce5a1e',
        name: 'Coin Jar',
        type: 'cash',
        balance: 0.32
      }
    ]
  }
}
