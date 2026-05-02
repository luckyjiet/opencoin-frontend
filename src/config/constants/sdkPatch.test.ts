const DEFAULT_ENV = {
  factoryAddress: '0xeF7290f5dC0E6752724d3605875d59AF5a2eE55c',
  initCodeHash: '0x8abce0937a764fb0abfbec65b1c0c46365417c964627f24f8ef3c59bc1571f5a',
  wbnbAddress: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
}

function loadSdk() {
  jest.resetModules()
  return require('@pancakeswap/sdk')
}

afterEach(() => {
  process.env.REACT_APP_FACTORY_ADDRESS = DEFAULT_ENV.factoryAddress
  process.env.REACT_APP_INIT_CODE_HASH = DEFAULT_ENV.initCodeHash
  process.env.REACT_APP_WBNB_ADDRESS = DEFAULT_ENV.wbnbAddress
  jest.resetModules()
})

describe('patched swap SDK constants', () => {
  it('uses OpenCoin factory and init code hash', () => {
    const { FACTORY_ADDRESS, INIT_CODE_HASH } = loadSdk()

    expect(FACTORY_ADDRESS).toBe(DEFAULT_ENV.factoryAddress)
    expect(INIT_CODE_HASH).toBe(DEFAULT_ENV.initCodeHash)
  })

  it('uses the BSC testnet wrapped native token', () => {
    const { ChainId, WETH } = loadSdk()

    expect(WETH[ChainId.TESTNET].address).toBe(DEFAULT_ENV.wbnbAddress)
  })

  it('calculates OpenCoin pair addresses from the patched factory', () => {
    const { ChainId, Pair, Token } = loadSdk()
    const tokenA = new Token(ChainId.TESTNET, '0x0000000000000000000000000000000000000001', 18, 'A', 'Token A')
    const tokenB = new Token(ChainId.TESTNET, '0x0000000000000000000000000000000000000002', 18, 'B', 'Token B')

    expect(Pair.getAddress(tokenA, tokenB)).toBe('0xBF9F7b68f9dBAC7A25D1F8C2Cb21e343620eBeC9')
  })

  it('uses OpenCoin LP token metadata', () => {
    const { ChainId, Pair, Token, TokenAmount } = loadSdk()
    const tokenA = new Token(ChainId.TESTNET, '0x0000000000000000000000000000000000000001', 18, 'A', 'Token A')
    const tokenB = new Token(ChainId.TESTNET, '0x0000000000000000000000000000000000000002', 18, 'B', 'Token B')
    const pair = new Pair(new TokenAmount(tokenA, '1000'), new TokenAmount(tokenB, '1000'))

    expect(pair.liquidityToken.symbol).toBe('OpenCoin-LP')
    expect(pair.liquidityToken.name).toBe('OpenCoin LPs')
  })

  it('quotes swaps with the Uniswap V2 0.30% fee', () => {
    const { ChainId, Pair, Token, TokenAmount } = loadSdk()
    const tokenA = new Token(ChainId.TESTNET, '0x0000000000000000000000000000000000000001', 18, 'A', 'Token A')
    const tokenB = new Token(ChainId.TESTNET, '0x0000000000000000000000000000000000000002', 18, 'B', 'Token B')
    const pair = new Pair(new TokenAmount(tokenA, '1000000'), new TokenAmount(tokenB, '1000000'))

    const [outputAmount] = pair.getOutputAmount(new TokenAmount(tokenA, '10000'))

    expect(outputAmount.raw.toString()).toBe('9871')
  })

  it('allows protocol constants to be overridden by deployment env vars', () => {
    process.env.REACT_APP_FACTORY_ADDRESS = '0x0000000000000000000000000000000000000003'
    process.env.REACT_APP_INIT_CODE_HASH = '0x1111111111111111111111111111111111111111111111111111111111111111'
    process.env.REACT_APP_WBNB_ADDRESS = '0x0000000000000000000000000000000000000004'

    const { ChainId, FACTORY_ADDRESS, INIT_CODE_HASH, WETH } = loadSdk()

    expect(FACTORY_ADDRESS).toBe('0x0000000000000000000000000000000000000003')
    expect(INIT_CODE_HASH).toBe('0x1111111111111111111111111111111111111111111111111111111111111111')
    expect(WETH[ChainId.TESTNET].address).toBe('0x0000000000000000000000000000000000000004')
    expect(WETH[ChainId.MAINNET].address).toBe('0x0000000000000000000000000000000000000004')
  })
})
