//@ts-nocheck
import tokens from './tokens'

const pools2 = [
  {
    pid: 0,
    lpSymbol: 'BHV-BHV LP',
    lpAddresses: {
      97: '0xE797C574973Cbb4FC9aF15eC0163bBc5B2C684c0',
    },
    token: tokens.bhv,
    quoteToken: tokens.bhv,
    
    earnToken1: tokens.map,
    earnToken2: tokens.befi,
    multiplier: '1X',
  },
  {
    pid: 1,
    lpSymbol: 'BHV LP',
    lpAddresses: {
      97: '0x33A04C59b599cfdF789E354e024850315225feE9',
    },
    token: tokens.bhv,
    quoteToken: tokens.bhv,
    earnToken1: tokens.map,
    earnToken2: tokens.befi,
    multiplier: '2X',
  },

]

export default pools2
