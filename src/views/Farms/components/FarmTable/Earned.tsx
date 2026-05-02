//@ts-nocheck
import React from 'react'
import styled from 'styled-components'
import { Skeleton } from '@pancakeswap/uikit'

export interface EarnedProps {
  earnings: number
  earnings1: any
  earnings2: any
  pid: number
}

const Amount = styled.span<{ earned: number }>`
  color: ${({ earned, theme }) => (earned ? theme.colors.text : theme.colors.textDisabled)};
  display: flex;
  align-items: center;
`

const Earned: React.FunctionComponent = ({ earned, userDataReady }) => {
  if (userDataReady) {
    return <Amount earned={earned}>{earned.toLocaleString()}</Amount>
  }
  return (
    <Amount earned={0}>
      <Skeleton width={60} />
    </Amount>
  )
}

export default Earned
