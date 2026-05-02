import React from 'react'
import styled from 'styled-components'
import PageSection from 'components/PageSection'
import { useWeb3React } from '@web3-react/core'
import useTheme from 'hooks/useTheme'

import bannerBG from '../../assets/image/banner.png'


import MetricsSection from './components/InfoSection'


const StyledBannerSection = styled(PageSection)`
  padding-top: 16px;
  background: url(${bannerBG}) no-repeat 100% 100%;
  background-size: cover;
  background-position: center center;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`

const Home: React.FC = () => {
  const { theme } = useTheme()


  return (
    <>
      <StyledBannerSection innerProps={{ style: { margin: '0', width: '100%' } }} index={2} hasCurvedDivider={false} />

      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
            ? 'linear-gradient(180deg, #09070C 22%, #201335 100%)'
            : 'linear-gradient(180deg, #FFFFFF 22%, #D7CAEC 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
        <MetricsSection />
      </PageSection>
    </>
  )
}

export default Home
