//@ts-nocheck
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

interface SpacerProps {
  size?: 'sm' | 'md' | 'lg' | 'mmd' | 'ssm' | ''
}

const Spacer: React.FC<SpacerProps> = ({ size = 'md' }) => {
  let s: number
  switch (size) {
    case 'xxl':
      s = 30
      break
    case 'xl':
      s = 18
      break
    case 'lg':
      s = 15
      break
    case 'sm':
      s = 5
      break
    case 'ssm':
      s = 3
      break
    case 'mmd':
      s = 12
      break
    case 'md':
    default:
      s = 8
  }

  return <StyledSpacer size={s} />
}

interface StyledSpacerProps {
  size: number
}

const StyledSpacer = styled.div<StyledSpacerProps>`
  height: ${props => props.size}px;
  width: ${props => props.size}px;
`

export default Spacer
