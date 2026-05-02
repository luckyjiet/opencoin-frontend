//@ts-nocheck
import React from 'react'
import styled from 'styled-components'
import { Skeleton } from '@pancakeswap/uikit'
const Container = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};

  button {
    width: 20px;
    height: 20px;

    svg {
      path {
        fill: ${({ theme }) => theme.colors.textSubtle};
      }
    }
  }
`

const AprWrapper = styled.div`
  word-wrap: break-word;
  max-width: 45px;

  text-align: left;
`

const Apr: React.FC = ({ apy, className }) => {
  if (!apy.isFinite()) {
    return <Skeleton width={60} />
  }
  return (
    //

    <Container>
      <AprWrapper className={className ? className : ''}>{apy.toFixed(2)}%</AprWrapper>
    </Container>
  )
}

export default Apr
