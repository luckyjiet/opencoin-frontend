//@ts-nocheck
import { useCallback, useMemo } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { harvestFarm } from 'utils/calls'
import { useMasterchef, usePools2 } from 'hooks/useContract'

const useHarvestFarm = (farmPid: number) => {
  const { path } = useRouteMatch()
  const isPools2 = useMemo(() => {
    return path === '/pools2'
  }, [path])
  const masterChefContract = useMasterchef()
  const pools2Contract = usePools2()

  const handleHarvest = useCallback(async () => {
    const contract = isPools2 ? pools2Contract : masterChefContract
    await harvestFarm(contract, farmPid, isPools2)
  }, [farmPid, masterChefContract, pools2Contract])

  return { onReward: handleHarvest }
}

export default useHarvestFarm
