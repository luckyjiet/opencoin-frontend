//@ts-nocheck
import tokens from './tokens'

const allFarms = [
  {
    pid: 0,
    lpSymbol: 'BHV',
    lpAddresses: {
      97: '0xea1485E431F388aEe3dFe76F1c180cD3bF704482',
    },
    token: tokens.bhv,
    quoteToken: tokens.bhv,
    multiplier: '1X',
  },
  {
    pid: 1,
    lpSymbol: 'BHV-BNB LP',
    lpAddresses: {
      97: '0x5496C381639fE3443B30A8a6B18edADdd7D4B985',
    },
    token: tokens.bhv,
    quoteToken: tokens.wbnb,
    multiplier: '2X',
  },
  {
    pid: 2,
    lpSymbol: 'BHV-USDT LP',
    lpAddresses: {
      97: '0x2727Cb5e3176e43eC64Ddf2F7b969945427E01e0',
    },
    token: tokens.bhv,
    quoteToken: tokens.usdt,
    multiplier: '3X',
  },

]

export default allFarms
