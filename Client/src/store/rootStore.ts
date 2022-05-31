import React from 'react'
import AuthStore from './authStore'
import SettingsStore from './settingsStore'

// Root Store Declaration
export default class RootStore {
  settingsStore: SettingsStore
  authStore: AuthStore
  constructor() {
    this.settingsStore = new SettingsStore(this)
    this.authStore = new AuthStore(this)
  }
}

const StoresContext = React.createContext(new RootStore())

// this will be the function available for the app to connect to the stores
export const useStores = () => React.useContext(StoresContext)
