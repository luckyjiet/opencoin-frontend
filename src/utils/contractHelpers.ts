import { ethers } from 'ethers'
import { simpleRpcProvider } from 'utils/providers'
import { poolsConfig } from 'config/constants'

// Addresses
import {
  getAddress,
  getCakeAddress,
  getMasterChefAddress,
  getPools2Address,
  getCakeVaultAddress,
  getMulticallAddress,
} from 'utils/addressHelpers'

// ABI

import bep20Abi from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import cakeAbi from 'config/abi/cake.json'

import masterChef from 'config/abi/masterchef.json'
import pools2 from 'config/abi/pools2.json'
import sousChef from 'config/abi/sousChef.json'

import cakeVaultAbi from 'config/abi/cakeVault.json'

import MultiCallAbi from 'config/abi/Multicall.json'

const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider
  return new ethers.Contract(address, abi, signerOrProvider)
}

export const getBep20Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bep20Abi, address, signer)
}
export const getErc721Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(erc721Abi, address, signer)
}
export const getLpContract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(lpTokenAbi, address, signer)
}

export const getSouschefContract = (id: number, signer?: ethers.Signer | ethers.providers.Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  return getContract(sousChef, getAddress(config.contractAddress), signer)
}

export const getCakeContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(cakeAbi, getCakeAddress(), signer)
}

export const getMasterchefContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(masterChef, getMasterChefAddress(), signer)
}

export const getPools2Contract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(pools2, getPools2Address(), signer)
}

export const getCakeVaultContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(cakeVaultAbi, getCakeVaultAddress(), signer)
}

export const getMulticallContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MultiCallAbi, getMulticallAddress(), signer)
}
