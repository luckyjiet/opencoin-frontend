import { ChainId, Token } from '@pancakeswap/sdk'
import { parseUnits } from 'ethers/lib/utils'
import { SerializedToken } from '../actions'

export function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
  }
}

export function deserializeToken(serializedToken: SerializedToken): Token {
  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name,
  )
}

export type GasPriceSpeed = 'default' | 'fast' | 'instant'
export type GasPriceOptions = Record<GasPriceSpeed, string>
type GasPriceEnv = Record<string, string | undefined>

const DEFAULT_BSC_GAS_PRICE: GasPriceOptions = {
  default: '0.1',
  fast: '0.2',
  instant: '0.3',
}

const GAS_PRICE_OPTIONS_BY_CHAIN: Record<number, GasPriceOptions> = {
  [ChainId.MAINNET]: DEFAULT_BSC_GAS_PRICE,
  [ChainId.TESTNET]: DEFAULT_BSC_GAS_PRICE,
}

const GAS_PRICE_ENV_KEYS: Record<GasPriceSpeed, string> = {
  default: 'REACT_APP_GAS_PRICE_STANDARD_GWEI',
  fast: 'REACT_APP_GAS_PRICE_FAST_GWEI',
  instant: 'REACT_APP_GAS_PRICE_INSTANT_GWEI',
}

const toChainId = (chainId?: number | string): number => {
  const parsed = Number(chainId || process.env.REACT_APP_CHAIN_ID || ChainId.MAINNET)
  return GAS_PRICE_OPTIONS_BY_CHAIN[parsed] ? parsed : ChainId.MAINNET
}

const isPositiveGwei = (value?: string): value is string => {
  if (!value) {
    return false
  }
  return /^\d+(\.\d+)?$/.test(value.trim()) && Number(value) > 0
}

export const getGasPriceOptions = (chainId?: number | string, env: GasPriceEnv = process.env): GasPriceOptions => {
  const defaults = GAS_PRICE_OPTIONS_BY_CHAIN[toChainId(chainId)]

  return {
    default: isPositiveGwei(env[GAS_PRICE_ENV_KEYS.default]) ? env[GAS_PRICE_ENV_KEYS.default].trim() : defaults.default,
    fast: isPositiveGwei(env[GAS_PRICE_ENV_KEYS.fast]) ? env[GAS_PRICE_ENV_KEYS.fast].trim() : defaults.fast,
    instant: isPositiveGwei(env[GAS_PRICE_ENV_KEYS.instant]) ? env[GAS_PRICE_ENV_KEYS.instant].trim() : defaults.instant,
  }
}

export const getGasPriceWeiOptions = (chainId?: number | string, env: GasPriceEnv = process.env) => {
  const options = getGasPriceOptions(chainId, env)

  return {
    default: parseUnits(options.default, 'gwei').toString(),
    fast: parseUnits(options.fast, 'gwei').toString(),
    instant: parseUnits(options.instant, 'gwei').toString(),
  }
}

export const getDefaultGasPrice = (chainId?: number | string, env: GasPriceEnv = process.env): string =>
  getGasPriceWeiOptions(chainId, env).default

export const resolveGasPrice = (
  chainId?: number | string,
  userGasPrice?: string,
  env: GasPriceEnv = process.env,
): string => {
  const gasPriceOptions = getGasPriceWeiOptions(chainId, env)
  return userGasPrice && Object.values(gasPriceOptions).includes(userGasPrice) ? userGasPrice : gasPriceOptions.default
}

export const GAS_PRICE = getGasPriceOptions()

export const GAS_PRICE_GWEI = getGasPriceWeiOptions()
