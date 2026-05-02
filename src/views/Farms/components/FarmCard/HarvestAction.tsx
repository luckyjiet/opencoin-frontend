//@ts-nocheck
import React, { useState, useMemo, useCallback } from 'react'
import { useRouteMatch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import useToast from 'hooks/useToast'
import { getBalanceAmount } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { useWeb3React } from '@web3-react/core'
import { usePriceCakeBusd } from 'state/farms/hooks'
import Balance from 'components/Balance'
import Spacer from 'components/Spacer'
import useHarvestFarm from '../../hooks/useHarvestFarm'

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
}

const HarvestAction: React.FC<FarmCardActionsProps> = ({ farm, userData, pid }) => {
  const { path } = useRouteMatch()
  const isPools2 = useMemo(() => {
    return path === '/pools2'
  }, [path])
  const { account } = useWeb3React()
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvestFarm(pid)
  const cakePrice = usePriceCakeBusd()
  const dispatch = useAppDispatch()

  const getEarningNumber = useCallback(
    (key) => {
      let earnings = BIG_ZERO
      let earningsBusd = 0
      const number = key === 'earnings' ? userData[key] : userData.earnings[key]

      const earningsBigNumber = new BigNumber(number)
      // let displayBalance = userDataReady ? earnings.toLocaleString() : <Skeleton width={60} />
      let displayBalance = earnings.toLocaleString()

      // If user didn't connect wallet default balance will be 0
      if (!earningsBigNumber.isZero()) {
        earnings = getBalanceAmount(earningsBigNumber)
        earningsBusd = earnings.multipliedBy(cakePrice).toNumber()
        displayBalance = earnings.toFixed(3, BigNumber.ROUND_DOWN)
      }
      return { earnings, earningsBusd, displayBalance }
    },
    [userData],
  )

  const { earnings, earningsBusd, displayBalance } = getEarningNumber('earnings')
  const { earnings: earnings1, displayBalance: displayBalanceEarnings1 } = getEarningNumber('earnings1')
  const { earnings: earnings2, displayBalance: displayBalanceEarnings2 } = getEarningNumber('earnings2')

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center">
      <div>
        {isPools2 ? (
          <>
            {' '}
            <div>
              <Flex>
                <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
                  {farm.earnToken1?.symbol}
                </Text>
                <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                  {t('Earned')}
                </Text>
              </Flex>
              <Flex flexDirection="column" alignItems="flex-start">
                <Heading color={earnings1.eq(0) ? 'textDisabled' : 'text'}>{displayBalanceEarnings1}</Heading>
              </Flex>
            </div>
            <div>
              <Spacer />
              <Flex>
                <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
                  {farm.earnToken2?.symbol}
                </Text>
                <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                  {t('Earned')}
                </Text>
              </Flex>
              <Flex flexDirection="column" alignItems="flex-start">
                <Heading color={earnings2.eq(0) ? 'textDisabled' : 'text'}>{displayBalanceEarnings2}</Heading>
              </Flex>
            </div>
          </>
        ) : (
          <>
            <div>
              <Spacer />
              <Flex>
                <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
                  BHV
                </Text>
                <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                  {t('Earned')}
                </Text>
              </Flex>
              <Flex flexDirection="column" alignItems="flex-start">
                <Heading color={earnings.eq(0) ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
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
              </Flex>
            </div>
          </>
        )}
      </div>

      <Button
        disabled={(isPools2 ? earnings1.eq(0) && earnings2.eq(0) : earnings.eq(0)) || pendingTx}
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
      >
        {t('Harvest')}
      </Button>
    </Flex>
  )
}

export default HarvestAction
