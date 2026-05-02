//@ts-nocheck
import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 0,
    stakingToken: tokens.bhv,
    earningToken: tokens.bhv,
    contractAddress: {
      97: '0xBAe9166e25eA85736246DC179d7D2850197d5c27',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '10',
    sortOrder: 0,
    isFinished: false,
  },
  {
    sousId: 1,
    stakingToken: tokens.bhv,
    earningToken: tokens.map,
    contractAddress: {
      97: '0xec7f6602ADf937e24104BaDCCBB2488cD3f26b53',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '10',
    sortOrder: 1,
    isFinished: false,
  },

]

export default pools
