//@ts-nocheck
import React, { useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { useRouteMatch } from 'react-router-dom'
import { useFarmUser } from 'state/farms/hooks'
import { useTranslation } from 'contexts/Localization'
import { Text } from '@pancakeswap/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { Token } from 'config/constants/types'
import { TokenPairImage, TokenImage } from 'components/TokenImage'

export interface FarmProps {
  label: string
  pid: number
  token: Token
  quoteToken: Token
}

const Container = styled.div`
  padding-left: 16px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
  }
`

const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
  }
`

const Farm: React.FunctionComponent<FarmProps> = ({ token, quoteToken, label, pid, earnToken1, earnToken2 }) => {

  const { path } = useRouteMatch()
  const isPools2 = useMemo(() => {
    return path === '/pools2'
  }, [path])
  const { stakedBalance } = useFarmUser(pid)
  const { t } = useTranslation()
  const rawStakedBalance = getBalanceNumber(stakedBalance)

  const handleRenderFarming = (): JSX.Element => {
    if (rawStakedBalance) {
      return (
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {isPools2 ? t('Staked') : t('Farming')}
        </Text>
      )
    }

    return null
  }
  // let subtitle = `${t('Stake')} ${stakingTokenSymbol}`
  let subtitle = !isPools2
    ? `${t('Earn')} BHV ${t('Stake').toLocaleLowerCase()} BHV`
    : `${t('Earn')} ${earnToken1?.symbol}+${earnToken2?.symbol} ${t('Stake').toLocaleLowerCase()} ${label}`

  return (
    <Container>
      <TokenWrapper>
        {!label.includes('-') ? (
          <TokenImage token={token} width={40} height={40} />
        ) : (
          <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={40} height={40} />
        )}
      </TokenWrapper>
      <div>
        {handleRenderFarming()}
        <Text bold>{label}</Text>
        <Text fontSize="12px" color="textSubtle">
          {subtitle}
        </Text>
      </div>
    </Container>
  )
}

export default Farm
