//@ts-nocheck
import React, { useState, useMemo, useCallback } from 'react'
import { Button, Heading, Skeleton, Text } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import Balance from 'components/Balance'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { usePriceCakeBusd } from 'state/farms/hooks'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
import useHarvestFarm from '../../../hooks/useHarvestFarm'
import { useRouteMatch } from 'react-router-dom'
import { ActionContainer, ActionTitles, ActionContent } from './styles'

interface HarvestActionProps extends FarmWithStakedValue {
  userDataReady: boolean
}

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({
  pid,
  userData,
  userDataReady,
  earnToken1,
  earnToken2,
}) => {
  const { toastSuccess, toastError } = useToast()
  const { path } = useRouteMatch()
  const cakePrice = usePriceCakeBusd()

  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvestFarm(pid)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()

  const isPools2 = useMemo(() => {
    return path === '/pools2'
  }, [path])

  const getEarningNumber = useCallback(
    (key) => {
      let earnings = BIG_ZERO
      let earningsBusd = 0
      const number = key === 'earnings' ? userData[key] : userData.earnings[key]

      const earningsBigNumber = new BigNumber(number)
      let displayBalance = userDataReady ? earnings.toLocaleString() : <Skeleton width={60} />

      // If user didn't connect wallet default balance will be 0
      if (!earningsBigNumber.isZero()) {
        earnings = getBalanceAmount(earningsBigNumber)
        earningsBusd = earnings.multipliedBy(cakePrice).toNumber()
        displayBalance = earnings.toFixed(3, BigNumber.ROUND_DOWN)
      }
      return { earnings, earningsBusd, displayBalance }
    },
    [userData,userDataReady],
  )

  const { earnings, earningsBusd, displayBalance } = getEarningNumber('earnings')
  const { earnings: earnings1, displayBalance: displayBalanceEarnings1 } = getEarningNumber('earnings1')
  const { earnings: earnings2, displayBalance: displayBalanceEarnings2 } = getEarningNumber('earnings2')

  return (
    <ActionContainer>
      <ActionContent>
        <div>
          {isPools2 ? (
            <>
              <div>
                <ActionTitles>
                  <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
                    {earnToken1?.symbol}
                  </Text>
                  <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                    {t('Earned')}
                  </Text>
                </ActionTitles>
                <div>
                  <Heading>{displayBalanceEarnings1}</Heading>
                </div>
              </div>
              <div>
                <div className="space-white-lg"></div>
                <ActionTitles>
                  <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
                    {earnToken2?.symbol}
                  </Text>
                  <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                    {t('Earned')}
                  </Text>
                </ActionTitles>
                <div>
                  <Heading>{displayBalanceEarnings2}</Heading>
                </div>
              </div>
            </>
          ) : (
            <div>
              <ActionTitles>
                <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
                  BHV
                </Text>
                <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                  {t('Earned')}
                </Text>
              </ActionTitles>
              <div>
                <Heading>{displayBalance}</Heading>
                {/* {earningsBusd > 0 && (
                  <Balance
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    value={earningsBusd}
                    unit=" USD"
                    prefix="~"
                  />
                )} */}
              </div>
            </div>
          )}
        </div>

        <Button
          disabled={(isPools2 ? earnings1.eq(0) && earnings2.eq(0) : earnings.eq(0)) || pendingTx || !userDataReady}
          onClick={async () => {
            setPendingTx(true)
            try {
              await onReward()
              toastSuccess(
                `${t('Harvested')}!`,
                t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'BHV' }),
              )
            } catch (e) {
              toastError(
                t('Error'),
                t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
              )
              console.error(e)
            } finally {
              setPendingTx(false)
            }
            dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
          }}
          ml="4px"
        >
          {t('Harvest')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
