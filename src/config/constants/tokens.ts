import { ChainId, Token } from '@pancakeswap/sdk'

export const BHV: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xea1485E431F388aEe3dFe76F1c180cD3bF704482',
    18,
    'BHV',
    'OpenCoin Token',
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0xea1485E431F388aEe3dFe76F1c180cD3bF704482',
    18,
    'BHV',
    'OpenCoin Token',
  ),
}
//cake换成bhv
export const USDT: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x4ED112510bc3E3FF42a82F5C44a0F372b3a462d3',
    18,
    'USDT',
    'Binance USD',
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0x4ED112510bc3E3FF42a82F5C44a0F372b3a462d3',
    18,
    'USDT',
    'Binance USD',
  ),
}
  //busd换成usdt
export const WBNB = new Token(ChainId.MAINNET, '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd', 18, 'WBNB', 'Wrapped BNB')
  //wbnb换成wtre
export const USDT1 = new Token(ChainId.MAINNET, '0x4ED112510bc3E3FF42a82F5C44a0F372b3a462d3', 18, 'USDT', 'USDT')



const tokens = {
  true: {
    symbol: 'BNB',
    projectLink: 'https://www.binance.com/',
  },
  hive: {
    symbol: 'BHV',
    address: {
      97: '0xea1485E431F388aEe3dFe76F1c180cD3bF704482',
    },
    decimals: 18,
    projectLink: '/',
  },
  //cake换成bhv

  befi: {
    symbol: 'BEFI',
    address: {
      97: '0x14E6385c6106B88162d619A9bE332A2055f11661',

    },
    decimals: 18,
    projectLink: '/',
  },
  map: {
    symbol: 'MAP',
    address: {
      97: '0xf51389865ef62A60D38cF34bCF9BF973fbA82D4a',

    },
    decimals: 18,
    projectLink: '/',
  },
  bhv: {
    symbol: 'BHV',
    address: {
      97: '0xea1485E431F388aEe3dFe76F1c180cD3bF704482',

    },
    decimals: 18,
    projectLink: '/',
  },
  syrubar: {
    symbol: 'SYRUBAR',
    address: {
      97: '0x76fC4986ec05021b4aa0DAAc8346366D76CF73B2',

    },
    decimals: 18,
    projectLink: '/',
  },
  usdt: {
    symbol: 'USDT',
    address: {
      97: '0x4ED112510bc3E3FF42a82F5C44a0F372b3a462d3',

    },
    decimals: 18,
    projectLink: '/',
  },
  wbnb: {
    symbol: 'WBNB',
    address: {
      97: '0xae13d989dac2f0debff460ac112a837c89baa7cd',

    },
    decimals: 18,
    projectLink: '/',
  },

  bhv_true: {
    symbol: 'BHV-BNB',
    address: {
      97: '0x5496C381639fE3443B30A8a6B18edADdd7D4B985',

    },
    decimals: 18,
    projectLink: '/',
  },
  bhv_usdt: {
    symbol: 'BHV-USDT',
    address: {
      97: '0x2727Cb5e3176e43eC64Ddf2F7b969945427E01e0',

    },
    decimals: 18,
    projectLink: '/',
  },

}

export default tokens
