import { Toast } from '@tamagui/toast'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ONBOARDING_CONTENT_WIDTH } from 'src/app/features/onboarding/utils'
import { Circle, Image } from 'tamagui'
import { ColorTokens, Flex, Icons, Text, Unicon } from 'ui/src'
import { UNISWAP_LOGO } from 'ui/src/assets'
import MoreIcon from 'ui/src/assets/icons/more.svg'
import PinIcon from 'ui/src/assets/icons/pin.svg'
import { iconSizes, opacify, validToken } from 'ui/src/theme'
import { useInterval } from 'utilities/src/time/timing'
import { uniswapUrls } from 'wallet/src/constants/urls'
import { useActiveAccountAddressWithThrow, useDisplayName } from 'wallet/src/features/wallet/hooks'
import { sanitizeAddressText, shortenAddress } from 'wallet/src/utils/addresses'

const POPUP_WIDTH = 400
const POPUP_OFFSET = 20
const POPUP_SHADOW_RADIUS = 1000

const PINNED_CHECK_FREQUENCY_IN_MS = 750

// TODO(spore): replace with proper themed colors
const ONBOARDING_COLORS = {
  GREEN: '#00D395',
  BLUE: '#12AAFF',
  PINK: '#FD82FF',
  YELLOW: '#E8A803',
}

const ONBOARDING_COLORS_SOFT = {
  GREEN: opacify(20, ONBOARDING_COLORS.GREEN),
  BLUE: opacify(20, ONBOARDING_COLORS.BLUE),
  PINK: opacify(20, ONBOARDING_COLORS.PINK),
  YELLOW: opacify(20, ONBOARDING_COLORS.YELLOW),
}

