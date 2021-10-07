import { combineReducers } from '@reduxjs/toolkit'
import { monitoredSagaReducers } from 'src/app/rootSaga'
import { tokenListsReducer } from 'src/features/tokenLists/reducer'
import { tokensReducer } from 'src/features/tokens/tokensSlice'
import { walletReducer } from 'src/features/wallet/walletSlice'

export const rootReducer = combineReducers({
  wallet: walletReducer,
  tokenLists: tokenListsReducer,
  tokens: tokensReducer,
  saga: monitoredSagaReducers,
})

export type RootState = ReturnType<typeof rootReducer>
