interface IRootStore {
  settingsStore: ISettigsStore
  authStore: IAuthStore
}

interface IAuthStore {
  user: IUser
  isAuth: boolean
  isAuthLoading: boolean
  rootStore: IRootStore
  isAdministrator: () => boolean
}

interface ISettigsStore {}
