//@ts-nocheck
import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import pools2 from 'config/abi/pools2.json'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress, getPools2Address } from 'utils/addressHelpers'
import { FarmConfig } from 'config/constants/types'

export const fetchFarmUserAllowances = async (account: string, farmsToFetch: FarmConfig[], isPools2) => {
  const masterChefAddress = getMasterChefAddress()
  const pools2Address = getPools2Address()
  const address = isPools2 ? pools2Address : masterChefAddress
  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    return { address: lpContractAddress, name: 'allowance', params: [account, address] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (account: string, farmsToFetch: FarmConfig[], isPools2) => {
  const masterChefAddress = getMasterChefAddress()
  const pools2Address = getPools2Address()

  const calls = farmsToFetch.map((farm) => {
    return {
      address: isPools2 ? pools2Address : masterChefAddress,
      name: 'userInfo',
      params: [farm.pid, account],
    }
  })

  const rawStakedBalances = await multicall(isPools2 ? pools2 : masterchefABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: FarmConfig[], isPools2) => {
  try {
    const masterChefAddress = getMasterChefAddress()
    const pools2Address = getPools2Address()
    const calls = farmsToFetch.map((farm) => {
      return {
        address: isPools2 ? pools2Address : masterChefAddress,
        name: isPools2 ? 'pendingToken' : 'pendingCake',
        params: [farm.pid, account],
      }
    })

    const rawEarnings = await multicall(isPools2 ? pools2 : masterchefABI, calls)

    const parsedEarnings = rawEarnings.map((earnings) => {
      if (isPools2) {
        return {
          earnings1: earnings[0].toString(),
          earnings2: earnings[1].toString(),
        }
      } else {
        return new BigNumber(earnings).toJSON()
      }
    })
    return parsedEarnings
  } catch (error) {
    console.log('🚀 ~ file: fetchFarmUser.ts ~ line 88 ~ fetchFarmUserEarnings ~ error', getPools2Address(), error)
  }
}
