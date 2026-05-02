//@ts-nocheck
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useRouteMatch } from 'react-router-dom'
import { Tag, Flex, Heading } from '@pancakeswap/uikit'
import { CommunityTag, CoreTag } from 'components/Tags'
import { Token } from 'config/constants/types'
import { TokenPairImage, TokenImage } from 'components/TokenImage'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  token: Token
  quoteToken: Token
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const CardHeading: React.FC<ExpandableSectionProps> = ({ lpLabel, multiplier, isCommunityFarm, token, quoteToken }) => {
  const { path } = useRouteMatch()
  const isPools2 = useMemo(() => {
    return path === '/pools2'
  }, [path])
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      {!lpLabel.includes('-') ? (
        <TokenImage token={token} width={64} height={64} />
      ) : (
        <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={64} height={64} />
      )}

      <Flex flexDirection="column" alignItems="flex-end">
        <Heading mb="4px">{lpLabel.split(' ')[0]}</Heading>
        <Flex justifyContent="center">
          {isCommunityFarm ? <CommunityTag /> : <CoreTag />}
          <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
