// @ts-nocheck
import React, { useState, useCallback } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Flex, Text, Skeleton, Button, AutoRenewIcon, useWalletModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import tokens from 'config/constants/tokens'
import useToast from 'hooks/useToast'
import { useMasterchef } from 'hooks/useContract'
import useTokenBalance from 'hooks/useTokenBalance'
import useAuth from 'hooks/useAuth'
import useTotalSupply from '../../hooks/useTotalSupply'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { getFullDisplayBalance, getBalanceAmount } from 'utils/formatBalance'
import IconCard from '../IconCard'
import { harvestFarm } from 'utils/calls'
import myCofferIcon from '../../../../assets/image/img_mycoffer.png'
import BHVinfo from '../../../../assets/image/img_BHVinfo.png'
import { StyledColorMainBold } from 'components/common/CommonStyle'
import useFarmsWithBalance from 'views/Home/hooks/useFarmsWithBalance'
import Spacer from 'components/Spacer'

const StyledWrap = styled(Flex)`
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0 90px;
    width: 100%;
    align-items: stretch;
  }
`
const Stats = () => {
  const [pendingTx, setPendingTx] = useState(false)
  const { bhv } = tokens
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()

  const masterChefContract = useMasterchef()
  const cakePriceUsd = usePriceCakeBusd()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)
  const { farmsWithStakedBalance, earningsSum: farmEarningsSum } = useFarmsWithBalance()
  const bhvAddress = bhv.address[ChainId['MAINNET']]
  let { balance: bhvBalance } = useTokenBalance(bhvAddress)
  let { balance: burnBalance } = useTokenBalance(bhvAddress, '0x0000000000000000000000000000000000000001')

  let bhvTotalSupply = useTotalSupply(bhvAddress)
  let circAmount = getBalanceAmount(bhvTotalSupply?.toString()).minus(getBalanceAmount(burnBalance?.toString()))
  let price = circAmount.times(cakePriceUsd).toFixed(3)
  circAmount = circAmount.toFixed(3)
  bhvBalance = getFullDisplayBalance(bhvBalance?.toString(), 18, 3)
  bhvTotalSupply = getFullDisplayBalance(bhvTotalSupply?.toString(), 18, 3)
  burnBalance = getFullDisplayBalance(burnBalance?.toString(), 18, 3)

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    // eslint-disable-next-line no-restricted-syntax
    for (const farmWithBalance of farmsWithStakedBalance) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await harvestFarm(masterChefContract, farmWithBalance.pid)
        toastSuccess(
          `${t('Harvested')}!`,
          t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'CAKE' }),
        )
      } catch (error) {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    }
    setPendingTx(false)
  }, [farmsWithStakedBalance, masterChefContract, toastSuccess, toastError, t])

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <StyledWrap flexDirection={['column', null, null, 'row']}>
        <IconCard
          title={t('My Coffer')}
          icon={<img src={myCofferIcon} width="200px" height="150px" alt="" />}
          mr={[null, null, null, '16px']}
          mb={['16px', null, null, '0']}
        >
          <Spacer size="lg" />
          <div className="flex-jc-center text-center wing-blank-lg ">
            <div>
              <StyledColorMainBold>{t('BHV to harvest')}</StyledColorMainBold>
              <Spacer size="lg" />
              <div>{!farmEarningsSum ? 0 : farmEarningsSum?.toFixed(3)}</div>
            </div>
            <div>
              <StyledColorMainBold>{t('BHV in wallet')}</StyledColorMainBold>
              <Spacer size="lg" />
              <div>{!bhvBalance || bhvBalance === 'NaN' ? <Skeleton width={30} /> : bhvBalance}</div>
            </div>
          </div>
          <Spacer size="xl" />
          {!account ? (
            <Button className="width-100" onClick={onPresentConnectModal}>
              {t('Connect Wallet')}
            </Button>
          ) : (
            <Button
              width={['100%', null, null, 'auto']}
              id="harvest-all"
              isLoading={pendingTx}
              endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
              disabled={pendingTx || !farmsWithStakedBalance?.length}
              onClick={harvestAllFarms}
            >
              <Text color="invertedContrast" bold>
                {pendingTx ? t('Harvesting') : `${t('Harvest all')} (${farmsWithStakedBalance?.length})`}
              </Text>
            </Button>
          )}
        </IconCard>
        <IconCard
          title={t('BHV Info')}
          icon={<img src={BHVinfo} width="200px" height="150px" alt="" />}
          mr={[null, null, null, '16px']}
          mb={['16px', null, null, '0']}
        >
          <Spacer size="lg" />
          <div className="flex-jc-center">
            <StyledColorMainBold>{t('BHV Price')}</StyledColorMainBold>
            <div>{!cakePriceUsd ? <Skeleton width={30} /> : cakePriceUsd.toFixed(3)} </div>
          </div>
          <Spacer size="lg" />
          <div className="flex-jc-center">
            <StyledColorMainBold>{t('BHV Total')}</StyledColorMainBold>
            <div>{!bhvTotalSupply || bhvTotalSupply === 'NaN' ? <Skeleton width={30} /> : bhvTotalSupply} </div>
          </div>
          <Spacer size="lg" />
          <div className="flex-jc-center">
            <StyledColorMainBold>{t('BHV Circulation')}</StyledColorMainBold>
            <div>{!circAmount || circAmount === 'NaN' ? <Skeleton width={30} /> : circAmount} </div>
          </div>

          <Spacer size="lg" />
          <div className="flex-jc-center">
            <StyledColorMainBold>{t('BHV Burnt')} </StyledColorMainBold>
            <div>{!burnBalance || burnBalance === 'NaN' ? <Skeleton width={30} /> : burnBalance}</div>
          </div>

          <Spacer size="lg" />
          <div className="flex-jc-center">
            <StyledColorMainBold>{t('BHV Market Capitalization')}</StyledColorMainBold>
            <div>{!price || price === 'NaN' ? <Skeleton width={30} /> : `$${price}`}</div>
          </div>
          <Spacer size="lg" />
        </IconCard>
      </StyledWrap>
    </Flex>
  )
}

export default Stats
