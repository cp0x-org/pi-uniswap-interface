export enum ImportAccountType {
  Address = 'address',
  Mnemonic = 'mnemonic',
  RestoreBackup = 'restoreBackup',
  PrivateKey = 'privateKey',
  Indexed = 'indexed',
}

export enum ImportAccountEnsType {
  ENS = 'ens',
}

export const ImportAccountInputType = { ...ImportAccountType, ...ImportAccountEnsType }

interface BaseImportAccountParams {
  type: ImportAccountType
  name?: string
  locale?: string
  ignoreActivate?: boolean
}

export interface ImportAddressAccountParams extends BaseImportAccountParams {
  type: ImportAccountType.Address
  address: Address
}

export interface ImportMnemonicAccountParams extends BaseImportAccountParams {
  type: ImportAccountType.Mnemonic
  mnemonic: string
  indexes?: number[]
  markAsActive?: boolean // used for automatically activating test account
}

export interface ImportRestoreBackupAccountParams extends BaseImportAccountParams {
  type: ImportAccountType.RestoreBackup
  mnemonicId: string
  indexes?: number[]
}

export interface ImportPrivateKeyAccountParams extends BaseImportAccountParams {
  type: ImportAccountType.PrivateKey
  privateKey: string
}

export type ImportAccountParams =
  | ImportAddressAccountParams
  | ImportMnemonicAccountParams
  | ImportPrivateKeyAccountParams
  | ImportRestoreBackupAccountParams
