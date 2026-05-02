import { ChainId } from '@pancakeswap/sdk'
import { TokenList } from '@uniswap/token-lists'
import mainnetTokenList from './opencoin-bsc-mainnet.tokenlist.json'
import testnetTokenList from './opencoin-bsc-testnet.tokenlist.json'

const chainId = Number(process.env.REACT_APP_CHAIN_ID || ChainId.TESTNET)

const defaultTokenList = chainId === ChainId.MAINNET ? mainnetTokenList : testnetTokenList

export default defaultTokenList as TokenList
