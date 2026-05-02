//@ts-nocheck
import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'
import Apr from '../Apr'

interface AprCellProps {
  pool: Pool
  stakedBalance: BigNumber
  performanceFee: number
}

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0 0 120px;
  }
`

const AprCell: React.FC<AprCellProps> = ({ apy, }) => {
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('APY')}
        </Text>
        <Apr apy={apy} />
      </CellContent>
    </StyledCell>
  )
}

export default AprCell
