//@ts-nocheck
import { useCallback, useMemo } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { unstakeFarm } from 'utils/calls'
import { useMasterchef, usePools2 } from 'hooks/useContract'
const useUnstakeFarms = (pid: number) => {
  const { path } = useRouteMatch()
  const isPools2 = useMemo(() => {
    return path === '/pools2'
  }, [path])
  const masterChefContract = useMasterchef()
  const pools2Contract = usePools2()
  const handleUnstake = useCallback(
    async (amount: string) => {
      const contract = isPools2 ? pools2Contract : masterChefContract
      
      await unstakeFarm(contract, pid, amount,isPools2)
    },
    [masterChefContract, pools2Contract, pid],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeFarms
