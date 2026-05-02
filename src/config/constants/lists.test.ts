import { DEFAULT_ACTIVE_LIST_URLS, DEFAULT_LIST_OF_LISTS } from './lists'

describe('token list configuration', () => {
  it('uses OpenCoin token list URLs from environment configuration', () => {
    expect(DEFAULT_LIST_OF_LISTS).toEqual(['/tokenlists/opencoin-bsc-testnet.tokenlist.json'])
    expect(DEFAULT_ACTIVE_LIST_URLS).toEqual(['/tokenlists/opencoin-bsc-testnet.tokenlist.json'])
  })

  it('does not ship HiveSwap token list URLs', () => {
    expect(DEFAULT_LIST_OF_LISTS.join(' ')).not.toMatch(/hiveswap/i)
  })
})
