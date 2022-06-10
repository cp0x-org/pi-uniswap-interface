import React from 'react'
import { Identicon } from 'src/components/accounts/Identicon'
import { Flex } from 'src/components/layout'
import { Text } from 'src/components/Text'
import { useDisplayName } from 'src/features/wallet/hooks'
import { shortenAddress } from 'src/utils/addresses'

export function AccountDetails({ address }: { address: string }) {
  const displayName = useDisplayName(address)

  return (
    <Flex row>
      <Flex grow row alignItems="center" gap="xs">
        <Identicon address={address} size={20} />
        <Text fontWeight="500" variant="subHead2">
          {displayName?.name}
        </Text>
      </Flex>
      <Text color="neutralTextSecondary" variant="body2">
        {shortenAddress(address)}
      </Text>
    </Flex>
  )
}
