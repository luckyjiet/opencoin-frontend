import fs from 'fs'
import path from 'path'
import defaultTokenList from './tokenLists'

const TESTNET_DEFAULT_TOKEN_ADDRESSES = [
  '0xd483312dda674e64e8a43f1db476f745dd7aa6bf',
  '0x20de77b899f7d700d66074cfa8a0d9e374bdb7f2',
  '0x73d6d29d4206f590230aa07e66a77b4c5cdc44d2',
]

describe('default token list', () => {
  it('uses an OpenCoin fallback token list without removed HiveSwap tokens', () => {
    const symbols = defaultTokenList.tokens.map((token) => token.symbol)

    expect(symbols).toContain('WBNB')
    expect(symbols).not.toContain('BEFI')
    expect(symbols).not.toContain('MAP')
    expect(defaultTokenList.name).toBe('OpenCoin BSC Testnet Default List')
    expect(defaultTokenList.version).toEqual({ major: 1, minor: 1, patch: 0 })
    expect(defaultTokenList.keywords).toContain('opencoin')
  })

  it('includes the configured OpenCoin testnet default tokens', () => {
    const tokenMap = new Map(defaultTokenList.tokens.map((token) => [token.address.toLowerCase(), token]))

    expect(tokenMap.get(TESTNET_DEFAULT_TOKEN_ADDRESSES[0])).toMatchObject({
      chainId: 97,
      name: 'BitAsset',
      symbol: 'BAS',
      decimals: 18,
    })
    expect(tokenMap.get(TESTNET_DEFAULT_TOKEN_ADDRESSES[1])).toMatchObject({
      chainId: 97,
      name: 'Beacon',
      symbol: 'BEAC',
      decimals: 18,
    })
    expect(tokenMap.get(TESTNET_DEFAULT_TOKEN_ADDRESSES[2])).toMatchObject({
      chainId: 97,
      name: 'Mock USDT',
      symbol: 'USDT',
      decimals: 18,
    })
  })

  it('keeps the public testnet token list in sync with the bundled fallback list', () => {
    const publicTokenList = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), 'public/tokenlists/opencoin-bsc-testnet.tokenlist.json'), 'utf8'),
    )

    expect(publicTokenList).toEqual(defaultTokenList)
  })
})
