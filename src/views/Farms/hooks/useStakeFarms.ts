//@ts-nocheck
import { useCallback, useMemo } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { stakeFarm } from 'utils/calls'
import { useMasterchef, usePools2 } from 'hooks/useContract'

const useStakeFarms = (pid: number) => {
  const { path } = useRouteMatch()
  const isPools2 = useMemo(() => {
    return path === '/pools2'
  }, [path])
  const masterChefContract = useMasterchef()
  const pools2Contract = usePools2()
  const handleStake = useCallback(
    async (amount: string) => {
      const contract = isPools2 ? pools2Contract : masterChefContract
      const txHash = await stakeFarm(contract, pid, amount, isPools2)
      console.info(txHash)
    },
    [masterChefContract, pools2Contract, pid],
  )

  return { onStake: handleStake }
}

export default useStakeFarms
