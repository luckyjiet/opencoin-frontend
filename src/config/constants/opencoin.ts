import { ChainId } from '@pancakeswap/sdk'

const BSC_TESTNET_DEFAULTS = {
  routerAddress: '0x036f2081ac476492FdF4b94877a608E72bf4826E',
  factoryAddress: '0xeF7290f5dC0E6752724d3605875d59AF5a2eE55c',
  initCodeHash: '0x8abce0937a764fb0abfbec65b1c0c46365417c964627f24f8ef3c59bc1571f5a',
  wbnbAddress: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
}

const BSC_MAINNET_DEFAULTS = {
  wbnbAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
}

export const OPENCOIN_CHAIN_ID = Number(process.env.REACT_APP_CHAIN_ID || ChainId.TESTNET)

function getConfiguredValue(name: string, fallback = ''): string {
  const value = process.env[name] || fallback

  if (!value) {
    throw new Error(`Missing required OpenCoin environment variable: ${name}`)
  }

  return value
}

const isBscTestnet = OPENCOIN_CHAIN_ID === ChainId.TESTNET

export const OPENCOIN_ROUTER_ADDRESS = getConfiguredValue(
  'REACT_APP_ROUTER_ADDRESS',
  isBscTestnet ? BSC_TESTNET_DEFAULTS.routerAddress : '',
)

export const OPENCOIN_FACTORY_ADDRESS = getConfiguredValue(
  'REACT_APP_FACTORY_ADDRESS',
  isBscTestnet ? BSC_TESTNET_DEFAULTS.factoryAddress : '',
)

export const OPENCOIN_INIT_CODE_HASH = getConfiguredValue(
  'REACT_APP_INIT_CODE_HASH',
  isBscTestnet ? BSC_TESTNET_DEFAULTS.initCodeHash : '',
)

export const OPENCOIN_WBNB_ADDRESS = getConfiguredValue(
  'REACT_APP_WBNB_ADDRESS',
  isBscTestnet ? BSC_TESTNET_DEFAULTS.wbnbAddress : BSC_MAINNET_DEFAULTS.wbnbAddress,
)
