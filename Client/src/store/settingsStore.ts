import { makeAutoObservable } from 'mobx'
import RootStore from './rootStore'

interface ISettings {
  [key: string]: string
}

export default class SettingsStore {
  settings: ISettings = { taskSort: 'easyFirst' }
  isSettingsLoading = true
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  setSettings(settings: ISettings) {
    this.settings = settings
  }

  setSettingsItem(key: string, value: string) {
    this.settings[key] = value
    localStorage.setItem('settings', JSON.stringify(this.settings))
  }

  setSettingsLoading(bool: boolean) {
    this.isSettingsLoading = bool
  }

  async removeSettings() {
    this.setSettings({})
    localStorage.removeItem('settings')
  }

  // async saveSettings(settings) {
  //   localStorage.setItem('settings', settings)
  // }

  //если в стороке есть токен, то проверяем его валидность
  async loadSettings() {
    this.setSettingsLoading(true)

    let settings = localStorage.getItem('settings')

    if (settings) {
      settings = JSON.parse(settings)
    }

    if (settings && typeof settings === 'object') {
      this.setSettings(settings)
    }

    this.setSettingsLoading(false)
  }
}
