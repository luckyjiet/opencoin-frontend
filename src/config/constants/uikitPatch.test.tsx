import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

describe('patched UIKit branding', () => {
  beforeAll(() => {
    const matchMedia = () => ({
      matches: true,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMedia,
    })
  })

  it('renders OpenCoin in the top navigation brand', () => {
    const { light, Menu } = require('@pancakeswap/uikit')
    const container = document.createElement('div')
    document.body.appendChild(container)

    act(() => {
      ReactDOM.render(
        <ThemeProvider theme={light}>
          <BrowserRouter>
            <Menu
              isDark={false}
              toggleTheme={jest.fn()}
              currentLang="en"
              langs={[]}
              setLang={jest.fn()}
              links={[{ label: 'Home', href: '/', icon: 'HomeIcon' }]}
            />
          </BrowserRouter>
        </ThemeProvider>,
        container,
      )
    })

    expect(container.textContent).toContain('OpenCoin')
    expect(container.querySelector('a[aria-label="OpenCoin home page"]')).not.toBeNull()

    ReactDOM.unmountComponentAtNode(container)
    document.body.removeChild(container)
  })
})
