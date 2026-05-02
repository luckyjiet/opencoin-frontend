//@ts-nocheck
import { useEffect, useCallback, useState } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import tokens from 'config/constants/tokens'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { getMasterchefContract, getSouschefContract } from 'utils/contractHelpers'
import { useTokenContract } from 'hooks/useContract'
import { getBalanceAmount, getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
export const usePoolApy = (pool) => {
  const [tvl, setTvl] = useState(new BigNumber(0))
  const [apy, setApy] = useState(new BigNumber(0))
  const { usdt,  } = tokens
  const cakePriceUsd = usePriceCakeBusd()

  const lpContract = useTokenContract(pool?.stakingToken?.address[ChainId['MAINNET']])
  const earningTokenContract = useTokenContract(pool?.earningToken?.address[ChainId['MAINNET']])

  const usdtContract = useTokenContract(usdt.address[ChainId['MAINNET']])
  const fetchTVL = useCallback(async () => {
    const { sousId } = pool

    try {
      if (sousId === 0) {
        const masterChefContract = getMasterchefContract()
        const stakeTotalSupply = await lpContract.balanceOf(masterChefContract.address)
        let tvl = getBalanceAmount(stakeTotalSupply.toString()).times(cakePriceUsd)
       
        setTvl(tvl)
        const { allocPoint } = await masterChefContract.poolInfo(pool.sousId)
        let totalWeight = await masterChefContract.totalAllocPoint()
        const weight = allocPoint.toNumber()
        totalWeight = totalWeight.toNumber()
        let perBlock = await masterChefContract.cakePerBlock()
        console.log("🚀 ~ file: usePoolApy.ts ~ line 28 ~ fetchTVL ~ tvl", tvl.toNumber(),getBalanceNumber(perBlock.toString()),weight,totalWeight,getBalanceNumber(stakeTotalSupply.toString()))
        let apy = getBalanceAmount(perBlock.toString())
          .times(new BigNumber(weight).div(totalWeight))
          .times(new BigNumber(24).times(3600).times(73))
          .div(getBalanceAmount(stakeTotalSupply.toString()))
          // .div(tvl)
          .times(100)
        setApy(apy)
      } else {
        const lpAddress = {
          BHV: '0x2727Cb5e3176e43eC64Ddf2F7b969945427E01e0',
          MAP: '0x646e5ce728a46b923d5dff4f7591e3468390d92b',
        }
        const sousContract = getSouschefContract(sousId)
        const perBlock = await sousContract.rewardPerBlock()
        const stakeTotalSupply = await lpContract.balanceOf(sousContract.address)
        const LPAddress = lpAddress[pool?.stakingToken.symbol]
        const EarnLPAddress = lpAddress[pool?.earningToken.symbol]

        const tokenBalance = await lpContract.balanceOf(LPAddress)
        const usdtBalance = await usdtContract.balanceOf(LPAddress)

        const tokenPrice = getBalanceAmount(usdtBalance.toString()).div(getBalanceAmount(tokenBalance.toString()))
        const tvl = getBalanceAmount(stakeTotalSupply.toString()).times(tokenPrice)
        setTvl(tvl)
        const earnTokenBalance = await earningTokenContract.balanceOf(EarnLPAddress)
        const usdtEarnTokenBalance = await usdtContract.balanceOf(EarnLPAddress)

        const earnTokenPrice = getBalanceAmount(usdtEarnTokenBalance.toString()).div(
          getBalanceAmount(earnTokenBalance.toString()),
        )
        let apy = getBalanceAmount(perBlock.toString())
        .times(new BigNumber(24).times(3600).times(73))
        .times(earnTokenPrice)
        .div(tvl)
        .times(100)
        setApy(apy)
      }
    } catch (error) {
      console.log('🚀 ~ file: usePoolApy.ts ~ line 71 ~ fetchTVL ~ error', error)
    }
  }, [pool, lpContract, cakePriceUsd, usdtContract, earningTokenContract])

  useEffect(() => {
    if ((pool && lpContract && usdtContract, earningTokenContract)) {
      fetchTVL()
    }
  }, [pool, lpContract, cakePriceUsd, usdtContract, earningTokenContract])
  return { tvl, apy }
}
export default usePoolApy
