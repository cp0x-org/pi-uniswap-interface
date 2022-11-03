import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard } from 'react-native'
import { useAppTheme } from 'src/app/hooks'
import { TouchableArea } from 'src/components/buttons/TouchableArea'
import { TokenLogo } from 'src/components/CurrencyLogo/TokenLogo'
import { Box, Flex } from 'src/components/layout'
import { InlineNetworkPill } from 'src/components/Network/NetworkPill'
import { Text } from 'src/components/Text'
import TokenWarningModal from 'src/components/tokens/TokenWarningModal'
import WarningIcon from 'src/components/tokens/WarningIcon'
import { TokenOption } from 'src/components/TokenSelector/types'
import { SafetyLevel } from 'src/data/__generated__/types-and-hooks'
import { useDismissTokenWarnings } from 'src/features/tokens/useTokenWarningLevel'
import { formatNumber, formatUSDPrice, NumberType } from 'src/utils/format'

interface OptionProps {
  option: TokenOption
  showNetworkPill: boolean
  onPress: () => void
}

export function TokenOptionItem({ option, showNetworkPill, onPress }: OptionProps) {
  const theme = useAppTheme()
  const { t } = useTranslation()
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [dismissedWarningTokens, dismissTokenWarning] = useDismissTokenWarnings()

  const { currencyInfo, quantity, balanceUSD } = option
  const { currency, safetyLevel } = currencyInfo

  const dismissed = Boolean(dismissedWarningTokens[currency.chainId]?.[currency.wrapped.address])

  const onPressTokenOption = useCallback(() => {
    if (
      safetyLevel === SafetyLevel.Blocked ||
      ((safetyLevel === SafetyLevel.MediumWarning || safetyLevel === SafetyLevel.StrongWarning) &&
        !dismissed)
    ) {
      Keyboard.dismiss()
      setShowWarningModal(true)
      return
    }

    onPress()
  }, [dismissed, onPress, safetyLevel])

  return (
    <>
      <TouchableArea
        opacity={safetyLevel === SafetyLevel.Blocked ? 0.5 : 1}
        testID={`token-option-${currency.chainId}-${currency.symbol}`}
        onPress={onPressTokenOption}>
        <Flex row alignItems="center" gap="xs" justifyContent="space-between" py="sm">
          <Flex row shrink alignItems="center" gap="sm">
            <TokenLogo
              chainId={currency.chainId}
              size={theme.imageSizes.lg}
              symbol={currency.symbol}
              url={currencyInfo.logoUrl ?? undefined}
            />
            <Flex shrink alignItems="flex-start" gap="none">
              <Flex centered row gap="xs">
                <Flex shrink>
                  <Text color="textPrimary" numberOfLines={1} variant="bodyLarge">
                    {currency.name}
                  </Text>
                </Flex>
                <WarningIcon
                  height={theme.iconSizes.sm}
                  safetyLevel={safetyLevel}
                  width={theme.iconSizes.sm}
                />
              </Flex>
              <Flex centered row gap="xs">
                <Text color="textSecondary" numberOfLines={1} variant="subheadSmall">
                  {currency.symbol}
                </Text>
                {showNetworkPill && <InlineNetworkPill chainId={currency.chainId} />}
              </Flex>
            </Flex>
          </Flex>

          {safetyLevel === SafetyLevel.Blocked ? (
            <Text variant="bodySmall">{t('Not available')}</Text>
          ) : quantity && quantity !== 0 ? (
            <Box alignItems="flex-end">
              <Text variant="bodyLarge">{formatNumber(quantity, NumberType.TokenTx)}</Text>
              <Text color="textSecondary" variant="subheadSmall">
                {formatUSDPrice(balanceUSD)}
              </Text>
            </Box>
          ) : null}
        </Flex>
      </TouchableArea>

      {showWarningModal ? (
        <TokenWarningModal
          isVisible
          currency={currency}
          safetyLevel={safetyLevel}
          onAccept={() => {
            dismissTokenWarning(currency)
            setShowWarningModal(false)
            onPress()
          }}
          onClose={() => setShowWarningModal(false)}
        />
      ) : null}
    </>
  )
}
