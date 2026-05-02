import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'OpenCoin',
  description: 'OpenCoin DEX for token swaps and liquidity on BSC.',
  image: '/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('OpenCoin')}`,
      }
 
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('OpenCoin')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('OpenCoin')}`,
      }


    default:
      return null
  }
}
