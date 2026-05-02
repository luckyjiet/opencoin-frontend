//@ts-nocheck
import { useCallback, useMemo } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { ethers, Contract } from 'ethers'
import { useMasterchef, usePools2 } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

const useApproveFarm = (lpContract: Contract) => {
  const { path } = useRouteMatch()
  const isPools2 = useMemo(() => {
    return path === '/pools2'
  }, [path])
  const masterChefContract = useMasterchef()
  const pools2Contract = usePools2()
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    const contract = isPools2 ? pools2Contract : masterChefContract
    try {
      const tx = await callWithGasPrice(lpContract, 'approve', [contract.address, ethers.constants.MaxUint256])
      const receipt = await tx.wait()
      return receipt.status
    } catch (e) {
      console.log("🚀 ~ file: useApproveFarm.ts ~ line 9 ~ useApproveFarm ~ lpContract", lpContract,contract.address,e)
      return false
      
    }
  }, [lpContract, masterChefContract, pools2Contract, callWithGasPrice, isPools2])

  return { onApprove: handleApprove }
}

export default useApproveFarm
