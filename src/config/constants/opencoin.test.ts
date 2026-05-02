import { ROUTER_ADDRESS } from './index'
import { FACTORY_ADDRESS, INIT_CODE_HASH, WETH } from '@pancakeswap/sdk'

describe('OpenCoin constants', () => {
  it('uses OpenCoin protocol addresses from the configured environment', () => {
    expect(ROUTER_ADDRESS).toBe('0x036f2081ac476492FdF4b94877a608E72bf4826E')
    expect(FACTORY_ADDRESS).toBe('0xeF7290f5dC0E6752724d3605875d59AF5a2eE55c')
    expect(INIT_CODE_HASH).toBe('0x8abce0937a764fb0abfbec65b1c0c46365417c964627f24f8ef3c59bc1571f5a')
    expect(WETH[97].address).toBe('0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd')
  })
})
