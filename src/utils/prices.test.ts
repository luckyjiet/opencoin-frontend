import { ChainId, Pair, Route, Token, TokenAmount, Trade, TradeType } from '@pancakeswap/sdk'
import { computeTradePriceBreakdown } from './prices'

describe('computeTradePriceBreakdown', () => {
  it('reports the Uniswap V2 0.30% liquidity provider fee for a single-hop trade', () => {
    const tokenA = new Token(ChainId.TESTNET, '0x0000000000000000000000000000000000000001', 18, 'A', 'Token A')
    const tokenB = new Token(ChainId.TESTNET, '0x0000000000000000000000000000000000000002', 18, 'B', 'Token B')
    const pair = new Pair(
      new TokenAmount(tokenA, '1000000000000000000000'),
      new TokenAmount(tokenB, '1000000000000000000000'),
    )
    const trade = new Trade(
      new Route([pair], tokenA, tokenB),
      new TokenAmount(tokenA, '100000000000000000000'),
      TradeType.EXACT_INPUT,
    )

    const { realizedLPFee } = computeTradePriceBreakdown(trade)

    expect(realizedLPFee?.raw.toString()).toBe('300000000000000000')
  })
})
