import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useAppDispatch, useAppTheme } from 'src/app/hooks'
import { OnboardingStackParamList } from 'src/app/navigation/types'
import { Button } from 'src/components/buttons/Button'
import { Chevron } from 'src/components/icons/Chevron'
import { Flex } from 'src/components/layout'
import { Text } from 'src/components/Text'
import { Unicon } from 'src/components/unicons/Unicon'
import { useCloudBackups } from 'src/features/CloudBackup/hooks'
import { ICloudMnemonicBackup } from 'src/features/CloudBackup/types'
import { importAccountActions, IMPORT_WALLET_AMOUNT } from 'src/features/import/importAccountSaga'
import { ImportAccountType } from 'src/features/import/types'
import { OnboardingScreen } from 'src/features/onboarding/OnboardingScreen'
import {
  PendingAccountActions,
  pendingAccountActions,
} from 'src/features/wallet/pendingAcccountsSaga'
import { restoreMnemonicFromICloud } from 'src/lib/RNEthersRs'
import { OnboardingScreens } from 'src/screens/Screens'
import { shortenAddress } from 'src/utils/addresses'
import { formatDate } from 'src/utils/format'
import { logger } from 'src/utils/logger'

type Props = NativeStackScreenProps<OnboardingStackParamList, OnboardingScreens.RestoreCloudBackup>

export function RestoreCloudBackupScreen({ navigation, route: { params } }: Props) {
  const { t } = useTranslation()
  const theme = useAppTheme()
  const dispatch = useAppDispatch()
  const backups = useCloudBackups()
  const sortedBackups = backups.slice().sort((a, b) => a.createdAt - b.createdAt)

  const onPressRestoreBackup = async (backup: ICloudMnemonicBackup) => {
    // Clear any existing pending accounts
    dispatch(pendingAccountActions.trigger(PendingAccountActions.DELETE))

    if (backup.isPinEncrypted) {
      navigation.navigate({
        name: OnboardingScreens.RestoreCloudBackupPin,
        params: { ...params, mnemonicId: backup.mnemonicId },
        merge: true,
      })
      return
    }

    try {
      await restoreMnemonicFromICloud(backup.mnemonicId, '')
      dispatch(
        importAccountActions.trigger({
          type: ImportAccountType.RestoreBackup,
          mnemonicId: backup.mnemonicId,
          indexes: Array.from(Array(IMPORT_WALLET_AMOUNT).keys()),
        })
      )

      navigation.navigate({ name: OnboardingScreens.SelectWallet, params, merge: true })
    } catch (error) {
      const err = error as Error
      logger.debug('RestoreCloudBackupScreen', 'restoreMnemonicFromICloud', 'Error', error)
      Alert.alert(t('iCloud error'), err.message, [
        {
          text: t('OK'),
          style: 'default',
        },
      ])
    }
  }

  return (
    <OnboardingScreen
      subtitle={t("Please select which backup you'd like to recover")}
      title={t('We found multiple recovery phrase backups')}>
      <ScrollView>
        <Flex gap="xs">
          {sortedBackups.map((backup, index) => {
            const { mnemonicId, createdAt } = backup
            return (
              <Button
                key={backup.mnemonicId}
                backgroundColor="backgroundContainer"
                borderColor="backgroundAction"
                borderRadius="lg"
                borderWidth={1}
                p="md"
                onPress={() => onPressRestoreBackup(backup)}>
                <Flex row alignItems="center" justifyContent="space-between">
                  <Flex centered row gap="sm">
                    <Unicon address={mnemonicId} size={32} />
                    <Flex gap="none">
                      <Text numberOfLines={1} variant="body">
                        {t('Backup {{backupIndex}}', { backupIndex: index + 1 })}
                      </Text>
                      <Text color="textSecondary" variant="caption">
                        {shortenAddress(mnemonicId)}
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex row gap="sm">
                    <Flex alignItems="flex-end" gap="xxs">
                      <Text color="textSecondary" variant="caption">
                        {t('Backed up on:')}
                      </Text>
                      <Text variant="caption">{formatDate(new Date(createdAt * 1000))}</Text>
                    </Flex>
                    <Chevron color={theme.colors.textPrimary} direction="e" />
                  </Flex>
                </Flex>
              </Button>
            )
          })}
        </Flex>
      </ScrollView>
    </OnboardingScreen>
  )
}
