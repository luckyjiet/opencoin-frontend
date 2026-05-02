// @ts-nocheck
import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Box, CardProps, Heading, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'

const StyledCard = styled(Card)<{ background: string; rotation?: string }>`
  height: fit-content;
  padding: 1px 1px 4px 1px;
  box-sizing: border-box;
  flex: 1 auto;
  height: auto;

  ${({ theme }) => theme.mediaQueries.md} {
    ${({ rotation }) => (rotation ? `transform: rotate(${rotation});` : '')}
  }
`
const StyledTitle = styled.div`
  padding-left: 24px;
  flex: 1;
`

interface IconCardProps extends IconCardData, CardProps {
  children: ReactNode
}

export interface IconCardData {
  icon: ReactNode
  background?: string
  borderColor?: string
  rotation?: string
}

const IconCard: React.FC<IconCardProps> = ({ icon, title, background, borderColor, rotation, children, ...props }) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  return (
    <StyledCard background={background} borderBackground={borderColor} rotation={rotation} {...props}>
      <div className="flex-jc-center">
        <StyledTitle>
          <Heading scale="lg">{title}</Heading>
        </StyledTitle>

        {icon}
      </div>
      <CardBody>{children}</CardBody>
    </StyledCard>
  )
}

export default IconCard
