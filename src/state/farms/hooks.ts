//@ts-nocheck
import { useEffect, useCallback, useState } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { farmsConfig, pools2Config } from 'config/constants'
import useRefresh from 'hooks/useRefresh'
import { useTokenContract } from 'hooks/useContract'
import { fetchFarmsPublicDataAsync, fetchFarmUserDataAsync } from '.'
import { State, Farm, FarmsState } from '../types'
import { updateFarmList } from './actions'
import tokens from 'config/constants/tokens'
export const usePollFarmsData = (isPools2) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    const farmsToFetch = isPools2 ? pools2Config : farmsConfig
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchFarmsPublicDataAsync(pids))

    if (account) {
      dispatch(fetchFarmUserDataAsync({ account, pids }))
    }
  }, [dispatch, slowRefresh, account])
}

export const useUpdateFarmsList = (isPools2) => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(updateFarmList())
  }, [dispatch, isPools2])
}

/**
 * Fetches the "core" farm data used globally
 * 251 = BHV-BNB LP
 * 252 = USDT-BNB LP
 */
export const usePollCoreFarmData = () => {
  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync([251, 252]))
  }, [dispatch, fastRefresh])
}

export const useFarms = (): FarmsState => {
  const farms = useSelector((state: State) => state.farms)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromLpSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm?.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm?.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm?.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm?.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  }
}

// Return the base token price for a farm, from a given pid
export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const farm = useFarmFromPid(pid)
  return farm && new BigNumber(farm.token.busdPrice)
}

export const useLpTokenPrice = (symbol: string) => {
  // const farm = useFarmFromLpSymbol(symbol)
  // const farmTokenPriceInUsd = useBusdPriceFromPid(farm?.pid)
  // let lpTokenPrice = BIG_ZERO
  // if (farm) {
  //   if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
  //     // Total value of base token in LP
  //     const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(farm.tokenAmountTotal)
  //     // Double it to get overall value in LP
  //     const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
  //     // Divide total value of all tokens, by the number of LP tokens
  //     const totalLpTokens = getBalanceAmount(new BigNumber(farm.lpTotalSupply))
  //     lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
  //   }
  // }

  // return lpTokenPrice
  return new BigNumber(0)
}

// /!\ Deprecated , use the USDT hook in /hooks

export const usePriceBnbBusd = (): BigNumber => {
  const bnbBusdFarm = useFarmFromPid(1)
  return new BigNumber(bnbBusdFarm.quoteToken.busdPrice)
}

export const usePriceCakeBusd = (): BigNumber => {
  const [price, setPrice] = useState(new BigNumber(0))
  // const { bhv_usdt, bhv, usdt } = tokens
  // const LPTokenAddress = bhv_usdt.address[ChainId['MAINNET']]
  // const bhvContract = useTokenContract(bhv.address[ChainId['MAINNET']])
  // const usdtContract = useTokenContract(usdt.address[ChainId['MAINNET']])

  // const fetchPrice = useCallback(async () => {
  //   // setPrice
  //   const bhvBalance = await bhvContract.balanceOf(LPTokenAddress)
  //   const usdtBalance = await usdtContract.balanceOf(LPTokenAddress)
  //   const price = getBalanceAmount(usdtBalance.toString()).div(getBalanceAmount(bhvBalance.toString()))
  //   setPrice(price)
  // }, [])
  // useEffect(() => {
  //   if (bhvContract && usdtContract) {
  //     fetchPrice()
  //   }
  // }, [bhvContract, usdtContract])
  return price
}
