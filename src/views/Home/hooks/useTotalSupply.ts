//@ts-nocheck
import { BigNumber } from '@ethersproject/bignumber'
import { Token, TokenAmount } from '@pancakeswap/sdk'
import { useTokenContract } from 'hooks/useContract'
import { useSingleCallResult } from 'state/multicall/hooks'
import { getFullDisplayBalance } from 'utils/formatBalance'
// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
function useTotalSupply(address) {
  const contract = useTokenContract(address, false)

  const totalSupply = useSingleCallResult(contract, 'totalSupply')?.result?.[0]

  return totalSupply
}

export default useTotalSupply
