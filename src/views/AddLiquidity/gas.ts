import { BigNumber } from '@ethersproject/bignumber'
import { calculateGasMargin } from '../../utils'

export const FIRST_LIQUIDITY_GAS_FLOOR = BigNumber.from(3000000)

export const getAddLiquidityGasLimit = (estimatedGasLimit: BigNumber, isFirstLiquidityAdd: boolean): BigNumber => {
  const gasLimit = calculateGasMargin(estimatedGasLimit)

  if (!isFirstLiquidityAdd) {
    return gasLimit
  }

  return gasLimit.lt(FIRST_LIQUIDITY_GAS_FLOOR) ? FIRST_LIQUIDITY_GAS_FLOOR : gasLimit
}
