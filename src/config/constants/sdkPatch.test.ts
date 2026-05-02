import { ChainId, FACTORY_ADDRESS, INIT_CODE_HASH, Pair, Token, WETH } from '@pancakeswap/sdk'

describe('patched Pancake SDK constants', () => {
  it('uses OpenCoin factory and init code hash', () => {
    expect(FACTORY_ADDRESS).toBe('0xeF7290f5dC0E6752724d3605875d59AF5a2eE55c')
    expect(INIT_CODE_HASH).toBe('0x8abce0937a764fb0abfbec65b1c0c46365417c964627f24f8ef3c59bc1571f5a')
  })

  it('uses the BSC testnet wrapped native token', () => {
    expect(WETH[ChainId.TESTNET].address).toBe('0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd')
  })

  it('calculates OpenCoin pair addresses from the patched factory', () => {
    const tokenA = new Token(ChainId.TESTNET, '0x0000000000000000000000000000000000000001', 18, 'A', 'Token A')
    const tokenB = new Token(ChainId.TESTNET, '0x0000000000000000000000000000000000000002', 18, 'B', 'Token B')

    expect(Pair.getAddress(tokenA, tokenB)).toBe('0xBF9F7b68f9dBAC7A25D1F8C2Cb21e343620eBeC9')
  })
})
