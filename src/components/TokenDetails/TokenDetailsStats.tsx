import { Currency } from '@uniswap/sdk-core'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { LinkButton } from 'src/components/buttons/LinkButton'
import { Flex } from 'src/components/layout'
import { Shimmer } from 'src/components/loading/Shimmer'
import { Text } from 'src/components/Text'
import { LongText } from 'src/components/text/LongText'
import { TokenDetailsScreenQuery } from 'src/data/__generated__/types-and-hooks'
import { currencyAddress } from 'src/utils/currencyId'
import { formatNumber, NumberType } from 'src/utils/format'
import { ExplorerDataType, getExplorerLink, getTwitterLink } from 'src/utils/linking'

export function TokenDetailsMarketData({
  marketCap,
  volume,
  priceLow52W,
  priceHight52W,
  isLoading = false,
}: {
  marketCap?: number
  volume?: number
  priceLow52W?: number
  priceHight52W?: number
  isLoading?: boolean
}) {
  const { t } = useTranslation()

  // Utility component to render formatted values
  const FormattedValue = useCallback(
    ({ value, numberType }: { value?: number; numberType: NumberType }) => {
      if (isLoading) {
        return (
          <Shimmer>
            <Text loaderOnly height="100%" variant="bodyLarge" width="50%">
              $0.00
            </Text>
          </Shimmer>
        )
      }
      return <Text variant="bodyLarge">{formatNumber(value, numberType)}</Text>
    },
    [isLoading]
  )

  return (
    <Flex row justifyContent="space-between">
      <Flex flex={1} gap="lg">
        <Flex gap="xxs">
          <Text color="textTertiary" variant="subheadSmall">
            {t('Market cap')}
          </Text>
          <FormattedValue numberType={NumberType.FiatTokenStats} value={marketCap} />
        </Flex>
        <Flex gap="xxs">
          <Text color="textTertiary" variant="subheadSmall">
            {t('52W low')}
          </Text>
          <FormattedValue numberType={NumberType.FiatTokenDetails} value={priceLow52W} />
        </Flex>
      </Flex>
      <Flex flex={1} gap="lg">
        <Flex gap="xxs">
          <Text color="textTertiary" variant="subheadSmall">
            {t('24h Uniswap volume')}
          </Text>
          <FormattedValue numberType={NumberType.FiatTokenStats} value={volume} />
        </Flex>
        <Flex gap="xxs">
          <Text color="textTertiary" variant="subheadSmall">
            {t('52W high')}
          </Text>
          <FormattedValue numberType={NumberType.FiatTokenDetails} value={priceHight52W} />
        </Flex>
      </Flex>
    </Flex>
  )
}

export function TokenDetailsStats({
  currency,
  data,
}: {
  currency: Currency
  data: TokenDetailsScreenQuery | undefined
}) {
  const { t } = useTranslation()

  const tokenData = data?.tokens?.[0]
  const tokenProjectData = data?.tokenProjects?.[0]

  const marketData = tokenProjectData?.markets ? tokenProjectData.markets[0] : null

  const explorerLink = getExplorerLink(
    currency.chainId,
    currencyAddress(currency),
    ExplorerDataType.ADDRESS
  )

  return (
    <Flex gap="lg">
      <Text variant="subheadLarge">{t('Stats')}</Text>
      <TokenDetailsMarketData
        marketCap={marketData?.marketCap?.value}
        priceHight52W={marketData?.priceHigh52W?.value}
        priceLow52W={marketData?.priceLow52W?.value}
        volume={tokenData?.market?.volume?.value}
      />
      <Flex gap="xxs">
        <Text color="textTertiary" variant="subheadSmall">
          {t('About {{ token }}', { token: tokenProjectData?.name })}
        </Text>
        <Flex gap="sm">
          {tokenProjectData?.description && (
            <LongText
              gap="xxxs"
              initialDisplayedLines={5}
              text={tokenProjectData.description.trim()}
            />
          )}
          <Flex row>
            {tokenProjectData?.homepageUrl && (
              <LinkButton
                color="accentAction"
                label={t('Website')}
                textVariant="buttonLabelMicro"
                url={tokenProjectData.homepageUrl}
              />
            )}
            {tokenProjectData?.twitterName && (
              <LinkButton
                color="accentAction"
                label={t('Twitter')}
                textVariant="buttonLabelMicro"
                url={getTwitterLink(tokenProjectData.twitterName)}
              />
            )}
            <LinkButton
              color="accentAction"
              label={t('Etherscan')}
              textVariant="buttonLabelMicro"
              url={explorerLink}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
