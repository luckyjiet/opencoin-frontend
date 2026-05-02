import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ChainId } from '@pancakeswap/sdk'
import { light } from '@pancakeswap/uikit'
import { ThemeProvider } from 'styled-components'
import { TextDecoder, TextEncoder } from 'util'
import { EN } from 'config/localization/languages'
import { LanguageContext } from 'contexts/Localization/Provider'
import { SUGGESTED_BASES } from 'config/constants'

Object.assign(global, { TextDecoder, TextEncoder })

describe('CommonBases', () => {
  it('does not render the common bases shortcut row when no bases are configured', () => {
    const CommonBases = require('./CommonBases').default

    expect(SUGGESTED_BASES[ChainId.TESTNET]).toHaveLength(0)

    const markup = renderToStaticMarkup(
      <ThemeProvider theme={light}>
        <LanguageContext.Provider
          value={{
            isFetching: false,
            currentLanguage: EN,
            setLanguage: jest.fn(),
            t: (key: string) => key,
          }}
        >
          <CommonBases chainId={ChainId.TESTNET} onSelect={jest.fn()} />
        </LanguageContext.Provider>
      </ThemeProvider>,
    )

    expect(markup).toBe('')
  })
})
