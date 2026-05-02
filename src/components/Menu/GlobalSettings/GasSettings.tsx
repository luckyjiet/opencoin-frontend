import React from 'react'
import { Flex, Button, Text } from '@pancakeswap/uikit'
import QuestionHelper from 'components/QuestionHelper'
import { useTranslation } from 'contexts/Localization'
import { getGasPriceOptions, getGasPriceWeiOptions } from 'state/user/hooks/helpers'
import { useGasPriceManager } from 'state/user/hooks'

const GasSettings = () => {
  const { t } = useTranslation()
  const [gasPrice, setGasPrice] = useGasPriceManager()
  const gasPriceOptions = getGasPriceOptions()
  const gasPriceWeiOptions = getGasPriceWeiOptions()

  return (
    <Flex flexDirection="column">
      <Flex mb="12px" alignItems="center">
        <Text>{t('Default Transaction Speed (GWEI)')}</Text>
        <QuestionHelper
          text={t(
            'Adjusts the gas price (transaction fee) for your transaction. Higher GWEI = higher speed = higher fees',
          )}
          placement="top-start"
          ml="4px"
        />
      </Flex>
      <Flex flexWrap="wrap">
        <Button
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(gasPriceWeiOptions.default)
          }}
          variant={gasPrice === gasPriceWeiOptions.default ? 'primary' : 'tertiary'}
        >
          {t('Standard (%gasPrice%)', { gasPrice: gasPriceOptions.default })}
        </Button>
        <Button
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(gasPriceWeiOptions.fast)
          }}
          variant={gasPrice === gasPriceWeiOptions.fast ? 'primary' : 'tertiary'}
        >
          {t('Fast (%gasPrice%)', { gasPrice: gasPriceOptions.fast })}
        </Button>
        <Button
          mr="4px"
          mt="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(gasPriceWeiOptions.instant)
          }}
          variant={gasPrice === gasPriceWeiOptions.instant ? 'primary' : 'tertiary'}
        >
          {t('Instant (%gasPrice%)', { gasPrice: gasPriceOptions.instant })}
        </Button>
      </Flex>
    </Flex>
  )
}

export default GasSettings
