import { ChainId } from '@pancakeswap/sdk'
import { parseUnits } from 'ethers/lib/utils'
import {
  GAS_PRICE,
  GAS_PRICE_GWEI,
  getDefaultGasPrice,
  getGasPriceOptions,
  getGasPriceWeiOptions,
  resolveGasPrice,
} from './helpers'

const toWei = (gwei: string) => parseUnits(gwei, 'gwei').toString()

describe('gas price configuration', () => {
  it('uses BSC gas price tiers for mainnet and testnet', () => {
    const expected = {
      default: '0.1',
      fast: '0.2',
      instant: '0.3',
    }

    expect(getGasPriceOptions(ChainId.MAINNET, {})).toEqual(expected)
    expect(getGasPriceOptions(ChainId.TESTNET, {})).toEqual(expected)
    expect(getGasPriceWeiOptions(ChainId.TESTNET, {})).toEqual({
      default: toWei('0.1'),
      fast: toWei('0.2'),
      instant: toWei('0.3'),
    })
  })

  it('allows deployments to override the displayed gas price tiers', () => {
    const env = {
      REACT_APP_GAS_PRICE_STANDARD_GWEI: '1',
      REACT_APP_GAS_PRICE_FAST_GWEI: '2',
      REACT_APP_GAS_PRICE_INSTANT_GWEI: '3',
    }

    expect(getGasPriceOptions(ChainId.TESTNET, env)).toEqual({
      default: '1',
      fast: '2',
      instant: '3',
    })
    expect(getDefaultGasPrice(ChainId.TESTNET, env)).toBe(toWei('1'))
  })

  it('falls back to the chain default when local storage has a stale gas price', () => {
    expect(resolveGasPrice(ChainId.TESTNET, toWei('2000'), {})).toBe(toWei('0.1'))
    expect(resolveGasPrice(ChainId.TESTNET, toWei('0.2'), {})).toBe(toWei('0.2'))
  })

  it('does not expose the old 2000 gwei default through legacy constants', () => {
    expect(GAS_PRICE.default).toBe('0.1')
    expect(GAS_PRICE_GWEI.default).toBe(toWei('0.1'))
  })
})
