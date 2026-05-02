import store from 'state'
import { resolveGasPrice } from 'state/user/hooks/helpers'

/**
 * Function to return gasPrice outwith a react component
 */
const getGasPrice = (): string => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  const state = store.getState()
  return resolveGasPrice(chainId, state.user.gasPrice)
}

export default getGasPrice
