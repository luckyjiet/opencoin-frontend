import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { light } from '@pancakeswap/uikit'
import { ThemeProvider } from 'styled-components'
import AppBody from './AppBody'

describe('AppBody', () => {
  it('does not render page background decorations', () => {
    const markup = renderToStaticMarkup(
      <ThemeProvider theme={light}>
        <AppBody>
          <div>content</div>
        </AppBody>
      </ThemeProvider>,
    )

    expect(markup).not.toContain('<img')
  })
})
