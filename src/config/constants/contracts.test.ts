import addresses from './contracts'

describe('contract addresses', () => {
  it('uses Multicall2 addresses that support tryAggregate on BSC mainnet and testnet', () => {
    expect(addresses.multiCall[56]).toBe('0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B')
    expect(addresses.multiCall[97]).toBe('0xf08ed5944312c1a0a364e1655d2738765111e61b')
  })
})
