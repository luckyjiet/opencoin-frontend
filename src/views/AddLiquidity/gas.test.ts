import { BigNumber } from '@ethersproject/bignumber'
import { getAddLiquidityGasLimit } from './gas'

describe('getAddLiquidityGasLimit', () => {
  it('uses the normal gas margin when adding to an existing pool with liquidity', () => {
    expect(getAddLiquidityGasLimit(BigNumber.from(900000), false).toString()).toBe('990000')
  })

  it('uses a higher gas floor when adding first liquidity', () => {
    expect(getAddLiquidityGasLimit(BigNumber.from(900000), true).toString()).toBe('3000000')
  })

  it('keeps the estimated gas margin when first liquidity needs more than the floor', () => {
    expect(getAddLiquidityGasLimit(BigNumber.from(3000000), true).toString()).toBe('3300000')
  })
})
