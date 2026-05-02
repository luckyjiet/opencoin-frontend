import React from 'react'
import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'
import img_bg1 from '../../assets/image/img_bg1.png'
import img_bg2 from 'assets/image/img_bg2.png'
// img_bg1.png
// img_bg2.png
export const BodyWrapper = styled(Card)`
  border-radius: 24px;
  max-width: 436px;
  width: 100%;
  z-index: 1;
  position: relative;
  overflow: visible;
`

export const BodyBg1 = styled.img`
  position: absolute;
  left: -130px;
  top: 0;
  width: 130px;
  height: 245px;
  @media (max-width: 768px) {
    display: none;
  }
`
export const BodyBg2 = styled.img`
  position: absolute;
  right: -130px;
  bottom: 0;
  width: 52px;
  @media (max-width: 768px) {
    display: none;
  }
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return (
    <BodyWrapper>
      <BodyBg1 src={img_bg1} />
      {children}
      <BodyBg2 src={img_bg2} />
    </BodyWrapper>
  )
}
