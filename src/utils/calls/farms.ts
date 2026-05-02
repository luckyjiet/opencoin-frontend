//@ts-nocheck
import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const stakeFarm = async (contract, pid, amount, isPools2) => {
  const gasPrice = getGasPrice()
  console.log("🚀 ~ file: farms.ts ~ line 12 ~ stakeFarm ~ gasPrice", gasPrice)
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  if (isPools2) {
    var tx = await contract.deposit(pid, value, { ...options, gasPrice })
  } else {
    if (pid === 0) {
      var tx = await contract.enterStaking(value, { ...options, gasPrice })
    } else {
      var tx = await contract.deposit(pid, value, { ...options, gasPrice })
    }
  }
  const receipt = await tx.wait()
  return receipt.status
}

export const unstakeFarm = async (contract, pid, amount, isPools2) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  if (isPools2) {
    var tx = await contract.withdraw(pid, value, { ...options, gasPrice })
  } else {
    if (pid === 0) {
      var tx = await contract.leaveStaking(value, { ...options, gasPrice })
    } else {
      var tx = await contract.withdraw(pid, value, { ...options, gasPrice })
    }
  }
  const receipt = await tx.wait()
  return receipt.status
}

export const harvestFarm = async (contract, pid, isPools2) => {
  const gasPrice = getGasPrice()
  console.log("🚀 ~ file: farms.ts ~ line 44 ~ harvestFarm ~ gasPrice", gasPrice)
  if (isPools2) {
    var tx = await contract.deposit(pid, '0', { ...options, gasPrice })
  } else {
    if (pid === 0) {
      var tx = await contract.enterStaking('0', { ...options, gasPrice })
    } else {
      var tx = await contract.deposit(pid, '0', { ...options, gasPrice })
    }
  }
  const receipt = await tx.wait()
  return receipt.status
}
