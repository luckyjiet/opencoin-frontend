//@ts-nocheck
import { useEffect, useMemo, useCallback, useState } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import tokens from 'config/constants/tokens'
import { useRouteMatch } from 'react-router-dom'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { getMasterchefContract, getBep20Contract, getPools2Contract } from 'utils/contractHelpers'
import { useTokenContract } from 'hooks/useContract'
import { getBalanceAmount, getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
export const useFarmApy = (farm, lpAddresses) => {
  const [tvl, setTvl] = useState(new BigNumber(0))
  const [apy, setApy] = useState(new BigNumber(0))
  const { usdt, bhv } = tokens
  const cakePriceUsd = usePriceCakeBusd()

  const lpContract = useTokenContract(lpAddresses)

  const usdtContract = useTokenContract(usdt.address[ChainId['MAINNET']])
  const bhvContract = useTokenContract(bhv.address[ChainId['MAINNET']])
  const { path } = useRouteMatch()
  const isPools2 = useMemo(() => {
    return path === '/pools2'
  }, [path])
  const updateApy = useCallback(
    async ({ perBlock, weight, totalWeight, cakePriceUsd, tvl, tokenAPrice, tokenBPrice, isPools2 }) => {
      if (!isPools2) {
        let apy = getBalanceAmount(perBlock.toString())
          .times(new BigNumber(weight).div(totalWeight))
          .times(new BigNumber(24).times(3600).times(73))
          .times(cakePriceUsd)
          .div(tvl)
          .times(100)
        setApy(apy)
      } else {
        let apy = getBalanceAmount(perBlock.toString())
          .times(new BigNumber(0.9).times(tokenAPrice).plus(new BigNumber(0.1).times(tokenBPrice)))
          .times(new BigNumber(24).times(3600).times(73))
          .div(tvl)
          .times(100)
        setApy(apy)
      }
    },
    [setApy],
  )
  const fetchTVL = useCallback(async () => {
    try {
      const masterChefContract = getMasterchefContract()
      const pools2Contract = getPools2Contract()
      let { label } = farm

      const totalSupply = await lpContract.totalSupply()

      if (!isPools2) {
        const { allocPoint } = await masterChefContract.poolInfo(farm.pid)
        let totalWeight = await masterChefContract.totalAllocPoint()
        const weight = allocPoint.toNumber()
        totalWeight = totalWeight.toNumber()
        let perBlock = await masterChefContract.cakePerBlock()
        if (label.includes('-')) {
          const stakeTotalSupply = await lpContract.balanceOf(masterChefContract.address)
          if (label.includes('USDT')) {
            //带usdt的
            const usdtBalance = await usdtContract.balanceOf(lpAddresses)
            let tvl = getBalanceAmount(stakeTotalSupply.toString())
              .div(getBalanceAmount(totalSupply.toString()))
              .times(getBalanceAmount(usdtBalance.toString()).times(2))
            setTvl(tvl)
            updateApy({ perBlock, weight, totalWeight, cakePriceUsd, tvl, isPools2 })
          } else {
            //bhv-的
            const bhvBalance = await bhvContract.balanceOf(lpAddresses)
            let tvl = getBalanceAmount(stakeTotalSupply.toString())
              .div(getBalanceAmount(totalSupply.toString()))
              .times(getBalanceAmount(bhvBalance.toString()).times(2).times(cakePriceUsd))
            setTvl(tvl)
            updateApy({ perBlock, weight, totalWeight, cakePriceUsd, tvl, isPools2 })
          }
        }
      } else {
        //抵押bhv挖bhv
        const tokenAContract = getBep20Contract(farm?.earnToken1?.address[ChainId['MAINNET']])
        const tokenBContract = getBep20Contract(farm?.earnToken2?.address[ChainId['MAINNET']])
        if (tokenBContract && tokenAContract) {
          const stakeTotalSupply = await lpContract.balanceOf(pools2Contract.address)
          const perBlock = await pools2Contract.rewardPerBlock()
          const lpAddress = {
            MAP: '0x646e5ce728a46b923d5dff4f7591e3468390d92b',
            BEFI: '0x6209814a9ec5a9fb9e5ff8dde6380c1b70f52607',
          }
          const tokenALPAddress = lpAddress[farm?.earnToken1.symbol]
          const tokenBLPAddress = lpAddress[farm?.earnToken2.symbol]

          const tokenABalance = await tokenAContract.balanceOf(tokenALPAddress)
          const usdtABalance = await usdtContract.balanceOf(tokenALPAddress)
          const tokenBBalance = await tokenBContract.balanceOf(tokenBLPAddress)
          const usdtBBalance = await usdtContract.balanceOf(tokenBLPAddress)
          const tokenAPrice = getBalanceAmount(usdtABalance.toString()).div(getBalanceAmount(tokenABalance.toString()))
          const tokenBPrice = getBalanceAmount(usdtBBalance.toString()).div(getBalanceAmount(tokenBBalance.toString()))
          if (label.includes('-')) {
            if (label.includes('USDT')) {
              //带usdt的
              const usdtBalance = await usdtContract.balanceOf(lpAddresses)
              let tvl = getBalanceAmount(stakeTotalSupply.toString())
                .div(getBalanceAmount(totalSupply.toString()))
                .times(getBalanceAmount(usdtBalance.toString()).times(2))
              setTvl(tvl)

              updateApy({ perBlock, tokenAPrice, tokenBPrice, tvl, isPools2 })
            }
          } else {
            let tvl = getBalanceAmount(stakeTotalSupply.toString()).times(cakePriceUsd)
            setTvl(tvl)
            updateApy({ perBlock, tokenAPrice, tokenBPrice, tvl, isPools2 })
          }
        }
      }
    } catch (error) {
      // console.log('🚀 ~ file: useFarmApy.ts ~ line 71 ~ fetchTVL ~ error', error)
    }
  }, [farm, cakePriceUsd, lpContract, usdtContract, bhvContract, isPools2])

  useEffect(() => {
    if (farm && cakePriceUsd && lpContract && usdtContract && bhvContract) {
      fetchTVL()
    }
  }, [farm, cakePriceUsd, lpContract, usdtContract, bhvContract, isPools2])
  return { tvl, apy }
}
export default useFarmApy
