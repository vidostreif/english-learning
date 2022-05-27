import { makeAutoObservable } from 'mobx'

export default class SettingsStore {
  settings = { taskSort: 'easyFirst' }
  isSettingsLoading = true

  constructor(rootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  setSett(settings) {
    this.settings = settings
  }

  setSettings(key, value) {
    this.settings[key] = value
    localStorage.setItem('settings', JSON.stringify(this.settings))
  }

  setSettingsLoading(bool) {
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
      this.setSett(settings)
    }

    this.setSettingsLoading(false)
  }
}
