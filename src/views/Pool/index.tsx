import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Pair } from '@pancakeswap/sdk'
import { Text, Flex, CardBody, CardFooter, Button, AddIcon } from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`

export default function Pool() {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  console.log('====== Pool 页面调试 ======')
  console.log('chainId:', chainId, 'account:', account)
  console.log('追踪的代币对数量:', trackedTokenPairs.length)

  const tokenPairsWithLiquidityTokens = useMemo(
    () => {
      const result = trackedTokenPairs.map((tokens) => {
        const liquidityToken = toV2LiquidityToken(tokens)
        console.log(`\n代币对: ${tokens[0].symbol}/${tokens[1].symbol}`)
        console.log(`  Token0: ${tokens[0].address}`)
        console.log(`  Token1: ${tokens[1].address}`)
        console.log(`  计算的 LP 地址: ${liquidityToken.address}`)
        console.log(`  你钱包里的 LP: 0xCb07299347A89e2FEa26f089866F8FA8c98eCC02`)
        console.log(`  地址是否匹配:`, liquidityToken.address.toLowerCase() === '0xCb07299347A89e2FEa26f089866F8FA8c98eCC02'.toLowerCase())
        return { liquidityToken, tokens }
      })
      return result
    },
    [trackedTokenPairs],
  )

  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  console.log('\nLP token 余额检查:')
  Object.keys(v2PairsBalances).forEach(addr => {
    const balance = v2PairsBalances[addr]
    console.log(`  ${addr}: ${balance?.toSignificant(6) || '0'}`)
  })

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () => {
      const withBalances = tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) => {
        const balance = v2PairsBalances[liquidityToken.address]
        const hasBalance = balance?.greaterThan('0')
        return hasBalance
      })
      console.log('\n有余额的 LP 数量:', withBalances.length)
      return withBalances
    },
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('Connect to a wallet to view your liquidity.')}
        </Text>
      )
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }
    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
        />
      ))
    }
    return (
      <Text color="textSubtle" textAlign="center">
        {t('No liquidity found.')}
      </Text>
    )
  }

  return (
    <Page>
      <AppBody>
        <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} />
        <Body>
          {renderBody()}
          {account && !v2IsLoading && (
            <Flex flexDirection="column" alignItems="center" mt="24px">
              <Text color="textSubtle" mb="8px">
                {t("Don't see a pool you joined?")}
              </Text>
              <Button id="import-pool-link" variant="secondary" scale="sm" as={Link} to="/find">
                {t('Find other LP tokens')}
              </Button>
            </Flex>
          )}
        </Body>
        <CardFooter style={{ textAlign: 'center' }}>
          <Button id="join-pool-button" as={Link} to="/add" width="100%" startIcon={<AddIcon color="white" />}>
            {t('Add Liquidity')}
          </Button>
        </CardFooter>
      </AppBody>
    </Page>
  )
}