export function Complete(): JSX.Element {
  const address = useActiveAccountAddressWithThrow()
  const { t } = useTranslation()
  const nickname = useDisplayName(address)?.name

  if (!address) {
    throw new Error('No address found')
  }

  // We set the initial state to undefined to avoid the wrong message flickering when the component remounts
  const [isPinned, setIsPinned] = useState<boolean | undefined>(undefined)

  const isExtensionPinned = async (): Promise<void> => {
    const settings = await chrome.action.getUserSettings()
    setIsPinned(settings.isOnToolbar)
  }

  // there's no way to listen to the extension pinning status,
  // so check every [PINNED_CHECK_FREQUENCY_IN_MS]ms during this step if it's pinned
  useInterval(isExtensionPinned, PINNED_CHECK_FREQUENCY_IN_MS)

  return (
    <>
      <Flex alignItems="center" width={ONBOARDING_CONTENT_WIDTH}>
        <Flex gap="$spacing12">
          <Flex alignItems="center" gap="$spacing12">
            <Flex alignItems="center" gap="$spacing24">
              {/* TODO: use AddressDisplay here */}
              <Unicon address={address} size={iconSizes.icon64} />
              <Text color="$neutral1" variant="heading1">
                {nickname}
              </Text>
            </Flex>
            <Text color="$neutral2" variant="subheading2">
              {sanitizeAddressText(shortenAddress(address))}
            </Text>
          </Flex>
          <Flex gap="$spacing12" py="$spacing36">
            <Flex row gap="$spacing12">
              {/* TODO(EXT-210): clean up use of colors here and just pass color value */}
              <OnboardingCompleteCard
                Icon={<Icons.Buy color={ONBOARDING_COLORS.GREEN} size={iconSizes.icon20} />}
                backgroundColor={validToken(ONBOARDING_COLORS_SOFT.GREEN)}
                color={validToken(ONBOARDING_COLORS.GREEN)}
                title="Buy crypto"
                url={uniswapUrls.helpArticleUrls.moonpayHelp}
              />
              <OnboardingCompleteCard
                disabled
                Icon={<Icons.ArrowDown color={ONBOARDING_COLORS.BLUE} size={iconSizes.icon20} />}
                backgroundColor={validToken(ONBOARDING_COLORS_SOFT.BLUE)}
                color={validToken(ONBOARDING_COLORS.BLUE)}
                title="Transfer from exchange"
                url={uniswapUrls.interfaceUrl}
              />
            </Flex>
            <Flex row gap="$spacing12">
              <OnboardingCompleteCard
                Icon={
                  <Icons.SwapActionButton color={ONBOARDING_COLORS.PINK} size={iconSizes.icon20} />
                }
                backgroundColor={validToken(ONBOARDING_COLORS_SOFT.PINK)}
                color={validToken(ONBOARDING_COLORS.PINK)}
                title="Swap"
                url={uniswapUrls.interfaceUrl}
              />
              <OnboardingCompleteCard
                disabled
                Icon={<Icons.BookOpen color={ONBOARDING_COLORS.YELLOW} size={iconSizes.icon20} />}
                backgroundColor={validToken(ONBOARDING_COLORS_SOFT.YELLOW)}
                color={validToken(ONBOARDING_COLORS.YELLOW)}
                title="Take a tour"
                url={uniswapUrls.interfaceUrl}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      {/* check for false because !isPinned will trigger on undefined, and since that's what the value gets initialized as */}
      {/* it would flicker with a false positive before it can check if it's pinned or not */}
      {isPinned === false && (
        // extension is not pinned, show reminder popup
        // TODO: try using Tamagui Popover component here
        <Flex position="absolute" right={0} top={-60}>
          {/* pinning reminder popup container */}
          <Flex
            bg="$surface2"
            borderRadius="$rounded20"
            gap="$spacing24"
            mr={POPUP_OFFSET}
            mt={POPUP_OFFSET}
            p="$spacing24"
            // TODO(EXT-141): revisit design of shadow (tweak color, figure out why opacity doesn't apply, tweak radius)
            shadowColor="$neutral3"
            shadowRadius={POPUP_SHADOW_RADIUS}
            width={POPUP_WIDTH}>
            {/* heading and puzzle icon */}
            <Flex gap="$spacing2">
              <Text numberOfLines={1} variant="body2">
                Pin the extension to your browser window
              </Text>
              <Flex row alignItems="center" gap="$spacing8">
                <Text numberOfLines={1} variant="body2">
                  by clicking on the
                </Text>
                {/* TODO(EXT-210): constant icon sizes */}
                <Icons.Puzzle color="$accent1" size={iconSizes.icon20} />
                <Text numberOfLines={1} variant="body2">
                  icon, and then the pin
                </Text>
              </Flex>
            </Flex>
            {/* mocked extension list item container */}
            <Flex
              row
              alignItems="center"
              bg="$surface1"
              borderRadius="$rounded4"
              px="$spacing12"
              py="$spacing8">
              {/* mocked extension icon and name */}
              <Flex grow row alignItems="center" gap="$spacing12" justifyContent="flex-start">
                {/* mocked extension icon */}
                <Flex
                  centered
                  bg="$sporeWhite"
                  borderRadius="$roundedFull"
                  flexGrow={0}
                  p="$spacing4">
                  <Image
                    height={iconSizes.icon24}
                    source={UNISWAP_LOGO}
                    theme="primary"
                    width={iconSizes.icon24}
                  />
                </Flex>
                {/* mocked extension list item name */}
                <Text variant="body1">Uniswap Wallet</Text>
              </Flex>
              {/* mocked extension list item pin button and more icon container */}
              <Flex row alignItems="center" gap="$spacing12">
                {/* mocked extension list item pin button */}
                <Flex alignItems="center" justifyContent="center">
                  <Circle backgroundColor="$DEP_accentBranded" opacity={0.25} size={40} />
                  <Flex
                    alignItems="center"
                    height={40}
                    justifyContent="center"
                    position="absolute"
                    width={40}>
                    <PinIcon height={iconSizes.icon20} width={iconSizes.icon20} />
                  </Flex>
                </Flex>
                {/* mocked extension list item more icon */}
                <MoreIcon height={iconSizes.icon20} width={iconSizes.icon20} />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      )}

      {/* this and the condition above are separated out as two separate conditions that check for false and true respectively */}
      {/* instead of as a ternary, because we initialize the value as undefined instead of false, to avoid a flicker on re-render */}
      {isPinned && (
        <Toast
          bg="$surface2"
          borderColor="$surface3"
          borderRadius="$roundedFull"
          borderWidth={1}
          duration={30_000}
          gap="$spacing4"
          justifyContent="center"
          mt="$spacing12"
          opacity={0.9}
          open={true}
          px="$spacing36"
          py="$spacing24"
          viewportName="onboarding">
          <Toast.Title alignItems="center" display="flex" flexDirection="row" gap="$spacing8">
            <Icons.Checkmark color="$statusSuccess" size={iconSizes.icon24} />
            <Text variant="body1">{t('Pinned! It’s safe to close this tab now')}</Text>
          </Toast.Title>
        </Toast>
      )}
    </>
  )
}

interface OnboardingCompleteCardProps {
  title: string
  url: string
  Icon: JSX.Element
  backgroundColor: ColorTokens
  color: ColorTokens
  disabled?: boolean
}

const linkStyles = {
  textDecoration: 'none',
}

function OnboardingCompleteCard({
  title,
  url,
  Icon,
  backgroundColor,
  color,
  disabled,
}: OnboardingCompleteCardProps): JSX.Element {
  return (
    <Link rel="noopener noreferrer" style={{ ...linkStyles }} target="_blank" to={url}>
      <Flex
        alignItems="flex-start"
        bg={backgroundColor}
        borderColor="$surface3"
        borderRadius="$rounded20"
        borderWidth={1}
        cursor={disabled ? 'not-allowed' : 'pointer'}
        height={100}
        justifyContent="space-between"
        p="$spacing16"
        width={200}>
        {Icon}
        <Text color={color} textDecorationLine="none" variant="subheading2">
          {title}
        </Text>
      </Flex>
    </Link>
  )
}
