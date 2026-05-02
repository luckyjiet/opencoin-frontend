//@ts-nocheck
import { ChainId } from '@pancakeswap/sdk'
import addresses from 'config/constants/contracts'
import tokens from 'config/constants/tokens'
import { Address } from 'config/constants/types'

export const getAddress = (address: Address): string => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  return address && address[chainId] ? address[chainId] : address[ChainId.MAINNET]
}

export const getCakeAddress = () => {
  return getAddress(tokens.hive.address)
}
export const getMasterChefAddress = () => {
  return getAddress(addresses.masterChef)
}
export const getPools2Address = () => {
  return getAddress(addresses.pools2)
}
export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall)
}
export const getWbnbAddress = () => {
  return getAddress(tokens.wbnb.address)
}


export const getCakeVaultAddress = () => {
  return getAddress(addresses.cakeVault)
}
