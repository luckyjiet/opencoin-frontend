//@ts-nocheck
import React from 'react'
import styled from 'styled-components'
import { Flex, TooltipText, IconButton, useModal, CalculateIcon, Skeleton, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { Pool } from 'state/types'

import BigNumber from 'bignumber.js'

const ApyLabelContainer = styled(Flex)`
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
`

interface AprRowProps {
  pool: Pool
  stakedBalance: BigNumber
  performanceFee?: number
}

const AprRow: React.FC<AprRowProps> = ({ apy }) => {
  const { t } = useTranslation()
  const tooltipContent = t('This pool’s rewards aren’t compounded automatically, so we show APR')

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })

  // const { stakingToken, earningToken, isFinished, apr, earningTokenPrice, stakingTokenPrice, userData, isAutoVault } =
  //   pool

  // const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  // const apyModalLink = stakingToken.address ? `/#/swap?outputCurrency=${getAddress(stakingToken.address)}` : '/swap'

  // const [onPresentApyModal] = useModal(
  //   <RoiCalculatorModal
  //     earningTokenPrice={earningTokenPrice}
  //     stakingTokenPrice={stakingTokenPrice}
  //     apr={apr}
  //     linkLabel={t('Get %symbol%', { symbol: stakingToken.symbol })}
  //     linkHref={apyModalLink}
  //     stakingTokenBalance={stakedBalance.plus(stakingTokenBalance)}
  //     stakingTokenSymbol={stakingToken.symbol}
  //     earningTokenSymbol={earningToken.symbol}
  //     autoCompoundFrequency={autoCompoundFrequency}
  //     performanceFee={performanceFee}
  //   />,
  // )
  // onClick={onPresentApyModal}
  // onClick={onPresentApyModal}
  // <IconButton variant="text" scale="sm">
  //   <CalculateIcon color="textSubtle" width="18px" />
  // </IconButton>

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef}>{`${t('APY')}:`}</TooltipText>
      {!apy.isFinite() ? (
        <Skeleton width="82px" height="32px" />
      ) : (
        <ApyLabelContainer alignItems="center">
          <Balance fontSize="16px" value={apy.toNumber()} decimals={2} unit="%" />
        </ApyLabelContainer>
      )}
    </Flex>
  )
}

export default AprRow
