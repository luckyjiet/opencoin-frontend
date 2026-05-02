import React from 'react'
import { Menu as UikitMenu } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { usePriceCakeBusd } from 'state/farms/hooks'

import config from './config'
import UserMenu from './UserMenu'
import GlobalSettings from './GlobalSettings'

const MenuShell = styled.div`
  > div > div:nth-child(2) > div:first-child > div:last-child > div:first-child > div:last-child {
    display: none !important;
  }
`

const Menu = (props) => {
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = usePriceCakeBusd()
  
  const { currentLanguage, setLanguage, t } = useTranslation()

  return (
    <MenuShell>
      <UikitMenu
        userMenu={<UserMenu />}
        globalMenu={<GlobalSettings />}
        isDark={isDark}
        toggleTheme={toggleTheme}
        currentLang={currentLanguage.code}
        langs={languageList}
        setLang={setLanguage}
        cakePriceUsd={cakePriceUsd.toNumber()}
        links={config(t)}
        profile={null}
        {...props}
      />
    </MenuShell>
  )
}


export default Menu
