//@ts-nocheck
import React, { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import { useRouteMatch } from 'react-router-dom'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import useFarmApy from '../../hooks/useFarmApy'
import { useFarmUser } from 'state/farms/hooks'

import Apr from './Apr'
import Farm, { FarmProps } from './Farm'
import Earned, { EarnedProps } from './Earned'
import Details from './Details'
import Multiplier, { MultiplierProps } from './Multiplier'
import Liquidity, { LiquidityProps } from './Liquidity'
import ActionPanel from './Actions/ActionPanel'
import CellLayout from './CellLayout'
import { DesktopColumnSchema, MobileColumnSchema } from '../types'

export interface RowProps {
  farm: FarmProps
  earned: EarnedProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  details: FarmWithStakedValue
}

interface RowPropsWithLoading extends RowProps {
  userDataReady: boolean
}

const cells = {
  apr: Apr,
  farm: Farm,
  earned: Earned,
  details: Details,
  multiplier: Multiplier,
  liquidity: Liquidity,
}

const CellInner = styled.div`
  padding: 24px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 8px;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-right: 32px;
  }
`

const StyledTr = styled.tr`
  cursor: pointer;
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
`

const EarnedMobileCell = styled.td`
  padding: 16px 0 24px 16px;
`

const AprMobileCell = styled.td`
  padding-top: 16px;
  padding-bottom: 24px;
`

const FarmMobileCell = styled.td`
  padding-top: 24px;
`

const Row: React.FunctionComponent<RowPropsWithLoading> = (props) => {
  const { path } = useRouteMatch()
  const { details, userDataReady } = props
  const hasStakedAmount = !!useFarmUser(details.pid).stakedBalance.toNumber()
  const [actionPanelExpanded, setActionPanelExpanded] = useState(hasStakedAmount)
  const shouldRenderChild = useDelayedUnmount(actionPanelExpanded, 300)
  const { t } = useTranslation()
  const { tvl, apy } = useFarmApy(props.farm, props.lpAddresses)

  const toggleActionPanel = () => {
    setActionPanelExpanded(!actionPanelExpanded)
  }

  useEffect(() => {
    setActionPanelExpanded(hasStakedAmount)
  }, [hasStakedAmount])

  const { isXl, isXs } = useMatchBreakpoints()

  const isMobile = !isXl
  const tableSchema = isMobile ? MobileColumnSchema : DesktopColumnSchema
  const columnNames = tableSchema.map((column) => column.name)
  const isPools2 = useMemo(() => {
    return path === '/pools2'
  }, [path])
  const handleRenderRow = () => {
    if (!isXs) {
      return (
        <StyledTr onClick={toggleActionPanel}>
          {Object.keys(props).map((key) => {
            const columnIndex = columnNames.indexOf(key)
            if (columnIndex === -1) {
              return null
            }

            switch (key) {
              case 'details':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout>
                        <Details actionPanelToggled={actionPanelExpanded} />
                      </CellLayout>
                    </CellInner>
                  </td>
                )
              case 'apr':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t('APR')}>
                        <Apr apy={apy} hideButton={isMobile} />
                      </CellLayout>
                    </CellInner>
                  </td>
                )

              case 'liquidity':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t('Liquidity')}>
                        <Liquidity liquidity={tvl} />
                      </CellLayout>
                    </CellInner>
                  </td>
                )

              case 'earned':
                return (
                  <React.Fragment key={key}>
                    {isPools2 ? (
                      <React.Fragment>
                        <td>
                          <CellInner>
                            <CellLayout label={`${props.farm?.earnToken1?.symbol}   ${t('Earned')}`}>
                              <Earned earned={props.earnings1} userDataReady={userDataReady} />
                            </CellLayout>
                          </CellInner>
                        </td>
                        <td>
                          <CellInner>
                            <CellLayout label={`${props.farm?.earnToken2?.symbol}   ${t('Earned')}`}>
                              <Earned earned={props.earnings2} userDataReady={userDataReady} />
                            </CellLayout>
                          </CellInner>
                        </td>
                      </React.Fragment>
                    ) : (
                      <td>
                        <CellInner>
                          <CellLayout label={t('Earned')}>
                            <Earned earned={props.earned.earnings} userDataReady={userDataReady} />
                          </CellLayout>
                        </CellInner>
                      </td>
                    )}
                  </React.Fragment>
                )
              default:
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t(tableSchema[columnIndex].label)}>
                        {React.createElement(cells[key], { ...props[key], userDataReady })}
                      </CellLayout>
                    </CellInner>
                  </td>
                )
            }
          })}
        </StyledTr>
      )
    }

    return (
      <StyledTr onClick={toggleActionPanel}>
        <td>
          <tr>
            <FarmMobileCell>
              <CellLayout>
                <Farm {...props.farm} />
              </CellLayout>
            </FarmMobileCell>
          </tr>
          <tr>
            <EarnedMobileCell>
              <CellLayout label={t('Earned')}>
                <Earned earned={props.earned} userDataReady={userDataReady} />
              </CellLayout>
            </EarnedMobileCell>
            <AprMobileCell>
              <CellLayout label={t('APR')}>
                <Apr apy={apy} hideButton />
              </CellLayout>
            </AprMobileCell>
          </tr>
        </td>
        <td>
          <CellInner>
            <CellLayout>
              <Details actionPanelToggled={actionPanelExpanded} />
            </CellLayout>
          </CellInner>
        </td>
      </StyledTr>
    )
  }

  return (
    <>
      {handleRenderRow()}
      {shouldRenderChild && (
        <tr>
          <td colSpan={10}>
            <ActionPanel {...props} tvl={tvl} apy={apy} expanded={actionPanelExpanded} />
          </td>
        </tr>
      )}
    </>
  )
}

export default Row
